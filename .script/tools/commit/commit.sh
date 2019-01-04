#!/usr/bin/env bash
# Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
# MIT License
# ----------------------------------------------------------------------------------------------------------------------
# commit: Commit changes to the repository.
# This will ask some questions before committing changes to the repository.
# ----------------------------------------------------------------------------------------------------------------------
[[ "${#BASH_SOURCE[@]}" = 1 ]] && printf "This script cannot be executed directly.\n" && exit 5

DESCRIPTION="Commit changes to the repository."
ENTRY() {
	set -o errexit
	git_utils
	git_protect 'commit to'

	xopts 'format=flag' "$@"

	# Reformat code.
	if [[ "$opt_format" != "false" ]]; then
		refmt
	fi

	# Commit.
	exec node "${RES}/git-commit.js"
}

# ----------------------------------------------------------------------------------------------------------------------

refmt() {
	"$SCT" fmt --porcelain >/dev/null || die 'Unable to reformat code.'
}
