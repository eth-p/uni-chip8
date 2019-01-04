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
	xopts 'release=flag,verbose/V=flag' "$@"
	local flags=()

	if [[ "${opt_release}" = true ]]; then
		printf "Building for release.\n"
	else
		printf "Building for debug.\n"
	fi

	compile "${flags[@]}" "${opt_[@]}" || die 'Failed to compile.'

	return 0
}

# ----------------------------------------------------------------------------------------------------------------------

compile() {
	set -o errexit
	local flags=()

	[[ "${opt_verbose}" != "true" ]] && flags+=("--silent")
	[[ "${opt_release}" =  "true" ]] && flags+=("--release")

	npx gulp --gulpfile "${BASE}/build/gulpfile.js" --cwd "$ROOT" "${flags[@]}" -- "$@"
}
