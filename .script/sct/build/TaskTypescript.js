// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: TaskTypescript
// A gulp task generator to build TypeScript files.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const path     = require('path');
const ts       = require('typescript');

// Modules.
const Task     = require('@sct').Task;

// Gulp.
const gulp_babel      = require('gulp-babel');
const gulp_filter     = require('gulp-filter');
const gulp_rename     = require('gulp-rename');
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
 * @param module    {Module} The module.
 * @param [options] {Object} The build options.
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
		let tsOutDir  = module.getBuildDirectory('scripts');
		let tsDeclDir = module.getBuildDirectory('types');

		// Babel options.
		let babelOptions = JSON.parse(JSON.stringify(Object.assign({}, options.compatibility ? BABEL_OPTS_COMPATIBILITY : BABEL_OPTS_MODERN)));
		if (babelOptions.plugins == null) babelOptions.plugins = [];
		if (babelOptions.presets == null) babelOptions.presets = [];

		if (options.minify) {
			babelOptions.presets.push(['minify', {
				builtIns: false
			}]);
		}

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
					if (!source.endsWith('.js')) source += '.js';
					let capture = /^@chipotle[/\\](.+)$/.exec(source);
					if (capture === null) return source;
					return `/scripts/${capture[1]}`;
				}
			}
		]);

		// Stream.
		return this._gulpsrc(TS_FILTER)

			// Compile TypeScript.
			.pipe(tsProject())
			.pipe(this._gulpstrip(tsSources.concat(tsSources.map( x => x.replace(/(.*)\.ts$/, '$1.js')))))

			// Rename.
			.pipe(gulp_rename(file => {
				file.dirname = path.join(`${file.basename.endsWith('.d') ? tsDeclDir : tsOutDir}`, file.dirname)
			}))

			// Transform JavaScript.
			.pipe(filterJavascript)
			.pipe(gulp_babel(babelOptions))
			.pipe(filterJavascript.restore)

			// Save.
			.pipe(this._gulpdest(options))
	}
	
};

