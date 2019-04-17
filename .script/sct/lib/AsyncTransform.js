// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <contact@eth-p.dev>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: AsyncTransform
// An abstract transform stream that operates with promises.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// Libraries.
const stream  = require('stream');

// ---------------------------------------------------------------------------------------------------------------------
// Class:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * An abstract transform stream that operates with promises.
 *
 * @type {AsyncTransform}
 * @abstract
 */
module.exports = class AsyncTransform extends stream.Transform {

	/**
	 * Creates a new async transform stream.
	 *
	 * @param [options]           {Object}   The stream options.
	 * @param [options.transform] {Function} The async transform function.
	 */
	constructor(options) {
		super(options);

		if (options && options.transform) this._transform = options.transform;
	}

	/**
	 * This is a wrapper around {@link _asyncTransform}.
	 *
	 * @override
	 * @private
	 */
	get _transform() {
		return (data, encoding, callback) => {
			this._asyncTransform(data, encoding).then(
				data => callback(null, data),
				error => callback(error, null)
			);
		};
	}

	/**
	 * Sets the transform function.
	 * This will actually set {@link _asyncTransform}.
	 *
	 * @param value The transform function.
	 * @private
	 */
	set _transform(value) {
		this._asyncTransform = value;
	}

	/**
	 * Called when a stream chunk should be transformed.
	 *
	 * @param data     {*}      The stream data.
	 * @param encoding {String} The stream encoding.
	 *
	 * @returns {Promise<*>}
	 * @protected
	 */
	async _asyncTransform(data, encoding) {
		throw new Error('Unimplemented _asyncTransform');
	}

};
