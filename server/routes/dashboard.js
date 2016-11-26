const express = require("express");
const router = express.Router();
const logger = require("../lib/logger");

const GameStore = require("../stores/game");
const BetsStore = require("../stores/bets");

router.get("/", (req, res) => {
    var series = req.query.series;
    GameStore.getGames()
    .then(function (games) {
        var game;
        if (series) {
            series = parseInt(series);
            games.some(function (_game, index) {
                if (_game.series === series) {
                    game = _game;
                    return true;
                }
                return false;
            });
        }
        if (!game) {
            series = games[0].series;
            game = games[0];
        }

        BetsStore.getBetUsersFromGame({
            gameId: game._id
        })
        .then(function (users) {
            res.render("dashboard", {
                route: "dashboard",
                title: "參與列表",
                games: games,
                users: users,
                currentSeries: series,
                game: game,
            });
        });
    })
    .catch(function (error) {
        res.render("error", {
            route: "dashboard",
            title: "參與列表",
        });
    });

});

module.exports = router;
