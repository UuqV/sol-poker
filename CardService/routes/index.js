var anchor = require('@project-serum/anchor');
var express = require('express');
const cors = require('cors');
var router = express.Router();
var IDL  = require("./idl");
const { GameState } = require('../GameState');

console.log(GameState);

// Enable CORS for all routes
router.use(cors());

router.get('/', function(req, res, next) {
  res.sendFile('index.html', { root: '.' });
});

/* GET cards. */
router.get('/shuffle/', function(req, res) {
  res.send({
    deck: GameState.deck,
    hands: GameState.hands,
    commonCards: GameState.commonCards
  });
});


router.post('/hand/', function(req, res) {
  const {player} = req.body;
  console.log('player', player);
  res.send(GameState.dealHand(player));
});

router.get('/flop/', function(req, res, next) {
  res.send(GameState.deal(3));
});


router.get('/deck/', function(req, res, next) {
  res.send(GameState.deck);
});


router.get('/hands', function(req, res, next) {
  res.send(GameState.hands);
});

router.get('/river/', function(req, res, next) {
  res.send(GameState.deal(1));
});

router.get('/winner/', function(req, res, next) {
  res.send(GameState.determineWinner());
});


module.exports = router;
