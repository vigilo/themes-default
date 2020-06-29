// Copyright (C) 2017-2020 CS GROUP – France
// License: GNU GPL v2 <http://www.gnu.org/licenses/gpl-2.0.html>

/* Par défaut, mootools encore/décode les paramètres d'URL (query strings)
 * en utilisant les conventions de PHP (ie. "a[b]=42&b[]=23&b[]=69").
 * On patche les fonctions liées à ces opérations pour utiliser les conventions
 * de TurboGears à la place (ie. "a.b=42&b=23&b=69").
 *
 * Note :
 * La notation de TurboGears ne permet pas de différencier une valeur scalaire
 * d'un tableau contenant une seule valeur.
 * L'application appelante est chargée de réaliser les conversions nécessaires
 * en fonction du contexte.
 */

String.implement({
	parseQueryString: function(decodeKeys, decodeValues){
		if (decodeKeys === null) decodeKeys = true;
		if (decodeValues === null) decodeValues = true;
		var vars = this.split(/[&;]/), res = {};
		if (vars.length) vars.each(function(val){
			var index = val.indexOf('='),
				keys = index < 0 ? [''] : val.substr(0, index).match(/([^.]+)/g),
				value = decodeValues ? decodeURIComponent(val.substr(index + 1)) : val.substr(index + 1),
				obj = res;
			keys.each(function(key, i){
				if (decodeKeys) key = decodeURIComponent(key);
				var current = obj[key];
				if(i < keys.length - 1)
					obj = obj[key] = current || {};
				else if($type(current) == 'array')
					current.push(value);
				else
					obj[key] = $defined(current) ? [current, value] : value;
			});
		});
		return res;
	}
});

Hash.implement({
	toQueryString: function(base){
		var queryString = [];
		Hash.each(this, function(value, key){
			if (base) key = base + '_' + key;
			var result;
			switch ($type(value)){
				case 'object': result = Hash.toQueryString(value, key); break;
				case 'array':
					value.each(function(val, i){
						switch ($type(val)) {
							case 'object':
							case 'array':
								queryString.push(Hash.toQueryString(val, key));
								break;
							default:
								queryString.push(key + '=' + encodeURIComponent(val));
								break;
						}
					});
					value = undefined;
				break;
				default: result = key + '=' + encodeURIComponent(value);
			}
			if (value !== undefined) queryString.push(result);
		});

		return queryString.join('&');
	}
});
