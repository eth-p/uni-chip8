//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------

const INJECT_STYLESHEET = [
	'var link = document.createElement("link");',
	'link.setAttribute("rel", "stylesheet");',
	'link.setAttribute("href", "/<$>");',
	'document.head.appendChild(link);'
];

// ---------------------------------------------------------------------------------------------------------------------

/**
 * A class for injecting things into pages.
 */
class Injector {
	public static stylesheet(path: string): string {
		return INJECT_STYLESHEET.join('').replace('<$>', escape(path));
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default Injector;
export {Injector};
