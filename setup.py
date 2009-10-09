#!/usr/bin/env python
# vim: set fileencoding=utf-8 sw=4 ts=4 et :
from setuptools import setup, find_packages

setup(name='vigilo-themes-default',
        version='0.1',
        author='Francois POIROTTE',
        author_email='francois.poirotte@c-s.fr',
        url='http://www.projet-vigilo.org/',
        description='default theme for vigilo applications',
        license='http://www.gnu.org/licenses/gpl-2.0.html',
        long_description='This component provides a default theme for vigilo applications:\n',
        install_requires=[
            'setuptools',
            'coverage',
            'nose',
            'pylint',
            'Genshi >= 0.5.1',

            'Babel >= 0.9.4',
            ],
        namespace_packages = [
            'vigilo',
            ],
        packages=find_packages('src'),
        include_package_data = True,
        package_data={'vigilo.themes': [
            'i18n/*'
            'templates/*/**.*',
            'templates/*/**.html',
            'public/*/css/**.css',
            'public/*/javascript/**.js',
            'public/*/images/**.*',
        ]},
        exclude_package_data ={'vigilo.themes': [
        ]},
        message_extractors={'src/vigilo/themes/': [
            ('**/templates/**.mako', 'mako', None),
            ('**/templates/**.html', 'genshi', None),
            ('**/templates/admin/**.html', 'genshi', None),
            ('**/public/**', 'ignore', None)
        ]},
        entry_points={
            'console_scripts': [
                ],
            },
        package_dir={'': 'src'},
        )

