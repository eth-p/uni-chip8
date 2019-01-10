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
const stream       = require('stream');

// Modules.
const Command       = require('@sct').Command;
const CommandUtil   = require('@sct').CommandUtil;
const Finder        = require('@sct').Finder;
const FileFormatter = require('@sct').FileFormatter;
const SCT           = require('@sct');

// Functions.
const ending = CommandUtil.ending;

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
			}
		}
	}

	async run(args) {
		let modules = await CommandUtil.getModulesFromArgs(args._, {
			meta:      false,
			metaError: m => `${m} is a meta-module, and cannot be formatted.`
		});

		// Handle arguments.
		let fmtprint = args.plumbing ? this._printPlumbing : this._printPorcelain;
		let fmtsave = async (file, data) => {
			await fs.writeFile(file, data);
		};

		// Create formatting stream.
		let formatter = new FileFormatter({directory: (await SCT.getProject()).getDirectory()});
		let fmtstream = new stream.Transform({
			objectMode: true,
			transform: (data, encoding, callback) => {
				(async () => {

					let result = await formatter.format(data.path);
					if (result.before === result.after) return null;

					await fmtsave(result.file, result.after);
					await fmtprint(result.file);

				})().then(data => callback(null, data), err => callback(err));
			}
		});

		// Format project files.
		let finders = Finder.all(modules.map(m => m.getFiles()).flat());
		finders.pipe(fmtstream);

		// Wait for completion.
		return await ending(fmtstream);
	}

	async _printPlumbing(file) {
		process.stdout.write(`${file}\n`);
	}

	async _printPorcelain(file) {
		console.log(chalk.yellow('Formatted: ') + path.relative((await SCT.getProject()).getDirectory(), file));
	}

};
