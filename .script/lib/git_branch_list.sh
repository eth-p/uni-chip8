#!/usr/bin/env bash
# Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
# MIT License
# ----------------------------------------------------------------------------------------------------------------------
# A function for getting a list of local branch refs.
# ----------------------------------------------------------------------------------------------------------------------

git_branch_list() {
	case "$1" in
		'--simple') git for-each-ref --format='%(refname)' refs/heads/ 2>/dev/null | sed 's/^refs\/heads\///' || return 1;;
		*)          ggit for-each-ref --format='%(refname)' refs/heads/ 2>/dev/null || return 1;;
	esac

	return 0
}
