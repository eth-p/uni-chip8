#!/usr/bin/env node
// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// SCT Help: View subcommand help.
// This tool will show subcommand help.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const chalk = require('chalk');
const fs    = require('fs-extra');

// Modules.
const Command = require('@sct').Command;
const SCT     = require('@sct');

// ---------------------------------------------------------------------------------------------------------------------
// Class:
// ---------------------------------------------------------------------------------------------------------------------

module.exports = class CommandHelp extends Command {

	name() {
		return 'sct help';
	}

	description() {
		return 'View subcommand help.';
	}

	schema() {
		return {
			'_': {
				value: 'subcommand',
				type: 'string',
				many: false
			}
		}
	}

	async run(args) {
		// Show list of commands.
		if (args._.length === 0) return this.list();

		// Show help for specific command.
		this.help(new (await SCT.getCommand(args._)));
	}

	/**
	 * Show a list of commands.
	 */
	async list() {
		let commands = (await Promise.all((await fs.readdir(__dirname))
			.filter(c => c.startsWith('sct-') && c.endsWith('.js'))
			.map(c => c.substring(4, c.length - 3))
			.map(c => SCT.getCommand(c))))
			.map(c => new c());

		console.log("Available subcommands:");
		console.log();

		for (let command of commands) {
			console.log('    ' + chalk.magenta(command.name().padEnd(16)) + ' -- ' + command.description());
		}

		console.log();
	}

	/**
	 * Show help for a specific command.
	 * @param command {Command} The command.
	 */
	help(command) {
		console.log(chalk.magenta(command.usage()));
		console.log();
		console.log(command.description());
	}

};
