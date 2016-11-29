const express = require("express");
const router = express.Router();
const GameStore = require("../../stores/game");
const BetsStore = require("../../stores/bets");

function draw (users) {
    users.sort(function (user1, user2) {
        if (user1.bets > user2.bets) {
            return -1;
        } else {
            return 1;
        }
    });

    for (var i = 0; i < users.length; i++) {
        if (users[i-1] && users[i-1].bets === users[i].bets) {
            users[i].score1 = users[i-1].score1;
        } else if (i > 100) {
            users[i].score1 = 0;
        } else {
            users[i].score1 = 100-i;
        }
    }

    users.sort(function (user1, user2) {
        return 0.5 - Math.random();
    });

    for (var i = 0; i < users.length; i++) {
        if (i > 100) {
            users[i].score = users[i].score1*0.6;
        } else {
            users[i].score = (100-i)*0.4 + users[i].score1*0.6;
        }
        delete users[i].score1;
    }

    users.sort(function (user1, user2) {
        if (user1.score > user2.score) {
            return -1;
        } else {
            return 1;
        }
    });

    return users.slice(0, 11);
}

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

router.get("/", (req, res) => {
    const newGame = req.body;
    GameStore.getGames()
    .then((games) => {
        res.json(games);
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

router.get("/:gameId/draw", (req, res) => {
    var gameId = req.params.gameId;
    BetsStore.getBetUsersFromGame({
        gameId: gameId,
    })
    .then(function (users) {
        var drawed = draw(users);
        res.json(drawed);
        res.end();
    })
    .catch(function (error) {
        res.status(404).send(error);
        res.end();
    });
});

module.exports = router;
