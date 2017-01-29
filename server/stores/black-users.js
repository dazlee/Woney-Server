const logger = require("../lib/logger");
const BlackUserModel = require("../models/black-user");
const UserModel = require("../models/user");

function addUserToBlackList (facebookId) {
	return new Promise((resolve, reject) => {
		if (!facebookId) {
			reject({});
			return;
		}
		UserModel.findOne({facebookId}, function (error, user) {
			if (error || !user) {
				reject({});
				return;
			}

			BlackUserModel.create({
				userId: user._id,
				facebookId: facebookId,
			}, (error, blacklist) => {
		   		if (error) {
		   			reject(error);
		   			return;
		   		}
		   		resolve(blacklist);
		   	});
		});
	});
}
function getBlacklist () {
	return new Promise((resolve, reject) => {
		BlackUserModel.find({})
		.exec(function (error, blackUsers) {
			if (error) {
				reject(error);
				return;
			}
			resolve(blackUsers);
		});
	});
}
function removeUserFromBlacklist (facebookId) {
	return new Promise((resolve, reject) => {
		BlackUserModel.remove({
			facebookId
		})
		.exec(function (error) {
			if (error) {
				reject(error);
				return;
			}
			resolve();
		});
	});
}

module.exports = {
    addUserToBlackList,
    getBlacklist,
	removeUserFromBlacklist
};
