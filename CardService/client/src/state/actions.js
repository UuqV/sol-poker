import store, { initialize } from '../state/store';
import { getHandCards, getFlop, getCard, fetchWinner } from '../api/serviceRequests';
import { initializePot, rewardWinner } from '../api/solRequests';

export const init = async (wallet) => {
  try {
    initializePot(wallet);
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