// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: TaskRunner
// A class to run build tasks.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const asyncdone  = require('async-done');
const undertaker = require('undertaker');

// Modules.
const SCTError = require('./SCTError');

// ---------------------------------------------------------------------------------------------------------------------
// Class:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A class to run build tasks.
 *
 * @type {TaskRunner}
 */
module.exports = class TaskRunner {

	/**
	 * Creates a new task logger.
	 *
	 * @param tasks  {Task[]} The tasks to run.
	 * @param args   {*} The task arguments.
	 * @param Logger {{new():TaskLogger}} The logger constructor.
	 */
	constructor(tasks, args, Logger) {
		this._undertaker = new undertaker();
		this._taskList   = tasks;
		this._taskArgs   = args;
		this._loggers    = new Map();

		// Add tasks to undertaker.
		for (let task of tasks) {
			let taskId = task.fqid;
			let logger = new Logger(task);
			this._loggers.set(taskId, logger);
			this._undertaker.task(taskId, () => {
				logger.task('Started.');
				return task.run(logger, this._taskArgs);
			});
		}

		// Sort tasks.
		this._taskTable = [];
		let lastPrio  = null;
		let lastTable = null;
		for (let task of tasks.sort((a, b) => b.priority - a.priority)) {
			if (lastPrio !== task.priority) {
				lastPrio = task.priority;
				lastTable = [];
				this._taskTable.push(lastTable);
			}

			lastTable.push(task);
		}
	}

	/**
	 * Runs the tasks.
	 *
	 * @param failOnError {boolean} Fail all tasks if any single task errors.
	 *
	 * @returns {Promise<void>}
	 * @private
	 */
	async run(failOnError) {
		for (let table of this._taskTable) {
			await this._runTasks(table, failOnError);
		}
	}

	/**
	 * Runs an array of tasks.
	 *
	 * @param tasks {Task[]} The tasks to run.
	 * @param failOnError {boolean} Fail all tasks if any single task errors.
	 *
	 * @returns {Promise<void>}
	 * @private
	 */
	_runTasks(tasks, failOnError) {
		return new Promise((resolve, reject) => {
			let remaining = tasks.length;
			let failed    = false;
			let dead      = false;

			for (let task of tasks) {
				let taskId = task.fqid;
				let taskFn = this._undertaker.task(taskId);
				let logger = this._loggers.get(taskId);
				asyncdone(taskFn, (error, data) => {
					remaining--;
					if (dead) return;

					// Handle error.
					if (error != null) {
						logger.error(error);
						failed = true;

						if (failOnError) {
							dead = true;
							reject(new SCTError('One or more build tasks failed.', {cause: error}));
						}
					} else {
						logger.task(`Completed in ${this._timeDiff(task.timeStart, task.timeStop)}.`);
					}

					// Handle success.
					if (remaining === 0) {
						dead = true;
						if (failed) {
							reject(new SCTError('One or more build tasks failed.'));
						} else {
							resolve();
						}
					}
				});
			}
		});
	}

	/**
	 * Get the time difference between two dates.
	 *
	 * @param a {Date} The first date.
	 * @param b {Date} The second date.
	 *
	 * @private
	 */
	_timeDiff(a, b) {
		let diff = a.getTime() > b.getTime() ? (b.getTime() - a.getTime()) : (b.getTime() - a.getTime());
		if (diff < 1000)      return `${diff} ms`;
		if (diff < 1000 * 60) return `${Math.floor(diff / 1000)} s`;
		return `${Math.floor(diff / 1000 / 60)} m, ${Math.floor((diff / 1000) % 60)} s`;
	}
};
