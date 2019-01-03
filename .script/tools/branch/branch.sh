#!/usr/bin/env bash
# Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
# MIT License
# ----------------------------------------------------------------------------------------------------------------------
# branch: Create or switch branches.
# ----------------------------------------------------------------------------------------------------------------------
[[ "${#BASH_SOURCE[@]}" = 1 ]] && printf "This script cannot be executed directly.\n" && exit 5

DESCRIPTION="Create or switch branches."
ENTRY() {
	set -o errexit
	git_utils

	xopts 'new/create=flag' "$@"

	case "${#opt_[@]}" in
		0) display_branch; return $?;;
		1) switch_branch "$1" "${opt_new}"; return $?;;
		2) die "Too many arguments.${ANSI_DEFAULT}\n\n%s" "$(usage)";;
	esac
}

USAGE() {
cat <<-MESSAGE
	usage: ${PROGRAM} ${SCRIPT} ${ANSI_PARAM}BRANCH${ANSI_RESET} [--create]
MESSAGE
}

# ----------------------------------------------------------------------------------------------------------------------

switch_branch() {
	git rev-parse "$1" &>/dev/null || { [[ "$2" = true ]] && {
		create_branch "$1" || return $?
	} } || die "'%s' is not a branch. Use --create to make it.\n" "$1"

	git checkout "$1"
}

create_branch() {
	# Ensure the branch name isn't weird.
	grep '^\([a-z]\{1,\}\)\([/-][a-z]\{1,\}\)\{0,\}$' <<< "$1" || die "'%s' is an unusual branch name." "$1"
	git checkout -b "$1"
}

display_branch() {
	printf "${ANSI_INFO}Current:  ${ANSI_DEFAULT} %s\n" "$(git_current_branch --simple)"
	printf "${ANSI_INFO}Available:${ANSI_DEFAULT}\n"

	local branch
	while read -r branch; do
		printf "${ANSI_INFO} - ${ANSI_DEFAULT}%-20s (%s)\n" "$branch" "$(git_branch_date "$branch" --relative)"
	done < <(git_branch_list --simple)
}
