const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserModel = require("./user");

const BlackUserSchema = new Schema({
	userId: {
		type: String,
		unique: true,
	},
    facebookId: {
		type: String,
		unique: true,
	}
}, {
    timestamps: true,
});

BlackUserSchema.post("find", function(blacklist, next) {
    var facebookIds = blacklist.reduce(function (reduced, current) {
        reduced.push(current.facebookId);
        return reduced;
    }, []);
    UserModel.find({
        facebookId: {
            $in: facebookIds
        },
    }, function (error, users) {
        var mappedUsers = users.reduce(function (reduced, current) {
            var newUser = current.toObject();
            reduced[newUser.facebookId] = newUser;
            return reduced;
        }, {});

        if (error) {
            // no user;
        } else {
            for(var i = 0; i < blacklist.length; i++) {
                blacklist[i].user = mappedUsers[blacklist[i].facebookId];
            }
        }
        next();
    });
});

module.exports = mongoose.model("Blackuser", BlackUserSchema);
