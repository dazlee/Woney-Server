$(function () {
    $('#export_excel').click(function () {
        var table = document.getElementById('export_table');
        var ths = Array.prototype.slice.apply(table.querySelectorAll("th"));

        var headers = ths.reduce(function (reduced, th) {
            reduced.push(th.innerHTML);
            return reduced;
        }, []);
        headers = headers.join();

        var trs = Array.prototype.slice.apply(table.querySelectorAll("tbody tr"));
        var rows = trs.reduce(function (reducedTrs, tr) {
            var tds = Array.prototype.slice.apply(tr.querySelectorAll("td"));
            var row = tds.reduce(function (reducedTds, td) {
                reducedTds.push(td.innerHTML);
                return reducedTds;
            }, []);
            row = row.join();
            reducedTrs.push(row);
            return reducedTrs;
        }, []);

        rows.unshift(headers);
        rows = rows.join("\n");

        var blob = new Blob([rows], {
            type: "data:text/csv;charset=utf-8"
        });

        var now = new Date();
        var strFile = "report_" + moment(new Date()).format("YYYY_MM_DD_hh_mm") + ".csv";
        saveAs(blob, strFile);
        return false;
    });
});
