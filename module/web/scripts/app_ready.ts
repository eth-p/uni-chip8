//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
// Variables:
let ready = false;
let listeners: (() => void)[] = [];

// ---------------------------------------------------------------------------------------------------------------------

/**
 * Returns a promise that resolves when the application is loaded.
 * @returns The promise.
 */
async function app_ready(): Promise<void>;

/**
 * Calls a callback when the application is loaded.
 * @param callback The callback.
 */
function app_ready(callback: () => void): void;

function app_ready(callback?: () => void): void | Promise<void> {
	if (ready) {
		if (callback) {
			return callback();
		} else {
			return new Promise(resolve => resolve());
		}
	}

	if (callback) {
		listeners.push(() => callback());
	} else {
		return new Promise((resolve, reject) => {
			listeners.push(resolve);
		});
	}
}

/**
 * Marks the application as done.
 */
app_ready.done = function() {
	if (ready) throw new Error('Application already ready!');
	ready = true;

	// Call listeners.
	for (let listener of listeners) {
		listener();
	}

	// Remove the loading screen.
	let loader = document.querySelector('#loading-screen');
	if (loader != null) {
		loader.classList.add('hide');
		setTimeout(() => loader!.parentNode!.removeChild(loader!), 1000);
	}
};

// ---------------------------------------------------------------------------------------------------------------------
export default app_ready;
export {app_ready};
