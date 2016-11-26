const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    if (req.user) {
        res.redirect("/admin");
    } else {
        res.redirect("/login");
    }
});

module.exports = router;
