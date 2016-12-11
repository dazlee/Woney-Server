const jwt = require("jsonwebtoken");
const passport = require("passport"),
      LocalStrategy = require("passport-local").Strategy;

const GameStore = require("./game");
const BetsStore = require("./bets");
const UserModel = require("../models/user");
const config = require("../config");
const logger = require("../lib/logger");

// login passport setup
passport.use(new LocalStrategy(
    function(username, password, done) {
        UserModel.findOne({ username: username }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user.toObject());
        });
    }
));
passport.serializeUser(function(user, done) {
    done(null, user._id);
});
passport.deserializeUser(function(_id, done) {
    UserModel.findOne({_id: _id}, function(err, user) {
        done(null, user.toObject());
    });
});

function signUser(user) {
    const token = jwt.sign({userId: user._id.toString()}, config.secret, {
        expiresIn: "60 days" // expires in 60 days
    });
    var newUser = user;
    if (user.toObject) {
        newUser = newUser.toObject();
    }
    newUser["x-access-token"] = token;
    return newUser;
}
function signup (attributes) {
    return new Promise((resolve, reject) => {
        getUser({
            email: attributes.email,
            facebookId: attributes.facebookId
        })
        .then(function (user) {
            resolve(signUser(user));
        })
        .catch(function (error) {
            const userModel = {
                facebookId: attributes.facebookId,
                name: {
                    firstName:  attributes.firstName,
                    lastName:   attributes.lastName,
                    displayName:   attributes.displayName,
                    middleName: attributes.middleName,
                },
                email:      attributes.email,
                gender:     attributes.gender,
                photo:      attributes.photo,
                woney:      attributes.woney,
                totalWoney: attributes.woney,
            };
            UserModel.create(userModel, (error, user) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(signUser(user));
            });
        });
    });
}
function getUser (attributes) {
    return new Promise((resolve, reject) => {
        UserModel.findOne(attributes, (error, user) => {
            if (error) {
                reject(error);
                return;
            }
            if (!user) {
                reject({
                    reason: "user_not_found",
                    message: "No such user",
                });
                return;
            }

            GameStore.getOnGoingGame()
            .then(function (game) {
                return BetsStore.getBets({
                    userId: user._id.toString(),
                    gameId: game._id.toString(),
                });
            })
            .then(function (bets) {
                const newUser = user.toObject();
                newUser.bets = bets.bets;
                resolve(newUser);
            })
            .catch(function (error) {
                const newUser = user.toObject();
                newUser.bets = 0;
                resolve(newUser);
            });
        });
    });
}

function updateUser (userId, setAttributes, incAttributes) {
    var updateDoc = {
        $set: setAttributes
    };
    if (incAttributes) {
        updateDoc['$inc'] = incAttributes;
    }
    return new Promise((resolve, reject) => {
        UserModel.findByIdAndUpdate(userId, updateDoc, { new: true }, (error, user) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(user);
        });
    });
}

module.exports = {
    signup,
    getUser,
    updateUser,
};
