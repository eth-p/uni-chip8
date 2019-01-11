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
	 * @returns {string[]}
	 */
	getSourcePatterns() {
		return this._sources;
	}

	/**
	 * Gets a Finder for the source files.
	 * @returns {Finder}
	 */
	getSourceFiles() {
		return new Finder(this.getDirectory(), this.getSourcePatterns().concat(this._excludes, [
			'!**/node_modules',
			'!**/.git',
			'!**/.DS_Store',
			'!**/._*',
			'!**/.tmp',
			'!**/.idea'
		]));
	}

	/**
	 * Gets the patterns used to determine the test files.
	 * @returns {string[]}
	 */
	getTestPatterns() {
		return this._tests;
	}

	/**
	 * Gets a Finder for the test files.
	 * @returns {Finder}
	 */
	getTestFiles() {
		return new Finder(this.getDirectory(), this.getTestPatterns().concat(this._excludes, [
			'!**/node_modules',
			'!**/.git',
			'!**/.DS_Store',
			'!**/._*',
			'!**/.tmp',
			'!**/.idea'
		]));
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

	async _load() {
		if (this._config['@auto'] === true) {
			try {
				let tsconfig = JSON.parse(await fs.readFile(path.join(this.getDirectory(), 'tsconfig.json')));
				if (tsconfig.include) this._sources  = this._sources.concat(tsconfig.include);
				if (tsconfig.exclude) this._excludes = this._excludes.concat(tsconfig.include.map(x => `!${x}`));
				if (tsconfig.tests)   this._tests    = this._tests.concat(tsconfig.tests);
			} catch (ex) {
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
	}

};
