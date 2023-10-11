import store, { addOpponents, initialize, takeTurn, getFlop, clearTable, startRound, win, updatePot, updateBalance, setWinner} from './state/store';
import { rewardWinner, initializePot } from './api/solRequests';

const socket = new WebSocket("wss://celestial-sonar-400518.uk.r.appspot.com/echo");
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
        socket.send(JSON.stringify({action: "ANNOUNCE_WINNER", winner: store.getState().player.wallet}));
        rewardWinner(store.getState().player.wallet).then((balance) => {
            
            store.dispatch(updateBalance(balance));
            
        });
        console.log('WINNER------');
        console.log('payload in action == "WINNER"', store.getState().player.wallet);
    } else if (action == "POT") {
        store.dispatch(updatePot(payload));
    } else if (action == "ANNOUNCE_WINNER") {
        // front end part
        console.log('in socket.js ANNOUNCE_WINNER------');
        console.log('payload in action == "ANNOUNCE_WINNER"', payload);// works
        // set winner again
        store.dispatch(setWinner(payload));
        console.log('get winner from store.js', store.getState().winner);
    }
});

export default socket;