const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    req.logout();
    res.writeHead(200);
    res.end();
});

module.exports = router;
