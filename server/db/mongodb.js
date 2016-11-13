const mongoose = require('mongoose');
const config = require("../config");
const logger = require("../lib/logger");

function _connect () {
    mongoose.connect(config.mongoURL, (error) => {
        if (error) {
            logger.error("please make sure mongodb is running", config.mongoURL);
            return;
        }

        logger.info("connected to mongoDB", config.mongoURL);
    });
    mongoose.Promise = require('bluebird');
}

module.exports = {
    connect: function () {
        _connect();
    },
};
