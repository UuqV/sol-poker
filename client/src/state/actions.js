import store, { initialize, takeTurn, updatePot, updateBalance } from '../state/store';
import { getHandCards, getFlop, getCard, fetchWinner } from '../api/serviceRequests';
import { initializePot, rewardWinner, placeBet, getSolBalance } from '../api/solRequests';
import socket from "../socket";

export const init = async (wallet) => {
  try {
    getSolBalance(wallet).then((balance) => {
      store.dispatch(updateBalance(balance));
    });
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

export const bet = (wallet) => {
  store.dispatch(takeTurn());
  placeBet(wallet).then((potBalance) => {
    store.dispatch(updatePot(potBalance));
    getSolBalance(wallet).then((balance) => {
      store.dispatch(updateBalance(balance));
    });
    socket.send(JSON.stringify({action: "BET", pot: potBalance}));
  })
  .catch((error) => {
      console.error("Error occurred:", error);
      // Handle the error
  });
}

export const fold = () => {
  store.dispatch(takeTurn());
  socket.send(JSON.stringify({action: "FOLD"}));
}


export const determineWinner = (winner) => {
  rewardWinner({winner});
};