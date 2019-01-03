#!/usr/bin/env bash
# Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
# MIT License
# ----------------------------------------------------------------------------------------------------------------------
# A quick shim for npx that just invokes files inside node_modules.
# ----------------------------------------------------------------------------------------------------------------------

npx() {
	"${base}/node_modules/.bin/$1" "${@:2}"
	return $?
}
