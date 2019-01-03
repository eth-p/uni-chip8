#!/usr/bin/env bash
# Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
# MIT License
# ----------------------------------------------------------------------------------------------------------------------
# push: Push local changes to GitHub.
# ----------------------------------------------------------------------------------------------------------------------
[[ "${#BASH_SOURCE[@]}" = 1 ]] && printf "This script cannot be executed directly.\n" && exit 5

DESCRIPTION="Push local changes to GitHub."
ENTRY() {
	set -o errexit
	git_utils
	git_protect 'push to'

	xopts 'format=flag' "$@"

	# Reformat code.
	if [[ "$opt_format" != "false" ]]; then
		refmt
	fi

	git push
}

# ----------------------------------------------------------------------------------------------------------------------

refmt() {
	git stash >/dev/null     || die 'Unable to reformat code.'

	# Format files.
	local file
	while read -r file; do
		git add "$file"
	done < <("$SCT" format --porcelain)

	# Add formatted files.
	if ! git diff --cached --quiet; then
		git commit -m "auto: Reformatted code."
	fi

	git stash pop >/dev/null || die 'Unable to reformat code.'
}
