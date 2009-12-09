function vigiboard_hls_dialog(ref, url, idd) {
    var req = new Request.JSON({
        url: url + 'get_plugin_value',
        onSuccess: function (json, raw) {
            var code = '';
            for (var i = 0; i < json.services.length; i++)
                code += '<p>' + json.services[i] + '</p>';
            window.hls_dialog.setContent(code);
            window.hls_dialog.open.bind(window.hls_dialog)();
        }
    });
    req.post({plugin_name: 'shn', idcorrevent: idd});
}

