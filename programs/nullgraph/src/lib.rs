use anchor_lang::prelude::*;

declare_id!("8MqKBAvXCe4ASv3gBAokyVuHUk311D3TvMfQ5pYdjEzo");

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
