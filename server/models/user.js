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
}, {
    timestamps: true,
});
UserSchema.methods.validPassword = function (password) {
    return this.password === password;
};

if (!UserSchema.options.toObject) UserSchema.options.toObject = {};
UserSchema.options.toObject.transform = function (doc, ret, options) {
    delete ret.__v;
    return ret;
};

module.exports = mongoose.model("User", UserSchema);
