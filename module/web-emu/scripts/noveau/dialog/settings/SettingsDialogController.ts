//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import DialogTabbed from '@chipotle/wfw/DialogTabbed';

import App from '../../App';

import SettingAdapter from './SettingAdapter';
import SAColor from './SAColor';
import SABoolean from './SABoolean';
import SAKeybind from './SAKeybind';
import SARange from './SARange';
import Optional from '@chipotle/types/Optional';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * The class for controlling the settings dialog.
 */
class SettingsDialogController extends App {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected dialog!: DialogTabbed;
	protected fields!: HTMLInputElement[];
	protected adapters: Map<string, SettingAdapter>;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	public constructor() {
		super();
		this.onChange = this.onChange.bind(this);
		this.adapters = new Map([
			['color', new SAColor(this.settings)],
			['boolean', new SABoolean(this.settings)],
			['range', new SARange(this.settings)],
			['keybind', new SAKeybind(this.settings)]
		]);
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Hooks:                                                                                                    |
	// -------------------------------------------------------------------------------------------------------------

	protected init(this: App.Fragment<this>): void {
		this.dialog = new DialogTabbed(document.getElementById('dialog-settings')!);
		this.fields = <HTMLInputElement[]>Array.from(document.querySelectorAll('[data-setting]'));

		// Add providers.
		this.state.dialog.visible.addProvider(this.dialog.getVisibilityProvider());

		// Connect triggers.
		this.triggers.dialog.settings.show.onTrigger(() => this.dialog.show());
		this.triggers.dialog.settings.hide.onTrigger(() => this.dialog.hide());
		this.triggers.settings.undo.onTrigger(this.update.bind(this));

		// Attach listeners.
		this.fields.forEach(this.register.bind(this));

		// Ready!
		this.update();
		this.ready();
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Handlers:                                                                                                 |
	// -------------------------------------------------------------------------------------------------------------

	protected onChange(this: App.Fragment<this>, event: Event): boolean {
		let element = <HTMLInputElement>event.target;
		let adapter = this.getAdapter(element)!;
		let key = element.getAttribute('data-setting')!;

		if (!adapter.validate(key, element.value || element.checked)) {
			element.classList.add('invalid');
			return true;
		}

		element.classList.remove('invalid');
		adapter.store(element, key);
		return true;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Gets the setting adapter for an input field.
	 *
	 * @param element The input element.
	 *
	 * @returns The setting adapter, or undefined if not found.
	 */
	protected getAdapter(element: HTMLInputElement): Optional<SettingAdapter>;

	/**
	 * Gets the setting adapter for a setting type.
	 *
	 * @param type The setting type.
	 *
	 * @returns The setting adapter, or undefined if not found.
	 */
	protected getAdapter(type: string): Optional<SettingAdapter>;

	protected getAdapter(arg1: string | HTMLElement): Optional<SettingAdapter> {
		if (typeof arg1 === 'string') return this.adapters.get(arg1);

		let type = (arg1.getAttribute('data-setting-type') || arg1.getAttribute('type'))!;
		return this.getAdapter(type);
	}

	/**
	 * Adds an event listener to an element with a `data-trigger` attribute.
	 * @param element The element.
	 */
	public register(this: App.Fragment<this>, element: HTMLInputElement): void {
		let adapter = this.getAdapter(element)!;

		adapter.attach(element, element.getAttribute('data-setting')!);
		element.addEventListener('change', this.onChange);
	}

	/**
	 * Updates the values in settings fields in this dialog.
	 */
	public update(): void {
		for (let element of this.fields) {
			let key = element.getAttribute('data-setting')!;
			let entry = this.settings.getEntry(<any>key);

			if (entry == null) {
				console.warn(`Setting field encountered, but no corresponding entry: ${key}`);
				continue;
			}

			let adapter = this.getAdapter(element)!;
			adapter.fetch(element, entry.name);
		}
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default SettingsDialogController;
export {SettingsDialogController};
