NAME := themes_default

all: build

include buildenv/Makefile.common

MODULE := vigilo.themes
CODEPATH := src/vigilo/themes

tests: $(CODEPATH)/i18n/fr/LC_MESSAGES/theme.mo tests_nose

