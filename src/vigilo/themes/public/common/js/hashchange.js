// Copyright (C) 2014-2020 CS-SI
// License: GNU GPL v2 <http://www.gnu.org/licenses/gpl-2.0.html>

/* Repris de https://mootools.lighthouseapp.com/projects/2706/tickets/778-add-hashchange-event */

Element.Events.hashchange = {
    onAdd: function(){
        var hash = null;

        var hashchange = function(){
            if (hash === self.location.hash) return;
            else hash = self.location.hash;

            var value = (hash.indexOf('#') === 0 ? hash.substr(1) : hash);
            window.fireEvent('hashchange', value);
            document.fireEvent('hashchange', value);
        };

        if ("onhashchange" in window){
            window.onhashchange = hashchange;
        } else {
            // Détection des changements tous les 100ms.
            this.periodical(100);
        }
        hashchange();
    }
};
