const express = require("express");
const router = express.Router();
const UserStore = require("../../stores/user");
const passport = require("passport");

const passportConfig = {
    successFlash: "successfully log in",
    failureFlash: "incorrect username or password",
};
router.post("/",  passport.authenticate('local', passportConfig), function(req, res) {
    res.json(req.user);
});

module.exports = router;
