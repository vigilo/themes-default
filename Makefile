NAME := themes-default
all: build
include buildenv/Makefile.common.python
MODULE := vigilo.themes
JSFILES = src/vigilo/themes/public/common/js/*.js \
		  src/vigilo/themes/public/vigigraph/js/*.js \
		  src/vigilo/themes/public/vigimap/js/*.js

install: $(PYTHON) build
	$(PYTHON) setup.py install --record=INSTALLED_FILES
install_pkg: $(PYTHON) build
	$(PYTHON) setup.py install --single-version-externally-managed \
		$(SETUP_PY_OPTS) --root=$(DESTDIR)

# Même si vigilo-themes-default ne contient pas de tests,
# l'utilisation tests_nose permet de compiler les traductions.
# (les paquets Debian générés sont incomplets sans ça)
tests: tests_nose
doc: apidoc
clean: clean_python

.PHONY: install install_pkg doc
