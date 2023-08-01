import {TexasHoldem, SixPlusHoldem, Omaha} from 'poker-odds-calc';

const Table = new TexasHoldem();
Table
  .addPlayer(["Qs", "Ks"])
  .addPlayer(["Qd", "Kd"])

  .setBoard(["Js","Ts","5h","Td"])
  // or
  .boardAction(board => {
    board
      .setFlop(["Js", "Ts", "5h"])
      .setTurn("Td")
  })
  ;

const Result = Table.calculate();

Result.getPlayers().forEach(player => {
  console.log(`${player.getName()} - ${player.getHand()} - Wins: ${player.getWinsPercentageString()} - Ties: ${player.getTiesPercentageString()}`);
});

console.log(`Board: ${Result.getBoard()}`);
console.log(`Iterations: ${Result.getIterations()}`);
console.log(`Time takes: ${Result.getTime()}ms`);

// Outputs:
// Player #1 - QsKs - Wins: 20.45% - Ties: 79.55%
// Player #2 - QdKd - Wins: 0.00% - Ties: 79.55%
// Board: JsTs5hTd
// Iterations: 44
// Time takes: 8ms
