//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Settings from '@chipotle/wfw/Settings';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * A class for interfacing between the settings object and their corresponding input elements.
 */
abstract class SettingAdapter {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected readonly settings: Settings;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	public constructor(settings: Settings) {
		this.settings = settings;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Stores the data from an <input> tag.
	 *
	 * @param element The input element.
	 * @param name The setting name.
	 */
	public abstract store(element: HTMLInputElement, name: string): void;

	/**
	 * Fetches the data and places it in an <input> tag.
	 *
	 * @param element The input element.
	 * @param name The setting name.
	 */
	public abstract fetch(element: HTMLInputElement, name: string): void;

	/**
	 * Attaches listeners to an <input> tag.
	 *
	 * @param element The input element.
	 * @param name The setting name.
	 */
	public attach(element: HTMLInputElement, name: string): void {}

	/**
	 * Validates the data in an <input> tag.
	 *
	 * @param name The setting name.
	 * @param value The setting value.
	 *
	 * @returns True if the data in the input element is valid.
	 */
	public validate(name: string, value: any): boolean {
		let entry = this.settings.getEntry(name);
		if (entry == null) return true;
		if (entry.validator == null) return true;

		return entry.validator(value);
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default SettingAdapter;
export {SettingAdapter};
