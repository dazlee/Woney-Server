const logger = require("../lib/logger");
const mysql = require("mysql");
const config = require("../config");
const pool = mysql.createPool(config.mysqlConfig);

pool.on("connection", (connection) => {
    logger.info("new connection comes into mysql pool");
});
pool.on('enqueue', () => {
    logger.info('Waiting for available connection slot');
});

module.exports = {
    getConnection: function () {
        return new Promise((resolve, reject) => {
            pool.getConnection((error, connection) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(connection);
            });
        });
    }
};
