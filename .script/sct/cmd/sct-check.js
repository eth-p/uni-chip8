#!/usr/bin/env node
// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <contact@eth-p.dev>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// SCT Check: Check source code for guideline violations.
// This tool will check project files for anything that violates the style guide or code of conduct.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const badwords     = require('bad-words');
const chalk        = require('chalk');
const findup       = require('find-up');
const ts           = require('typescript');
const tslint       = require('tslint');
const path         = require('path');

// Modules.
const AsyncTransform          = require('@sct').AsyncTransform;
const Command                 = require('@sct').Command;
const CommandUtil             = require('@sct').CommandUtil;
const Finder                  = require('@sct').Finder;
const FileFormatter           = require('@sct').FileFormatter;
const FileChecker             = require('@sct').FileChecker;
const SCT                     = require('@sct');
const StreamUtil              = require('@sct').StreamUtil;

// ---------------------------------------------------------------------------------------------------------------------
// Constants:
// ---------------------------------------------------------------------------------------------------------------------

const IGNORE_BADWORDS = [
	'wang',
	'xxx'
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
				default: false,
				description: 'Check profanity.'
			},
			'formatting': {
				type: 'boolean',
				default: false,
				description: 'Check formatting.'
			},
			'lint': {
				type: 'boolean',
				default: false,
				description: 'Check source code using tslint.'
			},
			'only-modified': {
				type: 'boolean',
				default: false,
				description: 'Only check modified files. (Requires Repository)',
				alias: ['modified-only', 'm']
			},
			'only-staged': {
				type: 'boolean',
				default: false,
				description: 'Only check staged files. (Requires Repository)',
				alias: ['staged-only', 's']
			},
			'verbose': {
				type: 'boolean',
				default: false,
				description: 'Show all files.',
				alias: ['v']
			},
			'plumbing': {
				type: 'boolean',
				default: false,
				description: 'Parsable output.'
			},
			'_': {
				value: 'module',
				type: 'string',
				many: true
			}
		}
	}

	async run(args) {
		let project = await SCT.getProject();
		let modules = await CommandUtil.getModulesFromArgs(args, {
			meta:      false,
			metaError: m => `${m} is a meta-module, and cannot be checked.`
		});

		// Create file checker.
		let checker = new FileChecker();

		checker._initProfanityChecker_HOOK = function() {
			this._badwords = new badwords();
			this._badwords.removeWords(... IGNORE_BADWORDS);
		};

		checker._initFormattingChecker_HOOK = function() {
			this._formatter = new FileFormatter({directory: project.getDirectory()});
		};

		checker._initLintChecker_HOOK = function() {
			let configFile = findup.sync('tslint.json', {cwd: project.getDirectory()});
			this._tslintConfig     = tslint.Configuration.loadConfigurationFromPath(configFile);
			// this._tslintTypescript = ts.createProgram();
			// TODO: Create TypeScript program instance to allow type information checks.
		};


		// Handle arguments.
		let printer = this._getPrinter(args);
		let checks  = this._getChecks(args, checker);
		let filters = await CommandUtil.getFiltersFromArgs(args);

		// Create stream to check files.
		let stream = new AsyncTransform({
			objectMode: true,
			transform: async (data) => {
				let result = await Promise.all(checks.map(f => f(data.path)));
				let passed = result.find(([n, v]) => !v.status) === undefined;

				if (args.verbose || !passed) {
					await printer(data.path, result);
				}
			}
		});

		// Start checking files.
		let result = StreamUtil.chain([
			Finder.all(modules.map(m => m.getFiles()).flat()),
			... filters,
			stream
		]);

		// Start checking.
		if (args.plumbing) {
			await StreamUtil.ending(result);
		} else {
			console.log(chalk.yellow("Checking project..."));

			await StreamUtil.ending(result);

			console.log(
				checker.failures === 0
				? chalk.yellow("All checks passed.")
				: chalk.yellow(`${checker.failures} check${checker.failures > 0 ? 's' : ''} failed.`)
			);
		}

		return checker.failures === 0;
	}

	async _printPlumbing(file, checks) {
		let checkfields = checks.map(([name, results]) => results.status ? '*' : name).join(' ');
		process.stdout.write(`${checkfields} ${file}\n`);
	}

	async _printPorcelain(file, checks, verbose) {
		let failed = false;
		let filerel = path.relative((await SCT.getProject()).getDirectory(), file);

		for (let check of checks.filter(([name, results]) => !results.status)) {
			failed = true;
			console.log(chalk.red(check[0]) + chalk.yellow(': ') + filerel);

			let details = check[1].details;
			if (details != null) {
				for (let i = 0; i < details.length; i++) {
					let issue  = details[i];
					let prefix = '        ' + chalk.yellow(`[${(i+1)}]`.padEnd(4));

					if (issue.line != null) {
						prefix += `${chalk.yellow('Line')} ${chalk.blue(issue.line)}${chalk.yellow(':')}`;
					}

					console.log(`${prefix}  ${issue.message}`);
				}
			}
		}

		if (verbose && !failed) {
			console.log(chalk.green('PASS') + chalk.yellow(': ') + filerel);
		}
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

	/**
	 * Gets an array of async check functions.
	 *
	 * @param args    {Object}      The command arguments.
	 * @param checker {FileChecker} The file checker.
	 *
	 * @returns {Function[]} The check functions.
	 * @private
	 */
	_getChecks(args, checker) {
		let checks   = [];
		let all      = !(args.profanity || args.formatting || args.lint);

		if (all || args.formatting)	checks.push(async file => ['FORMATTING', await checker.checkFormatting(file)]);
		if (all || args.profanity)  checks.push(async file => ['PROFANITY', await checker.checkProfanity(file)]);
		if (all || args.lint)       checks.push(async file => ['TSLINT', await checker.checkLint(file)]);

		return checks;
	}

};
