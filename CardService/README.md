# Endpoints

Endpoint to shuffle the deck and reinitialize:
`http://localhost:3000/shuffle/`

Endpoint to retrieve hand cards:
`http://localhost:3000/hand/`
Example response:
`{"playerCards":[{"suit":"♠","rank":"2"},{"suit":"♠","rank":"3"}],"computerCards":[{"suit":"♠","rank":"4"},{"suit":"♠","rank":"5"}]}`

Endpoint to retrieve flop cards:
`http://localhost:3000/flop/`

Example response:
`{"commonCards":[[{"suit":"♠","rank":"2"},{"suit":"♠","rank":"3"},{"suit":"♠","rank":"4"}]]}`

Endpoint to retrieve river cards (call this function once each for the 4th and 5th card):
`http://localhost:3000/river/`

Example response:
`{"commonCards":[[{"suit":"♠","rank":"2"},{"suit":"♠","rank":"3"},{"suit":"♠","rank":"4"}],[{"suit":"♠","rank":"5"}],[{"suit":"♠","rank":"6"}]]}`