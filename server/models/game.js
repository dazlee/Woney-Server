const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    _id: {
        type: String,
        required: true,
    },
    facebookId: {
        type: String,
        required: true,
    },
    name: {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
    },
    email: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    }
});
const GameSchema = new Schema({
    series: {
        type: Number,
        required: true,
        index: true,
        unique: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    finished: {
        type: Boolean,
        default: false,
    },
    reward: {
        type: Number,
        default: 0,
    },
    firstWinner: UserSchema,
    commonWinners: [UserSchema],
}, {
    timestamps: true,
});

module.exports = mongoose.model("Game", GameSchema);
