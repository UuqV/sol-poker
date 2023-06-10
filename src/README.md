# API Description

List of args and accounts needed for each smart contract method.

The "House" represents the casino, with treasury and signing authority.
The "Player" represents a seat at the round, the user's wallet.

# initTable
Master account governing rounds at rounds. You should just fetch these tables instead of using this function.

Accounts:
```
newAccount: seed: 'table'
payer: House
```
Example Objects:
```
[
  {
    "publicKey": Pubkey from table seed,
    "account": {
      "lastId": 1
    }
  }
]
```

# createRound
Represents a game at a round. Currently only supports a single round of betting.

args:
```
betPrice: "Big Blind" bet in lamports
```
Accounts:
```
round: seed 'round' + (u32: table's lastId + 1)
table: from initTable
house: house
```
Example Objects:
```
[
  {
    "publicKey": Pubkey from round seed,
    "account": {
      "id": 1,
      "house": House,
      "betPrice": "1000",
      "lastBetId": 0,
      "winnerId": null,
      "claimed": false
    }
  },
  {
    "publicKey": Pubkey from round seed,
    "account": {
      "id": 2,
      "house": House,
      "betPrice": "1000",
      "lastBetId": 4,
      "winnerId": 4,
      "claimed": true
    }
  }
]
```

# buyBet:
Represents a bet posted at a round.

args:
```
roundId: id from createRound
```
Accounts:
```
round: from createRound
bet: seed 'bet' + round Pubkey + (u32: lastBetId from Round + 1)
buyer: Player
```
Example Objects:
```
[
  {
    "publicKey": Pubkey from bet seed,
    "account": {
      "id": 1,
      "house": House,
      "roundId": 2
    }
  },
  {
    "publicKey": Pubkey from bet seed,
    "account": {
      "id": 2,
      "house": House,
      "roundId": 2
    }
  },
  {
    "publicKey": Pubkey from bet seed,
    "account": {
      "id": 3,
      "house": House,
      "roundId": 2
    }
  },
  {
    "publicKey": Pubkey from bet seed,
    "account": {
      "id": 4,
      "house": House,
      "roundId": 2
    }
  }
]
```

# claimPot:
Distributes the pot to a given bet owner.

args:
```
roundId: from createRound
betId: from createBet
```

Accounts:
```
round: from createRound
bet: from createBet
house: House
```
