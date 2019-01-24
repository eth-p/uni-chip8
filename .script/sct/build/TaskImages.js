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
const Task = require('@sct').Task;

// Gulp.
const gulp_rename = require('gulp-rename');

// ---------------------------------------------------------------------------------------------------------------------
// Constants:
// ---------------------------------------------------------------------------------------------------------------------

const IMAGES_FILTER = [
	'**/*.png',
	'**/*.svg',
	'**/*.jpg',
	'**/*.jpeg',
	'**/*.webp'
];

// ---------------------------------------------------------------------------------------------------------------------
// Generator:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Generates an image copying gulp task for a module.
 *
 * @param module    {Module} The module.
 * @param [options] {Object} The build options.
 */
module.exports = class TaskImages extends Task {

	get id() {
		return 'images';
	}

	get description() {
		return 'Builds the module images.'
	}

	/**
	 * @override
	 */
	_run(logger, options) {
		let target   = options.release ? 'release' : 'debug';
		let module  = this.module;
		let project = this.module.getProject();

		let out = module.getBuildDirectory('images');

		// Stream.
		return this._gulpsrc(IMAGES_FILTER)
			.pipe(this._gulpstrip(this.module.getSourcePatterns(false)))
			.pipe(gulp_rename(file => file.dirname = path.join(out, file.dirname)))
			.pipe(this._gulpdest(options))
	}

};

