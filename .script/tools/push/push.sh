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
	local stash=false
	if git_dirty; then
		stash=true
		git stash >/dev/null || die 'Unable to reformat code.'
	fi

	# Format files.
	local file
	local changes=false
	while read -r file; do
		changes=true
		git add "$file"
	done < <("$SCT" fmt --porcelain)

	# Add formatted files.
	if $changes; then
		git commit -m "auto: Reformatted code." >/dev/null || die 'Unable to reformat code.'
		printf "Automatically formatted code.\n"
	fi

	if $stash; then
		git stash pop >/dev/null || die 'Unable to reformat code.'
	fi
}
