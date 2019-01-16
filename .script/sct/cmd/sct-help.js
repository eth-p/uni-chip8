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
const path  = require('path');
const vm    = require('vm');

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
		let commands = await Promise.all(await Promise.all((await fs.readdir(__dirname))
			.filter(c => c.startsWith('sct-') && c.endsWith('.js'))
			.map(c => path.join(__dirname, c))
			.map(c => this._getCommandFast(c))));

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

	/**
	 * Quickly load a command object.
	 * This creates an entirely new context, and shims the require function.
	 *
	 * COMMANDS LOADED THIS WAY SHOULD NOT BE RUN.
	 *
	 * @param file {String}        The path to the command file.
	 * @returns {Promise<Command>} The shimmed command.
	 *
	 * @throws {Error} When the command could not be parsed or loaded.
	 * @private
	 */
	async _getCommandFast(file) {
		let sandbox = {
			module: {exports: {}},
			require: (module) => {
				if (module === '@sct')        return SCT;
				if (module === 'import-lazy') return require('import-lazy');
				return () => {throw new Error(`Cannot load module '${module}' in shimmed command.`)};
			}
		};

		let source = await fs.readFile(file, 'utf8');
		if (source.startsWith('#!')) {
			source = source.substring(source.indexOf("\n"));
		}

		let context = vm.createContext(sandbox);
		let script = new vm.Script(source, {filename: file});
		script.runInContext(context);

		return new sandbox.module.exports();
	}

};
