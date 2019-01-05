#!/usr/bin/env bash
# Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
# MIT License
# ----------------------------------------------------------------------------------------------------------------------
# A function to silently run a command with status and stderr output.
# ----------------------------------------------------------------------------------------------------------------------

srun() {
	local width="$(($(tput cols) - 5))"

	if [[ -n "$SRUN_MESSAGE" ]]; then
		printf "%-${width}s\x1B[39m\n" "$SRUN_MESSAGE"
		SRUN_MESSAGE=''
	else
		printf "${ANSI_COMMAND}%-${width}s\n" "$1 "$'\x1B[39m'"${*:2}"
	fi

	# Run the command and print STDERR.
	local line
	local lines=1
	local status
	local started=false
	while read -r line || { status=$line && break; }; do
		if ! $started && [ -z "${#line}" ]; then continue; fi
		started=true

		printf "\x1B[33m|\x1B[39m %s\n" "$line"
		((lines++))
	done < <(( "$1" "${@:2}" <&- >/dev/null ) 2>&1 | fold -w "$((width - 3))" -s; printf "${PIPESTATUS[0]}")

	# Print the status message.
	local msg
	if [ "$status" -eq 0 ]; then
		msg=$'[ \x1B[32mOK\x1B[39m ]'
	else
		msg=$'[\x1B[31mFAIL\x1B[39m]'
	fi

	if [[ "$lines" -lt "$(tput lines)" ]]; then
		printf "\x1B[${lines}A\x1B[${width}G%s\n\x1B[${lines}B" "$msg"
	else
		printf "$msg"
	fi

	# Return.
	return $status
}
