import store, { initialize, takeTurn, updatePot } from '../state/store';
import { getHandCards, getFlop, getCard, fetchWinner } from '../api/serviceRequests';
import { initializePot, rewardWinner, placeBet } from '../api/solRequests';
import socket from "../socket";

export const init = async (wallet) => {
  try {
    //initializePot(wallet);
    //socket.send(JSON.stringify({action: "HAND"}));
  } catch (error) {
    console.error(error);
  }
};

export const dealFlop = async () => {
  return getFlop();
};

export const dealCard = () => {
  return getCard();
};

export const bet = () => {
  store.dispatch(takeTurn());
  placeBet().then((potBalance) => {
    store.dispatch(updatePot(potBalance));
    socket.send(JSON.stringify({action: "BET"}));
  })
}

export const fold = () => {
  store.dispatch(takeTurn());
  socket.send(JSON.stringify({action: "FOLD"}));
}


export const determineWinner = (winner) => {
  rewardWinner({winner});
};