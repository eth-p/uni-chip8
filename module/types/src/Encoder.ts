//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------

/**
 * A static class for encoding things.
 */
namespace Encoder {
	/**
	 * Encodes a typed array to a string.
	 *
	 * @param array The array to encode.
	 *
	 * @returns The string.
	 */
	export function string(array: ArrayBuffer | Uint8Array): string {
		const ui8 = array instanceof Uint8Array ? array : new Uint8Array(array);

		let chunks = [];
		for (let i = 0; i < ui8.length; i += 64) {
			chunks.push(String.fromCharCode.apply(null, ui8.slice(i, Math.min(i + 64, ui8.length))));
		}

		return chunks.join('');
	}

	/**
	 * Encodes a string to base64.
	 *
	 * @param string The string to encode.
	 *
	 * @returns The base64 string.
	 */
	export function base64(string: string): string {
		return btoa(string);
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default Encoder;
export {Encoder};
