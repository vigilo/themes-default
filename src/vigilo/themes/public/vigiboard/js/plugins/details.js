window.details_dialog = null;

window.addEvent("domready", function () {
    var original_height = 190;
    if (plug_details_nb_links)
        original_height = 220 + plug_details_nb_links * 14;

    window.details_dialog = new Jx.Dialog({
        label: l_('Event details'),
        modal: false,
        resize: false,
        move: true,
        content: 'DetailsDialog',
        onOpen: window.dlg_open_handler,
        onClose: window.dlg_close_handler,
        width: 275,
        // On essaye d'obtenir une hauteur correcte pour le dialogue,
        // en fonction du nombre de liens externes configurés.
        height: original_height,
        closed: true,
        horizontal: 'right left',
        vertical: 'top top'
    });
    /// HACK: voir notes sur window.search_dialog dans vigiboard.html.
    window.details_dialog.toggleCollapse();
    window.details_dialog.toggleCollapse();

    function remove_selection() {
        $$('.selectedRow').removeClass('selectedRow');
    }

    window.details_dialog.addEvent('close', remove_selection);

    $$('.Details_Link').each(function (el) {
        el.addEvent('click', function (item) {
            remove_selection();

            // On supprime les anciens états, pour ne pas induire en erreur l'utilisateur
            // dans le cas où les nouvelles infos prennent un peu de temps à charger.
            $('DetailsDialog_initial_state').set('text', '');
            $('DetailsDialog_current_state').set('text', '');
            $('DetailsDialog_peak_state').set('text', '');

            // On supprime également un éventuel message d'erreur survenu
            // lors d'un précédent affichage de la boîte de dialogue.
            $$('.loading-error').setStyle('display', 'none');

            // On affiche une animation pendant toute la durée du chargement
            $$('.loading').setStyle('display', 'block');

            var idd = item.get('href').substring(1);
            var req = new Request.JSON({
                link: 'cancel',
                url: plug_details_base + 'plugin_json',
                onSuccess: function (details, raw) {
                    var i;
                    var newItem;
                    var newLink;
                    var maps = new Hash(details.maps);
                    var nbMaps = maps.getLength();
                    var details_maps = $('details_maps');
                    var idMaps;

                    if (plug_details_max_maps >= 0 && nbMaps > plug_details_max_map)
                        nbMaps = plug_details_max_maps;

                    $('DetailsDialog_initial_state').set('text', details.initial_state);
                    $('DetailsDialog_current_state').set('text', details.current_state);
                    $('DetailsDialog_peak_state').set('text', details.peak_state);
                    $('DetailsDialog_event').set('href', plug_details_base + "event/?idevent=" + encodeURIComponent(details.idcause));
                    $('DetailsDialog_masked').set('href', plug_details_base + "masked_events/?idcorrevent=" + encodeURIComponent(details.idcorrevent));
                    if (details.service) {
                        $('DetailsDialog_item').set('href', plug_details_base + "item/1/?host=" +
                            encodeURIComponent(details.host) + "&service=" +
                            encodeURIComponent(details.service));
                    } else {
                        $('DetailsDialog_item').set('href', plug_details_base + "item/1/?host=" +
                            encodeURIComponent(details.host));
                    }
                    for (i = 0; i < plug_details_nb_links; i++) {
                        var index = i.toString();
                        if (!$chk(details.eventdetails[index])) {
                            $('DetailsDialog_'+index).getParent().hide();
                            continue;
                        }
                        $('DetailsDialog_'+index).set({
                            'href': details.eventdetails[index].url,
                            'target': details.eventdetails[index].target
                        });
                        $('DetailsDialog_'+index).getParent().show();
                    }

                    details_maps.empty();
                    idMaps = maps.getKeys();
                    for (i = 0; i < nbMaps; i++) {
                        newItem = new Element('li');
                        newLink = new Element('a', {
                            href: plug_details_vmap + '/#mapid=' + encodeURIComponent(idMaps[i]),
                            html: maps.get(idMaps[i]),
                            target: plug_details_target
                        });
                        newItem.adopt(newLink);
                        details_maps.adopt(newItem);
                    }
                    // Il y avait plus de 10 cartes.
                    // On affiche un message le signalant.
                    if (maps.getLength() > nbMaps) {
                        newItem = new Element('li', {
                            styles: {'font-weight': 'bold'}
                        });
                        newItem.set('text', l_('More than {max} map(s) found...').substitute({'max': plug_details_max_maps}));
                        details_maps.adopt(newItem);
                        nbMaps++;
                    }
                    if (nbMaps > 0) {
                        window.details_dialog.resize(275, original_height + 18 + nbMaps * 12);
                        $('details_maps_container').setStyle('display', 'block');
                    }

                    window.details_dialog.setBusy(false);
                    // Arrêt de l'animation de chargement
                    $$('.loading').setStyle('display', 'none');

                },
                onFailure: function (xhr) {
                    window.details_dialog.setBusy(false);

                    // Arrêt de l'animation de chargement
                    $$('.loading').setStyle('display', 'none');

                    // On affiche un message indiquant qu'une
                    // erreur est survenue durant le chargement
                    $$('.loading-error').setStyle('display', 'block');

                    remove_selection();
                    if (!xhr.responseText)
                        return;
                    var res = JSON.decode(xhr.responseText, true);
                    if (res === null || !res.errors)
                        return;
                    alert(res.errors.join('\n'));
                }
            });
            window.details_dialog.options.parent = item;
            // Permet d'afficher l'événement sélectionné autrement.
            item.getParent('tr').addClass('selectedRow');
            window.details_dialog.open.bind(window.details_dialog)();
            window.details_dialog.setBusy(true);
            req.post({plugin_name: plug_details_name, idcorrevent: idd});
        }.bind(this, el));
    }, window.details_dialog);
});
