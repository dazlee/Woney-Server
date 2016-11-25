const express = require("express");
const router = express.Router();
const logger = require("../lib/logger");

const GameStore = require("../stores/game");

router.get("/", (req, res) => {
    var series = req.query.series;
    GameStore.getGames()
    .then(function(games) {
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

        res.render("winners", {
            title: "Winners",
            games: games,
            game: game,
            currentSeries: series,
        });
    })
    .catch(function (error) {
        res.status(404).send({
            error: "cannot_get_games",
            message: "cannot get games",
        });
        res.end();
    });
});

module.exports = router;
