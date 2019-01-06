// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

const fs     = require('fs-extra');
const mm     = require('micromatch');
const stream = require('stream');

// ---------------------------------------------------------------------------------------------------------------------

const OPTIONS = {
	matcher: {
		dot: true,
		basename: true,
		unixify: true
	}
}

// ---------------------------------------------------------------------------------------------------------------------

/**
 * A class to search for files based on glob-like patterns.
 */
module.exports = class Finder {

	/**
	 * Starts the search.
	 */
	start() {
		this._search();
	}

	/**
	 * Stops the search.
	 */
	stop() {
		this._running = false;
	}

	/**
	 * Checks if the search is running.
	 * @returns {boolean}
	 */
	isSearching() {
		return this._running;
	}

	/**
	 * Checks if the search is finished.
	 * @returns {boolean}
	 */
	isFinished() {
		return this._finished;
	}

	/**
	 * Gets a promise for an array of all the matching files.
	 *
	 * @returns {Promise<string[]>}
	 * @throws {Error} When the finder has already been started.
	 */
	array() {
		if (this._running) throw new Error('Finder is already started.');

		let p = new Promise((resolve, reject) => {
			let files = [];

			this.stream.on('data', (file) => files.push(file));
			this.stream.on('error', (err) => reject(err));
			this.stream.on('end', () => resolve(files));
		});

		this.start();
		return p;
	}

	/**
	 * Gets a promise for the completion of the finder.
	 * @returns {Promise<void>}
	 */
	promise() {
		return new Promise((resolve, reject) => {
			this.stream.on('end', resolve);
			this.stream.on('error', reject);
		})
	}

	/**
	 * A shortcut for `.stream.on()`.
	 *
	 * @param event    {string}   The event.
	 * @param callback {function} The callback function.
	 */
	on(event, callback) {
		return this.stream.on(event, callback);
	}

	/**
	 * Searches for files using the static {#recurse} search method.
	 *
	 * @returns {Promise<void>}
	 * @private
	 */
	async _search() {
		this._running  = true;
		this._finished = false;

		await this.constructor.recurse(this._directory, this._patterns, this._options, (data) => {
			// Data.
			this.stream.push(data);
		}, (err) => {
			// Errored.
			this.stream.destroy(err);
		}, '', 0);

		this._running  = false;
		this._finished = true;
		this.stream.end();
	}

	/**
	 * Create a new finder.
	 *
	 * @param directory {string}   The directory to search.
	 * @param patterns  {string[]} The matching patterns.
	 * @param options   {object}   The options.
	 */
	constructor(directory, patterns, options) {
		let mmopts = (options != null && options.matcher != null) ? options.matcher : OPTIONS.matcher;

		this._running   = false;
		this._finished  = false;
		this._directory = directory;

		this._patterns  = {
			include: patterns
				.filter(p => !p.startsWith('!'))
				.map(p => mm.matcher(p, mmopts)),

			exclude: patterns
				.filter(p => p.startsWith('!'))
				.map(p => p.substring(1))
				.map(p => mm.matcher(p, mmopts))
		};

		this._options = Object.assign({
			directories: false
		}, (options == null ? {} : options));

		this.stream = new stream.Transform({objectMode: true});
	}

	static async recurse(directory, patterns, options, onData, onError, _parent) {
		try {
			let waiting = [];

			search: for (let entry of await fs.readdir(`${directory}/${_parent}`)) {
				let file  = `${_parent}${entry}`;
				let rfile = `${directory}/${file}`;

				// Check if it's excluded.
				for (let isExcluded of patterns.exclude) {
					if (isExcluded(file)) {
						continue search;
					}
				}

				// It's a directory.
				let stat = await fs.stat(rfile);
				if (stat.isDirectory()) {
					waiting.push(Finder.recurse(directory, patterns, options, onData, onError, `${file}/`));
					continue search;
				}

				// Check if it matches a pattern.
				let include = false;
				for (let isIncluded of patterns.include) {
					if (isIncluded(file)) {
						include = true;
						break;
					}
				}

				if (!include) {
					continue search;
				}

				// Add it.
				if (!stat.isDirectory() || options.directories) {
					onData(file);
				}

				continue search;
			}

			await Promise.all(waiting);
		} catch (ex) {
			onError(ex);
		}
	}


}
