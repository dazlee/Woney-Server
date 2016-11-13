const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    firstWinner: {
        firstName: String,
        lastName: String,
        email: String,
    },
    commonWinners: [{
        firstName: String,
        lastName: String,
        email: String,
    }],
}, {
    timestamps: true,
});

module.exports = mongoose.model("Game", GameSchema);
