use anchor_lang::prelude::*;
use anchor_spl::token_interface::{
    Mint, TokenAccount, TokenInterface,
    transfer_checked, TransferChecked,
};
use anchor_spl::associated_token::AssociatedToken;

declare_id!("2u3DXQq9A6UgMryeVSWCNdYLy3Fjh391R5hcfWYkCgZK");

// ---------------------------------------------------------------------------
// Program
// ---------------------------------------------------------------------------

#[program]
pub mod nullgraph {
    use super::*;

    pub fn initialize_protocol(
        ctx: Context<InitializeProtocol>,
        fee_basis_points: u16,
    ) -> Result<()> {
        let state = &mut ctx.accounts.protocol_state;
        state.authority = ctx.accounts.authority.key();
        state.nka_counter = 0;
        state.bounty_counter = 0;
        state.fee_basis_points = fee_basis_points;
        state.treasury = ctx.accounts.treasury.key();
        state.bump = ctx.bumps.protocol_state;

        emit!(ProtocolInitialized {
            authority: state.authority,
            fee_basis_points,
        });
        Ok(())
    }

    pub fn submit_null_result(
        ctx: Context<SubmitNullResult>,
        hypothesis: [u8; 128],
        methodology: [u8; 128],
        expected_outcome: [u8; 128],
        actual_outcome: [u8; 128],
        p_value: u32,
        sample_size: u32,
        data_hash: [u8; 32],
    ) -> Result<()> {
        let state = &mut ctx.accounts.protocol_state;
        state.nka_counter += 1;
        let specimen_number = state.nka_counter;

        let nr = &mut ctx.accounts.null_result;
        nr.researcher = ctx.accounts.researcher.key();
        nr.specimen_number = specimen_number;
        nr.hypothesis = hypothesis;
        nr.methodology = methodology;
        nr.expected_outcome = expected_outcome;
        nr.actual_outcome = actual_outcome;
        nr.p_value = p_value;
        nr.sample_size = sample_size;
        nr.data_hash = data_hash;
        nr.status = 0; // Pending
        nr.created_at = Clock::get()?.unix_timestamp;
        nr.bump = ctx.bumps.null_result;

        emit!(NullResultSubmitted {
            specimen_number,
            researcher: nr.researcher,
        });
        Ok(())
    }

    pub fn create_bounty(
        ctx: Context<CreateBounty>,
        description: [u8; 256],
        reward_amount: u64,
        deadline: i64,
    ) -> Result<()> {
        require!(reward_amount > 0, NullGraphError::InvalidRewardAmount);

        let state = &mut ctx.accounts.protocol_state;
        state.bounty_counter += 1;
        let bounty_number = state.bounty_counter;

        let bounty = &mut ctx.accounts.bounty;
        bounty.creator = ctx.accounts.creator.key();
        bounty.bounty_number = bounty_number;
        bounty.description = description;
        bounty.reward_amount = reward_amount;
        bounty.usdc_mint = ctx.accounts.usdc_mint.key();
        bounty.vault = ctx.accounts.vault.key();
        bounty.deadline = deadline;
        bounty.status = 0; // Open
        bounty.matched_submission = Pubkey::default();
        bounty.created_at = Clock::get()?.unix_timestamp;
        bounty.vault_bump = ctx.bumps.vault;
        bounty.bump = ctx.bumps.bounty;

        // Transfer USDC from creator to vault
        let decimals = ctx.accounts.usdc_mint.decimals;
        transfer_checked(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                TransferChecked {
                    from: ctx.accounts.creator_usdc_ata.to_account_info(),
                    mint: ctx.accounts.usdc_mint.to_account_info(),
                    to: ctx.accounts.vault.to_account_info(),
                    authority: ctx.accounts.creator.to_account_info(),
                },
            ),
            reward_amount,
            decimals,
        )?;

        emit!(BountyCreated {
            bounty_number,
            creator: bounty.creator,
            reward_amount,
            deadline,
        });
        Ok(())
    }

    pub fn submit_to_bounty(ctx: Context<SubmitToBounty>) -> Result<()> {
        let bounty_status = ctx.accounts.bounty.status;
        require!(bounty_status == 0, NullGraphError::InvalidBountyStatus); // Must be Open

        let researcher_key = ctx.accounts.researcher.key();
        let null_result_key = ctx.accounts.null_result.key();
        let bounty_key = ctx.accounts.bounty.key();
        let specimen_number = ctx.accounts.null_result.specimen_number;
        let now = Clock::get()?.unix_timestamp;

        let submission = &mut ctx.accounts.submission;
        submission.researcher = researcher_key;
        submission.null_result = null_result_key;
        submission.bounty = bounty_key;
        submission.status = 0; // Pending
        submission.created_at = now;
        submission.bump = ctx.bumps.submission;

        let submission_key = submission.key();

        let bounty = &mut ctx.accounts.bounty;
        bounty.status = 1; // Matched
        bounty.matched_submission = submission_key;

        emit!(BountySubmissionCreated {
            bounty_number: bounty.bounty_number,
            specimen_number,
            researcher: researcher_key,
        });
        Ok(())
    }

    pub fn approve_bounty_submission(ctx: Context<ApproveBountySubmission>) -> Result<()> {
        let bounty = &mut ctx.accounts.bounty;
        require!(bounty.status == 1, NullGraphError::InvalidBountyStatus); // Must be Matched
        require!(
            bounty.matched_submission == ctx.accounts.submission.key(),
            NullGraphError::SubmissionMismatch
        );

        let submission = &mut ctx.accounts.submission;
        require!(submission.status == 0, NullGraphError::InvalidSubmissionStatus); // Must be Pending

        let protocol = &ctx.accounts.protocol_state;
        let fee_bps = protocol.fee_basis_points as u64;
        let total = bounty.reward_amount;
        let fee = total
            .checked_mul(fee_bps)
            .ok_or(NullGraphError::FeeOverflow)?
            .checked_div(10_000)
            .ok_or(NullGraphError::FeeOverflow)?;
        let payout = total.checked_sub(fee).ok_or(NullGraphError::FeeOverflow)?;

        let decimals = ctx.accounts.usdc_mint.decimals;
        let bounty_key = bounty.key();
        let vault_seeds: &[&[u8]] = &[
            b"bounty_vault",
            bounty_key.as_ref(),
            &[bounty.vault_bump],
        ];

        // Pay researcher
        transfer_checked(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                TransferChecked {
                    from: ctx.accounts.vault.to_account_info(),
                    mint: ctx.accounts.usdc_mint.to_account_info(),
                    to: ctx.accounts.researcher_usdc_ata.to_account_info(),
                    authority: ctx.accounts.vault.to_account_info(),
                },
                &[vault_seeds],
            ),
            payout,
            decimals,
        )?;

        // Pay treasury fee
        if fee > 0 {
            transfer_checked(
                CpiContext::new_with_signer(
                    ctx.accounts.token_program.to_account_info(),
                    TransferChecked {
                        from: ctx.accounts.vault.to_account_info(),
                        mint: ctx.accounts.usdc_mint.to_account_info(),
                        to: ctx.accounts.treasury_usdc_ata.to_account_info(),
                        authority: ctx.accounts.vault.to_account_info(),
                    },
                    &[vault_seeds],
                ),
                fee,
                decimals,
            )?;
        }

        bounty.status = 2; // Fulfilled
        submission.status = 1; // Approved

        emit!(BountyFulfilled {
            bounty_number: bounty.bounty_number,
            specimen_number: ctx.accounts.null_result.specimen_number,
            researcher: submission.researcher,
            payout,
            fee,
        });
        Ok(())
    }

    pub fn close_bounty(ctx: Context<CloseBounty>) -> Result<()> {
        let bounty = &mut ctx.accounts.bounty;
        require!(
            bounty.status == 0 || bounty.status == 1,
            NullGraphError::InvalidBountyStatus
        );

        let vault_balance = ctx.accounts.vault.amount;
        let decimals = ctx.accounts.usdc_mint.decimals;
        let bounty_key = bounty.key();
        let vault_seeds: &[&[u8]] = &[
            b"bounty_vault",
            bounty_key.as_ref(),
            &[bounty.vault_bump],
        ];

        // Refund creator
        if vault_balance > 0 {
            transfer_checked(
                CpiContext::new_with_signer(
                    ctx.accounts.token_program.to_account_info(),
                    TransferChecked {
                        from: ctx.accounts.vault.to_account_info(),
                        mint: ctx.accounts.usdc_mint.to_account_info(),
                        to: ctx.accounts.creator_usdc_ata.to_account_info(),
                        authority: ctx.accounts.vault.to_account_info(),
                    },
                    &[vault_seeds],
                ),
                vault_balance,
                decimals,
            )?;
        }

        bounty.status = 3; // Closed

        emit!(BountyClosed {
            bounty_number: bounty.bounty_number,
            creator: bounty.creator,
            refunded_amount: vault_balance,
        });
        Ok(())
    }
}

// ---------------------------------------------------------------------------
// Account Structs (Contexts)
// ---------------------------------------------------------------------------

#[derive(Accounts)]
pub struct InitializeProtocol<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = 8 + ProtocolState::INIT_SPACE,
        seeds = [b"protocol_state"],
        bump,
    )]
    pub protocol_state: Account<'info, ProtocolState>,

    /// CHECK: Treasury wallet, validated by admin at init time.
    pub treasury: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubmitNullResult<'info> {
    #[account(mut)]
    pub researcher: Signer<'info>,

    #[account(
        mut,
        seeds = [b"protocol_state"],
        bump = protocol_state.bump,
    )]
    pub protocol_state: Account<'info, ProtocolState>,

    #[account(
        init,
        payer = researcher,
        space = 8 + NullResult::INIT_SPACE,
        seeds = [
            b"null_result",
            researcher.key().as_ref(),
            &(protocol_state.nka_counter + 1).to_le_bytes(),
        ],
        bump,
    )]
    pub null_result: Account<'info, NullResult>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateBounty<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        mut,
        seeds = [b"protocol_state"],
        bump = protocol_state.bump,
    )]
    pub protocol_state: Account<'info, ProtocolState>,

    #[account(
        init,
        payer = creator,
        space = 8 + NullBounty::INIT_SPACE,
        seeds = [
            b"null_bounty",
            creator.key().as_ref(),
            &(protocol_state.bounty_counter + 1).to_le_bytes(),
        ],
        bump,
    )]
    pub bounty: Account<'info, NullBounty>,

    #[account(
        init,
        payer = creator,
        token::mint = usdc_mint,
        token::authority = vault,
        seeds = [b"bounty_vault", bounty.key().as_ref()],
        bump,
    )]
    pub vault: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub creator_usdc_ata: InterfaceAccount<'info, TokenAccount>,

    pub usdc_mint: InterfaceAccount<'info, Mint>,

    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubmitToBounty<'info> {
    #[account(mut)]
    pub researcher: Signer<'info>,

    #[account(
        has_one = researcher,
    )]
    pub null_result: Account<'info, NullResult>,

    #[account(mut)]
    pub bounty: Account<'info, NullBounty>,

    #[account(
        init,
        payer = researcher,
        space = 8 + BountySubmission::INIT_SPACE,
        seeds = [
            b"bounty_submission",
            bounty.key().as_ref(),
            null_result.key().as_ref(),
        ],
        bump,
    )]
    pub submission: Account<'info, BountySubmission>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ApproveBountySubmission<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        mut,
        has_one = creator,
    )]
    pub bounty: Box<Account<'info, NullBounty>>,

    #[account(mut)]
    pub submission: Box<Account<'info, BountySubmission>>,

    pub null_result: Box<Account<'info, NullResult>>,

    #[account(
        mut,
        seeds = [b"bounty_vault", bounty.key().as_ref()],
        bump = bounty.vault_bump,
    )]
    pub vault: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub researcher_usdc_ata: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub treasury_usdc_ata: InterfaceAccount<'info, TokenAccount>,

    #[account(
        seeds = [b"protocol_state"],
        bump = protocol_state.bump,
    )]
    pub protocol_state: Box<Account<'info, ProtocolState>>,

    pub usdc_mint: InterfaceAccount<'info, Mint>,

    pub token_program: Interface<'info, TokenInterface>,
}

#[derive(Accounts)]
pub struct CloseBounty<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        mut,
        has_one = creator,
    )]
    pub bounty: Account<'info, NullBounty>,

    #[account(
        mut,
        seeds = [b"bounty_vault", bounty.key().as_ref()],
        bump = bounty.vault_bump,
    )]
    pub vault: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub creator_usdc_ata: InterfaceAccount<'info, TokenAccount>,

    pub usdc_mint: InterfaceAccount<'info, Mint>,

    pub token_program: Interface<'info, TokenInterface>,
}

// ---------------------------------------------------------------------------
// Data Accounts
// ---------------------------------------------------------------------------

#[account]
#[derive(InitSpace)]
pub struct ProtocolState {
    pub authority: Pubkey,        // 32
    pub nka_counter: u64,         // 8
    pub bounty_counter: u64,      // 8
    pub fee_basis_points: u16,    // 2
    pub treasury: Pubkey,         // 32
    pub bump: u8,                 // 1
}

#[account]
#[derive(InitSpace)]
pub struct NullResult {
    pub researcher: Pubkey,       // 32
    pub specimen_number: u64,     // 8
    pub hypothesis: [u8; 128],    // 128
    pub methodology: [u8; 128],   // 128
    pub expected_outcome: [u8; 128], // 128
    pub actual_outcome: [u8; 128],   // 128
    pub p_value: u32,             // 4
    pub sample_size: u32,         // 4
    pub data_hash: [u8; 32],      // 32
    pub status: u8,               // 1
    pub created_at: i64,          // 8
    pub bump: u8,                 // 1
}

#[account]
#[derive(InitSpace)]
pub struct NullBounty {
    pub creator: Pubkey,          // 32
    pub bounty_number: u64,       // 8
    pub description: [u8; 256],   // 256
    pub reward_amount: u64,       // 8
    pub usdc_mint: Pubkey,        // 32
    pub vault: Pubkey,            // 32
    pub deadline: i64,            // 8
    pub status: u8,               // 1
    pub matched_submission: Pubkey, // 32
    pub created_at: i64,          // 8
    pub vault_bump: u8,           // 1
    pub bump: u8,                 // 1
}

#[account]
#[derive(InitSpace)]
pub struct BountySubmission {
    pub researcher: Pubkey,       // 32
    pub null_result: Pubkey,      // 32
    pub bounty: Pubkey,           // 32
    pub status: u8,               // 1
    pub created_at: i64,          // 8
    pub bump: u8,                 // 1
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

#[event]
pub struct ProtocolInitialized {
    pub authority: Pubkey,
    pub fee_basis_points: u16,
}

#[event]
pub struct NullResultSubmitted {
    pub specimen_number: u64,
    pub researcher: Pubkey,
}

#[event]
pub struct BountyCreated {
    pub bounty_number: u64,
    pub creator: Pubkey,
    pub reward_amount: u64,
    pub deadline: i64,
}

#[event]
pub struct BountySubmissionCreated {
    pub bounty_number: u64,
    pub specimen_number: u64,
    pub researcher: Pubkey,
}

#[event]
pub struct BountyFulfilled {
    pub bounty_number: u64,
    pub specimen_number: u64,
    pub researcher: Pubkey,
    pub payout: u64,
    pub fee: u64,
}

#[event]
pub struct BountyClosed {
    pub bounty_number: u64,
    pub creator: Pubkey,
    pub refunded_amount: u64,
}

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

#[error_code]
pub enum NullGraphError {
    #[msg("Bounty is not in the expected status")]
    InvalidBountyStatus,
    #[msg("Submission is not in the expected status")]
    InvalidSubmissionStatus,
    #[msg("Matched submission mismatch")]
    SubmissionMismatch,
    #[msg("Bounty deadline has passed")]
    BountyExpired,
    #[msg("Reward amount must be > 0")]
    InvalidRewardAmount,
    #[msg("Fee calculation overflow")]
    FeeOverflow,
}
