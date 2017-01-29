const express = require("express");
const logger = require("../../lib/logger");
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
    if (parseInt(isDailyEarn) === 1) {
        doc.lastDailyEarn = new Date();
    }
    if (parseInt(isFbShare) === 1) {
        doc.lastFbShare = new Date();
    }
	if (addedWoneys > 10 || woney > 2000) {
		logger.warn("[Woney]someone is gaining too many woney, userId is", req.userId, ", woney doc is", doc, ", addedWoneys is", addedWoneys);
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
