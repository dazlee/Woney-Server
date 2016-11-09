const moment = require('moment');
export function relativeDateTime (date) {
    const _date = new Date(date);
    return moment(_date).calendar();
}

export function simpleFormattedDate (date) {
    const _date = new Date(date);
    return moment(_date).format("M/D");
}

export function formatDate (format, date) {
    const _date = new Date(date);
    return moment(_date).format(format);
}
