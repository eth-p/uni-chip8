#!/usr/bin/env node
// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// SCT Fmt: Format source code.
// This tool will format project source code.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const chalk        = require('chalk');
const fs           = require('fs-extra');
const path         = require('path');

// Modules.
const AsyncTransform = require('@sct').AsyncTransform;
const Command        = require('@sct').Command;
const CommandUtil    = require('@sct').CommandUtil;
const Finder         = require('@sct').Finder;
const FileFormatter  = require('@sct').FileFormatter;
const SCT            = require('@sct');
const StreamUtil     = require('@sct').StreamUtil;

// ---------------------------------------------------------------------------------------------------------------------
// Class:
// ---------------------------------------------------------------------------------------------------------------------

module.exports = class CommandFormat extends Command {

	name() {
		return 'sct fmt';
	}

	description() {
		return 'Format source code.';
	}

	schema() {
		return {
			'_': {
				value: 'module',
				type: 'string',
				many: true
			},
			'only-modified': {
				type: 'boolean',
				default: false,
				description: 'Only format modified files. (Requires Repository)',
				alias: ['modified-only', 'm']
			},
			'only-staged': {
				type: 'boolean',
				default: false,
				description: 'Only format staged files. (Requires Repository)',
				alias: ['staged-only', 's']
			},
			'dry': {
				type: 'boolean',
				default: false,
				alias: 'dry-run',
				description: 'Do not modify the files.'
			},
			'plumbing': {
				type: 'boolean',
				default: false,
				description: 'Parsable output.'
			}
		}
	}

	async run(args) {
		let project = await SCT.getProject();
		let modules = await CommandUtil.getModulesFromArgs(args, {
			meta:      false,
			metaError: m => `${m} is a meta-module, and cannot be formatted.`
		});

		// Handle arguments.
		let formatter = new FileFormatter({directory: project.getDirectory()});
		let printer   = this._getPrinter(args);
		let filters   = await CommandUtil.getFiltersFromArgs(args);
		let saver     = args.dry ? () => {} : async (file, data) => {
			await fs.writeFile(file, data);
		};

		// Create stream to format files.
		let stream = new AsyncTransform({
			objectMode: true,
			transform: async (data) => {
				let result = await formatter.format(data.path);
				if (result === null) return null;
				if (result.before === result.after) return null;

				await saver(result.file, result.after);
				await printer(result.file);
			}
		});

		// Format project files.
		let result = StreamUtil.chain([
			Finder.all(modules.map(m => m.getFiles()).flat()),
			... filters,
			stream
		]);

		// Wait for completion.
		return await StreamUtil.ending(result);
	}

	async _printPlumbing(file) {
		process.stdout.write(`${file}\n`);
	}

	async _printPorcelain(file) {
		console.log(chalk.yellow('Formatted: ') + path.relative((await SCT.getProject()).getDirectory(), file));
	}

	/**
	 * Gets the most appropriate printer.
	 *
	 * @param args {Object} The command arguments.
	 * @returns {Function}  The printer function.
	 * @private
	 */
	_getPrinter(args) {
		return args.plumbing
			? (...params) => this._printPlumbing(...params, args.verbose)
			: (...params) => this._printPorcelain(...params, args.verbose);
	}


};
