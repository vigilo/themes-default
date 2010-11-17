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
        win.print();
    });
});
