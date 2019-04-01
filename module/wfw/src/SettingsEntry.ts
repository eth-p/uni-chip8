//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------

/**
 * An interface representing a settings entry.
 */
interface SettingsEntry<KEYS = string> {
	/**
	 * A function to validate the settings value.
	 */
	validator: (value: any) => boolean;

	/**
	 * The name of the setting.
	 */
	name: KEYS;

	/**
	 * The default value of the setting.
	 */
	value: any;
}

// ---------------------------------------------------------------------------------------------------------------------
export default SettingsEntry;
export {SettingsEntry};
