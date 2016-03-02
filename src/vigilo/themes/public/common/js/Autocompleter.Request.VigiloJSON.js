// Copyright (C) 2011-2016 CS-SI
// License: GNU GPL v2 <http://www.gnu.org/licenses/gpl-2.0.html>

/**
 * Autocompleter.Request.VigiloJSON
 *
 */

Autocompleter.Request.VigiloJSON = new Class({
    Extends: Autocompleter.Request.JSON,

    queryResponse: function(response) {
        this.parent();
        this.update(response.results);
    },

    // Correction d'un bug qui vide le champ si on clique trop vite dessus puis en dehors
    // http://digitarald.de/forums/topic.php?id=506&replies=1#post-1319
    hideChoices: function(clear) {
        var fixed = false;
        if (clear && !this.opted) {
            fixed = true;
            this.opted = this.element.value;
        }
        this.parent(clear);
        if (fixed) { // revert the fix
            this.opted = undefined;
        }
    }
});
