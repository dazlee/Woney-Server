require('babel-core/register');

const config = require("../server/config");
process.env.NODE_ENV = config.NODE_ENV;
process.env.PORT = config.PORT;

// initialize service
require("./www.js");
