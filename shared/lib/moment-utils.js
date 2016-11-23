const moment = require('moment');
 function relativeDateTime (date) {
    const _date = new Date(date);
    return moment(_date).calendar();
}

function simpleFormattedDate (date) {
    const _date = new Date(date);
    return moment(_date).format("M/D");
}

function formatDate (format, date) {
    const _date = new Date(date);
    return moment(_date).format(format);
}

module.exports = {
    relativeDateTime, simpleFormattedDate, formatDate
};
