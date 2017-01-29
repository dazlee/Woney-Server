require("./lib/dust-helpers").registerHelpers();

const express = require("express");
const app = express();
const path = require("path");
const connectionLogger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const passport = require("passport");
const cons = require('consolidate');
const session = require('express-session');
const flash = require("connect-flash");
const serverLogger = require("./lib/logger");
const config = require("./config");

app.set("port", process.env.PORT);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'dust');
app.engine('dust', cons.dust);
app.use(express.static(path.join(__dirname, '../public')));
app.use(connectionLogger("dev"));
app.use(cookieParser());
app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.set("jwtSecret", config.secret);

app.use("/login", require("./routes/login"));
app.use("/logout", require("./routes/logout"));

app.use("/admin*", require("./middlewares/checkAdmin"));
app.use("/", require("./routes/home"));
app.use('/admin', require("./routes/dashboard"));
app.use('/admin/drawing', require("./routes/drawing"));
app.use('/admin/reward', require("./routes/reward"));
app.use('/admin/winners', require("./routes/winners"));
app.use('/admin/black-list', require("./routes/black-users"));

// apis
// without user token authentications
app.use('/api/games', require("./routes/api/game"));

// with user check login
app.use("/api*", require("./middlewares/checkLogin"));
app.use('/api/signup', require("./routes/api/signup"));
// with user authorization
app.use("/api*", require("./middlewares/authorization"));
app.use('/api/user', require("./routes/api/user"));


// catch 404 and handle it
app.use(function (req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handlers
// development envrionment only
if (app.get("env") === "development") {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render("error", {
            message: err.message,
            error: err,
        });
    });
}

// production handler, no stack trace leak to users
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
        message: err.message,
        error: {},
    });
});

module.exports = app;
