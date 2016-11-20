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
});

module.exports = mongoose.model("Bets", BetsSchema);
