#!/usr/bin/env bash
# ----------------------------------------------------------------------------------------------------------------------
# Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
# MIT License
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# SCT: Simple Contribution Tool
# This tool is used for repository contribution and management.
# ----------------------------------------------------------------------------------------------------------------------

# Function: osname
# Get the current name of the operating system.
#
# Results:
#
#     - "mac"
#     - "linux/debian"
#     - "linux/other"
#     - "other"
#
osname() {
	if [[ -n "${_OSNAME_CACHE}" ]]; then
		echo "${_OSNAME_CACHE}"
		return 0
	fi

	# Determine OS.
	case "$(uname -s | tr '[:upper:]' '[:lower:]')" in

		'darwin')	{
			_OSNAME_CACHE="mac"
		};;

		'linux') {
			case "$(lsb_release -si 2>&1 | tr '[:upper:]' '[:lower:]')" in

				'debian'|'ubuntu'|'elementaryos') {
					_OSNAME_CACHE="linux/debian"
				};;

				*) {
					__OSNAME_CACHE="linux/other"
				};;

			esac
		};;

		*) {
			_OSNAME_CACHE="other"
		};;

	esac

	# Print.
	echo "${_OSNAME_CACHE}"
	return 0
}

# Function: has_command
# Checks to see if a command is available.
has_command() {
	command -v "$1" &>/dev/null
	return $?
}

# Function: has_package_apt
# Checks to see if an apt package is installed.
has_package_apt() {
	dpkg --get-selections | grep -v deinstall | cut -f1 | grep --fixed-strings "$1" &>/dev/null
	return $?
}

# Function: has_package_brew
# Checks to see if a homebrew package is installed.
has_package_brew() {
	brew list -1 | grep '@' | sed 's/@.\{1,\}$//' | grep --fixed-strings "$1" &>/dev/null
	return $?
}

# Function: colorify
# Parse color tags.
#
# Tags:
#
#     {#}Code{/#}
#
colorify() {
	local ANSI=$'\\\x1B\\['
	local NEWLINE=$'\\\n'
	{
		if [[ -z "$1" || "$1" = "-" ]]; then
			cat
		else
			echo "$1"
		fi
	} | {
		sed "
			s/{code}/${ANSI}35m/g;
			s/{\/code}/${ANSI}39m/g;
			s/{url}//g;
			s/{\/url}//g;
			s/{style warning}/${ANSI}33m/g;
			s/{\/style}/${ANSI}0m/g;
			s/\\\\n/${NEWLINE}/g;
		"
	}
}

# Function: warn
# Warn about something.
#
# Arguments:
#
#     $1: The warning message.
#
warn() {
	local fatal=false
	_WARN_DEFAULT=true
	((WARN_COUNT++))

	[[ "$1" = "--fatal" ]] && fatal=true && WARN_FATAL=true && shift
	if "${fatal}"; then
		printf "\x1B[31mError: %s\x1B[0m\n" "$1"
	else
		printf "\x1B[33mWarning: %s\x1B[0m\n" "$1"
	fi
}

# Function: warn_details
# Specify details about the warning.
# Arguments:
#
#     $1: The message, or STDIN if not specified.
#
warn_details() {
	if [[ -z "$1" ]]; then
		printf "%s\n" "$(cat)" | colorify
	else
		printf "%s\n" "$1" | colorify
	fi
}

# Function: warn_solution
# Specify a solution to solve the warning.
#
# Arguments:
#
#     $1: The condition.
#     $2: The message, or STDIN if not specified.
#
warn_solution() {

	# Check if it matches the condition.
	case "$1" in
		'mac')           { [[ "$(osname)" = "mac" ]]; }                     || return 0;;
		'mac[homebrew]') { [[ "$(osname)" = "mac" ]] && has_command brew; } || return 0;;
		'linux/debian')  { [[ "$(osname)" = "linux/debian" ]]; }            || return 0;;
		'linux/other')   { [[ "$(osname)" = "linux/other" ]]; }             || return 0;;
		'other')         { [[ "$(osname)" = "other" ]]; }                   || return 0;;
		'default')       { [[ "${_WARN_DEFAULT}" = "true" ]]; }             || return 0;;
		'all')
	esac

	# Print the message.
	_WARN_DEFAULT=false
	warn_details "$2"
}

# Function: warn_abort
# Offer the user the ability to abort.
warn_abort() {
	if [[ "${WARN_FATAL}" = true ]]; then
		printf "\x1B[31mCannot proceed until errors are resolved.\x1B[0m\n"
		exit 1
	fi

	printf "\n\x1B[33mPress CTRL-C to abort.\nPress ENTER to continue.\x1B[0m\n"
	read -sr meh
	printf "\n"
}

# Function: warn_done
# Mark the warning as finished.
warn_done() {
	printf "\n"
}


# ----------------------------------------------------------------------------------------------------------------------
# Warnings:
# ----------------------------------------------------------------------------------------------------------------------

# Function: warn_no_node
# Warns about not having node installed.
warn_no_node() {
	warn --fatal "node does not appear to be installed."
	warn_details "This script requires node to work."

	warn_solution mac[homebrew] <<-END
		You can install it through {code}brew install node{/code}.
	END

	warn_solution linux/debian  <<-END
		You can install it by following this guide:
		{url}https://github.com/nodesource/distributions/blob/master/README.md{/url}
	END

	warn_solution default <<-END
		You can install it from: {url}https://nodejs.org/en/{/url}
	END

	warn_done
}

# Function: warn_no_git
# Warns about not having git installed.
warn_no_git() {
	warn         "git does not appear to be installed."
	warn_details "Git and git-lfs are necessary to contribute changes and update the project."

	warn_solution mac[homebrew] <<-END
		You can install it through {code}brew install git{/code}.
	END

	warn_solution linux/debian  <<-END
		You can install it through {code}sudo apt-get install git{/code}.
	END

	warn_done
}

# Function: warn_no_gitlfs
# Warns about not having git-lfs installed.
warn_no_gitlfs() {
	warn         "git-lfs does not appear to be installed."
	warn_details "Git and git-lfs are necessary to contribute changes and update the project."

	warn_solution mac[homebrew] <<-END
		You can install it through {code}brew install git-lfs{/code}.
	END

	warn_solution default <<-END
		You can install it from: {url}https://git-lfs.github.com/{/url}
	END

	warn_done
}

# Function: warn_no_buildtools
# Warns about not having essential build tools installed.
warn_no_buildtools() {
	warn         "Build tools do not appear to be installed."
	warn_details "Build tools are necessary for node-gyp to build extensions."

	warn_solution mac[homebrew] <<-END
		You can install them through {code}sudo xcode-select --install{/code}.
	END

	warn_solution linux/debian  <<-END
		You can install them through {code}sudo apt-get install build-essential{/code}.
	END

	warn_done
}

# Function: warn_no_buildlibs
# Warns about not having essential packages installed.
warn_no_buildlibs() {
	warn         "Some necessary libraries and headers are not installed."
	warn_details "The following packages are necessary for node-gyp to build extensions:"

	warn_solution linux/debian <<-END
		\n
		 - {code}libcurl4-openssl-dev{/code}
		 - {code}libssl-dev{/code}
	END

	warn_done
}

# ----------------------------------------------------------------------------------------------------------------------
# Variables:
# ----------------------------------------------------------------------------------------------------------------------
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(dirname "$(dirname "$(dirname "${HERE}")")")"
TEMP="${ROOT}/.tmp"
[[ -d "$TEMP" ]] || mkdir -p "$TEMP" || exit $?

WARN_COUNT=0
WARN_FATAL=false

# ----------------------------------------------------------------------------------------------------------------------
# Check:
# ----------------------------------------------------------------------------------------------------------------------

if ! [[ -f "${TEMP}/sct-setup" ]]; then

	# Node.
	has_command node    || warn_no_node
	has_command git     || warn_no_git
	has_command git-lfs || warn_no_gitlfs

	# Packages.
	case "$(osname)" in
		'mac') {
			has_command clang || warn_no_buildtools
		};;

		'linux/debian') {
			has_package_apt 'build-essential'      || warn_no_buildtools
			has_package_apt 'libcurl4-openssl-dev' || warn_no_buildlibs
			has_package_apt 'libssl-dev'           || warn_no_buildlibs
		};;

		*) {
			warn         "Your system is not officially supported by the {code}sct{/code} tool."
			warn_details "{style warning}There will not be any documentation should anything fail.{/style}"
			warn_done
		};;
	esac

	# Confirm.
	if [[ -n "${WARN_COUNT}" && "${WARN_COUNT}" -gt 0 ]]; then
		warn_abort
	fi

	# Done.
	touch "${TEMP}/sct-setup"

fi

# ----------------------------------------------------------------------------------------------------------------------
# Main:
# ----------------------------------------------------------------------------------------------------------------------
node "${HERE}/sct.js" "$@"
exit $?
