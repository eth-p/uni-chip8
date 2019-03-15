//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import SettingAdapter from './SettingAdapter';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * Boolean (checkbox) settings field adapter.
 */
class SABoolean extends SettingAdapter {
	// -------------------------------------------------------------------------------------------------------------
	// | Implementation:                                                                                           |
	// -------------------------------------------------------------------------------------------------------------

	public store(element: HTMLInputElement, name: string): void {
		this.settings.set(name, element.checked);
	}

	public fetch(element: HTMLInputElement, name: string): void {
		element.checked = this.settings.get(name)!;
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default SABoolean;
export {SABoolean};
