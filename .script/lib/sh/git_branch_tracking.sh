#!/usr/bin/env bash
# Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
# MIT License
# ----------------------------------------------------------------------------------------------------------------------
# A function for getting the current branch's upstream ref.
# ----------------------------------------------------------------------------------------------------------------------

git_branch_tracking() {
	case "$1" in
		*) git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null || return 1;;
	esac

	return 0
}
