//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Emitter from '@chipotle/types/Emitter';

import SettingsEntry from './SettingsEntry';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * A decorator for specifying a configurable setting.
 */
function Setting(value: any, options?: {validator: SettingsEntry<string>['validator']}) {
	return function(target: any, property: string | symbol) {
		target.constructor.entries.set(
			property,
			Object.assign(
				{
					validator: null
				},
				options,
				{
					value: value,
					name: property
				}
			)
		);
	};
}

// ---------------------------------------------------------------------------------------------------------------------
// Settings:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * An object for storing settings in localStorage.
 * This also provides an interface for listening for changes to the settings.
 */
class Settings<KEYS extends string = string> extends Emitter<'update' | 'load' | 'save' | 'invalid'> {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected static entries: Map<string, any> = new Map();
	protected _namespace: string;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	public constructor(namespace: string) {
		super();
		this._namespace = namespace;

		// Create properties.
		for (let {name, value} of this.getEntries()) {
			Object.defineProperties(this, {
				[name]: {
					enumerable: true,
					configurable: false,
					get: () => this.get(name),
					set: val => this.set(name, val)
				},

				[`_${name}`]: {
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
	 * Adds a listener for when a setting value changes.
	 * @param setting The setting value (or values).
	 * @param listener The listener function.
	 */
	public onChange(setting: KEYS | KEYS[], listener: (setting: KEYS, value: any) => void): void {
		let settings = setting instanceof Array ? setting : [setting];

		// Add listener for value changes.
		this.addListener('update', (k, v) => {
			if (settings.includes(k)) listener(k, v);
		});

		// Call for initial value.
		for (let setting of settings) {
			listener(setting, this.get(setting));
		}
	}

	/**
	 * Gets the settings keys.
	 * @returns An array of valid settings keys.
	 */
	public getKeys(): KEYS[] {
		return Array.from((<any>this.constructor).entries.keys());
	}

	/**
	 * Gets a settings entry.
	 * @param setting The setting key.
	 */
	public getEntry(setting: KEYS): SettingsEntry<KEYS> | null {
		let entry = (<any>this.constructor).entries.get(setting);
		if (entry === undefined) return null;
		return entry;
	}

	/**
	 * Gets the settings entry descriptors.
	 * @returns An array of settings descriptors.
	 */
	public getEntries(): SettingsEntry<KEYS>[] {
		return (<any>this.constructor).entries.values();
	}

	/**
	 * Sets a setting.
	 * @param setting The setting to set.
	 * @param value The value.
	 * @returns True or false, depending on whether or not the data provided was valid.
	 */
	public set(setting: KEYS, value: any): boolean {
		let entry = this.getEntry(setting);

		// Validate.
		if (entry === null) return false;
		if (entry.validator != null) {
			if (!entry.validator(value)) {
				this.emit('invalid', setting, value);
				return false;
			}
		}

		// Set.
		(<any>this)[`_${setting}`] = value;
		this.emit('update', setting, value);
		return true;
	}

	/**
	 * Gets a setting.
	 * @param setting The setting to get.
	 * @returns The setting value, or null.
	 */
	public get(setting: KEYS): any | null {
		let key = `_${setting}`;
		if (!(key in this)) return null;
		return (<any>this)[key];
	}

	/**
	 * Loads the settings from localStorage.
	 */
	public load(): void {
		let settings = localStorage.getItem(`${this._namespace}/settings`);
		let json;

		// Attempt to parse the JSON from localStorage.
		try {
			json = JSON.parse(settings!);
			if (json == null || typeof json !== 'object') json = {};
		} catch (ex) {
			json = {};
		}

		// Attempt to use the values from the JSON.
		for (let entry of this.getEntries()) {
			let {name, value, validator} = entry;
			let jsonValue = json[name];
			if (
				jsonValue == null ||
				typeof jsonValue !== typeof value ||
				(validator != null && !validator(jsonValue))
			) {
				this.set(name, value);
				continue;
			}

			this.set(name, jsonValue);
		}

		// Done.
		this.emit('load');
	}

	/**
	 * Saves the settings to localStorage.
	 */
	public save(): void {
		let json: any = {};

		// Write to JSON.
		for (let setting of this.getKeys()) {
			json[setting] = (<any>this)[setting];
		}

		// Write to localStorage.
		localStorage.setItem(`${this._namespace}/settings`, JSON.stringify(json));
		this.emit('save');
	}

	/**
	 * Resets the settings.
	 * This will not save them.
	 */
	public reset(): void {
		for (let setting of this.getEntries()) {
			this.set(setting.name, setting.value);
		}
	}

	/**
	 * Broadcasts all the settings values through an 'update' event.
	 */
	public broadcast(): void {
		for (let setting of this.getKeys()) {
			this.emit('update', setting, this.get(setting));
		}
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default Settings;
export {Settings, Setting};
