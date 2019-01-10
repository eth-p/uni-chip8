#!/usr/bin/env node
// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: FileFormatter
// A class to check source code files against the project guidelines.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const badwords     = require('bad-words');
const fs           = require('fs-extra');
const path         = require('path');

// Modules.
const FileFormatter = require('./FileFormatter');

// ---------------------------------------------------------------------------------------------------------------------
// Class:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A class to check source code files against the project guidelines.
 * @type {FileChecker}
 */
module.exports = class FileChecker {

	/**
	 * Creates a new checker.
	 *
	 * @param [options]           {Object}        The checker options.
	 * @param [options.formatter] {FileFormatter} The formatter instance to use.
	 * @param [options.badwords]  {*}             The badwords instance to use.
	 */
	constructor(options) {
		this._formatter   = (options && options.formatter) ? options.formatter : new FileFormatter();
		this._badwords    = (options && options.badwords)  ? options.badwords  : new badwords();
		this._BUFFER_SIZE = 128;
	}

	/**
	 * Checks to see if a file is correctly formatted.
	 *
	 * @param file {String} The file to check.
	 *
	 * @returns {Promise<Boolean>} True if the file is correctly formatted.
	 */
	async checkFormatting(file) {
		return await this._formatter.check(file);
	}

	/**
	 * Checks to see if a file contains profanity.
	 *
	 * @param file {String} The file to check.
	 *
	 * @returns {Promise<Boolean>} True if the file has no profanity.
	 */
	checkProfanity(file) {
		return new Promise((resolve, reject) => {
			let stream = fs.createReadStream(file, {encoding: 'utf-8'});
			let cache = '';

			stream.on('data', (chunk) => {
				if (this._badwords.isProfane(cache + chunk)) {
					stream.close();
					return resolve(false);
				}

				cache = chunk.substring(cache.length - this._BUFFER_SIZE);
			});

			stream.on('end', () => resolve(true));
			stream.on('error', (err) => reject(err));
		});
	}

};
