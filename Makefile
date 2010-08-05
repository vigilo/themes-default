NAME := themes_default
all: build
install:
	$(PYTHON) setup.py install --single-version-externally-managed --root=$(DESTDIR) --record=INSTALLED_FILES


include buildenv/Makefile.common

MODULE := vigilo.themes
CODEPATH := src/vigilo/themes

tests: tests_nose

