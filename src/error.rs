use anchor_lang::prelude::error_code;

#[error_code]
pub enum TableError {
    #[msg("Winner already exists")]
    WinnerAlreadyExists,
    #[msg("Can't choose a winner when there are no bets.")]
    NoBets,
    #[msg("Winner has not been chosen.")]
    WinnerNotChosen,
    #[msg("Invalid winner.")]
    InvalidWinner,
    #[msg("The prize has already been claimed.")]
    AlreadyClaimed,
}
