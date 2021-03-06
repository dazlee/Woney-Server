const logger = require("../lib/logger");
const UserModel = require("../models/user");
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
            if (!game) {
                reject({
                    error: "no_ongoing_game",
                    message: "cannot find ongoing game"
                });
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
            if (!game) {
                reject({
                    error: "no_last_game",
                    message: "cannot find last game"
                });
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
        const startTimeEST = MomentTimezone.tz(attributes.startTime, "Asia/Kolkata");
        const endTimeEST = MomentTimezone.tz(attributes.endTime, "Asia/Kolkata");
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
function updateGameReward(gameId, attributes) {
    return new Promise((resolve, reject) => {
        const reward = {
            reward: attributes.reward,
            secondReward: attributes.secondReward
        };
        GameModel.findByIdAndUpdate(gameId, {
            $set: reward
        }, {new: true}, (error, game) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(game);
        });
    });
};
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
            var userIds = finishedGame.commonWinners.reduce(function(reduced, winner) {
                reduced.push(winner._id);
                return reduced;
            }, [finishedGame.firstWinner._id]);

            UserModel.update({
                _id: {
                    $in: userIds
                }
            },{
                $inc: {
                    wonTimes: 1
                }
            }, {
                multi: true,
            }, function (error, users) {
                if (error) {
                    logger.error("error when updating user wonTimes ", logger);
                }
                resolve(game);
            });
        });
    });
}
function getGames () {
    return new Promise((resolve, reject) => {
        GameModel.find({})
        .sort({
            series: -1
        })
        .exec(function (error, games) {
            if (error) {
                reject(error);
                return;
            }
            resolve(games);
        });
    });
}
function getGameBySeries (attributes) {
    const series = attributes.series;
    return new Promise((resolve, reject) => {
        GameModel.findOne({
            series: series
        })
        .exec(function (error, games) {
            if (error) {
                reject(error);
                return;
            }
            resolve(games);
        });
    });
}
function getGameById (attributes) {
    const gameId = attributes.gameId;
    return new Promise((resolve, reject) => {
        GameModel.findOne({
            _id: gameId
        })
        .exec(function (error, games) {
            if (error) {
                reject(error);
                return;
            }
            resolve(games);
        });
    });
}

module.exports = {
    getOnGoingGame,
    createGame,
    finishGame,
    getLastDrawGame,
    getGames,
    updateGameReward,
    getGameById,
};
