Default Theme
=============

Ce package contient le thème par défaut des interfaces web de Vigilo_.

Pour les détails du fonctionnement des thèmes de Vigilo, se reporter à la
`documentation officielle`_.


Dépendances
-----------
Vigilo nécessite une version de Python supérieure ou égale à 2.5. Le chemin de
l'exécutable python peut être passé en paramètre du ``make install`` de la
façon suivante::

    make install PYTHON=/usr/bin/python2.6

Le thème de Vigilo a besoin des modules Python suivants :

- setuptools (ou distribute)
- Babel
- genshi
- vigilo-common
- tg.devtools >= 2.0 et < 2.1


Installation
------------
L'installation se fait par la commande ``make install`` (à exécuter en
``root``).


License
-------
Le thème Vigilo est sous licence `GPL v2`_.

.. _documentation officielle: Vigilo_
.. _Vigilo: https://www.vigilo-nms.com
.. _GPL v2: http://www.gnu.org/licenses/gpl-2.0.html

.. vim: set syntax=rst fileencoding=utf-8 tw=78 :
