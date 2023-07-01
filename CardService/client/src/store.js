import { createSlice, configureStore } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
    walletAddress: undefined,
    ws: undefined,
  },
  reducers: {
    connectSocket: (state, action) => {
        console.log(action);
        state.walletAddress = action.payload;
        const socket = new WebSocket("ws://localhost:3001/echo");
        socket.addEventListener('message', console.log);
        socket.onopen = () => socket.send('connected');
        state.ws = socket;
    }
  }
})

export const { connectSocket } = counterSlice.actions


const store = configureStore({
  reducer: counterSlice.reducer
})

export default store;

// Can still subscribe to the store
store.subscribe(() => console.log(store.getState()))

// Still pass action objects to `dispatch`, but they're created for us