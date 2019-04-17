// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <contact@eth-p.dev>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: TaskPug
// A gulp task generator to build HTML files from Pug templates.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const path = require('path');
const vinyl = require('vinyl');
const stream = require('stream');
const Transform = stream.Transform;

// Modules.
const Task = require('@sct').Task;

// Gulp.
const gulp_rename = require('gulp-rename');

// ---------------------------------------------------------------------------------------------------------------------
// Constants:
// ---------------------------------------------------------------------------------------------------------------------

const INFO_FILTER = [
	'**/*.json',
];

// ---------------------------------------------------------------------------------------------------------------------
// Generator:
// ---------------------------------------------------------------------------------------------------------------------

class RomDatabaseBuilder extends Transform {

	constructor() {
		super({objectMode: true});

		this.collection = [];
	}

	_transform(data, encoding, cb) {
		if (data.isNull()) return cb();

		this.collection.push(data);
		return cb();
	}

	_flush(cb) {
		let database = {};

		for (let program of this.collection) {
			if (program.isStream()) throw new Error('Does not support streams.');

			let data = JSON.parse(program.contents.toString('utf8'));
			let rom = path.basename(program.path, '.json');
			database[`${rom}.rom`] = data;
		}

		this.push(new vinyl({
			path: 'database.json',
			contents: Buffer.from(JSON.stringify(database))
		}));

		return cb();
	}

}

/**
 * Generates the database.json file for CHIP-8 programs.
 *
 * @param module    {Module} The module.
 * @param [options] {Object} The build options.
 */
module.exports = class TaskRoms extends Task {

	get id() {
		return 'rom-db';
	}

	get description() {
		return 'Builds the database.json file.'
	}

	/**
	 * @override
	 */
	_run(logger, options) {
		let module  = this.module;
		let project = this.module.getProject();

		let out = module.getBuildDirectory('images');

		// Stream.
		return this._gulpsrc(INFO_FILTER)
			.pipe(this._gulpstrip(this.module.getSourcePatterns(false)))
			.pipe(new RomDatabaseBuilder())
			.pipe(gulp_rename({dirname: 'assets/rom'}))
			.pipe(this._gulpdest(options))
	}

};

