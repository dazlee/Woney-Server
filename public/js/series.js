$(function () {
    $("#series-selector").change(function (event) {
        document.location.href = location.pathname + "?series=" + event.target.value;
    });
});
