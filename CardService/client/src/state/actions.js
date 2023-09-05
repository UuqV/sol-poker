import store, { initialize } from '../state/store';
import { getHandCards, getFlop, getCard } from '../api/serviceRequests';

export const init = async (wallet) => {
  try {
    const playerCards = await getHandCards(wallet);
    store.dispatch(initialize({ cards: playerCards }));
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

};