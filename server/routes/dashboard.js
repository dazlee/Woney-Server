const express = require("express");
const router = express.Router();
const logger = require("../lib/logger");

const GameStore = require("../stores/game");

router.get("/", (req, res) => {
    GameStore.getGames()
    .then(function (games) {
        res.render("dashboard", {
            title: "參與列表",
            games: games
        });
    })
    .catch(function (error) {
        res.render("error", {
            title: "參與列表",
        });
    });

});

module.exports = router;
