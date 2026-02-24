use anchor_lang::prelude::*;

declare_id!("2u3DXQq9A6UgMryeVSWCNdYLy3Fjh391R5hcfWYkCgZK");

#[program]
pub mod nullgraph {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
