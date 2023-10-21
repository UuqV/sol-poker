import store, { addOpponents, initialize, takeTurn, getFlop, clearTable, startRound, win, updatePot, updateBalance, setWinner} from './state/store';
import { rewardWinner, initializePot } from './api/solRequests';

const socket = new WebSocket("ws://localhost:3001/echo");
socket.addEventListener('message', (message) => {
    const {action, payload} = JSON.parse(message.data);
    console.log('Received WS Event', action);
    
    if (action == "CONNECTION") {
        store.dispatch(addOpponents({opponents: payload}));
    } else if (action == "TURN") {
        store.dispatch(takeTurn(payload));
    } else if (action == "START") {
        initializePot(store.getState().player.wallet).then(() => {
            socket.send(JSON.stringify({action: "HAND"}));
            store.dispatch(startRound(payload));
        });
    } else if (action == "HAND") {
        store.dispatch(initialize(payload));
    } else if (action == "DEAL") {
        store.dispatch(getFlop(payload));
    } else if (action == "CLEAR") {
        store.dispatch(clearTable());
    } else if (action == "WINNER") {
        store.dispatch(setWinner(store.getState().player.wallet));
        rewardWinner(store.getState().player.wallet).then((balance) => {
            store.dispatch(updateBalance(balance));
        });
    } else if (action == "POT") {
        store.dispatch(updatePot(payload));
    } else if (action == "ANNOUNCE_WINNER") {
        // set winner again
        store.dispatch(setWinner(payload));
        console.log('get winner from store.js', store.getState().winner);
    }
});

export default socket;