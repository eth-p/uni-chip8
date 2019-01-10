#!/usr/bin/env node
// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// SCT Check: Check source code for guideline violations.
// This tool will check project files for anything that violates the style guide or code of conduct.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const badwords     = require('bad-words');
const chalk        = require('chalk');
const path         = require('path');
const stream       = require('stream');

// Modules.
const Command       = require('@sct').Command;
const CommandUtil   = require('@sct').CommandUtil;
const Finder        = require('@sct').Finder;
const FileFormatter = require('@sct').FileFormatter;
const FileChecker   = require('@sct').FileChecker;
const SCT           = require('@sct');

// Functions.
const ending = CommandUtil.ending;

// ---------------------------------------------------------------------------------------------------------------------
// Constants:
// ---------------------------------------------------------------------------------------------------------------------

const IGNORE_BADWORDS = [
	'wang'
];

// ---------------------------------------------------------------------------------------------------------------------
// Class:
// ---------------------------------------------------------------------------------------------------------------------

module.exports = class CommandCheck extends Command {

	name() {
		return 'sct check';
	}

	description() {
		return 'Check source code for guideline violations.';
	}

	schema() {
		return {
			'profanity': {
				type: 'boolean',
				default: false
			},
			'formatting': {
				type: 'boolean',
				default: false
			},
			'_': {
				value: 'module',
				type: 'string',
				many: true
			}
		}
	}

	async run(args) {
		let all     = !(args.profanity || args.formatting);
		let modules = await CommandUtil.getModulesFromArgs(args._, {
			meta:      false,
			metaError: m => `${m} is a meta-module, and cannot be checked.`
		});

		// Create file checker.
		let formatter = new FileFormatter({directory: (await SCT.getProject()).getDirectory()});
		let profanity = new badwords();

		profanity.removeWords(... IGNORE_BADWORDS);

		let checker = new FileChecker({
			badwords: profanity,
			formatter: formatter
		});

		// Add checks.
		let chkprint = args.plumbing ? this._printPlumbing : this._printPorcelain;
		let checks   = [];
		let failed   = 0;

		if (all || args.formatting)	checks.push(async file => ['FORMATTING', await checker.checkFormatting(file)]);
		if (all || args.profanity)  checks.push(async file => ['PROFANITY', await checker.checkProfanity(file)]);

		// Create check stream.
		let chkstream = new stream.Transform({
			objectMode: true,
			transform: (data, encoding, callback) => {
				(async () => {
					let result = await Promise.all(checks.map(f => f(data.path)));
					if (result.find(([n, v]) => !v) !== undefined) {
						failed++;
						await chkprint(data.path, result);
					}
				})().then(data => callback(null, data), err => callback(err));
			}
		});

		// Check project files.
		let finders = Finder.all(modules.map(m => m.getFiles()).flat());
		finders.pipe(chkstream);

		// Wait for completion and report back.
		console.log(chalk.yellow("Checking project..."));

		await ending(chkstream);

		if (failed === 0) {
			console.log(chalk.yellow("All checks passed."));
		} else {
			console.log(chalk.yellow(`${failed} check${failed > 0 ? 's' : ''} failed.`));
		}

		return failed === 0;
	}

	async _printPlumbing(file, checks) {
		let checkfields = checks.map(([name, passed]) => passed ? '*' : name).join(' ');
		process.stdout.write(`${checkfields} ${file}\n`);
	}

	async _printPorcelain(file, checks) {
		for (let check of checks.filter(([name, passed]) => !passed)) {
			console.log(
				chalk.red(check[0]) + chalk.yellow(': ')
				+ path.relative((await SCT.getProject()).getDirectory(), file)
			)
		}
	}

};
