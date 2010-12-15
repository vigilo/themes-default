var SearchResultsModel = new Class({
    Extends: Jx.Grid.Model,

    getColumnWidth: function (col) {
        return this.options.colWidth[col];
    },

    getColumnCount: function () {
        return (this.data && this.data.labels && this.data.labels[0]) ?
            this.data.labels[0].length : 0;
    },

    getRowCount: function () {
        return (this.data && this.data.labels) ? this.data.labels.length : 0;
    },

    getValueAt: function (row, col) {
        var content = (this.data && this.data.labels && $chk(this.data.labels[row])) ?
            this.data.labels[row][col] : '';
        //var value = Element('div', {'text': content, 'title': content});
        //var container = Element('div');
        //value.inject(container)
        //return container.get('html')
        return content;
    },

    getIDAt: function (row, col) {
        return (this.data && this.data.ids) ?
            this.data.ids[row] : null;
    }
});

var Search = new Class({
    initialize: function () {
        this.search_results = new Jx.Grid({
            parent: 'search_results',
            alternateRowColors: true,
            columnHeaders: true,
            rowPrelight: true,
            cellSelection: true
        });

        this.search_dialog = new Jx.Dialog({
            label: _('Search for a map'),
            modal: false,
            width: 600,
            height: 400,
            content: 'search_container'
        });

        this.search_request = new Request.JSON({
            url: '/maps/search',
            onSuccess: this.updateResults.bind(this)
        });

        $('search').addEvent('click', function (e) {
            e.stop();
            this.search_dialog.open();
        }.bind(this));

        this.search_dialog.addEvent('open', function () {
            // On doit afficher une grille vide la première fois,
            // afin de donner les bonnes dimensions à la grille.
            if (this.search_results.model)
                return;
            this.search_results.setModel(new Jx.Grid.Model([], {
                colWidth: [255, 255],
                columnHeaders: [_('Group'), _('Map')]
            }));
            var search_content = $$('#search_results > div > div.jxGridContainer:last-child')[0];
            search_content.setStyles({'overflow': 'auto'});
        }.bind(this));

        $('search_form_search').addEvent('click', function (e) {
            e.stop();
            if ($('search_form_map').get('value') == '')
                $('search_form_map').set('value', '*');
            this.search_request.post($('search_form'));
        }.bind(this));
    },

    updateResults: function (data) {
        // On met à jour le contenu de la grille
        // avec les résultats de la recherche.
        var model = new SearchResultsModel(data, {
            colWidth: [337, 200],
            columnHeaders: [_('Group'), _('Map')]
        });

        function selectCell(row, col) {
            var mapname = this.getValueAt(row, 1);
            var mapid = this.getIDAt(row, 0);
            // Sélection d'une map
            map.load(mapid);
        }

        model.addEvent('select-cell', selectCell.bind(model));
        this.search_results.setModel(model);
    }
});

window.addEvent('load', function () {
    new Search();
});