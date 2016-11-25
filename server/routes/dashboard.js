const express = require("express");
const router = express.Router();
const logger = require("../lib/logger");

const GameStore = require("../stores/game");
const BetsStore = require("../stores/bets");

router.get("/", (req, res) => {
    var series = req.query.series;
    GameStore.getGames()
    .then(function (games) {
        var gameId;
        if (series) {
            series = parseInt(series);
            games.some(function (game, index) {
                if (game.series === series) {
                    gameId = game._id;
                    return true;
                }
                return false;
            });
        }
        if (!gameId) {
            series = games[0].series;
            gameId = games[0]._id;
        }

        BetsStore.getBetUsersFromGame({
            gameId: gameId
        })
        .then(function (users) {
            res.render("dashboard", {
                title: "參與列表",
                games: games,
                users: users,
                currentSeries: series,
            });
        });
    })
    .catch(function (error) {
        res.render("error", {
            title: "參與列表",
        });
    });

});

module.exports = router;
