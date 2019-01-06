// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const findup   = require('find-up');
const fs       = require('fs-extra');
const git      = require('nodegit');
const minimist = require('minimist');
const path     = require('path');

// Modules.
const Module   = require('@/Module');

// ---------------------------------------------------------------------------------------------------------------------

/**
 * The project.
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
	 * Gets the project repository.
	 * @returns {Promise<git.Repository|null>}
	 */
	async getRepository() {
		if (this._repository !== undefined) return this._repository;

		try {
			let repo = path.join(this._directory, '.gits');
			await fs.stat(repo);
			this._repository = await git.Repository.open(repo);
		} catch (_) {
			this._repository = null;
		}

		return this._repository;
	}

	/**
	 * Gets a project module.
	 *
	 * @param id {string} The module ID.
	 * @returns {Module} The module.
	 * @throws Error When the module doesn't exist.
	 */
	getModule(id) {
		if (!(id in this._modules)) throw new Error(`Unknown module: ${id}`);
		return this._modules[id];
	}

	/**
	 * Gets an array of project modules.
	 * @returns {Module[]}
	 */
	getModules() {
		return Object.values(this._modules);
	}

	async _load() {
		this._repository = undefined;
		for (let [id, config] of Object.entries(this._config.modules)) {
			this._modules[id] = new Module(this, id, config);
		}
	}

	constructor(directory, config) {
		this._directory = directory;
		this._config    = config;
		this._modules   = {};
	}

	/**
	 * Gets the current project.
	 * @returns {Promise<Project>}
	 */
	static async get() {
		if (this._instance != null) {
			return this._instance;
		}

		// Load project.
		let dir     = path.dirname(await findup('project.json'));
		let config  = JSON.parse(await fs.readFile(path.join(dir, 'project.json'), 'utf-8'));
		let project = this._instance = new Project(dir, config);
		await project._load();
		return project;
	}

}
