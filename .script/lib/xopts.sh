#!/usr/bin/env bash
# Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
# MIT License
# ----------------------------------------------------------------------------------------------------------------------
# A simple (from an API standpoint) GNU-like options parser.
#
# Arguments are defined using a simple pattern:
#
#     option=type
#     option/alias=type
#     option=type,option2=type
#
# Additional flags can be set to alter parsing behaviour:
#
#     xopts :FLAGS PATTERN
#
#
# SUPPORTED FLAGS:
#
#     'b'    [D] -- Enable `-abc` flag bundling support.
#     'e'    [D] -- Enable `--key=value` parsing.
#     'i'        -- Ignore the casing of options.
#     'l'        -- Add multiple copies of an argument into an array.
#     's'        -- Stop parsing after the first non-option argument.
#     'u'    [D] -- Error at unknown arguments.
#
# SUPPORTED TYPES:
#
#     'string'   -- Any string.
#     'string!'  -- Any non-empty string.
#     'flag'     -- True or false. Validation isn't implemented yet.
#     'ignore'   -- Pass the option through to the default list exactly as it was presented.
#
# EXAMPLES:
#
#     xopts :b 'validate/V=flag,name=string!'
#
# ----------------------------------------------------------------------------------------------------------------------

xopts() {
	# Parse xopts flags.
	local xo_flags="$1"
	local xo_flag_stop_unknown=false
	local xo_flag_stop_early=false
	local xo_flag_bundling=false
	local xo_flag_ignore_case=false
	local xo_flag_lists=false
	local xo_flag_equals=false

	if [[ "${xo_flags:0:1}" = ':' ]]; then
		shift
		local xo_flag
		while read -n1 xo_flag; do case "${xo_flag}" in
			'u') xo_flag_stop_unknown=true;;
			's') xo_flag_stop_early=true;;
			'b') xo_flag_bundling=true;;
			'i') xo_flag_ignore_case=true;;
			'l') xo_flag_lists=true;;
			'e') xo_flag_equals=true;;
			'')  :;;
			*)   echo "xopts: unknown flag '${xo_flag}'"; return 6;;
		esac; done <<< "${xo_flags:1}"
	else
		xo_flag_stop_unknown=true
		xo_flag_stop_early=false
		xo_flag_bundling=true
		xo_flag_ignore_case=false
		xo_flag_lists=false
		xo_flag_equals=true
	fi

	# Parse option pattern.
	local xo_pattern="$1"
	local xo_args=("${@:2}")
	local xo_arg_definitions=()
	local xo_arg_aliases=()
	local xo_arg_values=()

	if $xo_flag_ignore_case; then
		xo_pattern="$(tr '[:upper:]' '[:lower:]' <<< "$xo_pattern")"
	fi

	local pattern
	while read -r pattern; do
		local pattern_names="${pattern%%=*}"
		local pattern_types="${pattern##*=}"

		local pattern_name_primary="${pattern_names%%/*}"
		local pattern_name_aliases="${pattern_names#*/}"

		xo_arg_definitions+=("$pattern_name_primary" "$pattern_types")
		if [[ "${pattern_name_aliases}" != "${pattern_name_primary}" ]]; then
			while read -r aliased; do
				xo_arg_aliases+=("$aliased" "${pattern_name_primary}")
			done <<< "$(tr '/' '\n' <<< "${pattern_name_aliases}")"
		fi
	done <<< "$(tr ',' '\n' <<< "${xo_pattern}" | sed 's/ *//')"

	# Parse options.
	opt_=()

	local key=''
	local val=''
	local old_key=''
	local old_val=''
	local arg_prev=''
	local arg_raw=''
	local xo_iseq=false
	local xo_break=false
	for arg in "${xo_args[@]}"; do
		arg_raw="$arg"

		if $xo_break; then
			_xopts_commit_default "$arg"
			continue
		fi

		case "$arg" in

			--) if [[ "$key" != '' || "$val" != '' ]]; then
			 		_xopts_commit || return $?
				fi

				xo_break=true;;

			--*=*)
				if $xo_flag_equals; then
					xo_iseq=true
					old_key="$key"
					old_val="$val"

					key="${arg%%=*}"
					val="${arg#--*=}"
					_xopts_commit || return $?

					key="$old_key"
					val="$old_val"
					xo_iseq=false
				else
					if [[ "$key" != '' || "$val" != '' ]]; then
						_xopts_commit || return $?
					fi

					key="$arg"
				fi
				;;

			-*) if [[ "$key" != '' || "$val" != '' ]]; then
			 		_xopts_commit || return $?
				fi

			    key="$arg";;


			*)  val="$arg"

			    if [[ "$key" != '' || "$val" != '' ]]; then
			 		_xopts_commit || return $?
				fi;;

		esac

		arg_prev="$arg_raw"
	done

	[[ "$key" != '' || "$val" != '' ]] && { _xopts_commit || return $?; }
	return 0
}

_xopts_commit() {
	if [[ -z "$key" ]]; then
		_xopts_commit_default "$val"
		key=''
		val=''
		return 0
	fi

	local args="${key#--}"

	# Bundled.
	if [[ "${args:0:1}" = "-" ]]; then
		if $xo_flag_bundling; then
			val=''

			args=($(IFS=$'\n' grep -o . <<< "${args:1}"))
			for arg in "${args[@]}"; do
				_xopts_commit_unalias "$arg" "$val" || return $?
			done

			key=''
			val=''
			return 0
		fi

		args="${args:1}"
	fi

	# Case-insensitive.
	if $xo_flag_ignore_case; then
		args="$(tr '[:upper:]' '[:lower:]' <<< "$args")"
	fi

	# Commit.
	_xopts_commit_unalias "$args" "$val"
	key=''
	val=''
	return $?
}

_xopts_commit_default() {
	if $xo_flag_stop_early; then xo_break=true; fi
	opt_+=("$1")
}

_xopts_commit_unalias() {
	local i=0
	local arg="$1"

	# Look up the alias.
	local max=${#xo_arg_aliases[@]}
	while [[ $i -lt $max ]]; do
		if [[ "${xo_arg_aliases[$i]}" = "$arg" ]]; then
			arg="${xo_arg_aliases[$((i + 1))]}"
			break
		fi
		((i += 2))
	done

	# Look up the type.
	local found=false
	local type=''

	i=0
	max=${#xo_arg_definitions[@]}
	while [[ $i -lt $max ]]; do
		if [[ "${xo_arg_definitions[$i]}" = "$arg" ]]; then
			found=true
			type="${xo_arg_definitions[$((i + 1))]}"
			break
		fi
		((i += 2))
	done

	if $xo_flag_stop_unknown && ! $found; then
		printf "unknown argument '%s'\n" "$arg"
		return 1
	fi

	# Define the variable.
	local var="$(sed 's/[^a-zA-Z0-9]/_/' <<< "$arg")"
	local vto="$2"
	case "$type" in

		'flag')     if [[ -z "$vto" ]]; then
						vto=true
					fi;;

		'string!')  if [[ -z "$vto" ]]; then
						printf "invalid argument '%s': cannot be empty\n" "$type"
						return 1
					fi;;

		'ignore')
					if $xo_iseq; then
						opt_+=("$arg_raw")
						return 0
					else
						if [[ -z "${val}" ]]; then
							opt_+=("$arg_raw")
						else
							opt_+=("$arg_prev" "$arg_raw")
						fi
						return 0
					fi
					;;

	esac

	if $xo_flag_lists; then
		eval "opt_${var}+=($(printf "%q" "$vto"))"
	else
		eval "opt_${var}=$(printf "%q" "$vto")"
	fi

	return 0
}
