#!/usr/bin/env node
// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// SCT: Entry point.
// This will call subcommands.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';
require('../lib/_init')();

// Libraries.
const chalk    = require('chalk');
const minimist = require('minimist');
const path     = require('path');

// Modules.
const CommandError  = require('@sct').CommandError;
const CommandRunner = require('@sct').CommandRunner;
const SCT           = require('@sct');

// ---------------------------------------------------------------------------------------------------------------------
// Variables:
// ---------------------------------------------------------------------------------------------------------------------

let DEBUG       = false;
const PROGRAM   = 'sct';
const VERSION   = '0.1.1';

// ---------------------------------------------------------------------------------------------------------------------
// Functions:
// ---------------------------------------------------------------------------------------------------------------------

function onComplete(result) {
	switch (typeof result) {
		case 'boolean':   process.exit(result ? 0 : 1); break;
		case 'number':    process.exit(result);         break;

		case 'undefined':
		case 'null':      process.exit(0);              break;

		case 'string':
		default:         // Um...
	}

	process.exit(254);
}

function onError(error) {
	let exit = 1;
	let message = `Uncaught ${error.constructor.name}: ${error.message}`;

	// Use friendly command-line error messages if possible.
	if (error instanceof CommandError) {
		if (error.cliExit != null) exit = error.cliExit;
		if (!DEBUG)                message = error.cliMessage;
	}

	// Print the error.
	if (DEBUG || !(error instanceof CommandError)) {
		console.error(chalk.red(message));
		console.error(error.stack.split('\n').slice(1).join('\n'));
	} else {
		console.error(chalk.red(`${PROGRAM}: ${message}`));
	}

	// Exit.
	process.exit(exit);
}

// ---------------------------------------------------------------------------------------------------------------------
// Main:
// ---------------------------------------------------------------------------------------------------------------------

(async function(argv) {

	// Parse arguments.
	let args = minimist(argv, {
		'--': true,
		boolean: ['debug', 'plumbing'],
		default: {
			'debug': false,
			'version': false,
			'plumbing': false
		}
	});

	// Handle arguments.
	DEBUG = args.debug;

	if (args.version) {
		console.log(`${PROGRAM} ${VERSION}`);
		return;
	}

	if (args.plumbing) {
		console.log = () => {}; // Disallow console.log.
	}

	// Get subcommand.
	let subcommandName = args._.shift();
	if (subcommandName == null) {
		subcommandName = 'help';
		args._ = [];
	}

	let subcommand       = new (await SCT.getCommand(subcommandName));
	let subcommandSchema = subcommand.schema();

	// Change working directory.
	process.chdir((await SCT.getProject()).getDirectory());

	// Generate argument passthrough.
	let subArgv = args._.concat(
		Object.entries(args)
			.filter(([k, v]) => !['--', '_', 'debug', 'version'].includes(k))
			.map(([k, v]) => {
				let argSchema = subcommandSchema[k];
				if (argSchema == null) {
					argSchema = Object
						.entries(subcommandSchema)
						.map(([arg, schema])  => [arg, schema.alias])
						.filter(([arg, aliases]) => aliases != null)
						.map(([arg, aliases]) => [arg, aliases instanceof Array ? aliases : [aliases]])
						.find(([arg, aliases]) => aliases.includes(k)
					);

					if (argSchema !== undefined) {
						argSchema = subcommandSchema[argSchema[0]];
					}
				}

				if (argSchema != null && argSchema.type === 'boolean' && typeof(v) === 'boolean') {
					return (v ? `--${k}` : `--no-${k}`);
				}

				return `--${k}=${v}`;
			})
	);

	// Parse subcommand arguments.
	let subArgs = CommandRunner.createArgumentParser(subcommandSchema)(subArgv);
	CommandRunner.createArgumentValidator(subcommandSchema)(subArgs);

	// Validate subcommand arguments.
	// Run subcommand.
	return await subcommand.run(subArgs);

})(process.argv.slice(2)).then(onComplete, onError);
