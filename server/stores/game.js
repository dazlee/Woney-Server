const GameModel = require("../models/game");
const MomentTimezone = require("moment-timezone");

function getOnGoingGame() {
    return new Promise((resolve, reject) => {
        GameModel.findOne({
            finished: false,
        }).sort({
            series: -1
        }).exec((error, game) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(game);
        });
    });
}
function getLastDrawGame() {
    return new Promise((resolve, reject) => {
        GameModel.findOne({
            finished: true,
        }).sort({
            series: -1
        }).exec((error, game) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(game);
        });
    });
}
function createGame(attributes) {
    return new Promise((resolve, reject) => {
        // need to protect the timezone format, otherwise that will be incorrect
        // tz 格式 yyyy-mm-dd hh:mm
        const startTimeEST = MomentTimezone.tz(attributes.startTime, "America/New_York");
        const endTimeEST = MomentTimezone.tz(attributes.endTime, "America/New_York");
        const newGame = {
            series      : attributes.series,
            woney       : attributes.woney,
            startTime   : startTimeEST.clone().tz("GMT").format(),
            endTime     : endTimeEST.clone().tz("GMT").format(),
        };
        GameModel.create(newGame, (error, game) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(game);
        });
    });
}
function finishGame(gameId, attributes) {
    return new Promise((resolve, reject) => {
        const finishedGame = {
            finished: true,
            firstWinner: attributes.firstWinner,
            commonWinners: attributes.commonWinners,
        };
        GameModel.findByIdAndUpdate(gameId, {
            $set: finishedGame
        }, {new: true}, (error, game) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(game);
        });
    });
}

module.exports = {
    getOnGoingGame,
    createGame,
    finishGame,
    getLastDrawGame,
};
