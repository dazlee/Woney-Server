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

module.exports = router;
