// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: SCT
// The standard library used for the SCT tool.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const findup = require('find-up');
const fs     = require('fs-extra');
const path   = require('path');

// Modules.
const SCTError = require('./SCTError');

// ---------------------------------------------------------------------------------------------------------------------
// Class:
// ---------------------------------------------------------------------------------------------------------------------

let project  = null;
let commands = [];

/**
 * The standard library used for the SCT tool.
 * @type {SCT}
 */
module.exports = class SCT {

	/**
	 * Get the current project.
	 * @returns {Project}
	 */
	static async getProject() {
		if (project !== null) return project;

		let dir     = path.dirname(await findup('project.json', {cwd: __dirname}));
		let config  = JSON.parse(await fs.readFile(path.join(dir, 'project.json'), 'utf-8'));
		project = new this.Project(dir, config);
		await project._load();
		return project;
	}

	/**
	 * Get the directory to the SCT folder.
	 * @returns {String}
	 */
	static getDirectory() {
		return path.dirname(__dirname);
	}

	/**
	 * Gets a subcommand class.
	 *
	 * @param command {String} The command.
	 * @returns {Promise<Command>}
	 */
	static async getCommand(command) {
		// Validate subcommand name.
		if (!/^[a-z0-9@]+$/.test(command)) {
			throw new SCTError(`Unknown subcommand: ${command}`, {
				message: `'${command}' is not a sct command.`
			});
		}

		// Use cached copy.
		let commandClass = commands[command];
		if (commandClass != null) return commandClass;

		// Check if it exists.
		let commandPath = path.join(SCT.getDirectory(), 'cmd', `sct-${command}.js`);
		if (!await fs.pathExists(commandPath)) {
			throw new SCTError(`Unknown subcommand: ${command}`, {
				message: `'${command}' is not a sct command.`
			});
		}

		// Use require'd copy.
		commandClass = require(commandPath);
		if (Object.getPrototypeOf(commandClass) !== this.Command) {
			throw new SCTError(`Unknown subcommand: ${command}`, {
				message: `'${command}' is not a sct command.`
			});
		}

		// Return.
		commands[command] = commandClass;
		return commandClass;
	}

};

// ---------------------------------------------------------------------------------------------------------------------
// Exports:
// ---------------------------------------------------------------------------------------------------------------------

Object.defineProperties(module.exports, {

	AsyncTransform: {
		enumerable: true,
		get: () => require('./AsyncTransform')
	},

	Child: {
		enumerable: true,
		get: () => require('./Child')
	},

	Command: {
		enumerable: true,
		get: () => require('./Command')
	},

	CommandUtil: {
		enumerable: true,
		get: () => require('./CommandUtil')
	},

	CommandError: {
		enumerable: true,
		get: () => require('./CommandError')
	},

	GitUtil: {
		enumerable: true,
		get: () => require('./GitUtil')
	},

	Project: {
		enumerable: true,
		get: () => require('./Project')
	},

	Finder: {
		enumerable: true,
		get: () => require('./Finder')
	},

	FinderFilter: {
		enumerable: true,
		get: () => require('./FinderFilter')
	},

	FinderFilterGit: {
		enumerable: true,
		get: () => require('./FinderFilterGit')
	},

	FinderFilterGitModified: {
		enumerable: true,
		get: () => require('./FinderFilterGitModified')
	},

	FileChecker: {
		enumerable: true,
		get: () => require('./FileChecker')
	},

	FileFormatter: {
		enumerable: true,
		get: () => require('./FileFormatter')
	},

	SCTError: {
		enumerable: true,
		value: SCTError
	},

	StreamUtil: {
		enumerable: true,
		get: () => require('./StreamUtil')
	}

});
