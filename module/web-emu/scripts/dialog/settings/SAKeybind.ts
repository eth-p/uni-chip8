//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Settings from '@chipotle/wfw/Settings';

import SettingAdapter from './SettingAdapter';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * Keybind settings field adapter.
 */
class SAKeybind extends SettingAdapter {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected keymap: Map<string, string>;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	public constructor(arg1: Settings) {
		super(arg1);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.keymap = new Map([[',', 'Comma'], ['.', 'Period'], [' ', 'Space']]);
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Implementation:                                                                                           |
	// -------------------------------------------------------------------------------------------------------------

	public store(element: HTMLInputElement, name: string): void {
		this.settings.set(name, element.getAttribute('data-keybind-value'));
	}

	public fetch(element: HTMLInputElement, name: string): void {
		let value = this.settings.get(name);

		element.value = this.getKeyName(value);
		element.setAttribute('data-keybind-value', value);
	}

	public attach(element: HTMLInputElement, name: string): void {
		element.addEventListener('keydown', this.onKeyDown);
		element.addEventListener('input', this.onInput);
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Handlers:                                                                                                 |
	// -------------------------------------------------------------------------------------------------------------

	protected onKeyDown(event: KeyboardEvent): boolean {
		event.preventDefault();
		event.stopPropagation();

		if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) return false;
		if (event.key === 'Unidentified') return false;
		let element = <HTMLInputElement>event.target;

		element.setAttribute('data-keybind-value', event.key);
		element.value = this.getKeyName(event.key);

		// Trigger change event.
		let change = document.createEvent('HTMLEvents');
		change.initEvent('change', true, false);
		element.dispatchEvent(change);

		// Return.
		return false;
	}

	protected onInput(event: Event): boolean {
		event.preventDefault();
		event.stopImmediatePropagation();
		return false;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Implementation:                                                                                           |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Gets a human readable key name.
	 * @param key The key.
	 */
	public getKeyName(key: string) {
		let mapped = this.keymap.get(key);
		if (mapped != null) return mapped;
		return key.length === 1 ? key.toUpperCase() : key;
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default SAKeybind;
export {SAKeybind};
