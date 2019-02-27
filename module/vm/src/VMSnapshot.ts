//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import JsonType from '@chipotle/types/JsonType';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A JSON-compatible snapshot of the virtual machine state.
 * This can be used for savestates or debugging.
 */
interface VMSnapshot {
	/**
	 * The architecture identifier.
	 * If this does not match, the VM should throw a fatal error.
	 */
	__ARCH: string;

	/**
	 * A snapshot value.
	 */
	[key: string]: JsonType;
}

// ---------------------------------------------------------------------------------------------------------------------
export default VMSnapshot;
export {VMSnapshot};
