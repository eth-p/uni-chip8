#!/usr/bin/env node
// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <contact@eth-p.dev>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: FileFormatter
// A class to check source code files against the project guidelines.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const badwords     = require('bad-words');
const findup       = require('find-up');
const fs           = require('fs-extra');
const path         = require('path');
const tslint       = require('tslint');

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
	 * @param [options]                  {Object}        The checker options.
	 * @param [options.formatter]        {FileFormatter} The formatter instance to use.
	 * @param [options.badwords]         {*}             The badwords instance to use.
	 * @param [options.tslintOptions]    {?}             The tslint config to use.
	 * @param [options.tslintTypescript] {ts.Program}    An instance of ts.Program to use for linting.
	 */
	constructor(options) {
		if (options && options.badwords)         this._badwords          = options.badwords;
		if (options && options.formatter)        this._formatter        = options.formatter;
		if (options && options.tslintConfig)     this._tslintConfig     = options.tslintConfig;
		if (options && options.tslintTypescript) this._tslintTypescript = options.tslintTypescript;
		this.failures     = 0;
		this._BUFFER_SIZE = 128;
	}

	/**
	 * Checks to see if a file is correctly formatted.
	 *
	 * @param file {String} The file to check.
	 *
	 * @returns {Promise<{status:boolean,details:string}>} True if the file is correctly formatted.
	 */
	async checkFormatting(file) {
		this._initFormattingChecker();
		let result = await this._formatter.check(file);
		if (!result) this.failures++;
		return {
			status: result,
			details: null
		};
	}

	/**
	 * Checks to see if a file passes the linter.
	 *
	 * @param file {String} The file to check.
	 *
	 * @returns {Promise<{status:boolean,details:string}>} True if the file is correctly formatted.
	 */
	async checkLint(file) {
		switch (path.extname(file).toLowerCase()) {
			case '.ts':
			case '.js':
				break;

			default:
				return {
					status: true,
					ignored: true,
					details: []
				};
		}

		this._initLintChecker();

		let linter = new tslint.Linter({fix: false});
		let source = await fs.readFile(file, 'utf8');

		linter.lint(file, source, this._tslintConfig);
		let result = linter.getResult();

		// It passed!
		if (result.errorCount === 0 && result.warningCount === 0) {
			return {
				status: true,
				details: null
			};
		}

		// It failed.
		this.failures++;

		// Format result.
		let check = {
			status: false,
			details: []
		};

		for (let failure of result.failures) {
			check.details.push({
				line:      failure.startPosition.lineAndCharacter.line,
				character: failure.startPosition.lineAndCharacter.character,
				message:   failure.failure
			});
		}

		return check;
	}

	/**
	 * Checks to see if a file contains profanity.
	 *
	 * @param file {String} The file to check.
	 *
	 * @returns {Promise<{status:boolean,details:string}>} True if the file has no profanity.
	 */
	async checkProfanity(file) {
		this._initProfanityChecker();
		return new Promise((resolve, reject) => {
			let stream = fs.createReadStream(file, {encoding: 'utf-8'});
			let cache = '';

			stream.on('data', (chunk) => {
				if (this._badwords.isProfane(cache + chunk)) {
					stream.close();
					this.failures++;
					return resolve({status: false, details: null});
				}

				cache = chunk.substring(cache.length - this._BUFFER_SIZE);
			});

			stream.on('end', () => resolve({status: true, details: null}));
			stream.on('error', (err) => reject(err));
		});
	}

	_initFormattingChecker() {
		if (this._formatter != null) return;

		if (this._initFormattingChecker_HOOK != null) {
			this._initFormattingChecker_HOOK();
			if (this._formatter != null) return;
		}

		this._formatter = new FileFormatter();
	}

	_initProfanityChecker() {
		if (this._badwords != null) return;

		if (this._initProfanityChecker_HOOK != null) {
			this._initProfanityChecker_HOOK();
			if (this._badwords != null) return;
		}

		this._badwords = new badwords();
	}

	_initLintChecker() {
		if (this._tslintConfig != null) return;

		if (this._initProfanityChecker_HOOK != null) {
			this._initProfanityChecker_HOOK();
			if (this._tslintConfig != null) return;
		}

		let configFile = findup.sync('tslint.json', {cwd: __dirname});
		this._tslintConfig = tslint.Configuration.loadConfigurationFromPath(configFile);
	}

};
