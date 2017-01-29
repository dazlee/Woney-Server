const BetsModel = require("../models/bets");
const BlackUserModel = require("../models/black-user");

function placeBets(data) {
    const gameId = data.gameId,
          userId = data.userId,
          bets = data.bets;
    return new Promise(function(resolve, reject) {
        BetsModel.findOneAndUpdate({
            gameId, userId
        }, {
            $set: {
                gameId: gameId,
                bets: bets,
                userId: userId,
            }
        }, {
            new: true,
            upsert: true
        }, function (error, betsDoc) {
            if (error) {
                reject(error);
                return;
            }
            resolve(betsDoc);
        });
    });
}

function getBets(attributes) {
    const gameId = attributes.gameId,
          userId = attributes.userId;
    return new Promise(function (resolve, reject) {
        BetsModel.findOne({
            gameId, userId
        }, function (error, betsDoc) {
            if (error) {
                reject(error);
                return;
            }
            resolve(betsDoc);
        });
    });
}

function getBetUsersFromGame(attributes) {
    const gameId = attributes.gameId;
    return new Promise(function (resolve, reject) {
        BetsModel.find({
            gameId
        })
        .lean(true)
        .exec(function (error, betsDoc) {
            if (error) {
                reject(error);
                return;
            }
            const users = betsDoc.map(function(bets) {
                bets.user.bets = bets.bets;
                return bets.user;
            });
            resolve(users);
        });
    });
}
function getBetUsersFromGameInWhiteList(attributes) {
    const gameId = attributes.gameId;
    return new Promise(function (resolve, reject) {
		BlackUserModel.find({}, function (error, blackUserList) {
			var blackUserIds = [];
			if (blackUserList) {
				blackUserIds = blackUserList.map(function (blackUser) {
					return blackUser.userId;
				});
			}

			BetsModel.find({
	            gameId,
				userId: {
					$nin: blackUserIds
				}
	        })
	        .lean(true)
	        .exec(function (error, betsDoc) {
	            if (error) {
	                reject(error);
	                return;
	            }
	            const users = betsDoc.map(function(bets) {
	                bets.user.bets = bets.bets;
	                return bets.user;
	            });
	            resolve(users);
	        });
		});
    });
}

module.exports = {
    placeBets,
    getBets,
    getBetUsersFromGame,
	getBetUsersFromGameInWhiteList,
};
