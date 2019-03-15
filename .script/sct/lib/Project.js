// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: Project
// The project.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const fs       = require('fs-extra');
const path     = require('path');
const git      = require('nodegit');

// Modules.
const Module   = require('./Module');
const SCTError = require('./SCTError');

// ---------------------------------------------------------------------------------------------------------------------

/**
 * The project.
 * @type {Project}
 */
module.exports = class Project {

	/**
	 * Gets the project directory.
	 * @returns {string}
	 */
	getDirectory() {
		return this._directory;
	}

	/**
	 * Gets the build output directory.
	 * @returns {string}
	 */
	getBuildDirectory() {
		return path.join(this._directory, 'out');
	}

	/**
	 * Gets the temp data directory.
	 * @returns {string}
	 */
	getTempDirectory() {
		return path.join(this._directory, 'temp');
	}

	/**
	 * Gets the module directory.
	 * @returns {string}
	 */
	getModuleDirectory() {
		return path.join(this._directory, 'module');
	}

	/**
	 * Gets the project repository.
	 * @returns {Promise<nodegit.Repository|null>}
	 */
	async getRepository() {
		if (this._repository !== undefined) return this._repository;

		try {
			let repo = path.join(this._directory, '.git');
			await fs.stat(repo);
			this._repository = await git.Repository.open(repo);
		} catch (ex) {
			this._repository = null;
		}

		return this._repository;
	}

	/**
	 * Gets a project module.
	 *
	 * @param id {string} The module ID.
	 * @returns {Module} The module.
	 * @throws {SCTError} When the module doesn't exist.
	 */
	getModule(id) {
		if (!(id in this._modules)) {
			throw new SCTError(`Unknown project module: ${id}`, {
				message: `unknown module -- '${id}'`
			});
		}
		return this._modules[id];
	}

	/**
	 * Gets an array of project modules.
	 * @returns {Module[]}
	 */
	getModules() {
		return Object.values(this._modules);
	}

	/**
	 * Gets the version string of the project.
	 * @returns {string} The version, or unknown.
	 */
	getVersion() {
		return this._config.version || 'Unknown';
	}

	/**
	 * Gets the current branch of the project.
	 * @returns {string} The friendly branch name, or unknown.
	 */
	async getBranch() {
		if (process.env['BRANCH'] != null) return process.env['BRANCH'];

		let repo = await this.getRepository();
		if (repo == null) return 'Unknown';

		let branch = await repo.getCurrentBranch();
		return branch.shorthand();
	}

	async _load() {
		let waits = [];

		this._repository = undefined;
		for (let [id, config] of Object.entries(this._config.modules)) {
			this._modules[id] = new Module(this, id, config);
			waits.push(this._modules[id]._load());
		}

		await Promise.all(waits);
	}

	/**
	 * Creates a new project.
	 *
	 * @param directory {string} The project directory.
	 * @param config    {object} The project configuration.
	 */
	constructor(directory, config) {
		this._directory = directory;
		this._config    = config;
		this._modules   = {};
	}

};
