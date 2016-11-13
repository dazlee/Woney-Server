const express = require("express");
const router = express.Router();
const GameStore = require("../../stores/game");

router.get("/ongoing", (req, res) => {
    GameStore.getOnGoingGame()
    .then((game) => {
        res.json(game);
    })
    .catch((error) => {
        res.status(400).send(error);
        res.end();
    });
});
router.get("/lastDraw", (req, res) => {
    GameStore.getLastDrawGame()
    .then((game) => {
        res.json(game);
    })
    .catch((error) => {
        res.status(400).send(error);
        res.end();
    });
});

router.post("/", (req, res) => {
    const newGame = req.body;
    GameStore.createGame(newGame)
    .then((game) => {
        res.json(game);
    })
    .catch((error) => {
        res.status(400).send(error);
        res.end();
    });
});
router.post("/:gameId/finish", (req, res) => {
    const gameId = req.params.gameId;
    const finishedGame = req.body;

    GameStore.finishGame(gameId, finishedGame)
    .then((game) => {
        res.json(game);
    })
    .catch((error) => {
        res.status(400).send(error);
        res.end();
    });
});

module.exports = router;
