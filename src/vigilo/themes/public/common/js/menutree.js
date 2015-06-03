/*
 * VigiMap, composant de Vigilo.
 * Copyright (C) 2015-2015 CS-SI
 * Licence : GNU GPL v2 ou superieure
 *
 */


/*
 * Affichage en arbre des cartes par groupe,
 * dans un menu flottant
 */
var MenuTree = new Class({

    Implements: [Options, Events],

    options: {
        url: backend.maps,
        label: 'Maps menu',
        groupName: "group",
        groupImage: "mapgroup.png",
        itemName: "map",
        itemImage: "map.png",
        imgpath: "images"
    },

    initialize: function(options) {
        this.setOptions(options);

        this.tree = new Jx.Menu({
            label: this.options.label,
            image: this.options.imgpath + "/" + this.options.itemImage,
            idgroup: null,
            loaded: false
        }).add(this._makeLoading());

        this.tree.addEvent('show', function () {
            var req = this.domObj.retrieve('request');
            req.options.parent = this;
            req.send();
        }.bind(this.tree));

        this.tree.domObj.store(
            'request',
            new Request.JSON({
                method: "post",
                url: this.options.url,
                noCache: true,
                link: 'cancel',
                onSuccess: function(data) {
                    var i;
                    var req = this.tree.domObj.retrieve('request');
                    var parent = req.options.parent;
                    var menutree = this;
                    var continuation = parent.options.continuation;
                    var node, node_pos, dims;
                    var maxWidth = 250;

                    if (parent.options.loaded) {
                        return;
                    } else if (continuation) {
                        node = parent;
                        parent = parent.owner;
                    } else {
                        node = parent.items[0];
                    }
                    node_pos = parent.items.indexOf(node);

                    parent.contentContainer.style.width = 'auto';

                    data[menutree.options.groupName + 's'].each(function (group) {
                        var item = new Jx.Menu.SubMenu({
                            label: group.name,
                            image: menutree.options.imgpath + "/" +
                                    menutree.options.groupImage,
                            continuation: false
                        });

                        item.add(menutree._makeLoading());

                        if (group.type == 'continued') {
                            menutree._makeContinuation(item, group);
                        } else {
                            item.addEvent('show', function () {
                                var req = menutree.tree.domObj.retrieve('request');
                                var data = {parent_id: group.id};
                                req.options.parent = this;
                                req.send({'data': data});
                            }.bind(item));
                        }

                        this.items.splice(node_pos++, 0, item);
                        item.setOwner(this);
                        item.domObj.inject(node.domObj, 'before');

                        // Si la largeur de la ligne dépasse la limite
                        // d'affichage pré-définie, on affiche aussi
                        // le nom complet au survol de la ligne.
                        if (item.domObj.getMarginBoxSize().width > maxWidth) {
                            item.setTooltip(group.name);
                        }
                    }.bind(parent));

                    data[menutree.options.itemName + 's'].each(function (value) {
                        var item = new Jx.Menu.Item({
                            label: value.name,
                            idvalue: value.id,
                            image: menutree.options.imgpath + "/" +
                                    menutree.options.itemImage,
                            continuation: null
                        });

                        if (value.type == 'continued') {
                            menutree._makeContinuation(item, value);
                        } else {
                            item.addEvent('click', function () {
                                this.fireEvent('click', item);
                            }.bind(menutree.tree));
                        }

                        this.items.splice(node_pos++, 0, item);
                        item.setOwner(this);
                        item.domObj.inject(node.domObj, 'before');

                        // Même logique que pour les groupes.
                        if (item.domObj.getMarginBoxSize().width > maxWidth) {
                            item.setTooltip(value.name);
                        }
                    }.bind(parent));

                    node.setOwner(null);
                    node.domObj.dispose();
                    parent.items.splice(node_pos, 1);

                    if (parent.items.length === 0) {
                        parent.add(this._makeEmpty());
                    }

                    // Redimensionnement de la zone ombrée.
                    dims = parent.contentContainer.getMarginBoxSize();
                    dims.width = Math.min(dims.width, maxWidth);
                    parent.contentContainer.setContentBoxSize(dims);
                    parent.options.loaded = true;
                }.bind(this)
            })
        );
    },

    reset: function() {
        // Vide les éléments du menu et prépare
        // le menu pour un nouveau chargement.
        this.tree.items = [];
        this.tree.subDomObj.empty();
        this.tree.options.loaded = false;
        // Recrée le premier élément "Chargement..."
        this.tree.add(this._makeLoading());
    },

    _makeEmpty: function() {
        var empty = new Jx.Menu.Item({
            label: l_('No items'),
            continuation: null,
            enabled: false
        });
        empty.domObj.setStyle('font-style', 'italic');
        return empty;
    },

    _makeLoading: function() {
        var loading = new Jx.Menu.Item({
            label: l_('Loading...'),
            continuation: null,
            enabled: false
        });
        loading.domObj.setStyle('font-style', 'italic');
        return loading;
    },

    _makeContinuation: function(item, data) {
        var tree = this.tree;

        item.options.continuation = {
            onlytype: data.for_type,
            offset: data.offset,
            parent_id: data.parent_id
        };
        item.setEnabled(false);
        item.domObj.setStyle('font-style', 'italic');

        item.show = function () {
            this.setLabel(l_('Loading...'));
            var req = tree.domObj.retrieve('request');
            req.options.parent = this;
            req.send({'data': this.options.continuation});
            this.show = $empty;
        }.bind(item);
    }
});
