// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: Task
// An abstract class for a build task.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const gulp        = require('gulp');
const gulp_filter = require('gulp-filter');
const path        = require('path');
const stream      = require('stream');

// Modules.
const Finder     = require('./Finder');
const TaskStatus = require('./TaskStatus');

// ---------------------------------------------------------------------------------------------------------------------
// Class:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * An abstract class for a build task.
 *
 * @type {Task}
 * @abstract
 */
module.exports = class Task {

	/**
	 * Gets the task's name.
	 * @returns {String}
	 */
	get name() {
		return this.id;
	}

	/**
	 * Gets the task's ID.
	 * @returns {String}
	 */
	get id() {
		return this.constructor.name;
	}

	/**
	 * Gets the task's fully-qualified ID.
	 * @returns {String}
	 */
	get fqid() {
		return `${this.module.getId()}:${this.id}`;
	}

	/**
	 * Gets the task's description.
	 * @returns {string}
	 */
	get description() {
		return '[no description provided]';
	}

	/**
	 * Runs the task.
	 *
	 * @param logger  {TaskLogger} Task logger.
	 * @param options {Object} Task options.
	 * @returns {Promise|Stream} Task pipeline.
	 */
	run(logger, options) {
		this._status = TaskStatus.RUNNING;

		try {
			this.timeStart = new Date();
			let result = this._run(logger, options);

			// It's a promise.
			if (typeof(result.then) === 'function') {
				return new Promise((resolve, reject) => {
					result.then((...args) => {
						this._status = TaskStatus.STOPPED;
						this.timeStop = new Date();
						resolve(...args);
					}, (...args) => {
						this._status = TaskStatus.ERROR;
						this.timeStop = new Date();
						reject(...args);
					})
				})
			}

			// It's a stream.
			if (typeof(result.pipe) === 'function') {
				result.on('error', () => {
					this._status = TaskStatus.ERROR;
					this.timeStop = new Date();
				});
				result.on('end',   () => {
					this._status = TaskStatus.STOPPED;
					this.timeStop = new Date();
				});
			}

			return result;
		} catch (ex) {
			this._status = TaskStatus.ERROR;
			throw ex;
		}
	}

	/**
	 * Gets the task status.
	 * @returns {String}
	 */
	getStatus() {
		return this._status;
	}

	/**
	 * Gets the module built by the task.
	 * @returns {Module}
	 */
	get module() {
		return this._module;
	}

	/**
	 * Creates a new task.
	 *
	 * @param module {Module} The module to build.
	 */
	constructor(module) {
		this._status = TaskStatus.STOPPED;
		this._module = module;
		this.timeStart = null;
		this.timeStop = null;
	}

	/**
	 * Returns a gulp.src stream for the source files of this task's module.
	 * @param [only] {String[]} Only match these files.
	 * @protected
	 */
	_gulpsrc(only) {
		let base   = this.module.getDirectory();
		let stream = gulp.src([].concat(
				this.module.getSourcePatterns(),
				this.module._excludes,
				Finder.EXCLUDE,
				['!**/out/*']
			),
			{
				base:       base,
				cwd:        base,
				sourcemaps: true
			}
		);

		if (only != null) stream = stream.pipe(gulp_filter(['!**'].concat(only)));

		return stream;
	}

	/**
	 * Returns a gulp.dest stream for the build directory.
	 * @protected
	 */
	_gulpdest() {
		let project = this.module.getProject();
		return gulp.dest(project.getBuildDirectory(), {
			cwd: project.getDirectory()
		});
	}

	/**
	 * Runs the task.
	 *
	 * @param logger  {TaskLogger} Task logger.
	 * @param options {Object} Task options.
	 * @returns {Promise|Stream} Task pipeline.
	 *
	 * @abstract
	 */
	_run(logger, options) {
		throw new Error(`Unimplemented task: ${this.id()}`);
	}

	/**
	 * Check if the module supports this build task.
	 *
	 * @param module {Module} The module.
	 * @returns {Promise<Boolean>} True if the module supports the task.
	 */
	static async supports(module) {
		return !module.isMeta();
	}

};

