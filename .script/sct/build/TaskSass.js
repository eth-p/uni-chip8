// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: TaskSass
// A gulp task generator to build CSS styles from Sass/SCSS files.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const path = require('path');

// Modules.
const Task     = require('@sct').Task;

// Gulp.
const gulp_rename = require('gulp-rename');
const gulp_sass   = require('gulp-sass');

// ---------------------------------------------------------------------------------------------------------------------
// Constants:
// ---------------------------------------------------------------------------------------------------------------------

const SASS_FILTER = [
	'**/*.{sass,scss}'
];

// ---------------------------------------------------------------------------------------------------------------------
// Generator:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Generates a Sass/SCSS gulp task for a module.
 *
 * @param module    {Module} The module.
 * @param [options] {Object} The build options.
 */
module.exports = class TaskSass extends Task {

	get id() {
		return 'sass';
	}

	get description() {
		return 'Builds the module styles.'
	}

	/**
	 * @override
	 */
	_run(logger, options) {
		let target   = options.release ? 'release' : 'debug';
		let module  = this.module;
		let project = this.module.getProject();

		let out = module.getBuildDirectory('styles');

		// Stream.
		return this._gulpsrc(SASS_FILTER)
			// Compile SCSS.
			.pipe(gulp_sass({outputStyle: options.minify ? 'compressed' : 'expanded'}))

			// Save.
			.pipe(this._gulpstrip(this.module.getSourcePatterns(false)))
			.pipe(gulp_rename(file => file.dirname = path.join(out, file.dirname)))
			.pipe(this._gulpdest(options))
	}

};

