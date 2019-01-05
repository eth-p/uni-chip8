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

	xopts 'format=flag,unsafe=flag,only-staged/s=ignore' "$@"

	# Reformat code.
	if [[ "$opt_format" != "false" ]]; then
		refmt
	fi

	# Check code.
	if [[ "$opt_unsafe" != "true" ]]; then
		check
	fi

	# Commit.
	exec node "${RES}/git-commit.js" "${opt_[@]}"
}

# ----------------------------------------------------------------------------------------------------------------------

refmt() {
	"$SCT" fmt --porcelain >/dev/null || die 'Unable to reformat code.'
}

check() {
	"$SCT" check --no-formatting &>/dev/null || die - <<-MESSAGE
		Refusing to commit changes.
		${ANSI_DEFAULT}
		One or more checks failed.
		Run ${ANSI_COMMAND}${PROGRAM} check${ANSI_DEFAULT} for more details.
	MESSAGE
}
