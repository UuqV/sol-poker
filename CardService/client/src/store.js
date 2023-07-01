import { createSlice, configureStore } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
    ws: undefined,
  },
  reducers: {
    incremented: state => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1
    },
    decremented: state => {
      state.value -= 1
    },
    connectSocket: state => {
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
store.dispatch(connectSocket())