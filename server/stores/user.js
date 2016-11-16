const UserModel = require("../models/user");
const passport = require("passport"),
      FacebookStrategy = require("passport-facebook").Strategy;
const FACEBOOK_APP_ID = "1741830396105332";
const FACEBOOK_APP_SECRET = "d36ad066d40922137be1f6933adcaa2e";
const config = require("../config");
const logger = require("../lib/logger");
const jwt = require("jsonwebtoken");

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: config.siteUrl + "/auth/facebook/callback",
    profileFields: ['displayName', 'photos', 'email', 'gender', 'profileUrl'],
}, function(accessToken, refreshToken, profile, done) {
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const userObject = {
        facebookId: profile.id,
        provider: profile.provider,
        displayName: profile.displayName,
        name: {
            lastName: profile.familyName,
            firstName: profile.givenName,
            middleName: profile.middleName,
        },
        email: profile.emails.length > 0 ? profile.emails[0].value : "",
        photo: profile.photos.length > 0 ? profile.photos[0].value: "",
        profileUrl: profile.profileUrl,
    };
    UserModel.findOneAndUpdate({
        facebookId: profile.id
    }, userObject, options, function(err, user) {
        if (err) { return done(err); }
        done(null, user);
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user._id);
});
passport.deserializeUser(function(_id, done) {
    UserModel.findOne({_id: _id}, function(err, user) {
        const returnUser = {
            _id: user._id,
            photo: user.photo
        };
        done(null, user);
    });
});

function signUser(user) {
    const token = jwt.sign({userId: user._id.toString()}, config.secret, {
        expiresIn: "2 days" // expires in 24 hours
    });
    const newUser = user.toObject();
    newUser.accessToken = token;
    return newUser;
}
function signup (attributes) {
    return new Promise((resolve, reject) => {
        getUser({
            email: attributes.email,
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
                    middleName: attributes.middleName,
                },
                email:      attributes.email,
                gender:     attributes.gender,
                photo:      attributes.photo,
                woney:      attributes.woney,
                bets:       attributes.bets,
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
function checkUserExist (attributes) {
    return new Promise((resolve, reject) => {
        UserModel.where(attributes).count((error, count) => {
            if (error) {
                reject(error);
                return;
            }
            if (count === 0) {
                reject(new Error("no such user"));
            }
            resolve();
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
            resolve(user);
        });
    });
}

function updateUser (userId, attributes) {
    return new Promise((resolve, reject) => {
        UserModel.findByIdAndUpdate(userId, {
            $set: attributes,
        }, { new: true }, (error, user) => {
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
    checkUserExist,
    getUser,
    updateUser,
};
