const express = require("express");
const router = express.Router();
const logger = require("../lib/logger");

const GameStore = require("../stores/game");

router.get("/", (req, res) => {
    GameStore.getOnGoingGame()
    .then(function (game) {
        res.render("reward", {
            route: "reward",
            title: "第 " + game.series + " 期累積獎金金額(每日早上手動更新)",
            game,
        });
    })
    .catch(function (error) {
        res.render("reward", {
            route: "reward",
            title: "累積獎金金額(每日早上手動更新)",
            reward: "N/A"
        });
    });
});
router.post("/", (req, res) => {
    const gameId = req.body.gameId,
          reward = req.body.reward,
          secondReward = req.body.secondReward;
    GameStore.updateGameReward(gameId, {
        reward, secondReward
    })
    .then(function (game) {
        res.redirect("/admin/reward");
    })
    .catch(function (error) {
        res.status(404).send({
            error: "update_reward_fail",
            message: "cannot update reward."
        });
        res.end();
    });

});

module.exports = router;
