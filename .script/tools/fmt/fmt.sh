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
# Functions.

fmt() {
	set -o errexit

	if [[ "$opt_porcelain" ]]; then
		tsfmt --replace -- "$@" | sed 's/^replaced //'
	else
		tsfmt --replace -- "$@"
	fi

	return 0
}

validate() {
	set -o errexit

	npx tsfmt --verify -- "$@"

	return 0
}

# ----------------------------------------------------------------------------------------------------------------------
# Wrappers.

tsfmt() {
	node "${BASE}/libexec/format-typescript.js" --no-vscode --no-tsconfig "$@"
	return $?
}
