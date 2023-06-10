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
mod round {
    use super::*;
    pub fn init_table(_ctx: Context<InitTable>) -> Result<()> {
        Ok(())
    }

    pub fn create_round(ctx: Context<CreateRound>, bet_price: u64) -> Result<()> {
        msg!("Creating round...");
        let round = &mut ctx.accounts.round;
        msg!("Created round: {}", round.id);
        let table = &mut ctx.accounts.table;
        table.last_id += 1;

        round.id = table.last_id;
        round.house = ctx.accounts.house.key();
        round.bet_price = bet_price;

        msg!("House: {}", round.house);
        msg!("Bet price: {}", round.bet_price);

        Ok(())
    }

    pub fn buy_bet(ctx: Context<BuyBet>, round_id: u32) -> Result<()> {
        let round = &mut ctx.accounts.round;
        let bet = &mut ctx.accounts.bet;
        let buyer = &ctx.accounts.buyer;

        invoke(
            &transfer(&buyer.key(), &round.key(), round.bet_price),
            &[
                buyer.to_account_info(),
                round.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        round.last_bet_id += 1;

        bet.round_id = round_id;
        bet.id = round.last_bet_id;
        bet.house = buyer.key();

        msg!("Bet id: {}", bet.id);

        Ok(())
    }

    pub fn pick_winner(ctx: Context<PickWinner>, winner_id: u32) -> Result<()> {
        let round = &mut ctx.accounts.round;

        round.winner_id = Some(winner_id);

        msg!("Winner id:{}", winner_id);

        Ok(())
    }

    pub fn claim_pot(ctx: Context<ClaimPot>, round_id: u32, bet_id: u32) -> Result<()> {
        let round = &mut ctx.accounts.round;
        let bet = &ctx.accounts.bet;
        let winner = &ctx.accounts.house;

        round.winner_id = Some(bet.id);

        let pot = round
            .bet_price
            .checked_mul(round.last_bet_id.into())
            .unwrap();

        **round.to_account_info().try_borrow_mut_lamports()? -= pot;
        **winner.to_account_info().try_borrow_mut_lamports()? += pot;

        round.claimed = true;

        msg!(
            "{} claimed {} lamports from round id {} with bet id {}",
            winner.key(),
            pot,
            round.id,
            bet.id
        );

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitTable<'info> {
    #[account(init, payer = payer, space = 4 + 8, seeds = [TABLE_SEED.as_bytes()], bump,)]
    pub new_account: Account<'info, Table>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateRound<'info> {
    #[account(init, payer = house, space = 4 + 32 + 8 + 4 + 1 + 4 + 1 + 8, seeds = [ROUND_SEED.as_bytes(), &(table.last_id + 1).to_le_bytes()], bump,)]
    pub round: Account<'info, Round>,

    #[account(mut, seeds = [TABLE_SEED.as_bytes()], bump,)]
    pub table: Account<'info, Table>,

    #[account(mut)]
    pub house: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Table {
    pub last_id: u32,
}

#[account]
pub struct Round {
    pub id: u32,
    pub house: Pubkey,
    pub bet_price: u64,
    pub last_bet_id: u32,
    pub winner_id: Option<u32>,
    pub claimed: bool,
}

#[derive(Accounts)]
#[instruction(round_id:u32)]
pub struct BuyBet<'info> {
    #[account(mut, seeds = [ROUND_SEED.as_bytes(), &round_id.to_le_bytes()], bump,)]
    pub round: Account<'info, Round>,

    #[account(
        init,
        payer = buyer,
        space = 4 + 4 + 32 + 8,
        seeds = [BET_SEED.as_bytes(), round.key().as_ref(), &(round.last_bet_id + 1).to_le_bytes()], bump,
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
    pub round_id: u32,
}

#[derive(Accounts)]
#[instruction(round_id: u32)]
pub struct PickWinner<'info> {
    #[account(mut, seeds = [ROUND_SEED.as_bytes(), &round_id.to_le_bytes()], bump, has_one = house)]
    pub round: Account<'info, Round>,
    pub house: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(round_id:u32, bet_id: u32)]
pub struct ClaimPot<'info> {
    #[account(mut, seeds = [ROUND_SEED.as_bytes(), &round_id.to_le_bytes()], bump,)]
    pub round: Account<'info, Round>,

    #[account(mut, seeds = [BET_SEED.as_bytes(), round.key().as_ref(), &bet_id.to_le_bytes()], bump, has_one = house)]
    pub bet: Account<'info, Bet>,

    #[account(mut)]
    pub house: Signer<'info>,

    pub system_program: Program<'info, System>,
}
