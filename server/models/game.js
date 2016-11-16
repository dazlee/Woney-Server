const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    }
}, {_id : false});
const GameSchema = new Schema({
    series: {
        type: Number,
        required: true,
        index: true,
        unique: true,
    },
    woney: {
        type: Number,
        required: true,
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
    firstWinner: UserSchema,
    commonWinners: [UserSchema],
}, {
    timestamps: true,
});

module.exports = mongoose.model("Game", GameSchema);
