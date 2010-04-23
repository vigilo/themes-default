#!/usr/bin/env python
# vim: set fileencoding=utf-8 sw=4 ts=4 et :
from setuptools import setup, find_packages

tests_require = [
    'coverage',
    'nose',
    'pylint',
]

setup(name='vigilo-themes-default',
    version='2.0.0',
    author='Vigilo Team',
    author_email='contact@projet-vigilo.org',
    url='http://www.projet-vigilo.org/',
    description='default theme for vigilo applications',
    license='http://www.gnu.org/licenses/gpl-2.0.html',
    long_description='This component provides a default theme for Vigilo',
    zip_safe=False,
    install_requires=[
        'setuptools',
        'Genshi >= 0.5.1',
        'Babel >= 0.9.4',

        # Pas requis à proprement parlé,
        # mais permet d'utiliser la commande "identity_catalog".
        # La dépendance est déjà tirée via "vigilo-models".
        'vigilo-common',
    ],
    namespace_packages = [
        'vigilo',
    ],
    packages=find_packages('src', exclude=['ez_setup']),
    include_package_data = True,
    test_suite='nose.collector',
    tests_require=tests_require,
    extras_require={
        'tests': tests_require,
    },
    package_data={
        'vigilo.themes': [
            'i18n/*/LC_MESSAGES/**.*',
            'templates/*/**.*',
            'templates/*/**.html',
            'templates/*/*/**.html',
            'public/*/css/**.css',
            'public/*/css/*/**.*',
            'public/*/css/*/*/**.*',
            'public/*/javascript/**.js',
            'public/*/javascript/*/**.js',
            'public/*/images/**.*',
        ],
    },
    exclude_package_data ={
        'vigilo.themes': [
        ],
    },
    message_extractors={
        'src/vigilo/themes/': [
            ('**/templates/**.mako', 'mako', None),
            ('**/templates/**.html', 'genshi', None),
            ('**/templates/admin/**.html', 'genshi', None),
            ('**/public/**', 'ignore', None),
        ],
    },
    entry_points={
        'console_scripts': [
        ],
    },
    package_dir={'': 'src'},
)

