#!/usr/bin/env bash
# Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
# MIT License
# ----------------------------------------------------------------------------------------------------------------------
# @query: Query project information.
# ----------------------------------------------------------------------------------------------------------------------
[[ "${#BASH_SOURCE[@]}" = 1 ]] && printf "This script cannot be executed directly.\n" && exit 5

DESCRIPTION="Query project information."
ENTRY() {
	xopts 'porcelain=flag,module=string,filter=string' "$@" &>/dev/null

	# Porcelain?
	if [[ "$opt_porcelain" = true ]]; then
		"${BASE}/libexec/project.js" "$@"
		return $?
	fi

	# User-friendly.
	local action="${opt_[0]}"
	case "$action" in
		'')        USAGE;;
		'modules') query_modules; return $?;;
		*)         die 'Unknown query.';;
	esac
}

USAGE() {
	:
}

# ----------------------------------------------------------------------------------------------------------------------

query_modules() {
	local args=()
	case "$opt_filter" in
		'meta')    args=('--list-meta-modules');;
		'all')     args=('--list-modules' '--list-meta-modules');;
		'none'|'') args=('--list-modules');;
		*)         die 'Invalid filter for query.';;
	esac

	printf "${ANSI_INFO}Modules:${ANSI_DEFAULT}\n"
	local module
	while read -r module; do
		printf "${LIST_BULLET}%s\n" "$module"
	done < <(project "${args[@]}")

	return 0
}
