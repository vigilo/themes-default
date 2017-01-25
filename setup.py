# -*- coding: utf-8 -*-
# vim: set fileencoding=utf-8 sw=4 ts=4 et :
# Copyright (C) 2006-2016 CS-SI
# License: GNU GPL v2 <http://www.gnu.org/licenses/gpl-2.0.html>

from platform import python_version_tuple
try:
    from setuptools import setup, find_packages
except ImportError:
    from ez_setup import use_setuptools
    use_setuptools()
    from setuptools import setup, find_packages

cmdclass = {}
try:
    from babeljs import compile_catalog_plusjs
except ImportError:
    pass
else:
    cmdclass['compile_catalog'] = compile_catalog_plusjs

install_requires=[
    'setuptools',
    'Genshi >= 0.5.1',
    'Babel >= 0.9.4',

    # Pas requis à proprement parlé,
    # mais permet d'utiliser la commande "identity_catalog".
    # La dépendance est déjà tirée via "vigilo-models".
    'vigilo-common',
]

if tuple(python_version_tuple()) < ('2', '6'):
    # pour les traductions javascript
    install_requires.append("simplejson")

tests_require = [
    'coverage',
    'nose',
    'pylint',
]

setup(name='vigilo-themes-default',
    version='4.0',
    author='Vigilo Team',
    author_email='contact@projet-vigilo.org',
    url='http://www.projet-vigilo.org/',
    license='http://www.gnu.org/licenses/gpl-2.0.html',
    description="Vigilo default theme",
    long_description="This component provides a default theme for Vigilo",
    zip_safe=False,
    install_requires=install_requires,
    namespace_packages = [
        'vigilo',
        'vigilo.themes',
    ],
    packages=find_packages('src', exclude=['ez_setup']),
    include_package_data = True,
    test_suite='nose.collector',
    tests_require=tests_require,
    extras_require={
        'tests': tests_require,
    },
    exclude_package_data ={
        'vigilo.themes': [
        ],
    },
    message_extractors={
        'src/vigilo/themes/': [
            ('**/templates/**.mako', 'mako', None),
            ('**/templates/**.html', 'genshi', None),
            ('**/templates/**.xml', 'genshi', None),
            ('**/templates/admin/**.html', 'genshi', None),
            ('**/public/**.js', 'javascript', None),
        ],
    },
    entry_points={
        'console_scripts': [
        ],
    },
    package_dir={'': 'src'},
    cmdclass=cmdclass,
)
