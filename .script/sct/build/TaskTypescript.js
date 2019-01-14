// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: TaskTypescript
// A gulp task generator to build TypeScript files.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const mm       = require('micromatch');
const path     = require('path');
const ts       = require('typescript');

// Modules.
const Task     = require('@sct').Task;

// Gulp.
const gulp_babel      = require('gulp-babel');
const gulp_filter     = require('gulp-filter');
const gulp_if         = require('gulp-if');
const gulp_print      = require('gulp-print').default;
const gulp_rename     = require('gulp-rename');
const gulp_sourcemaps = require('gulp-sourcemaps');
const gulp_typescript = require('gulp-typescript');

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
		let target   = options.release ? 'release' : 'debug';
		let module  = this.module;
		let project = this.module.getProject();

		// Filters.
		let filterJavascript = gulp_filter('**/*.js', {restore: true});

		// TypeScript options.
		let tsProject = gulp_typescript.createProject(path.join(module.getDirectory(), 'tsconfig.json'), {
			typescript: ts,
			rootDir: project.getDirectory(),
			noEmit: false // DO NOT REMOVE THIS,
		});

		let tsSources = tsProject.config.include;
		let tsOutDir  = tsProject.config.compilerOptions.outDir;
		let tsDeclDir = tsProject.config.compilerOptions.declarationDir;

		// Babel options.
		let babelOptions = JSON.parse(JSON.stringify(options.compatibility ? BABEL_OPTS_COMPATIBILITY : BABEL_OPTS_MODERN));
		if (babelOptions.plugins == null) babelOptions.plugins = [];
		if (babelOptions.presets == null) babelOptions.presets = [];

		if (options.minify) babelOptions.presets.push(['minify']);

		if (!options['keep:asserts']) babelOptions.plugins.unshift("babel-plugin-unassert");
		if (!options['keep:comments']) {
			babelOptions.comments = false;
			babelOptions.shouldPrintComment = (val) => /^[!#]/.test(val);
		}

		switch (options.modules) {
			case 'es6':      break;
			case 'commonjs': babelOptions.plugins.push('@babel/plugin-transform-modules-commonjs'); break;
			case 'amd':      babelOptions.plugins.push('@babel/plugin-transform-modules-amd');      break;
		}

		// Babel options: path rewriting.
		babelOptions.plugins.push([
			'module-resolver', {
				root: path.join(project.getBuildDirectory(), tsOutDir),
				cwd:  path.join(project.getBuildDirectory(), tsOutDir),
				resolvePath: (source, current, opts) => {
					let capture = /^@chipotle[/\\](.+)$/.exec(source);
					if (capture === null) return source;
					return path.join('..', capture[1]);
				}
			}
		]);

		// Stream.
		return this._gulpsrc(TS_FILTER)

			// Compile TypeScript.
			.pipe(tsProject())
			.pipe(gulp_rename(file => {
				let joined = path.join(file.dirname, file.basename + file.extname);
				for (let pattern of tsSources) {
					if (mm.match(pattern, joined)) {
						let pfxIndex  = pattern.indexOf('*');
						let pfxString = pattern.substring(0, pfxIndex);

						if (pfxIndex === -1 || !pfxString.endsWith('/')) return;
						pfxString = pfxString.substring(0, pfxString.length - 1);

						if (!file.dirname.startsWith(pfxString)) return;
						file.dirname = file.dirname.substring(pfxString.length);
						return;
					}
				}
			}))

			// Rename.
			.pipe(gulp_rename(file => {
				file.dirname = `${file.basename.endsWith('.d') ? tsDeclDir : tsOutDir}/${module.getId()}`
			}))

			// Transform JavaScript.
			.pipe(filterJavascript)
			.pipe(gulp_babel(babelOptions))
			.pipe(filterJavascript.restore)

			// Save.
			.pipe(gulp_if(options.sourcemaps, gulp_sourcemaps.write('.')))
			.pipe(this._gulpdest())
			.pipe(gulp_if(options.verbose, gulp_print((f) => logger.file(f))))
	}

};

