import { createSlice, configureStore } from '@reduxjs/toolkit'
import { dealFlop, placeBet, dealCard, determineWinner } from './actions';
import { initializePot } from '../api/solRequests';

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
      isTurn: false,
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
        state.opponents = opponents;
    },
    takeTurn: (state, action) => {
      state.player.isTurn = action.payload;
    },
    startRound: (state, action) => {
      state.player.isTurn = action.payload;
      initializePot(state.wallet);
    },
    initialize: (state, action) => {
      state.player.hand = action.payload;
      state.table.inProgress = true;
    },
    getFlop: (state, action) => {
      state.table.cards.push(action.payload);
      state.table.cards = state.table.cards.flat();
      state.preFlop = false;
    },
    getRiver: (state, action) => {
      state.cards.append(dealCard());
    },
    updatePot: (state, action) => {
      state.table.pot = action.payload;
    },
    updateBalance: (state, action) => {
      state.player.balance = action.payload;
    },
    clearTable: (state, action) => { 
      state.table.cards = [];
      state.table.pot = 0;
      state.player.hand = [];
    },
  }
})

export const { addOpponents, initialize, setWallet, takeTurn, getFlop, clearTable, startRound, updatePot, updateBalance } = pokerSlice.actions


const store = configureStore({
  reducer: pokerSlice.reducer
})

export default store;

store.subscribe(() => console.log(store.getState()))
