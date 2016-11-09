const express = require("express");
const router = express.Router();
const UserStore = require("../../stores/user");

router.get("/me", (req, res) => {
    if (!req.user) {
        res.writeHead(401);
        res.end();
        return;
    }
    res.json(req.user);
});

router.get("/:username", (req, res) => {
    const { username } = req.params;
    UserStore.getUser({username})
    .then((user) => {
        res.json(user);
    })
    .catch((error) => {
        res.status(400).send(error);
        res.end();
    });
});

module.exports = router;
