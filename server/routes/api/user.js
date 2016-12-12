const express = require("express");
const router = express.Router();
const UserStore = require("../../stores/user");
const BetsStore = require("../../stores/bets");

router.get("/me", (req, res) => {
    UserStore.getUser({
        _id: req.userId,
    })
    .then((user) => {
        res.json(user);
    })
    .catch((error) => {
        res.status(400).send(error);
        res.end();
    });
});
router.post("/me/gain", (req, res) => {
    const woney = req.body.woney,
          addedWoneys = req.body.addedWoneys,
          isDailyEarn = req.body.isDailyEarn,
          isFbShare = req.body.isFbShare;
    var doc = {woney};
    if (isDailyEarn) {
        doc.lastDailyEarn = new Date();
    }
    if (isFbShare) {
        doc.lastFbShare = new Date();
    }
    UserStore.updateUser(req.userId, doc, {
        // inc attributes
        totalWoney: addedWoneys
    })
    .then((user) => {
        res.json(user);
    })
    .catch((error) => {
        res.status(400).send(error);
        res.end();
    });
});
router.post("/me/bet", (req, res) => {
    const woney = req.body.woney,
          bets = req.body.bets,
          gameId = req.body.gameId,
          userId = req.userId;

    UserStore.updateUser(userId, {
        woney,
    })
    .then((user) => {
        return BetsStore.placeBets({
            userId, gameId, bets,
        });
    })
    .then((data) => {
        res.json({
            bets, woney
        });
    })
    .catch((error) => {
        res.status(400).send(error);
        res.end();
    });
});

module.exports = router;
