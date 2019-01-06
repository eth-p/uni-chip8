#!/usr/bin/env bash
# Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
# MIT License
# ----------------------------------------------------------------------------------------------------------------------
# A function for getting the current branch ref.
# Will return non-zero if in a detached head state.
# ----------------------------------------------------------------------------------------------------------------------

git_branch_date() {
	local commit="$(git rev-parse "$1")"

	case "$2" in
		--relative)   git show -s --format=%cr "$commit" 2>/dev/null || return $?;;
		--absolute|*) git show -s --format=%ci "$commit" 2>/dev/null || return $?;;
	esac

	return 0
}
