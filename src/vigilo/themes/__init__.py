# -*- coding: utf-8 -*-
# Copyright (C) 2011-2020 CS-SI
# License: GNU GPL v2 <http://www.gnu.org/licenses/gpl-2.0.html>

"""
Module gérant les thèmes de Vigilo.

Un thème contient un ensemble de templates et de fichiers statiques communs
à toutes les applications, ainsi que les templates et fichiers statiques
spécifiques des applications.

Le thème 'default' correspond au thème par défaut dans lequel les nouveaux
fichiers seront placés. Ce thème pourra ensuite servir de base pour créer
d'autres thèmes.
"""
__import__('pkg_resources').declare_namespace(__name__)
