#!/usr/bin/env node
// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// SCT Test: Run module tests.
// This tool will run Jest tests against one or more modules.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const jestcli = require('jest-cli/build/cli');

// Modules.
const Command      = require('@sct').Command;
const CommandUtil  = require('@sct').CommandUtil;

// ---------------------------------------------------------------------------------------------------------------------
// Class:
// ---------------------------------------------------------------------------------------------------------------------

module.exports = class CommandTest extends Command {

	name() {
		return 'sct test';
	}

	description() {
		return 'Run module tests.';
	}

	schema() {
		return {
			'_': {
				value: 'module',
				type: 'string',
				many: true
			}
		}
	}

	async run(args) {
		let modules = await CommandUtil.getModulesFromArgs(args, {
			meta:      false,
			metaError: m => `${m} is a meta-module, and cannot be tested.`
		});

		// Run Jest command line.
		await jestcli.run(modules.map(m => ['--roots', m.getDirectory()]).flat());
	}

};
