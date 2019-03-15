//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------------------------------------
// Savestate:
// ---------------------------------------------------------------------------------------------------------------------

import VMSnapshot from '@chipotle/vm/VMSnapshot';

/**
 * A frontend representation of a savestate.
 */
interface Savestate {
	/**
	 * The savestate screenshot.
	 */
	screenshot: string;

	/**
	 * The savestate VM snapshot.
	 */
	snapshot: VMSnapshot;

	/**
	 * The savestate date.
	 */
	date: string;

	/**
	 * Whether or not the saveset is unset.
	 * Hint: It shouldn't be.
	 */
	unset: false;
}

// ---------------------------------------------------------------------------------------------------------------------
export default Savestate;
export {Savestate};
