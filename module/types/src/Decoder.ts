//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------

/**
 * A static class for decoding things.
 */
namespace Decoder {
	/**
	 * Decodes a string into a typed array.
	 *
	 * @param string The string to decode.
	 *
	 * @returns The decoded array buffer.
	 */
	export function string(string: string): ArrayBuffer {
		const length = string.length;
		const buffer = new Uint8Array(length);

		for (let i = 0; i < length; i++) {
			buffer[i] = string.charCodeAt(i);
		}

		return buffer;
	}

	/**
	 * Decodes a string from base64.
	 *
	 * @param string The string to decode.
	 *
	 * @returns The raw string.
	 */
	export function base64(string: string): string {
		return atob(string);
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default Decoder;
export {Decoder};
