NAME := themes-default
all: build
include buildenv/Makefile.common
MODULE := vigilo.themes
CODEPATH := src/vigilo/themes

install: $(PYTHON)
	$(PYTHON) setup.py install --single-version-externally-managed --root=$(DESTDIR) --record=INSTALLED_FILES
	chmod a+rX -R $(DESTDIR)$(PREFIX)/lib*/python*/*

#tests: tests_nose

