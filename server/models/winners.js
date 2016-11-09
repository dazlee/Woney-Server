const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WinnersSchema = new Schema({
    firstPrize: {
        userId: String,
        firstName: String,
        lastName: String,
        email: String,
    },
    normalPrizes: [{
        userId: String,
        firstName: String,
        lastName: String,
        email: String,
    }]
});

module.exports = mongoose.model("winners", WinnersSchema);
