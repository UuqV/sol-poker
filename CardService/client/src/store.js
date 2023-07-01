import { createSlice, configureStore } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
    walletAddress: undefined,
    opponents: [],
    ws: undefined,
  },
  reducers: {
    addOpponents: (state, action) => {
        const { opponents } = action.payload;
        console.log("opponents", opponents);
        state.opponents = [ ...state.opponents, opponents.split(',').flat()];
    }
  }
})

export const { addOpponents } = counterSlice.actions


const store = configureStore({
  reducer: counterSlice.reducer
})

export default store;

// Can still subscribe to the store
store.subscribe(() => console.log(store.getState()))

// Still pass action objects to `dispatch`, but they're created for us