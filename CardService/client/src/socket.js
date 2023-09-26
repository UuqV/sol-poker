import store, {connectSocket, addOpponents, initialize, takeTurn} from './state/store';

const socket = new WebSocket("ws://localhost:3001/echo");
socket.addEventListener('message', (message) => {
    const {action, payload} = JSON.parse(message.data);
    console.log('Received WS Event', action);
    if (action == "CONNECTION") {
        store.dispatch(addOpponents({opponents: payload}));
    } else if (action == "HAND") {
        store.dispatch(initialize(payload));
    } else if (action == "TURN") {
        store.dispatch(takeTurn(payload));
    }
});

export default socket;