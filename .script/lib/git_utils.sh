#!/usr/bin/env bash
# Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
# MIT License
# ----------------------------------------------------------------------------------------------------------------------
# A function for lazily loading the git utilities.
# ----------------------------------------------------------------------------------------------------------------------

git_utils() {
	local util
	for util in "${BASE}/lib/git_"*.sh; do
		source "$util"
	done
}
