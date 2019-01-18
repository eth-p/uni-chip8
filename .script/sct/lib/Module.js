// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: Module
// A project module.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const fs       = require('fs-extra');
const path     = require('path');

// Modules.
const Finder   = require('./Finder');
const SCT      = require('./SCT');
const SCTError = require('./SCTError');

// ---------------------------------------------------------------------------------------------------------------------
// Cache:
// ---------------------------------------------------------------------------------------------------------------------

let TASK_DIR  = path.join(SCT.getDirectory(), 'build');
let TASK_LIST = null;

// ---------------------------------------------------------------------------------------------------------------------
// Class:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A project module.
 * @type {Module}
 */
module.exports = class Module {

	/**
	 * Gets the module ID.
	 * @returns {string}
	 */
	getId() {
		return this._id;
	}

	/**
	 * Gets the module description.
	 * @returns {string}
	 */
	getDescription() {
		return this._description;
	}

	/**
	 * Gets the module directory.
	 * @returns {string}
	 */
	getDirectory() {
		return this._directory;
	}

	/**
	 * Gets the parent project.
	 * @returns {Project}
	 */
	getProject() {
		return this._project;
	}

	/**
	 * Gets the patterns used to determine the source files.
	 * @param [excludes] {Boolean} If true, will include the exclusion patterns.
	 * @returns {string[]}
	 */
	getSourcePatterns(excludes) {
		return excludes ? [].concat(this._sources, this._excludes) : this._sources.slice(0);
	}

	/**
	 * Gets a Finder for the source files.
	 * @returns {Finder}
	 */
	getSourceFiles() {
		return new Finder(this.getDirectory(), this.getSourcePatterns(true));
	}

	/**
	 * Gets the patterns used to determine the test files.
	 * @param [excludes] {Boolean} If true, will include the exclusion patterns.
	 * @returns {string[]}
	 */
	getTestPatterns(excludes) {
		return excludes ? [].concat(this._tests, this._excludes) : this._tests.slice(0);
	}

	/**
	 * Gets a Finder for the test files.
	 * @returns {Finder}
	 */
	getTestFiles() {
		return new Finder(this.getDirectory(), this.getTestPatterns(true));
	}

	/**
	 * Gets an array of Finders for the module's files.
	 * @returns {Finder[]}
	 */
	getFiles() {
		return [
			this.getSourceFiles(),
			this.getTestFiles()
		]
	}

	/**
	 * Checks if the module is a meta-module.
	 * Meta-modules are located at the repository root.
	 *
	 * @returns {boolean}
	 */
	isMeta() {
		return this._meta;
	}

	/**
	 * Checks if any module files have been changed since the last commit.
	 *
	 * @param status     {git.Status} The git status object.
	 * @param onlyStaged {Boolean}    If true, only staged changes will be checked for.
	 *
	 * @returns {Promise<boolean>}
	 */
	async hasChanges(status, onlyStaged) {
		let gitStatus = await (status != null ? status : (await this._project.getRepository()).getStatus());
		let directory = this.getDirectory();

		let patternsSrc  = Finder.compilePatterns(this.getSourcePatterns());
		let patternsTest = Finder.compilePatterns(this.getTestPatterns());
		let patterns     = [patternsSrc, patternsTest];

		search: for (let file of gitStatus.filter(onlyStaged ? (f => f.inIndex()) : (f => f.inIndex() || f.inWorkingTree()))) {
			let filePath = path.relative(directory, file.path());
			if (filePath.startsWith('../')) continue;

			for (let set of patterns) {
				for (let exclude of set.exclude) {
					if (exclude(filePath)) continue search;
				}

				for (let include of set.include) {
					if (include(filePath)) return true;
				}
			}
		}

		return false;
	}

	/**
	 * Gets an array of supported build tasks for this module.
	 * @returns {Promise<Task[]>}
	 */
	async getBuildTasks() {
		if (this._tasks !== null) return this._tasks;
		if (TASK_LIST === null) {
			TASK_LIST = (await fs.readdir(TASK_DIR))
				.filter(f => path.extname(f) === '.js')
				.filter(f => f.startsWith('Task'))
				.map(f => require(path.join(TASK_DIR, f)));
		}

		// Get supported task classes.
		let supported = await Promise.all(
			TASK_LIST.map(task => (typeof(task.isSupported) !== 'function') ? true : task.isSupported(this))
		);

		// Get task instances.
		if (this._tasks === null) {
			this._tasks = {};
			for (let [index, task] of Object.entries(TASK_LIST)) {
				if (!supported[index]) continue;

				let taskInstance = new task(this);
				this._tasks[taskInstance.id] = taskInstance;
			}
		}

		// Return task instances.
		return Object.values(this._tasks);
	}

	/**
	 * Gets an array of default build tasks for this module.
	 * @returns {Promise<Task[]>}
	 */
	async getDefaultTasks() {
		let tasks = await this.getBuildTasks();
		return (await Promise.all(tasks.map(task => [task, task.constructor.isDefault(this)])))
			.filter(([task, isDefault]) => isDefault)
			.map(([task]) => task);
	}

	/**
	 * Gets a build task for this module.
	 *
	 * @param task {String} The task name.
	 * @returns {Promise<Task>} The task instance.
	 *
	 * @throws {SCTError} When the task does not exist or is not supported.
	 */
	async getBuildTask(task) {
		await this.getBuildTasks(); // Ensure the _tasks cache exists.

		if (this._tasks[task] === undefined) throw new SCTError(`Task not found for module: ${task}`, {
			message: `'${this.getId()}:${task}' is not a build task.`
		});

		return this._tasks[task];
	}

	async _load() {
		if (this._config['@auto'] === true) {
			try {
				let tsconfig = JSON.parse(await fs.readFile(path.join(this.getDirectory(), 'tsconfig.json')));
				if (tsconfig.include) this._sources  = this._sources.concat(tsconfig.include);
				if (tsconfig.exclude) this._excludes = this._excludes.concat(tsconfig.include.map(x => `!${x}`));
				if (tsconfig.tests)   this._tests    = this._tests.concat(tsconfig.tests);
			} catch (ex) {
				if (ex instanceof SyntaxError) throw ex;
			}
		}
	}

	constructor(project, id, config) {
		this._project     = project;
		this._id          = id;
		this._description = config.description;
		this._meta        = config['@meta'] === true;
		this._config      = config;
		this._sources     = config.sources instanceof Array ? config.sources : [];
		this._tests       = config.tests instanceof Array ? config.tests : [];
		this._excludes    = config.exclude instanceof Array ? config.exclude.map(x => `!${x}`) : [];
		this._directory   = this._meta ? project.getDirectory() : path.join(project.getModuleDirectory(), id);
		this._tasks       = null;
	}

};
