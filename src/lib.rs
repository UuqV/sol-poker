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
mod table {
    use super::*;
    pub fn init_master(_ctx: Context<InitMaster>) -> Result<()> {
        Ok(())
    }

    pub fn create_table(ctx: Context<CreateTable>, bet_price: u64) -> Result<()> {
        msg!("Creating table...");
        let table = &mut ctx.accounts.table;
        msg!("Created table: {}", table.id);
        let master = &mut ctx.accounts.master;
        master.last_id += 1;

        table.id = master.last_id;
        table.authority = ctx.accounts.authority.key();
        table.bet_price = bet_price;

        msg!("Authority: {}", table.authority);
        msg!("Bet price: {}", table.bet_price);

        Ok(())
    }

    pub fn buy_bet(ctx: Context<BuyBet>, table_id: u32) -> Result<()> {
        let table = &mut ctx.accounts.table;
        let bet = &mut ctx.accounts.bet;
        let buyer = &ctx.accounts.buyer;

        if table.winner_id.is_some() {
            return err!(error::TableError::WinnerAlreadyExists);
        }

        invoke(
            &transfer(&buyer.key(), &table.key(), table.bet_price),
            &[
                buyer.to_account_info(),
                table.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        table.last_bet_id += 1;

        bet.table_id = table_id;
        bet.authority = buyer.key();

        msg!("Bet id: {}", bet.id);
        msg!("Bet authority: {}", bet.authority);

        Ok(())
    }

    pub fn pick_winner(ctx: Context<PickWinner>, winner_id: u32) -> Result<()> {
        let table = &mut ctx.accounts.table;

        table.winner_id = Some(winner_id);

        msg!("Winner id:{}", winner_id);

        Ok(())
    }

    pub fn claim_prize(ctx: Context<ClaimPrize>, table_id: u32, bet_id: u32) -> Result<()> {
        let table = &mut ctx.accounts.table;
        let bet = &ctx.accounts.bet;
        let winner = &ctx.accounts.authority;

        let prize = table
            .bet_price
            .checked_mul(table.last_bet_id.into())
            .unwrap();

        **table.to_account_info().try_borrow_mut_lamports()? -= prize;
        **winner.to_account_info().try_borrow_mut_lamports()? += prize;

        table.claimed = true;

        msg!(
            "{} claimed {} lamports from table id {} with bet id {}",
            winner.key(),
            prize,
            table.id,
            bet.id
        );

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
pub struct CreateTable<'info> {
    #[account(init, payer = authority, space = 4 + 32 + 8 + 4 + 1 + 4 + 1 + 8, seeds = [TABLE_SEED.as_bytes(), &(master.last_id + 1).to_le_bytes()], bump,)]
    pub table: Account<'info, Table>,

    #[account(mut, seeds = [MASTER_SEED.as_bytes()], bump,)]
    pub master: Account<'info, Master>,

    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Master {
    pub last_id: u32,
}

#[account]
pub struct Table {
    pub id: u32,
    pub authority: Pubkey,
    pub bet_price: u64,
    pub last_bet_id: u32,
    pub winner_id: Option<u32>,
    pub claimed: bool,
}

#[derive(Accounts)]
#[instruction(table_id:u32)]
pub struct BuyBet<'info> {
    #[account(mut, seeds = [TABLE_SEED.as_bytes(), &table_id.to_le_bytes()], bump,)]
    pub table: Account<'info, Table>,

    #[account(
        init,
        payer = buyer,
        space = 4 + 4 + 32 + 8,
        seeds = [BET_SEED.as_bytes(), table.key().as_ref(), &(table.last_bet_id + 1).to_le_bytes()], bump,
    )]
    pub bet: Account<'info, Bet>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct Bet {
    pub id: u32,
    pub authority: Pubkey,
    pub table_id: u32,
}

#[derive(Accounts)]
#[instruction(table_id: u32)]
pub struct PickWinner<'info> {
    #[account(mut, seeds = [TABLE_SEED.as_bytes(), &table_id.to_le_bytes()], bump, has_one = authority)]
    pub table: Account<'info, Table>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(table_id:u32, bet_id: u32)]
pub struct ClaimPrize<'info> {
    #[account(mut, seeds = [TABLE_SEED.as_bytes(), &table_id.to_le_bytes()], bump,)]
    pub table: Account<'info, Table>,

    #[account(mut, seeds = [BET_SEED.as_bytes(), table.key().as_ref(), &bet_id.to_le_bytes()], bump, has_one = authority)]
    pub bet: Account<'info, Bet>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}
