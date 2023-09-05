import { createSlice, configureStore } from '@reduxjs/toolkit'

const pokerSlice = createSlice({
  name: 'poker',
  initialState: {
    value: 0,
    walletAddress: undefined,
    opponents: [],
    ws: undefined,
    player: {
      playerHand: [],
      walletAddress: undefined,
      playerBalance: 0,
    },
    table: {
      pot: 0,
      roundInProgress: false,
      preFlop: true,
      flop: [],
      cards: [],
    }

  },
  reducers: {
    addOpponents: (state, action) => {
        const { opponents } = action.payload;
        console.log("opponents", opponents);
        state.opponents = [ ...state.opponents, opponents.split(',').flat()];
    }
  }
})

export const { addOpponents } = pokerSlice.actions


const store = configureStore({
  reducer: pokerSlice.reducer
})

export default store;

// Can still subscribe to the store
store.subscribe(() => console.log(store.getState()))

// Still pass action objects to `dispatch`, but they're created for us