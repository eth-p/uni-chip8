// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: FinderFilter
// An abstract transform stream that filters the stream returned by a Finder.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Modules.
const AsyncTransform = require('./AsyncTransform');

// ---------------------------------------------------------------------------------------------------------------------
// Class:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * An abstract transform stream that filters the stream returned by a Finder.
 *
 * @type {FinderFilter}
 * @abstract
 */
module.exports = class FinderFilter extends AsyncTransform {

	/**
	 * Creates a new finder filter.
	 *
	 * @param [options]        {Object}   The stream options.
	 * @param [options.filter] {Function} The filter function.
	 */
	constructor(options) {
		super(Object.assign({objectMode: true}, options));

		if (options && options.filter) this._filter = options.filter;
	}

	/**
	 * @returns {Promise<FinderResult|null>}
	 * @override
	 */
	async _asyncTransform(data, encoding) {
		if (data == null) return data;
		return (await this._filter(data, encoding)) ? data : null;
	}

	/**
	 * Called to determine if a file should be kept.
	 *
	 * @param data     {FinderResult} The finder result.
	 * @param encoding {String}       UNUSED.
	 *
	 * @returns {Promise<Boolean>}
	 * @protected
	 * @abstract
	 */
	async _filter(data, encoding) {
		throw new Error('Unimplemented _filter');
	}

};
