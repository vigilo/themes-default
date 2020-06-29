// Copyright (C) 2011-2020 CS GROUP – France
// License: GNU GPL v2 <http://www.gnu.org/licenses/gpl-2.0.html>

// Permet de propager le fragment de l'URL courante
// dans le formulaire d'authentification, afin de
// revenir réellement vers l'URL d'origine.
var hash_change_detector = function() {
    var url = null;
    var action = null;
    var login_form = $$('#loginform > form');

    // Force mootools à analyser l'URL courante de nouveau,
    // ce qui mettra à jour la partie "fragment" de l'URI.
    URI.base = new URI(
        document.getElements('base[href]', true).getLast(),
        {base: document.location}
    );

    if (login_form) {
        url = new URI();
        action = new URI(login_form.get('action'));
        // Si le fragment dans l'URL a changé,
        // on met à jour la cible du formulaire.
        // On ne fait ça que si on a effectivement un nouveau fragment.
        if (action.toString() != url.toString() && url.get('fragment') !== '') {
            action.set('fragment', url.get('fragment'));
            login_form.set('action', action.toString());
        }
    }
};

window.onload = function () {
    // Focus automatique sur le 1er champ
    // du formulaire d'authentification.
    var field = $('login');
    if (field) field.focus();

    if ('onhashchange' in window) {
        window.onhashchange = hash_change_detector;
        // Mise à jour du formulaire au chargement.
        hash_change_detector();
    } else {
        // Repli : polling.
        hash_change_detector.periodical(100);
    }
};
