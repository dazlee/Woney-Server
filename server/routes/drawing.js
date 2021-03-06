const express = require("express");
const router = express.Router();
const logger = require("../lib/logger");

const GameStore = require("../stores/game");
const BetsStore = require("../stores/bets");

const momentUtils = require("../../shared/lib/moment-utils");

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

router.get("/:gameId", (req, res) => {
    var gameId = req.params.gameId;
    var game;
    GameStore.getGameById({
        gameId: gameId,
    })
    .then(function (_game) {
        game = _game;
        return BetsStore.getBetUsersFromGameInWhiteList({
            gameId: gameId,
        });
    })
    .then(function (users) {
        var drawed = draw(users);
        var firstWinner = drawed[0];
        var commonWinners = drawed.slice(1);
        if (firstWinner) {
            res.render("drawing", {
                route: "dashboard",
                title: "抽獎結果",
                firstWinner: firstWinner,
                commonWinners: commonWinners,
                game: game,
                gameId: gameId,
            });
        } else {
            res.redirect("/admin");
        }
    })
    .catch(function (error) {
        res.status(404).send(error);
        res.end();
    });
});
router.post("/:gameId/finish", (req, res) => {
    const gameId = req.params.gameId;
    const finishedGame = req.body;

    GameStore.finishGame(gameId, finishedGame)
    .then((game) => {
        return GameStore.createGame({
            startTime: game.endTime,
            endTime: momentUtils.getNextSundayWithHours(21),
            series: game.series + 1,
            woney: 0,
        });
    })
    .then((game) => {
        res.status("200");
        res.json({
            status: "success"
        });
        res.end();
    })
    .catch((error) => {
        res.status(400).send(error);
        res.end();
    });
});

module.exports = router;
