const express = require("express");
const router = express.Router();
const UserStore = require("../../stores/user");

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
    const woney = req.body.woney;
    UserStore.updateUser(req.userId, {
        woney
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
          bets = req.body.bets;
    UserStore.updateUser(req.userId, {
        woney, bets
    })
    .then((user) => {
        res.json(user);
    })
    .catch((error) => {
        res.status(400).send(error);
        res.end();
    });
});

module.exports = router;
