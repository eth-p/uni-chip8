//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------

/**
 * Returns a promise that resolves when it's safe to interact with the DOM.
 * @returns The promise.
 */
async function DOMReady(): Promise<void>;

/**
 * Calls a callback when it's safe to interact with the DOM.
 * @param callback The callback.
 */
function DOMReady(callback: () => void): void;

function DOMReady(callback?: () => void): void | Promise<void> {
	switch (<any>document.readyState) {
		case 'complete':
		case 'loaded':
		case 'interactive':
			if (callback) {
				return callback();
			} else {
				return new Promise(resolve => resolve());
			}

		default:
			break;
	}

	if (callback) {
		window.addEventListener('DOMContentLoaded', () => callback());
	} else {
		return new Promise((resolve, reject) => {
			window.addEventListener('DOMContentLoaded', () => resolve());
		});
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default DOMReady;
export {DOMReady};
