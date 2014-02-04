// Copyright (C) 2011-2014 CS-SI
// License: GNU GPL v2 <http://www.gnu.org/licenses/gpl-2.0.html>

/**
 * Autocompleter.Local
 *
 * http://digitarald.de/project/autocompleter/
 *
 * @version     1.1.2
 *
 * @license     MIT-style license
 * @author      Harald Kirschner <mail [at] digitarald.de>
 * @copyright   Author
 */

Autocompleter.Local = new Class({

    Extends: Autocompleter,

    options: {
        minLength: 0,
        delay: 200
    },

    initialize: function(element, tokens, options) {
        this.parent(element, options);
        this.tokens = tokens;
    },

    query: function() {
        this.update(this.filter());
    }

});