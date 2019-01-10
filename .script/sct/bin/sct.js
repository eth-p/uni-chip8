#!/usr/bin/env node
// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// SCT: Entry point.
// This will call subcommands.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';
require('module-alias/register');
require('array.prototype.flat').shim();

// Libraries.
const chalk    = require('chalk');
const minimist = require('minimist');
const path     = require('path');

// Modules.
const CommandError = require('@sct').CommandError;
const SCT          = require('@sct');

// ---------------------------------------------------------------------------------------------------------------------
// Variables:
// ---------------------------------------------------------------------------------------------------------------------

let DEBUG       = false;
const PROGRAM   = 'sct';
const VERSION   = '0.1.1';

// ---------------------------------------------------------------------------------------------------------------------
// Functions:
// ---------------------------------------------------------------------------------------------------------------------

function schemaToMinimist(schema) {
	return {
		'--': true,

		string: Object.entries(schema)
			.filter(([k, v]) => v.type === 'string')
			.map(e => e[0]),

		boolean: ['plumbing'].concat(Object.entries(schema)
			.filter(([k, v]) => v.type === 'boolean' || v.type == null)
			.map(e => e[0])),

		default: Object.entries(schema)
			.filter(([k, v]) => v.default !== undefined)
			.map(([k, v]) => [k, v.default])
			.reduce((obj, [k, v]) => ( { ... obj, [k]: v }), {}),

		alias: Object.entries(schema)
			.filter(([k, v]) => v.alias !== undefined)
			.map(([k, v]) => [k, v.alias])
			.map(([k, v]) => [k, v instanceof Array ? v : [v]])
			.map(([k, v]) => v.map(a => [a, k]))
			.flat(1)
			.reduce((obj, [k, v]) => ( { ... obj, [k]: v }), {}),

		unknown: (arg) => {
			if (arg.startsWith('--')) {
				let option = arg.substring(2).split('=')[0];
				throw new CommandError(`Unknown command option: ${option}`, {
					message: `unknown option -- '${option}'`
				});
			}
		}
	};
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

	// Get subcommand.
	let subcommandName = args._.shift();
	if (subcommandName == null) {
		subcommandName = 'help';
		args._ = [];
	}

	let subcommand       = new (await SCT.getCommand(subcommandName));
	let subcommandSchema = subcommand.schema();

	// Generate argument passthrough.
	let subcommandArgv = args._.concat(
		Object.entries(args)
			.filter(([k, v]) => !['--', '_', 'debug', 'version'].includes(k))
			.map(([k, v]) => `--${k}=${v}`)
	);

	// Run subcommand.
	return await subcommand.run(minimist(subcommandArgv, schemaToMinimist(subcommandSchema)));

})(process.argv.slice(2)).then((result) => {

	switch (typeof result) {
		case 'boolean':   process.exit(result ? 0 : 1); break;
		case 'number':    process.exit(result);         break;

		case 'undefined':
		case 'null':      process.exit(0);              break;

		case 'string':
		default:         // Um...
	}

	process.exit(254);

}, (error) => {

	let exit = 1;
	let message = `Uncaught ${error.constructor.name}: ${error.message}`;

	if (error instanceof CommandError) {
		exit    = error.cliExit;
		message = error.cliMessage;
	}

	if (DEBUG || !(error instanceof CommandError)) {
		console.error(chalk.red(message));
		console.error(error.stack.split('\n').slice(1).join('\n'));
	} else {
		console.error(chalk.red(`${PROGRAM}: ${message}`));
	}

	process.exit(exit);

});
