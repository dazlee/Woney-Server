const mongoose = require("mongoose");
const findOneOrCreate = require('mongoose-find-one-or-create');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    facebookId: String,
    profileUrl: String,
    provider: String,
    password: String,
    name: {
        lastName: String,
        firstName: String,
        middleName: String,
    },
    email: String,
    gender: String,
    photo: String,
    woney: Number,
    bets: Number,
    //accessToken: String,
    //tokenExpires: Date,
});
UserSchema.plugin(findOneOrCreate);
UserSchema.methods.validPassword = function (password) {
    return this.password === password;
};

module.exports = mongoose.model("User", UserSchema);
