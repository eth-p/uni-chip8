#!/usr/bin/env bash
# Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
# MIT License
# ----------------------------------------------------------------------------------------------------------------------
# A function for querying project information.
# This defers all processing to libexec/project.js
# ----------------------------------------------------------------------------------------------------------------------

project() {
	"${BASE}/libexec/project.js" "$@"
	return $?
}
