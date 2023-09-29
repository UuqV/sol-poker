import store, {connectSocket, addOpponents, initialize, takeTurn, getFlop, clearTable, startRound, win} from './state/store';
import { rewardWinner } from './api/solRequests';

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
    } else if (action == "START") {
        store.dispatch(startRound(payload));
    } else if (action == "DEAL") {
        store.dispatch(getFlop(payload));
    } else if (action == "CLEAR") {
        store.dispatch(clearTable());
    } else if (action == "WINNER") {
        alert("WINNER!");
        rewardWinner(store.getState().player.wallet);
    }
});

export default socket;