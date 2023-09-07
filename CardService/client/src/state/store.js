import { createSlice, configureStore } from '@reduxjs/toolkit'
import { initializePot, dealInitialCards, dealFlop, placeBet, dealCard, determineWinner } from './actions';

const pokerSlice = createSlice({
  name: 'poker',
  initialState: {
    value: 0,
    opponents: [],
    ws: undefined,
    player: {
      hand: [],
      wallet: undefined,
      balance: 0,
    },
    table: {
      pot: 0,
      inProgress: false,
      preFlop: true,
      cards: [],
    }

  },
  reducers: {
    setWallet: (state, action) => {
      const { wallet } = action.payload;
      state.player.wallet = wallet;
    },
    addOpponents: (state, action) => {
        const { opponents } = action.payload;
        state.opponents = [ ...state.opponents, opponents.split(',').flat() ];
    },
    initialize: (state, action) => {
      const { cards } = action.payload;
      state.player.hand = cards;
      state.table.inProgress = true;
    },
    getFlop: (state, action) => {
      state.cards = [ ...state.cards, dealFlop() ];
      state.preFlop = false;
    },
    getRiver: (state, action) => {
      state.cards.append(dealCard());
    },
    placeBet: (state, action) => {
      state.pot = placeBet(state.wallet);
    },
    determineWinner: (state, action) => {
      state.table.pot = 0;
      state.table.inProgress = false;
      state.player.balance = determineWinner(state.wallet, state.player.balance);
    }
  }
})

export const { addOpponents, initialize, setWallet } = pokerSlice.actions


const store = configureStore({
  reducer: pokerSlice.reducer
})

export default store;

store.subscribe(() => console.log(store.getState()))
