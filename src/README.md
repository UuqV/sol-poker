# API Description

List of args and accounts needed for each smart contract method.

The "House" represents the casino, with treasury and signing authority.
The "Player" represents a seat at the pot, the user's wallet.

# initMaster
Master account governing pots. You should just fetch these masters instead of using this function.

Accounts:
```
newAccount: seed: 'master'
payer: House
```
Example Objects:
```
[
  {
    "publicKey": Pubkey from master seed,
    "account": {
      "lastId": 1
    }
  }
]
```

# createPot
Represents a game at a pot. Currently only supports a single pot of betting.

args:
```
betPrice: "Big Blind" bet in lamports
```
Accounts:
```
pot: seed 'pot' + (u32: master's lastId + 1)
master: from initMaster
house: house
```
Example Objects:
```
[
  {
    "publicKey": Pubkey from pot seed,
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
    "publicKey": Pubkey from pot seed,
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
Represents a bet posted at a pot.

args:
```
potId: id from createPot
```
Accounts:
```
pot: from createPot
bet: seed 'bet' + pot Pubkey + (u32: lastBetId from Pot + 1)
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
      "potId": 2
    }
  },
  {
    "publicKey": Pubkey from bet seed,
    "account": {
      "id": 2,
      "house": House,
      "potId": 2
    }
  },
  {
    "publicKey": Pubkey from bet seed,
    "account": {
      "id": 3,
      "house": House,
      "potId": 2
    }
  },
  {
    "publicKey": Pubkey from bet seed,
    "account": {
      "id": 4,
      "house": House,
      "potId": 2
    }
  }
]
```

# claimPot:
Distributes the pot to a given bet owner.

args:
```
potId: from createPot
betId: from createBet
```

Accounts:
```
pot: from createPot
bet: from createBet
house: House
```
