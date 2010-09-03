NAME := themes-default
all: build
include buildenv/Makefile.common
MODULE := vigilo.themes
CODEPATH := src/vigilo/themes

install:
	$(PYTHON) setup.py install --single-version-externally-managed --root=$(DESTDIR) --record=INSTALLED_FILES

tests: tests_nose

