use anchor_lang::{
    prelude::*,
    solana_program::{clock::Clock, hash::hash, program::invoke, system_instruction::transfer},
};

mod constants;
mod error;

use crate::{constants::*, error::*};

// This is your program's public key and it will update
// automatically when you build the project.
declare_id!("HzawsjeijhERaZtCts76hKhFZjmWyRhBXoZG1B1KbHKU");

#[program]
mod pot {
    use super::*;
    pub fn init_master(_ctx: Context<InitMaster>) -> Result<()> {
        Ok(())
    }

    pub fn create_pot(ctx: Context<CreatePot>, bet_price: u64) -> Result<()> {
        msg!("Creating pot...");
        let pot = &mut ctx.accounts.pot;
        msg!("Created pot: {}", pot.id);
        let master = &mut ctx.accounts.master;
        master.last_id += 1;

        pot.id = master.last_id;
        pot.house = ctx.accounts.house.key();
        pot.bet_price = bet_price;

        msg!("House: {}", pot.house);
        msg!("Bet price: {}", pot.bet_price);

        Ok(())
    }

    pub fn buy_bet(ctx: Context<BuyBet>, pot_id: u32) -> Result<()> {
        let pot = &mut ctx.accounts.pot;
        let bet = &mut ctx.accounts.bet;
        let buyer = &mut ctx.accounts.buyer;

        invoke(
            &transfer(&buyer.key(), &pot.key(), pot.bet_price),
            &[
                buyer.to_account_info(),
                pot.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        pot.last_bet_id += 1;

        bet.pot_id = pot_id;
        bet.id = pot.last_bet_id;
        bet.house = buyer.key();

        msg!("Bet id: {}", bet.id);

        Ok(())
    }

    pub fn pick_winner(ctx: Context<PickWinner>, winner_id: u32) -> Result<()> {
        let pot = &mut ctx.accounts.pot;

        pot.winner_id = Some(winner_id);

        msg!("Winner id:{}", winner_id);

        Ok(())
    }

    pub fn claim_pot(ctx: Context<ClaimPot>, pot_id: u32, bet_id: u32) -> Result<()> {
        let pot = &mut ctx.accounts.pot;
        let winner = &mut ctx.accounts.house;

        let winnings = pot.bet_price.checked_mul(pot.last_bet_id.into()).unwrap();

        **pot.to_account_info().try_borrow_mut_lamports()? -= winnings;
        **winner.to_account_info().try_borrow_mut_lamports()? += winnings;

        pot.claimed = true;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitMaster<'info> {
    #[account(init, payer = payer, space = 4 + 8, seeds = [MASTER_SEED.as_bytes()], bump,)]
    pub new_account: Account<'info, Master>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreatePot<'info> {
    #[account(init, payer = house, space = 4 + 32 + 8 + 4 + 1 + 4 + 1 + 8, seeds = [POT_SEED.as_bytes(), &(master.last_id + 1).to_le_bytes()], bump,)]
    pub pot: Account<'info, Pot>,

    #[account(mut, seeds = [MASTER_SEED.as_bytes()], bump,)]
    pub master: Account<'info, Master>,

    #[account(mut)]
    pub house: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Master {
    pub last_id: u32,
}

#[account]
pub struct Pot {
    pub id: u32,
    pub house: Pubkey,
    pub bet_price: u64,
    pub last_bet_id: u32,
    pub winner_id: Option<u32>,
    pub claimed: bool,
}

#[derive(Accounts)]
#[instruction(pot_id:u32)]
pub struct BuyBet<'info> {
    #[account(mut, seeds = [POT_SEED.as_bytes(), &pot_id.to_le_bytes()], bump,)]
    pub pot: Account<'info, Pot>,

    #[account(
        init,
        payer = buyer,
        space = 4 + 4 + 32 + 8,
        seeds = [BET_SEED.as_bytes(), pot.key().as_ref(), &(pot.last_bet_id + 1).to_le_bytes()], bump,
    )]
    pub bet: Account<'info, Bet>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct Bet {
    pub id: u32,
    pub house: Pubkey,
    pub pot_id: u32,
}

#[derive(Accounts)]
#[instruction(pot_id: u32)]
pub struct PickWinner<'info> {
    #[account(mut, seeds = [POT_SEED.as_bytes(), &pot_id.to_le_bytes()], bump, has_one = house)]
    pub pot: Account<'info, Pot>,
    pub house: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(pot_id:u32, bet_id: u32)]
pub struct ClaimPot<'info> {
    #[account(mut, seeds = [POT_SEED.as_bytes(), &pot_id.to_le_bytes()], bump,)]
    pub pot: Account<'info, Pot>,

    #[account(mut)]
    pub house: Signer<'info>,

    pub system_program: Program<'info, System>,
}
