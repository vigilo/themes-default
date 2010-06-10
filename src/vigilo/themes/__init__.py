# -*- coding: utf-8 -*-
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
