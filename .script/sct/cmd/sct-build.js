#!/usr/bin/env node
// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <contact@eth-p.dev>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// SCT Build: Build the project.
// This tool will build the project.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const chalk      = require('chalk');
const unique     = require('array-unique');
const fs         = require('fs-extra');
const npmp       = require('npm-programmatic');
const path       = require('path');

// Modules.
const Command          = require('@sct').Command;
const CommandUtil      = require('@sct').CommandUtil;
const SCT              = require('@sct');
const TaskLogger       = require('@sct').TaskLogger;
const TaskLoggerPretty = require('@sct').TaskLoggerPretty;
const TaskRunner       = require('@sct').TaskRunner;

// ---------------------------------------------------------------------------------------------------------------------
// Class:
// ---------------------------------------------------------------------------------------------------------------------

module.exports = class CommandBuild extends Command {

	name() {
		return 'sct build';
	}

	description() {
		return 'Build the project.';
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
			},
			'keep:asserts': {
				type: 'boolean',
				default: (args) => !args.release,
				description: 'Enable assertions.',
				alias: ['asserts', 'assert']
			},
			'keep:comments': {
				type: 'boolean',
				default: false,
				description: 'Keep comments in source code.'
			},
			'list-tasks': {
				type: 'boolean',
				default: false,
				description: 'List build tasks.',
				alias: 'list'
			},
			'fast-fail': {
				type: 'boolean',
				default: true,
				description: 'Immediately fail all tasks if any fails.',
				alias: 'ff'
			},
			'plumbing': {
				type: 'boolean',
				default: false,
				description: 'Parsable output.'
			},
			'verbose': {
				type: 'boolean',
				default: false,
				description: 'Verbose output.'
			},
			'sourcemaps': {
				type: 'boolean',
				default: true,
				description: 'Write sourcemaps.'
			},
			'minify': {
				type: 'boolean',
				default: (args) => args.release,
				description: 'Minify output files.'
			},
			'modules': {
				type: 'string',
				value: 'pattern',
				default: 'amd',
				description: 'The module import/export pattern.',
				match: ['es6', 'commonjs', 'amd']
			},
			'watch': {
				type: 'boolean',
				default: false,
				description: 'Watch for and rebuild on changes.'
			},
			'_': {
				value: 'module',
				type: 'string',
				many: true
			}
		}
	}

	async run(args) {
		if (args['list-tasks']) {
			await (args.plumbing ? this._listTasksPlumbing : this._listTasksPorcelain)(await this._getModulesFromArgs(args));
			return;
		}

		let tasks   = await this._getTasksFromArgs(args);
		if (args.watch) tasks.forEach(t => t.watch = true);

		// Install packages if needed.
		const modules = unique(tasks.map(t => t.module));
		await Promise.all(modules.map(m => this._installPackages(m)));

		// Run tasks.
		let runner  = new TaskRunner(tasks, args, args.plumbing ? TaskLogger : TaskLoggerPretty);
		return runner.run(args['fast-fail']);
	}

	async _isMissingPackage(dep) {
		const pkgDir = path.join((await SCT.getProject()).getDirectory(), 'node_modules');
		if (await fs.pathExists(path.join(pkgDir, dep[0]))) {
			return null;
		}

		return `${dep[0]}@${dep[1]}`;
	}

	async _installPackages(module) {
		if (module.isMeta()) return; // Don't bother with meta modules.

		const dir = module.getDirectory();
		if (! (await fs.pathExists(path.join(dir, 'package.json')))) return;

		const json = await fs.readJson(path.join(dir, 'package.json'));
		const deps = Object.assign({}, json.dependencies, json.devDependencies);

		// Collect missing packages.
		const missing = [];
		for (let dep of Object.entries(deps).map(d => this._isMissingPackage(d))) {
			let depName = await dep;
			if (depName != null) missing.push(depName);
		}

		// Return if up-to-date.
		if (missing.length === 0) return;

		// Install missing packages.
		console.log("Installing dependencies...");
		for (let pkg of missing) {
			console.log(`- ${pkg}`);
		}

		await npmp.install(missing, {
			save: false,
			saveDev: false,
			cwd: module.getProject().getDirectory()
		});
	}

	async _getModulesFromArgs(args) {
		const moduleNames = args._.map(x => x.split(':')[0]);
		const modules = await CommandUtil.getModulesFromArgs({_: moduleNames}, {meta: true});

		if (moduleNames.length !== 0) return modules;

		// Handle manual build modules.
		return modules.filter(m => m.isAutomaticBuild());
	}

	async _getTasksFromArgs(args) {
		let project = await SCT.getProject();

		// Default - build all.
		if (args._.length === 0) {
			return (await Promise.all((await this._getModulesFromArgs(args)).map(m => m.getDefaultTasks()))).flat();
		}

		// Rewrite.
		let taskAliases = project._config.tasks;
		let taskNames = args._
			.map(t => Object.prototype.hasOwnProperty.call(taskAliases, t) ? taskAliases[t] : t);

		// Specific.
		let tasks = [];
		for (let [moduleName, taskName] of taskNames.map(a => a.split(':'))) {
			let module = project.getModule(moduleName);
			if (taskName === undefined) {
				tasks.push(module.getDefaultTasks());
			} else {
				tasks.push(module.getBuildTask(taskName));
			}
		}

		return unique((await Promise.all(tasks)).flat());
	}

	async _listTasksPlumbing(modules) {
		for (let tasks of await Promise.all(modules.map(m => m.getBuildTasks()))) {
			if (tasks.length === 0) continue;
			let module = tasks[0].module;

			for (let task of tasks) {
				let taskFlags = [];
				taskFlags.push((await task.constructor.isDefault(module)) ? 'D' : 'd');

				process.stdout.write(`[${taskFlags.join('')}] ${module.getId()} ${task.id}\n`);
			}
		}
	}

	async _listTasksPorcelain(modules) {
		for (let tasks of await Promise.all(modules.map(m => m.getBuildTasks()))) {
			if (tasks.length === 0) continue;
			let module = tasks[0].module;

			console.log(chalk.yellow('Module: ') + module.getId());
			for (let task of tasks) {
				let taskName = `${module.getId()}:${task.id}`.padEnd(20);
				let taskFlags = (await task.constructor.isDefault(module)) ? chalk.blue('[default]') : '         ';
				console.log(chalk.yellow(' - ') + chalk.magenta(taskName) + ` -- ${taskFlags} ${task.description}`);
			}
			console.log();
		}
	}

};
