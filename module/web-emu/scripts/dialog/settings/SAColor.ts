//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import SettingAdapter from './SettingAdapter';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * Color settings field adapter.
 */
class SAColor extends SettingAdapter {
	// -------------------------------------------------------------------------------------------------------------
	// | Implementation:                                                                                           |
	// -------------------------------------------------------------------------------------------------------------

	public store(element: HTMLInputElement, name: string): void {
		this.settings.set(name, this.canonicalize(element.value));
	}

	public fetch(element: HTMLInputElement, name: string): void {
		element.value = this.settings.get(name)!;
	}

	public validate(name: string, value: string): boolean {
		if (this.canonicalize(value) === null) return false;

		return super.validate(name, value);
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Canonicalizes a color.
	 *
	 * @param color The color to canonicalize.
	 *
	 * @returns The color, in '#rrggbb' format. Or null, if invalid.
	 */
	public canonicalize(color: string): string | null {
		let trcolor = color.trim().toLowerCase();
		let nhcolor = trcolor.startsWith('#') ? trcolor.substring(1) : trcolor;

		if (nhcolor.match(/^[0-9a-f]{6}$/)) return `#${nhcolor}`;
		if (nhcolor.match(/^[0-9a-f]{3}$/)) {
			let triplet = [0, 1, 2].map(i => nhcolor.charAt(i).repeat(2)).join('');
			return `#${triplet}`;
		}

		return null;
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default SAColor;
export {SAColor};
