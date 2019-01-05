#!/usr/bin/env bash
# Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
# MIT License
# ----------------------------------------------------------------------------------------------------------------------
# check: Check to see if the source code passes project guidelines.
# This will invoke various utilities.
# ----------------------------------------------------------------------------------------------------------------------
[[ "${#BASH_SOURCE[@]}" = 1 ]] && printf "This script cannot be executed directly.\n" && exit 5

DESCRIPTION="Check to see if the source code passes project guidelines."
ENTRY() {
	xopts 'formatting=flag,profanity=flag' "$@"

	PATH="${PATH}:${BASE}/node_modules/.bin"

	local checks=()
	[[ "$opt_formatting" != false ]] && checks+=('formatting')
	[[ "$opt_profanity " != false ]] && checks+=('profanity')

	# Any checks?
	if [[ "${#checks[@]}" = 0 ]]; then
		die "No checks selected."
	fi

	# Run checks.
	local check
	local fail=false
	for check in "${checks[@]}"; do
		SRUN_MESSAGE=$'\x1B[34m'"${check}" srun "${SCRIPT_DIR}/checks/${check}" || fail=true
	done

	# Summary.
	if $fail; then
		printf "\n\nOne or more checks have failed.\n"
		return 1
	fi

	printf "\n\nAll checks have passed.\n"
	return 0
}
