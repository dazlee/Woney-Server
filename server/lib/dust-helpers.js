const momentUtils = require("../../shared/lib/moment-utils");
const dust = require("dustjs-helpers");

function registerHelpers() {
    dust.helpers.formatDate = function (chunk, context, bodies, params) {
        var value = dust.helpers.tap(params.date, chunk, context);
        var result = momentUtils.formatDate("YYYY/MM/DD (ddd)", value);
        return chunk.write(result);
    };
}

module.exports = {
    registerHelpers
};
