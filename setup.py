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

#            'PasteScript >= 1.7',
#            'PasteDeploy',
#            'Paste',
            'Babel >= 0.9.4',
#            'vigilo-common',
#            'vigilo-pubsub',
            ],
        namespace_packages = [
            'vigilo',
            ],
        packages=find_packages('src'),
        package_data={
            'vigilo.themes': [
                '*/templates/*/*',
                '*/public/*/*/*',
            ],
        },
        message_extractors={'src/vigilo/themes/': [
            ('**/templates/**.mako', 'mako', None),
            ('**/templates/**.html', 'genshi', None),
            ('**/templates/admin/**.html', 'genshi', None),
            ('**/public/**', 'ignore', None)]},
        entry_points={
            'console_scripts': [
                ],
            },
        package_dir={'': 'src'},
        )

