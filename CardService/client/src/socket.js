import store, {connectSocket, addOpponents, initialize} from './state/store';

const socket = new WebSocket("ws://localhost:3001/echo");
socket.addEventListener('message', (message) => {
    const {action, payload} = JSON.parse(message.data);
    console.log(action, payload);
    if (action == "CONNECTION") {
        store.dispatch(addOpponents({opponents: payload}));
    } else if (action == "HAND") {
        store.dispatch(initialize(payload));
    }
});

export default socket;