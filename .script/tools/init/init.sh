#!/usr/bin/env bash
# Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
# MIT License
# ----------------------------------------------------------------------------------------------------------------------
# init: Initialize the project and settings.
# This will invoke various utilities in an attempt to keep the codebase style and formatting consistent.
# ----------------------------------------------------------------------------------------------------------------------
[[ "${#BASH_SOURCE[@]}" = 1 ]] && printf "This script cannot be executed directly.\n" && exit 5

DESCRIPTION="Initialize the project and settings."
ENTRY() {
	xopts 'config=flag,init=flag' "$@"

	set -o errexit

	if [[ -z "$opt_config" && -z "$opt_init" ]] || [[ "$opt_init" = "true" ]]; then
		printf "Initializing project...\n"
		source "${RES}/init-git-submodule.sh"
		source "${RES}/init-git-lfs.sh"
		source "${RES}/init-npm.sh"
	fi

	if [[ -z "$opt_config" && -z "$opt_init" ]] || [[ "$opt_config" = "true" ]]; then
		printf "Configuring project...\n"
		node   "${RES}/configure-git.js"
	fi

	printf "Done.\n"
}

# ----------------------------------------------------------------------------------------------------------------------

init_npm() {
	set -o errexit

	cd "$base"
	srun npm install --progress=false --loglevel=error

	return 0
}

init_git() {
	set -o errexit
	cd "$root"

	# Check if git is installed.
	git lfs &>/dev/null || die - <<-MESSAGE
		git is not installed.
		${ANSI_DEFAULT}
		Please install it from your system package repository.
	MESSAGE

	# Check if git-lfs is installed.
	git lfs &>/dev/null || die - <<-MESSAGE
		git-lfs is not installed.
		${ANSI_DEFAULT}
		Please install it from the following link:
		${ANSI_LINK}    https://git-lfs.github.com/\n
	MESSAGE

	# Add git hooks.
	srun git lfs install

	# Initialize submodules.
	srun git submodule update --init --recursive

	return 0
}

