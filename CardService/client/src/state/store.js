import { createSlice, configureStore } from '@reduxjs/toolkit'
import { initializePot, dealInitialCards } from './actions';

const pokerSlice = createSlice({
  name: 'poker',
  initialState: {
    value: 0,
    walletAddress: undefined,
    opponents: [],
    ws: undefined,
    player: {
      hand: [],
      walletAddress: undefined,
      balance: 0,
    },
    table: {
      pot: 0,
      inProgress: false,
      preFlop: true,
      flop: [],
      cards: [],
    }

  },
  reducers: {
    addOpponents: (state, action) => {
        const { opponents } = action.payload;
        state.opponents = [ ...state.opponents, opponents.split(',').flat()];
    },
    initialize: (state, action) => {
      state.pot = initializePot();
      state.player.hand = dealInitialCards();
      state.table.roundinProgress = true;
    }
  }
})

export const { addOpponents, initialize } = pokerSlice.actions


const store = configureStore({
  reducer: pokerSlice.reducer
})

export default store;

store.subscribe(() => console.log(store.getState()))
