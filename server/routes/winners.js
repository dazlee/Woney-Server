const express = require("express");
const router = express.Router();
const logger = require("../lib/logger");

router.get("/", (req, res) => {
    res.render("winners", {
        title: "Winners",
    });
});

module.exports = router;
