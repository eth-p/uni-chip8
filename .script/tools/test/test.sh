#!/usr/bin/env bash
# Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
# MIT License
# ----------------------------------------------------------------------------------------------------------------------
# build: Build the project.
# This will invoke various utilities in order to build the project artifacts.
# ----------------------------------------------------------------------------------------------------------------------
[[ "${#BASH_SOURCE[@]}" = 1 ]] && printf "This script cannot be executed directly.\n" && exit 5

DESCRIPTION="Build the project."
ENTRY() {
	echo "This is a shim for testing. We need to implement it properly later."
	return 0
}
