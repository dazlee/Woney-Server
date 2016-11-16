const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = function checkLogin(req, res, next) {
    const token = req.headers["x-access-token"];
    jwt.verify(token, config.secret, function (error, decoded) {
        if (!error) {
            req.userId = decoded.userId;
        }
        next();
    });
};
