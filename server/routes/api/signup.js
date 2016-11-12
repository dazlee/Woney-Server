const logger = require("../../lib/logger");
const express = require("express");
const router = express.Router();
const UserStore = require("../../stores/user");

router.post("/", (req, res) => {
    UserStore.signup(req.body)
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
