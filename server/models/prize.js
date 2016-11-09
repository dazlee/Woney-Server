const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PrizeSchema = new Schema({
    woney: Number,
    startTime: Date,
    endTime: Date,
});

module.exports = mongoose.model("Prize", PrizeSchema);
