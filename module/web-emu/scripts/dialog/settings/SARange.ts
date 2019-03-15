//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import SettingAdapter from './SettingAdapter';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * Range (number) settings field adapter.
 */
class SARange extends SettingAdapter {
	// -------------------------------------------------------------------------------------------------------------
	// | Implementation:                                                                                           |
	// -------------------------------------------------------------------------------------------------------------

	public store(element: HTMLInputElement, name: string): void {
		this.settings.set(name, parseInt(element.value, 10));
	}

	public fetch(element: HTMLInputElement, name: string): void {
		element.value = this.settings.get(name)!.toString(10);
	}

	public validate(name: string, value: string): boolean {
		let num = parseInt(value, 10);
		if (isNaN(num)) return false;

		return super.validate(name, value);
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default SARange;
export {SARange};
