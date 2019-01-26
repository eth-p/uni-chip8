//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------

/**
 * A decorator for specifying a configurable setting.
 */
function Setting(value: any) {
	return function(target: any, property: string | symbol) {
		target.constructor.defaults.set(property, value);
	};
}

// ---------------------------------------------------------------------------------------------------------------------
// Settings:
// ---------------------------------------------------------------------------------------------------------------------

type SettingsListener = (setting: string, value: any, settings: Settings) => void;

/**
 * An object for storing settings in localStorage.
 * This also provides an interface for listening for changes to the settings.
 */
class Settings {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	private static defaults: Map<string, any> = new Map();
	private listeners: SettingsListener[];
	private namespace: string;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	public constructor(namespace: string) {
		this.listeners = [];
		this.namespace = namespace;

		// Create properties.
		for (let [prop, value] of (<any>this.constructor).defaults.entries()) {
			Object.defineProperties(this, {
				[prop]: {
					enumerable: true,
					configurable: false,
					get: () => {
						return this.get(<string>prop);
					},
					set: val => {
						this.set(<string>prop, val);
					}
				},

				[`_${prop}`]: {
					enumerable: false,
					configurable: false,
					writable: true,
					value: value
				}
			});
		}

		// Load.
		this.load();
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Gets the setting keys.
	 */
	public get keys(): string[] {
		return Array.from((<any>this.constructor).defaults.keys());
	}

	/**
	 * Sets a setting.
	 * @param setting The setting to set.
	 * @param value The value.
	 */
	public set(setting: string, value: any): void {
		(<any>this)[`_${setting}`] = value;
		this.listeners.forEach((listener: any) => listener(setting, value, this));
	}

	/**
	 * Gets a setting.
	 * @param setting The setting to get.
	 * @returns The setting value, or null.
	 */
	public get(setting: string): any | null {
		let key = `_${setting}`;
		if (!(key in this)) return null;
		return (<any>this)[key];
	}

	/**
	 * Adds a settings listener.
	 * This will be called whenever a setting changes.
	 *
	 * @param listener The listener function.
	 */
	public addListener(listener: (setting: string, value: any) => void): void {
		this.listeners.push(listener);
	}

	/**
	 * Loads the settings from localStorage.
	 */
	public load(): void {
		let settings = localStorage.getItem(`${this.namespace}/settings`);
		let json;

		try {
			json = JSON.parse(settings!);
			if (json == null) json = {};
		} catch (ex) {
			json = {};
		}

		for (let setting of this.keys) {
			if (json[setting] == null) {
				this.set(setting, (<any>this.constructor).defaults.get(setting));
			} else {
				this.set(setting, json[setting]);
			}
		}
	}

	/**
	 * Saves the settings to localStorage.
	 */
	public save(): void {
		let json: any = {};

		for (let setting of this.keys) {
			json[setting] = (<any>this)[setting];
		}

		localStorage.setItem(`${this.namespace}/settings`, JSON.stringify(json));
	}

	/**
	 * Resets the settings.
	 * This will not save them.
	 */
	public reset(): void {
		for (let setting of this.keys) {
			this.set(setting, (<any>this.constructor).defaults.get(setting));
		}
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default Settings;
export {Settings, SettingsListener, Setting};
