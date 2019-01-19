// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: TaskTypescript
// A gulp task generator to build TypeScript files.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const del      = require('del');
const path     = require('path');

// Modules.
const SCT      = require('@sct');
const Task     = require('@sct').Task;

// ---------------------------------------------------------------------------------------------------------------------
// Generator:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Generates a TypeScript gulp task for a module.
 *
 * @param module    {BuildModule} The build module.
 * @param [options] {Object}      The build options.
 */
module.exports = class TaskClean extends Task {

	get id() {
		return 'clean';
	}

	get description() {
		return 'Cleans the build files.'
	}

	get priority() {
		return 200;
	}

	static isSupported(module) {
		return module.getId() === 'repo';
	}

	static isDefault(module) {
		return false;
	}

	/**
	 * @override
	 */
	async _run(logger, options) {
		let project = await SCT.getProject();
		let projDir = project.getDirectory();
		let deleted = await del(path.join(project.getBuildDirectory(), '**'));

		if (options.verbose) {
			for (let file of deleted) {
				logger.file(`Deleted: ${path.relative(projDir, file)}`);
			}
		}
	}
	
};

