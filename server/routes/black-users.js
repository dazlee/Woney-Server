const express = require("express");
const router = express.Router();
const logger = require("../lib/logger");

const BlackUsersStore = require("../stores/black-users");

router.get("/", (req, res) => {
    BlackUsersStore.getBlacklist()
    .then(function(blackUsers) {
        res.render("blacklist", {
            route: "blacklist",
            title: "Blacklist",
            users: blackUsers,
        });
    })
    .catch(function (error) {
        res.status(404).send({
            status: "cannot_get_blackusers",
            message: "cannot get blackusers",
			error: error
        });
        res.end();
    });
});
router.post("/", (req, res) => {
	const { facebookId } = req.body;
    BlackUsersStore.addUserToBlackList(facebookId)
    .then(function(blackUsers) {
		res.redirect("/admin/black-list");
    })
    .catch(function (error) {
		var message = "cannot add user to blacklist";
		if (error.code == 11000) {
			message = "duplicated user in blacklist.";
		}
        res.render("error", {
            status: "cannot_add_user",
            message: message,
			error: error
        });
        // res.end();
    });
});
router.post("/remove", (req, res) => {
	const { facebookId } = req.body;
    BlackUsersStore.removeUserFromBlacklist(facebookId)
    .then(function(blackUsers) {
		res.redirect("/admin/black-list");
    })
    .catch(function (error) {
        res.status(404).send({
            status: "cannot_remove_user",
            message: "cannot remove user",
			error: error
        });
        res.end();
    });
});

module.exports = router;
