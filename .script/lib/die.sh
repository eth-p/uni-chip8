#!/usr/bin/env bash
# Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
# MIT License
# ----------------------------------------------------------------------------------------------------------------------
# A function for causing the script to exit with a message.
# ----------------------------------------------------------------------------------------------------------------------

die() {
	local pattern="$1"
	local args=("${@:2}")

	if [[ "$pattern" = "-" ]]; then
		pattern="$(cat)"
	fi

	printf "${ANSI_ERROR}%s: ${pattern}${ANSI_RESET}\n" "${PROGRAM}-${SCRIPT}" "${args[@]}"
	exit 1
}
