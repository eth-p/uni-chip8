#!/usr/bin/env node
// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// SCT Build: Build the project.
// This tool will build the project.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const asyncdone  = require('async-done');
const chalk      = require('chalk');
const undertaker = require('undertaker');
const unique     = require('array-unique');

// Modules.
const Command          = require('@sct').Command;
const CommandError     = require('@sct').CommandError;
const CommandUtil      = require('@sct').CommandUtil;
const SCT              = require('@sct');
const TaskLogger       = require('@sct').TaskLogger;
const TaskLoggerPretty = require('@sct').TaskLoggerPretty;

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
				default: 'es6',
				description: 'The module import/export pattern.',
				match: ['es6', 'commonjs', 'amd']
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

		// Get tasks to run.
		let tasks   = await this._getTasksFromArgs(args);
		let loggers = {};

		// Set up task registry.
		let reg = new undertaker();
		for (let task of tasks) {
			let logger = loggers[task.fqid] = new (args.plumbing ? TaskLogger : TaskLoggerPretty)(task);
			reg.task(task.fqid, () => {
				logger.task(`Started.`);
				return task.run(logger, args);
			});
		}

		// Run tasks.
		return new Promise((resolve, reject) => {
			let remaining = tasks.length;
			let failed    = false;
			let dead      = false;

			for (let task of tasks) {
				let logger = loggers[task.fqid];
				asyncdone(() => reg.task(task.fqid)(), (error, data) => {
					remaining--;
					if (dead) return;

					// Handle error.
					if (error != null) {
						logger.error(error);
						failed = true;

						if (args['fast-fail']) {
							dead = true;
							reject(new CommandError('One or more build tasks failed.', {cause: error}));
						}
					} else {
						logger.task(`Completed in ${this._timeDiff(task.timeStart, task.timeStop)}.`);
					}

					// Handle success.
					if (remaining === 0) {
						dead = true;
						if (failed) {
							reject(new CommandError('One or more build tasks failed.'));
						} else {
							resolve();
						}
					}
				});
			}
		});
	}

	async _getModulesFromArgs(args) {
		let moduleNames = args._.map(x => x.split(':')[0]);
		return await CommandUtil.getModulesFromArgs({_: moduleNames}, {meta: true});
	}

	async _getTasksFromArgs(args) {
		let project = await SCT.getProject();

		// Default - build all.
		if (args._.length === 0) {
			return (await Promise.all((await this._getModulesFromArgs(args)).map(m => m.getBuildTasks()))).flat();
		}

		// Specific.
		let tasks = [];
		for (let [moduleName, taskName] of args._.map(a => a.split(':'))) {
			let module = project.getModule(moduleName);
			if (taskName === undefined) {
				tasks.push(module.getBuildTasks());
			} else {
				tasks.push(module.getBuildTask(taskName));
			}
		}

		return unique((await Promise.all(tasks)).flat());
	}

	/**
	 * Get the time difference between two dates.
	 * @param a {Date} The first date.
	 * @param b {Date} The second date.
	 * @private
	 */
	_timeDiff(a, b) {
		let diff = a.getTime() > b.getTime() ? (b.getTime() - a.getTime()) : (b.getTime() - a.getTime());
		if (diff < 1000)      return `${diff} ms`;
		if (diff < 1000 * 60) return `${Math.floor(diff / 1000)} s`;
		return `${Math.floor(diff / 1000 / 60)} m, ${Math.floor((diff / 1000) % 60)} s`;
	}

	async _listTasksPlumbing(modules) {
		for (let tasks of await Promise.all(modules.map(m => m.getBuildTasks()))) {
			if (tasks.length === 0) continue;
			let module = tasks[0].module;

			for (let task of tasks) {
				process.stdout.write(`${module.getId()} ${task.id}\n`);
			}
		}
	}

	async _listTasksPorcelain(modules) {
		for (let tasks of await Promise.all(modules.map(m => m.getBuildTasks()))) {
			if (tasks.length === 0) continue;
			let module = tasks[0].module;

			console.log(chalk.yellow('Module: ') + module.getId());
			for (let task of tasks) {
				let taskName = `${module.getId()}:${task.id}`;
				console.log(chalk.yellow(' - ') + chalk.magenta(`${taskName.padEnd(16)}`) + ` -- ${task.description}`);
			}
			console.log();
		}
	}

};
