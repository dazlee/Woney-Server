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

// connect to mongoDB
require("./db/mongodb").connect();


app.get('/', require("./routes/dashboard"));

// apis
// without user token authentications
app.use('/api/games', require("./routes/api/game"));

// with user check login
app.use(require("./middlewares/checkLogin"));
app.use('/api/signup', require("./routes/api/signup"));
// with user authorization
app.use(require("./middlewares/authorization"));
app.use('/api/user', require("./routes/api/user"));


/**
 * facebook authentications
 */
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email']}));
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));

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
