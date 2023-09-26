import store, {connectSocket, addOpponents, initialize, startTurn} from './state/store';

const socket = new WebSocket("ws://localhost:3001/echo");
socket.addEventListener('message', (message) => {
    const {action, payload} = JSON.parse(message.data);
    if (action == "CONNECTION") {
        store.dispatch(addOpponents({opponents: payload}));
    } else if (action == "HAND") {
        store.dispatch(initialize(payload));
    } else if (action == "TURN") {
        console.log("TURN");
        store.dispatch(startTurn());
    }
});

export default socket;