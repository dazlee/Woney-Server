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

function addDays (date, days) {
    const _date = new Date(date);
    return moment(_date).add(days, "days");
}

function getNextSunday() {
    return moment().weekday(7).hour(0).minute(0).format("YYYY-MM-DD HH:mm");
}

module.exports = {
    relativeDateTime, simpleFormattedDate, formatDate, addDays, getNextSunday
};
