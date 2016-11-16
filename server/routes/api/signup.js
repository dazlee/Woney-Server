const logger = require("../../lib/logger");
const express = require("express");
const router = express.Router();
const UserStore = require("../../stores/user");

router.post("/", (req, res) => {
    var userPromise;
    if (req.userId) {
        userPromise = UserStore.getUser({
            _id: req.userId
        });
    } else {
        userPromise = UserStore.signup(req.body);
    }
    userPromise
    .then((user) => {
        res.json(user);
    })
    .catch((error) => {
        logger.error("error signup ", error);
        res.json(error);
        res.end();
    });
});

module.exports = router;
