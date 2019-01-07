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

	xopts 'new/create=flag,update=flag' "$@"

	case "${#opt_[@]}" in

		0) if [[ "$opt_update" = "true" ]]; then
		       update_branch
		       return $?
		   else
		       display_branch
		       return $?
		   fi;;

		1) switch_branch "$1" "${opt_new}" || return $?;;
		2) die "Too many arguments.${ANSI_DEFAULT}\n\n%s" "$(usage)";;
	esac

	if [[ -n "$opt_update" && "$opt_new" != "true" ]]; then
		update_branch "$opt_update"
		return $?
	fi
}

USAGE() {
cat <<-MESSAGE
	usage: ${PROGRAM} ${SCRIPT} ${ANSI_PARAM}BRANCH${ANSI_RESET} [--create]
MESSAGE
}

# ----------------------------------------------------------------------------------------------------------------------

switch_branch() {
	if ! git rev-parse "$1" &>/dev/null; then
		if [[ "$opt_new" = true ]]; then
			create_branch "$1" || die 'Can not create branch.'
			return $?
		else
			die "'%s' is not a branch. Use --create to make it.\n" "$1"
		fi
	fi

	git checkout "$1"
}

create_branch() {
	# Ensure the branch name isn't weird.
	grep '^\([a-z]\{1,\}\)\([/-][a-z]\{1,\}\)\{0,\}$' <<< "$1" || die "'%s' is an unusual branch name." "$1"
	git checkout -b "$1"                                       || die "Can not create branch."
}

display_branch() {
	printf "${ANSI_INFO}Current:  ${ANSI_DEFAULT} %s\n" "$(git_current_branch --simple)"
	printf "${ANSI_INFO}Available:${ANSI_DEFAULT}\n"

	local branch
	while read -r branch; do
		printf "${LIST_BULLET}%-20s (%s)\n" "$branch" "$(git_branch_date "$branch" --relative)"
	done < <(git_branch_list --simple)
}

update_branch() {
	# Determine source branch.
	local branch="$1"
	local current="$(git_current_branch --simple)"

	if [[ -z "$branch" ]]; then
		branch="master"
	fi

	printf "Updating '%s' with commits from '%s'...\n" "$(git_current_branch --simple)" "$branch"

	# Update original branch.
	git fetch                              >/dev/null || { git checkout "$current"; die 'Could not update branch.'; }
	git checkout "$branch"                 >/dev/null || { git checkout "$current"; die 'Could not update branch.'; }
	git merge "origin/${branch}" --ff-only >/dev/null || { git checkout "$current"; die 'Could not update branch. You will need to do it manually.'; }
	git checkout "$current"                >/dev/null || { git checkout "$current"; die 'Could not update branch.'; }

	# Merge.
	git merge "$branch" --ff-only  || die 'Could not update branch. You will need to do it manually.'

	# Done.
	printf "Done.\n"
}
