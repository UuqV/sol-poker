import { createSlice, configureStore } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
    walletAddress: undefined,
    opponents: [],
    ws: undefined,
    storeFlop : [],
  },
  reducers: {
    addOpponents: (state, action) => {
        const { opponents } = action.payload;
        console.log("opponents", opponents);
        state.opponents = [ ...state.opponents, opponents.split(',').flat()];
    },
    addStoreFlop: (state, action) => {
        const { storeFlop } = action.payload;
        console.log("storeFlop", storeFlop);
        state.storeFlop = [ ...state.storeFlop, storeFlop];
        console.log("state.storeFlop", state.storeFlop);
    }
  }
})

export const { addOpponents, addStoreFlop } = counterSlice.actions


const store = configureStore({
  reducer: counterSlice.reducer
})

export default store;

// Can still subscribe to the store
store.subscribe(() => console.log(store.getState()))

// Still pass action objects to `dispatch`, but they're created for us