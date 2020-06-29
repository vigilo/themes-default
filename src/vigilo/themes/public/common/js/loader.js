/*
 * Copyright (C) 2009-2020 CS GROUP – France
 * Licence : GNU GPL v2 ou superieure
 *
 */
/*
 * Icone de chargement
 */
var Loader = new Class({

    clients: 0, // Nombre de demandes d'affichage

    initialize: function() {
        this.element = null;
        this.layer = null;
        window.addEvent('domready', function () {
            this.element = $("loading");
            this.layer = $("loadingLayer");
        }.bind(this));
        this.logger = (new Log()).enableLog();
    },

    show: function() {
        this.clients += 1;
        if (!$chk(this.element) || this.element.getStyle("display") == "block") {
            return this;
        }
        this.logger.log("Showing spinner");
        this.element.setStyle("display", "block");
        if (this.layer) {
            this.layer.setStyle("opacity", "0.5");
        }
        return this;
    },

    hide: function() {
        this.clients -= 1;
        // Encore des demandes d'affichage en attente
        if (!$chk(this.element) || this.clients > 0) return this;
        if (this.element.getStyle("display") == "none") return this;
        this.logger.log("Hiding spinner");
        this.element.setStyle("display", "none");
        if (this.layer) {
            this.layer.setStyle("opacity", "auto");
        }
        return this;
    }
});

loader = new Loader();

// Affichage du loader pour chaque requete
window.Request = Class.refactor(Request, {
    initialize: function(options){
        this.previous(options);
        this.addEvent("request", loader.show.bind(loader));
        ['complete', 'exception', 'cancel'].each(function(event){
            this.addEvent(event, loader.hide.bind(loader));
        }, this);
    }
});
