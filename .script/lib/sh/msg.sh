#!/usr/bin/env bash
# Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
# MIT License
# ----------------------------------------------------------------------------------------------------------------------
# A function for printing a message.
# ----------------------------------------------------------------------------------------------------------------------

msg() {
	local pattern="$1"
	local args=("${@:2}")

	if [[ "$pattern" = "-" ]]; then
		pattern="$(cat)"
	fi

	printf "%s: ${pattern}\n" "${PROGRAM}-${SCRIPT}" "${args[@]}"
}
