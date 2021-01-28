# -*- coding: utf-8 -*-
# vim: set fileencoding=utf-8 sw=4 ts=4 et :
# Copyright (C) 2006-2021 CS GROUP - France
# License: GNU GPL v2 <http://www.gnu.org/licenses/gpl-2.0.html>

import os
from setuptools import setup, find_packages

setup_requires = ['vigilo-common'] if not os.environ.get('CI') else []

cmdclass = {}
try:
    from vigilo.common.commands import compile_catalog_plusjs
    cmdclass['compile_catalog'] = compile_catalog_plusjs
except ImportError:
    pass

install_requires=[
    'setuptools',
    'Genshi >= 0.5.1',
    'Babel >= 0.9.4',

    # Pas requis à proprement parlé,
    # mais permet d'utiliser la commande "identity_catalog".
    # La dépendance est déjà tirée via "vigilo-models".
    'vigilo-common',
]

tests_require = [
    'coverage',
    'nose',
    'pylint',
]

setup(name='vigilo-themes-default',
    version='5.2.0',
    author='Vigilo Team',
    author_email='contact.vigilo@csgroup.eu',
    url='https://www.vigilo-nms.com/',
    license='http://www.gnu.org/licenses/gpl-2.0.html',
    description="Vigilo default theme",
    long_description="This component provides a default theme for Vigilo",
    zip_safe=False,
    setup_requires=setup_requires,
    install_requires=install_requires,
    namespace_packages = [
        'vigilo',
        'vigilo.themes',
    ],
    packages=find_packages('src'),
    include_package_data = True,
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
        'vigilo.turbogears.i18n': [
            'vigilo-themes = vigilo.themes.i18n:50',
        ],
    },
    test_suite='nose.collector',
    package_dir={'': 'src'},
    cmdclass=cmdclass,
    vigilo_build_vars={},
)
