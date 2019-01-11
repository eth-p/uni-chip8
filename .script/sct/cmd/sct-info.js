#!/usr/bin/env node
// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// SCT Info: View project info.
// This tool can be used to query for project information.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const chalk = require('chalk');

// Modules.
const Command                 = require('@sct').Command;
const CommandError            = require('@sct').CommandError;
const CommandUtil             = require('@sct').CommandUtil;
const Finder                  = require('@sct').Finder;
const SCT                     = require('@sct');
const StreamUtil              = require('@sct').StreamUtil;

// ---------------------------------------------------------------------------------------------------------------------
// Class:
// ---------------------------------------------------------------------------------------------------------------------

module.exports = class CommandCheck extends Command {

	name() {
		return 'sct info';
	}

	description() {
		return 'View project info.';
	}

	schema() {
		return {
			'list-modules': {
				type: 'boolean',
				default: false,
				description: 'List modules.',
				alias: 'modules'
			},
			'list-files': {
				type: 'boolean',
				default: false,
				description: 'List module files. (Requires Repository)',
				alias: 'files'
			},
			'only-modified': {
				type: 'boolean',
				default: false,
				description: 'Only check modified files. (Requires Repository)',
				alias: 'modified-only'
			},
			'only-staged': {
				type: 'boolean',
				default: false,
				description: 'Only check staged files. (Requires Repository)',
				alias: 'staged-only'
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

		if (args['list-files'] === true && args['list-modules'] === true) {
			throw new CommandError("Cannot use both '--list-files' and '--list-modules' arguments.");
		}

		if (args['list-files']   === true) return this.run_list_files(args, project);
		if (args['list-modules'] === true) return this.run_list_modules(args, project);

		console.log(this.usage());
		return 1;
	}

	async run_list_files(args, project) {
		let modules = await CommandUtil.getModulesFromArgs(args, {meta: true});
		let filters = await CommandUtil.getFiltersFromArgs(args);
		let files   = StreamUtil.chain([
			Finder.all(modules.map(m => m.getFiles()).flat()),
			... filters
		]);

		if (!args.plumbing) {
			console.log(chalk.yellow('Files:'));
		}

		files.on('data', (file) => {
			if (args.plumbing === true) {
				process.stdout.write(`${file.file}\n`);
			} else {
				console.log(file.file);
			}
		});

		await StreamUtil.ending(files);
		return 0;
	}

	async run_list_modules(args, project) {
		let modules = await project.getModules();

		if (!args.plumbing) {
			console.log(chalk.yellow('Modules:'));
		}

		for (let module of modules.sort((a, b) => a.getId().localeCompare(b.getId()))) {
			if (args.plumbing === true) {
				process.stdout.write(`${module.getId()} ${module.isMeta() ? 'META' : 'MODULE'} ${module.getDirectory()}\n`);
			} else {
				console.log(`${module.getId().padEnd(16)} ` + (
					module.isMeta()
						? chalk.magenta('(Meta)')
						: chalk.yellow('(Code)')
				));
			}
		}

		return 0;
	}

};
