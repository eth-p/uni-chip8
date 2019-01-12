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
const ts       = require('typescript');

// Modules.
const Task     = require('@sct').Task;

// Gulp.
const gulp            = require('gulp');
const gulp_babel      = require('gulp-babel');
const gulp_filter     = require('gulp-filter');
const gulp_if         = require('gulp-if');
const gulp_print      = require('gulp-print').default;
const gulp_rename     = require('gulp-rename');
const gulp_sourcemaps = require('gulp-sourcemaps');
const gulp_typescript = require('gulp-typescript');

// Transformers.
const ts_transformer_import_rewrite = require('ts-transform-import-path-rewrite');

// ---------------------------------------------------------------------------------------------------------------------
// Constants:
// ---------------------------------------------------------------------------------------------------------------------

const BABEL_OPTS_COMPATIBILITY = require('./babel-compat');
const BABEL_OPTS_MODERN        = require('./babel-modern');

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
		let target   = options.release === true ? 'release' : 'debug';
		let project = this.module.getProject();

		// Filters.
		let filterJavascript = gulp_filter('**/*.js', {restore: true});

		// TypeScript options.
		let tsImportTransformOpts = {
			projectBaseDir: this.module.getDirectory(),
			rewrite: (importPath, sourcePath) => {
				return importPath.replace('@chipotle', '..');
			}
		};

		let tsProject = gulp_typescript.createProject(path.join(this.module.getDirectory(), 'tsconfig.json'), {
			getCustomTransformers: program => {
				let transforms = {
					before:            [],
					after:             [],
					afterDeclarations: []
				};

				if (options.rewrites !== false) {
					transforms.after.push(ts_transformer_import_rewrite.transformAmd(tsImportTransformOpts));
					transforms.afterDeclarations.push(ts_transformer_import_rewrite.transformAmd(tsImportTransformOpts));
				}

				return transforms;
			},

			typescript: ts,
			rootDir: project.getDirectory(),
			noEmit: false // DO NOT REMOVE THIS
		});

		// Babel options.
		let babelOptions = JSON.parse(JSON.stringify(options.compatibility === true ? BABEL_OPTS_COMPATIBILITY : BABEL_OPTS_MODERN));
		if (babelOptions.plugins == null) babelOptions.plugins = [];

		if (options.asserts === false) {
			babelOptions.plugins.unshift("babel-plugin-unassert");
		}

		// Stream.
		return this._gulpsrc(TS_FILTER)

			.pipe(tsProject())
			.pipe(filterJavascript)
			.pipe(gulp_babel(babelOptions))
			.pipe(filterJavascript.restore)
			.pipe(gulp_rename(file => {file.dirname = `${file.basename.endsWith('.d') ? 'dev' : 'script'}/${this.module.getId()}`}))
			.pipe(gulp_if(options.sourcemaps === true, gulp_sourcemaps.write('.')))
			.pipe(this._gulpdest())
			.pipe(gulp_if(options.verbose === true, gulp_print((f) => logger.file(f))))
	}

};

