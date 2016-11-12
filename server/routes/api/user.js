const express = require("express");
const router = express.Router();
const UserStore = require("../../stores/user");

router.get("/me", (req, res) => {
    // [TODO] should use token to remember user
    UserStore.getUser({
        email: "asdf@asdf.asf",
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
    UserStore.updateUser("58271c0c85ff2f09d86408ce", {
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
    UserStore.updateUser("58271c0c85ff2f09d86408ce", {
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
