// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: Task
// An abstract class for a build task.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const gulp            = require('gulp');
const gulp_filter     = require('gulp-filter');
const gulp_print      = require('gulp-print').default;
const gulp_read       = require('gulp-read');
const gulp_rename     = require('gulp-rename');
const gulp_sourcemaps = require('gulp-sourcemaps');
const gulp_watch      = require('gulp-watch');
const gulp_plumber    = require('gulp-plumber');
const mm              = require('micromatch');
const mississippi     = require('mississippi');
const path            = require('path');

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
		this._logger = logger;

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
	 * Gets the task priority.
	 * The higher the priority, the sooner the task will run.
	 *
	 * @returns {number}
	 */
	get priority() {
		return 0;
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
		let stream = null;
		let srcpat = [].concat(
			this.module.getSourcePatterns(),
			this.module._excludes,
			Finder.EXCLUDE,
			['!**/out/*']);

		if (this.watch) {
			stream = gulp_watch(srcpat, {
				ignoreInitial: false,
				base:          base,
				cwd:           base,
				allowEmpty:    true,
				read:          only == null
			});
		} else {
			stream = gulp.src(srcpat, {
				base:       base,
				cwd:        base,
				allowEmpty: true,
				read:       only == null
			});
		}

		// Filtered.
		if (only != null) {
			stream = stream
				.pipe(gulp_filter(['!**'].concat(only)))
				.pipe(gulp_read());
		}

		// Sourcemaps.
		stream = stream.pipe(gulp_sourcemaps.init());
		return stream;
	}

	/**
	 * Returns a stream (and a couple extras) to save files to the build directory.
	 *
	 * @param options {Object} Task options.
	 * @returns {Stream}
	 * @protected
	 */
	_gulpdest(options) {
		let project = this.module.getProject();

		let streams = [
			(options.sourcemaps ? gulp_sourcemaps.write('.') : null),
			gulp.dest(project.getBuildDirectory(), {cwd: project.getBuildDirectory()}),
			(options.verbose ? gulp_print((f) => this._logger.file(f)) : null)
		].filter(x => x !== null);

		return mississippi.pipeline.obj(...streams);
	}

	/**
	 * Returns a stream to strip parts of the file path that are constant.
	 * Example: 'abc/**.ts' -> '**.ts'
	 *
	 * @param patterns The file patterns.
	 * @returns {Stream}
	 * @protected
	 */
	_gulpstrip(patterns) {
		return gulp_rename(file => {
			let joined = path.join(file.dirname, file.basename + file.extname);
			for (let pattern of patterns) {
				if (mm.isMatch(joined, pattern)) {
					let pfxIndex  = pattern.indexOf('*');
					let pfxString = pattern.substring(0, pfxIndex);

					if (pfxIndex === -1 || !pfxString.endsWith('/')) return;
					pfxString = pfxString.substring(0, pfxString.length - 1);

					if (!file.dirname.startsWith(pfxString)) return;
					file.dirname = file.dirname.substring(pfxString.length);
					return;
				}
			}
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
	 * Checks if the module supports this build task.
	 *
	 * @param module {Module} The module.
	 * @returns {Promise<Boolean>} True if the module isSupported the task.
	 */
	static async isSupported(module) {
		return !module.isMeta();
	}

	/**
	 * Checks if the build task runs with the default task.
	 *
	 * @param module {Module} The module.
	 * @returns {Promise<Boolean>} True if the task should run as part of the default tasks.
	 */
	static async isDefault(module) {
		return true;
	}

};

