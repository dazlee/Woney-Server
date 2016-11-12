const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    facebookId: {
        type: String,
        required: true,
    },
    profileUrl: String,
    provider: String,
    // password: String,
    name: {
        lastName: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        middleName: {
            type: String,
        },
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female", "unknown"],
    },
    photo: {
        type: String,
        required: true,
    },
    woney: {
        type: Number,
        default: 0,
    },
    bets: {
        type: Number,
        default: 0,
    },
    //accessToken: String,
    //tokenExpires: Date,
});
UserSchema.methods.validPassword = function (password) {
    return this.password === password;
};

module.exports = mongoose.model("User", UserSchema);
