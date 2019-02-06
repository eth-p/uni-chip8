#!/usr/bin/env node
// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: FileFormatter
// A class to format source code files.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const fs           = require('fs-extra');
const path         = require('path');
const prettier     = require('prettier');
const pugbeautify  = require('pug-beautify');

// Modules.
const SCT          = require('./SCT');
const SCTError     = require('./SCTError');

// ---------------------------------------------------------------------------------------------------------------------
// Class:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A class to format source code files.
 * @type {FileFormatter}
 */
module.exports = class FileFormatter {

	/**
	 * Creates a new formatter.
	 *
	 * @param [options]             {Object} The formatter options.
	 * @param [options.directory]   {String} The configuration lookup directory.
	 * @param [options.prettier]    {Object} Options for the `prettier` formatter.
	 * @param [options.pugbeautify] {Object} Options for the `pug-beautify` formatter.
	 */
	constructor(options) {
		let directory          = options && options.directory ? options.directory : process.cwd();
		this._opts_prettier    = prettier.resolveConfig.sync(directory);
		this._opts_pugbeautify = {fill_tab: true, omit_div: true, tab_size: 2};

		if (options != null) {
			if (options.prettier != null)    Object.assign(this._opts_prettier, options.prettier);
			if (options.pugbeautify != null) Object.assign(this._opts_pugbeautify, options.pugbeautify);
		}
	}

	/**
	 * Checks to see if a file is correctly formatted.
	 *
	 * @param file {String} The file to check.
	 *
	 * @returns {Promise<Boolean>} True if the file is correctly formatted.
	 */
	async check(file) {
		let ext  = path.extname(file);
		let data = await fs.readFile(file, 'utf-8');

		switch (ext) {
			case '.js':
			case '.jsx':
			case '.ts':
			case '.tsx':
			case '.css':
			case '.less':
			case '.scss':
			case '.html':
			case '.json':
			case '.yml':
			case '.yaml':
			case '.md':
			case '.markdown': {
				let info = await prettier.getFileInfo(file);
				return prettier.check(data, Object.assign({}, this._opts_prettier, {parser: info.inferredParser}));
			}

			case '.pug':
			case '.jade':
				return pugbeautify(data, this._opts_pugbeautify) === data;

			default:
				return true;
		}
	}

	/**
	 * Formats source code in a file.
	 * This will NOT replace the file.
	 *
	 * @param file {String} The file.
	 *
	 * @returns {Promise<{before: String, after: String}|null>} The formatted source code.
	 */
	async format(file) {
		let ext  = path.extname(file);
		let data = await fs.readFile(file, 'utf-8');

		switch (ext) {
			case '.js':
			case '.jsx':
			case '.ts':
			case '.tsx':
			case '.css':
			case '.less':
			case '.scss':
			case '.html':
			case '.json':
			case '.yml':
			case '.yaml':
			case '.md':
			case '.markdown': {
				let info = await prettier.getFileInfo(file);
				return {
					file: file,
					before: data,
					after: prettier.format(data, Object.assign({}, this._opts_prettier, {parser: info.inferredParser}))
				};
			}

			case '.pug':
			case '.jade':
				return {
					file: file,
					before: data,
					after: pugbeautify(data, this._opts_pugbeautify)
				};

			default:
				return null;
		}
	}

};
