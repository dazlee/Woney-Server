const express = require("express");
const router = express.Router();
const logger = require("../lib/logger");

router.get("/", (req, res) => {
    console.log("Asdfasdf");
    res.render("reward", {
        title: "累積獎金金額(每日早上手動更新)",
        reward: 2000
    });
});

module.exports = router;
