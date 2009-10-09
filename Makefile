NAME := themes_default
all: build
include ../glue/Makefile.common
MODULE := vigilo.themes
CODEPATH := src/vigilo/themes
lint: lint_pylint
tests: tests_nose
