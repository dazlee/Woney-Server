const BetsModel = require("../models/bets");

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

module.exports = {
    placeBets,
    getBets,
};
