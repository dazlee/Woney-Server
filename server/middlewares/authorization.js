module.exports = function checkLogin(req, res, next) {
    if (!req.userId) {
        res.status(401).send({
            error: "unauthorized",
            message: "you have no permission."
        });
        res.end();
    } else {
        next();
    }
};
