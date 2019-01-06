#!/usr/bin/env bash
# Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
# MIT License
# ----------------------------------------------------------------------------------------------------------------------
# A function for getting the current branch ref.
# Will return non-zero if in a detached head state.
# ----------------------------------------------------------------------------------------------------------------------

git_current_branch() {
	case "$1" in
		'--simple') git symbolic-ref HEAD 2>/dev/null | sed 's/^refs\/heads\///' || { echo "(detached)" && return 1; };;
		*)          git symbolic-ref HEAD 2>/dev/null || return 1;;
	esac

	return 0
}
