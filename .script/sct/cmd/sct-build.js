#!/usr/bin/env node
// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// SCT Build: Build the project.
// This tool will build the project.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Modules.
const Command = require('@sct').Command;

// ---------------------------------------------------------------------------------------------------------------------
// Class:
// ---------------------------------------------------------------------------------------------------------------------

module.exports = class CommandBuild extends Command {

	name() {
		return 'sct build';
	}

	description() {
		return ' Build the project.';
	}

	schema() {
		return {
			'release': {
				type: 'boolean',
				default: false,
				description: 'Build for release.',
			},
			'compatibility': {
				type: 'boolean',
				default: false,
				description: 'Build for older browsers.',
			}
		}
	}

	async run(args) {
		console.error('This subcommand is a stub.');
		console.error('It will be implemented in a later version.');
		return 0;
	}

};
