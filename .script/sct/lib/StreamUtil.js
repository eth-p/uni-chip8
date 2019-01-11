// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: StreamUtil
// A static class for common stream functions.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// ---------------------------------------------------------------------------------------------------------------------
// Class:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A static class for common stream functions.
 * @type {StreamUtil}
 */
module.exports = class StreamUtil {

	/**
	 * Returns a promise that resolves when a stream ends or errors.
	 *
	 * @param stream {Stream} The stream.
	 * @returns {Promise<void>} The promise.
	 */
	static ending(stream) {
		return new Promise((resolve, reject) => {
			stream.on('error', reject);
			stream.on('finish', resolve);
		});
	}

	/**
	 * Chains multiple streams together.
	 * Errors will propagate downwards.
	 *
	 * @param streams {Stream[]} The streams to chain.
	 * @returns {Stream} The final stream in the chain.
	 */
	static chain(streams) {
		let stream = streams[0];
		let last   = null;

		for (let i = 1; i < streams.length; i++) {
			last   = stream;
			stream = streams[i];

			last.on('error', (...args) => {
				stream.destroy(...args);
			});

			last.pipe(stream);
		}

		return stream;
	}

};

