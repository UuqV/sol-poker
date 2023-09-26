import store, { initialize } from '../state/store';
import { getHandCards, getFlop, getCard, fetchWinner } from '../api/serviceRequests';
import { initializePot, rewardWinner } from '../api/solRequests';
import socket from "../socket";

export const init = async (wallet) => {
  try {
    initializePot(wallet);
    socket.send(JSON.stringify({action: "HAND"}));
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

export const placeBet = () => {

}

export const determineWinner = () => {
  const winner = fetchWinner();
  store.dispatch(rewardWinner({winner}));
};