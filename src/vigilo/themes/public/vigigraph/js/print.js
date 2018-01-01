// Copyright (C) 2011-2018 CS-SI
// License: GNU GPL v2 <http://www.gnu.org/licenses/gpl-2.0.html>

window.addEvent('domready', function () {
    $('print').addEvent('click', function (e) {
        e.preventDefault();
        var uri = new URI(app_path + 'rpc/graphsList');
        var graphs = [];
        window.graphs.each(function (graph) {
            this.push(graph.getPrintParams());
        }, graphs);
        uri.setData({'graphs': graphs});
        var win = window.open(uri.toString());
        win.onload = function () {
            this.print();
        }.bind(win);
    });
});
