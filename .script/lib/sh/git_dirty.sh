#!/usr/bin/env bash
# Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
# MIT License
# ----------------------------------------------------------------------------------------------------------------------
# A function for checking if the current worktree is dirty.
# Will return non-zero if clean.
# ----------------------------------------------------------------------------------------------------------------------

git_dirty() {
	git diff --cached --quiet && return 1 || return 0
}
