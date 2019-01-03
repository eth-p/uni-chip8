#!/usr/bin/env bash
# Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
# MIT License
# ----------------------------------------------------------------------------------------------------------------------
# fmt: Format the project source code.
# This will invoke various utilities in an attempt to keep the codebase style and formatting consistent.
# ----------------------------------------------------------------------------------------------------------------------
[[ "${#BASH_SOURCE[@]}" = 1 ]] && printf "This script cannot be executed directly.\n" && exit 5

DESCRIPTION="Format the project source code."
ENTRY() {
	xopts 'validate=flag,porcelain=flag' "$@"

	[[ "$opt_validate"  = true ]] && { validate "${opt_[@]}" || return $?; }
	[[ "$opt_validate" != true ]] && { fmt      "${opt_[@]}" || return $?; }

	return 0
}

# ----------------------------------------------------------------------------------------------------------------------

fmt() {
	set -o errexit

	if [[ "$opt_porcelain" ]]; then
		npx tsfmt --replace --no-vscode --useTsconfig ".script/build/tsconfig.json" -- "$@" | sed 's/^replaced //'
	else
		npx tsfmt --replace --no-vscode --useTsconfig ".script/build/tsconfig.json" -- "$@"
	fi

	return 0
}

validate() {
	set -o errexit

	npx tsfmt --verify --no-vscode --useTsconfig ".script/build/tsconfig.json" -- "$@"

	return 0
}
