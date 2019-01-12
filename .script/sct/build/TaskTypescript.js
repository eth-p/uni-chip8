// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: TaskTypescript
// A gulp task generator to build TypeScript files.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const fs       = require('fs-extra');
const path     = require('path');

// Modules.
const Task     = require('@sct').Task;

// Gulp.
const gulp            = require('gulp');
const gulp_print      = require('gulp-print').default;
const gulp_typescript = require('gulp-typescript');
const gulp_if         = require('gulp-if');

// Transformers.
const ts_transformer_unassert = require('ts-transformer-unassert');

// ---------------------------------------------------------------------------------------------------------------------
// Constants:
// ---------------------------------------------------------------------------------------------------------------------

const TS_FILTER = [
	'**/*.{ts,tsx}'
];

// ---------------------------------------------------------------------------------------------------------------------
// Generator:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Generates a TypeScript gulp task for a module.
 *
 * @param module    {BuildModule} The build module.
 * @param [options] {Object}      The build options.
 */
module.exports = class TaskTypescript extends Task {

	get id() {
		return 'typescript';
	}

	get description() {
		return 'Builds the module source code.'
	}

	/**
	 * @override
	 */
	_run(logger, options) {
		let {asserts, verbose} = Object.assign({asserts: true, verbose: false}, options);
		let target             = options.release ? 'release' : 'debug';

		return this._gulpsrc(TS_FILTER)
			.pipe(gulp_if(options.verbose === true, gulp_print((f) => logger.file(f))));
	}

};

