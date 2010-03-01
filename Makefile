NAME := themes_default
CODEPATH := src/vigilo/themes

all: build

include ../glue/Makefile.common
MODULE := vigilo.themes
tests: $(PYTHON) tests_nose
	# Le compile_catalog permet de générer les fichiers de traduction.
	# Ces fichiers sont utilisés par TG2 et empêche le lancement des
	# tests unitaires de ces applications lorsqu'ils sont absents.
	$(PYTHON) setup.py compile_catalog

