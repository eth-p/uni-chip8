#!/usr/bin/env bash
# Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
# MIT License
# ----------------------------------------------------------------------------------------------------------------------
# A function for checking and preventing modifications to the master branch.
# ----------------------------------------------------------------------------------------------------------------------

git_protect() {
	local action="$1"
	[[ -z "$action" ]] && action='modify'

	[[ "$(git_current_branch)" = "refs/heads/master" ]] && die - <<-MESSAGE
		Refusing to ${action} master.
		${ANSI_DEFAULT}
		Please use ${ANSI_COMMAND}sct branch${ANSI_DEFAULT} to create a new branch.
	MESSAGE

	return 0
}
