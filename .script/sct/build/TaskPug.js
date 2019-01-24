// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: TaskPug
// A gulp task generator to build HTML files from Pug templates.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const path = require('path');

// Modules.
const Task     = require('@sct').Task;

// Gulp.
const gulp_pug    = require('gulp-pug');
const gulp_rename = require('gulp-rename');

// ---------------------------------------------------------------------------------------------------------------------
// Constants:
// ---------------------------------------------------------------------------------------------------------------------

const PUG_FILTER = [
	'**/*.pug'
];

// ---------------------------------------------------------------------------------------------------------------------
// Generator:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Generates a Pug gulp task for a module.
 *
 * @param module    {Module} The module.
 * @param [options] {Object} The build options.
 */
module.exports = class TaskSass extends Task {

	get id() {
		return 'pug';
	}

	get description() {
		return 'Builds the module pages.'
	}

	/**
	 * @override
	 */
	_run(logger, options) {
		let target   = options.release ? 'release' : 'debug';
		let module  = this.module;
		let project = this.module.getProject();

		let out = module.getBuildDirectory('pages');

		// Stream.
		return this._gulpsrc(PUG_FILTER)
			// Compile Pug.
			.pipe(gulp_pug())

			// Save.
			.pipe(this._gulpstrip(this.module.getSourcePatterns(false)))
			.pipe(gulp_rename(file => file.dirname = path.join(out, file.dirname)))
			.pipe(this._gulpdest(options))
	}

};

