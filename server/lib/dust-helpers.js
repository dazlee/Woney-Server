const momentUtils = require("../../shared/lib/moment-utils");
const dust = require("dustjs-helpers");
const numeral = require("numeral");

function registerHelpers() {
    dust.helpers.formatDate = function (chunk, context, bodies, params) {
        var value = dust.helpers.tap(params.date, chunk, context);
        var result = momentUtils.formatDate("YYYY/MM/DD (ddd)", value);
        return chunk.write(result);
    };
    dust.helpers.fullName = function (chunk, context, bodies, params) {
        var firstName = dust.helpers.tap(params.firstName, chunk, context),
            lastName = dust.helpers.tap(params.lastName, chunk, context);

        return chunk.write(firstName + " " + lastName);
    };
    dust.helpers.formatNumber = function (chunk, context, bodies, params) {
        var number = dust.helpers.tap(params.number, chunk, context);
        number = parseFloat(number);
        return chunk.write(numeral(number).format('0,0.00'));
    };
    dust.helpers.compare = function (chunk, context, bodies, params) {
        var value1 = params.value1,
            value2 = params.value2,
            body = bodies.block;

        if (value1 == value2) {
            chunk.render(body, context);
        }
        return chunk;
    };
    dust.helpers.inUserArray = function (chunk, context, bodies, params) {
        var users = params.users,
            userId = params.userId,
            body = bodies.block;

        var isInUsers = users.some(function (user) {
            if (user._id == userId) {
                chunk.render(body, context);
                return true;
            }
            return false;
        });

        return chunk;
    };
}

module.exports = {
    registerHelpers
};
