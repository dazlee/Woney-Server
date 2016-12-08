const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BetsSchema = new Schema({
    gameId: {
        type: String,
        required: true,
    },
    bets: {
        type: Number,
        default: 0,
    },
    userId: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

const UserModel = require("./user");
BetsSchema.post("find", function(bets, next) {
    var userIds = bets.reduce(function (reduced, current) {
        reduced.push(current.userId);
        return reduced;
    }, []);
    UserModel.find({
        _id: {
            $in: userIds
        },
    }, function (error, users) {
        var mappedUsers = users.reduce(function (reduced, current) {
            var newUser = current.toObject();
            reduced[newUser._id] = newUser;
            return reduced;
        }, {});

        if (error) {
            // no user;
        } else {
            for(var i = 0; i < bets.length; i++) {
                bets[i].user = mappedUsers[bets[i].userId];
            }
        }
        next();
    });
});

module.exports = mongoose.model("Bets", BetsSchema);
