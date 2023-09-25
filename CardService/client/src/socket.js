import store, {connectSocket, addOpponents, initialize} from './state/store';

export const getSocket = (w) => {
    const socket = new WebSocket("ws://localhost:3001/echo");
    socket.addEventListener('message', (message) => {
        const {action, payload} = JSON.parse(message.data);
        console.log(action, payload);
        switch (action) {
          case "CONNECTION":
            store.dispatch(addOpponents({opponents: payload}));
          case "DEAL":
            store.dispatch(initialize({ cards: payload }));
      }
    });
    socket.onopen = () => socket.send(JSON.stringify({action: "CONNECTION", wallet: w}));
}