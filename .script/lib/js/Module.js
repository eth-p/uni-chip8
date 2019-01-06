// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const fs       = require('fs-extra');
const git      = require('nodegit');
const path     = require('path');

// Modules.
const Finder   = require('@/Finder');

// ---------------------------------------------------------------------------------------------------------------------

/**
 * A project module.
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

	constructor(project, id, config) {
		this._project     = project;
		this._id          = id;
		this._description = config.description;
		this._meta        = config.meta ? true : false;
		this._config      = config;
		this._sources     = config.sources instanceof Array ? config.sources : [];
		this._tests       = config.tests instanceof Array ? config.tests : [];
		this._excludes    = config.exclude instanceof Array ? config.exclude.map(x => `!${x}`) : [];
		this._directory   = this._meta ? project.getDirectory() : path.join(project.getDirectory(), 'module', id);
	}

}
