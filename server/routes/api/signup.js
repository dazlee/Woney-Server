const logger = require("../../lib/logger");
const express = require("express");
const router = express.Router();
const UserStore = require("../../stores/user");

router.post("/", (req, res) => {
    const body = req.body;
    const attributes = {
        username: body.username,
        password: body.password,
    };
    UserStore.signup(attributes)
    .then((user) => {
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            res.json(user);
            res.end();
        });
    })
    .catch((error) => {
        logger.error("error signup ", error);
        res.json(error);
        res.end();
    });
});

module.exports = router;
