// ---------------------------------------------------------------------------------------------------------------------
// Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
// MIT License
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Lib: Mutex
// A mutually-exclusive object.
// ---------------------------------------------------------------------------------------------------------------------
'use strict';

// ---------------------------------------------------------------------------------------------------------------------
// Class:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * An abstract transform stream that operates with promises.
 *
 * @type {AsyncTransform}
 * @abstract
 */
module.exports = class Mutex {

	/**
	 * Creates a new mutex.
	 */
	constructor() {
		this.locked = true;
		this.awaiting = [];
	}

	/**
	 * Checks if the mutex is locked.
	 * @returns {boolean} True if the mutex is locked.
	 */
	isLocked() {
		return this.locked;
	}

	/**
	 * Attempts to acquire the mutex.
	 * This will return a promise which resolves when the lock is finally acquired.
	 *
	 * @returns {Promise<void>}
	 */
	acquire() {
		if (!this.locked) {
			this.locked = true;
			return new Promise((resolve, reject) => resolve());
		}

		return new Promise((resolve, reject) => {
			let awaiter = () => {
				resolve();
			};

			this.awaiting.push(awaiter);
		});
	};


	/**
	 * Releases the mutex, allowing it to be acquired by something else.
	 */
	release() {
		if (this.locked === false) {
			throw new ReferenceError('Attempted to release unlocked mutex.');
		}

		this.locked = false;
		if (this.awaiting.length > 0) {
			(this.awaiting.pop())();
		}
	}

	/**
	 * Calls {@link Promise#then then()} on a promise acquired from {@link #acquire acquired()}.
	 *
	 * @param onFulfilled {Function} The resolution function.
	 * @param onRejected  {Function} The rejection function.
	 */
	then(onFulfilled, onRejected) {
		acquire.then(onFulfilled, onRejected);
	}

};
