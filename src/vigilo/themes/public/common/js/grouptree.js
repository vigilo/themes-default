/*
 * VigiMap, composant de Vigilo.
 * Copyright (C) 2009-2016 CS-SI
 * Licence : GNU GPL v2 ou superieure
 *
 */



/*
 * Affichage en arbre des cartes par groupe
 */
var GroupTree = new Class({

    Implements: [Options, Events],

    /*
     * parent: l'élément où placer l'arbre
     */
    options: {
        parent: null,
        url: null,
        groupsonly: false,
        groupName: "group",
        itemName: "map",
        groupingItemName: "submaps",
        itemImage: null,
        groupingItemImage: null,
        imgpath: "images",
        requestOptions: {},
        onItemClick: null,
        onGroupClick: null
    },

    initialize: function(options) {
        this.setOptions(options);
        /* L'objet tree se réfère à un élément div*/
        this.tree = new Jx.Tree({
            parent: this.options.parent
        });

        this.childrenRequest = new Request.JSON({
            method: "get",
            noCache: true,
            link: "cancel",
            url: this.options.url,
            onSuccess: this.gotData.bind(this)
        });

        this.isLoaded = false;
    },

    load: function() {
        this.tree.clear();
        var firstGroupRequest = new Request.JSON({
                method: "get",
                noCache: true,
                url: this.options.url,
                onSuccess: (function(data){
                    var types = [this.options.groupName,
                                 this.options.itemName];
                    for (var i=0, type ; type = types[i] ; i++) {
                        var nodes = data[type + "s"];
                        if (typeof nodes === "undefined") {
                            continue;
                        }
                        for (var j=0, node ; node = nodes[j] ; j++) {
                            this.addNode(node);
                        }
                    }
                    this.isLoaded = true;
                    this.fireEvent("load", this);
                }).bind(this)
            });
        var requestOptions = {};
        if (this.options.groupsonly) {
            requestOptions.onlytype = "group";
        }
        $extend(requestOptions, this.options.requestOptions);
        firstGroupRequest.send({data: requestOptions});
    },

    gotData: function(data) {
        var subfolder = this.childrenRequest.options.subfolder;
        var continued;

        var types = [this.options.groupName, this.options.itemName];
        for (var i=0, type ; type = types[i] ; i++) {
            var offset = null;
            if (data.continued_type == type) {
                // c'est une continuation, il faut placer les éléments au bon
                // endroit (et pas à la fin)
                continued = this.getContinued(subfolder, type);
                offset = continued.index - 1;
            }
            if (typeof data[type+"s"] != "undefined") {
                for (var j=0, child ; child = data[type+"s"][j] ; j++) {
                    // L'option subfolder est ajoutée par le "addItem".
                    // Pas de risque d'écrasement car "link" vaut "cancel".
                    this.addNode(child, subfolder, offset);
                    if (offset !== null) {
                        offset = offset + 1;
                    }
                }
            }
            if (data.continued_type == type) {
                // on a cliqué sur un lien de continuation, il faut le
                // supprimer
                subfolder.remove(continued.node);
            }
        }

        this.fireEvent("branchloaded");
        if (!this.isLoaded) {
            this.isLoaded = true;
            this.fireEvent("load", this);
        }
    },

    /* Ajout d'un element à l'arbre */
    addNode: function(item, parent_tree, offset) {
        if (!$defined(parent_tree)) {
            parent_tree = this.tree;
        }
        var subitem;
        if ([this.options.groupName,
             this.options.groupingItemName].contains(item.type)) {
            subitem = this._addGroup(item, parent_tree);
        } else if (item.type == this.options.itemName) {
            subitem = this._addItem(item, parent_tree);
        } else if (item.type == 'continued') {
            subitem = this._addContinued(item, parent_tree);
        } else {
            return; // élément inconnu
        }

        // Insertion
        if (offset) {
            parent_tree.insert(subitem, parent_tree.nodes[offset]);
        } else {
            parent_tree.append(subitem);
        }
    },

    _addGroup: function(item, parent_tree) {
        var options = {
            label: item.name,
            image: this.options.imgpath + "/tree.png",
            data: {type: item.type}
        };
        if (item.type == this.options.groupingItemName) {
            options.image = this.options.groupingItemImage;
        }
        var subfolder = new Jx.TreeFolder(options);
        subfolder.addEvent("disclosed", function() {
            // L'événement "disclosed" est déclenché par jxlib dans
            // les méthodes expand et collapse du jxtreefolder.
            if (subfolder.nodes.length === 0) {
                // Type "group" par défaut.
                var data = {parent_id: item.id};
                if (this.options.groupsonly) {
                    data.onlytype = "group";
                }
                else if (item.type == this.options.groupingItemName) {
                    data.onlytype = this.options.groupingItemName;
                }

                $extend(data, this.options.requestOptions);
                // Envoi de la requête qui va permettre
                // d'obtenir les éléments fils.
                // L'ajout de l'option "subfolder" est un hack
                // afin de garder une référence pour plus tard.
                this.childrenRequest.send({
                    data: data,
                    subfolder: subfolder
                }).options.subfolder = subfolder;
            }
            this.fireEvent("nodedisclosed", item);
        }.bind(this));
        subfolder.addEvent("click", function() {
            this.fireEvent("groupClick", item);
        }.bind(this));
        if ($defined(item.children)) {
            $each(item.children, function(subitem) {
                this.addNode(subitem, subfolder);
            }.bind(this));
        }
        return subfolder;
    },

    _addItem: function(item, parent_tree) {
        var subitem = new Jx.TreeItem({
            label: item.name,
            image: this.options.itemImage,
            data: {type: item.type}
        });
        subitem.addEvent("click", function() {
            this.fireEvent("itemClick", item);
        }.bind(this));
        return subitem;
    },

    _addContinued: function(item, parent_tree) {
        var item_data = {
                "type": "continued",
                "for_type": item.for_type
        };
        var subitem = new Jx.TreeItem({
            label: item.name,
            image: this.options.imgpath + "/continued.png",
            data: item_data
        });
        var offset = 0;
        for (var i=0, node ; node = parent_tree.nodes[i] ; i++) {
            if (node.options.data.type == item.for_type) {
                offset = offset + 1;
            }
        }
        subitem.addEvent("click", function() {
            var data = {
                parent_id: item.parent_id,
                offset: offset,
                onlytype: item.for_type
            };
            $extend(data, this.options.requestOptions);
            // Envoi de la requête qui va permettre
            // d'obtenir les autres éléments.
            // L'ajout de l'option "subfolder" est un hack
            // afin de garder une référence pour plus tard.
            this.childrenRequest.send({
                data: data,
                subfolder: parent_tree
            }).options.subfolder = parent_tree;
            // Remplacement du lien par un indicateur de chargement
            var link = subitem.domObj.getElement("a");
            var link_img = link.getElement("img").clone();
            link.set("text", l_("Loading..."));
            link.grab(link_img);
            return false;
        }.bind(this));
        return subitem;
    },

    getContinued: function(parent_tree, type) {
        if (!$defined(parent_tree)) {
            parent_tree = this.tree;
        }
        // http://userjs.org/help/tutorials/efficient-code
        for (var i=0, node ; node = parent_tree.nodes[i] ; i++) {
            if (node.options.data &&
                    node.options.data.type == "continued" &&
                    node.options.data.for_type == type) {
                return {"index": i, "node": node};
            }
        }
        return null;
    },

    /**
     * Ouverture de l'arbre sur le premier noeud contenant la carte.
     * Ne fonctionne plus depuis qu'on a un chargement incrémental de l'arbre.
    */
    expand: function(itemid) {
        return;
        /*
        var item_tree = this.tree;
        var localName;
        var localItemTree;
        //Function findItem Recherche récursive d'élément dans un arbre
        //Parameters:
        // * item_tree - Element de l'arbre (group ou item)
        // * name - label de l'élément recherché
        // * path - {Array} Tableau de labels de noeuds
        //Retour : Tableau des labels de noeuds permettant de trouver l'élément.
        var findItem = function(name, item, path) {
            var localPath;
            var localItem = item;
            if (item.options.type == "Item") {
                return null; //Pas d'exploration pour un Item
            }
            for(var i=0;i<item.nodes.length;i++) {
                localItem = item.nodes[i];
                localName = localItem.getName();
                // recopie de path dans localpath
                localPath = path.slice();
                if (localName == name) {
                    return path;
                } else {
                    if (localItem.options.type != 'Item') {
                        localPath.push(localName);
                        var ret = findItem(name, localItem, localPath);
                        if (ret) {
                            return ret;
                        }
                    }
                }
            }
            return null;
        };
        var path = findItem(menu.map_title, item_tree, new Array());
        if (path) {
            progressPath = new Array;
            for(var i=0;i<path.length;i++) {
                progressPath.push(path[i]);
                localItemTree = item_tree.findChild(progressPath);
                localItemTree.expand();
            }
            // TODO: Pour le moment, la représentation de l'élément
            // sélectionné n'est pas implémentée

            //for(var i=0;i<localItemTree.nodes.length;i++) {
            //    if (localItemTree.nodes[i].getName() == menu.map_title) {
            //        localItemTree.nodes[i].selected();
            //        break;
            //    }
            //}
        }
        */

    },

    clear: function() {
        this.tree.clear();
    }

});
