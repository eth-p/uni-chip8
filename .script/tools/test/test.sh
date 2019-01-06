#!/usr/bin/env bash
# Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
# MIT License
# ----------------------------------------------------------------------------------------------------------------------
# test: Run unit tests.
# This will run unit tests on the project modules.
# ----------------------------------------------------------------------------------------------------------------------
[[ "${#BASH_SOURCE[@]}" = 1 ]] && printf "This script cannot be executed directly.\n" && exit 5

DESCRIPTION="Run unit tests."
ENTRY() {
	xopts 'validate=flag,porcelain=flag' "$@"

	local modules=()
	local module
	local fail=false

	# Get modules to test.
	if [[ "${#opt_[@]}" -eq 0 ]]; then
		while read -r module; do
			if [[ "$(project --list-module-tests "$module" | wc -l)" -gt 0 ]]; then
				modules+=("$module")
			fi
		done < <(project --list-modules)
	else
		for module in "${opt_[@]}"; do
			project --test-module-exists "$module" || die "Module '%s' does not exist."   "$1"
			project --test-module-meta   "$module" && die "Module '%s' is a meta-module." "$1"
			if [[ "$(project --list-module-tests "$module" | wc -l)" -eq 0 ]]; then
				die "Module '%s' does not have any tests." "$1"
			fi

			modules+=("$module")
		done
	fi

	# Test modules.
	for module in "${modules[@]}"; do
		printf "Testing %s...\n" "$module"
		test_module "$module" || fail=true
		printf "\n"
	done

	$fail && return 1
	return 0
}

# ----------------------------------------------------------------------------------------------------------------------

test_module() {
	local status
	local lastpwd="$PWD"

	cd "${BASE}/build"

	npx jest --config "${BASE}/build/jestconfig.json" --roots "${ROOT}/module/$1/test"
	status=$?

	cd "$lastpwd"
	return $status
}
