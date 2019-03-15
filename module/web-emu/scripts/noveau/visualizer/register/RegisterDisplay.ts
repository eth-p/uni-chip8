//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Template from '@chipotle/wfw/Template';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * A display component for a register.
 *
 * This displays registers and allows them to be edited.
 */
class RegisterDisplay {
	// -------------------------------------------------------------------------------------------------------------
	// | Constants:                                                                                                |
	// -------------------------------------------------------------------------------------------------------------

	protected readonly SAFE_KEYS: (typeof RegisterDisplay)['SAFE_KEYS'] = (<any>this.constructor).SAFE_KEYS;
	public static readonly SAFE_KEYS = [
		'Backspace',
		'Delete',
		'ArrowLeft',
		'ArrowRight',
		'ArrowUp',
		'ArrowDown',
		'Home',
		'End'
	];

	protected readonly TEMPLATE: (typeof RegisterDisplay)['TEMPLATE'] = (<any>this.constructor).TEMPLATE;
	public static readonly TEMPLATE = Template.compile<{name: string; width: number}>({
		classes: 'register-display',
		children: [
			{
				classes: ['register-name'],
				text: o => o.name
			},
			{
				type: 'input',
				classes: 'register-value',
				attr: {
					type: 'text',
					maxlength: o => o.width.toString(),
					value: o => '-'.repeat(o.width)
				}
			}
		]
	});

	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected name: string;
	protected width: number;
	protected editable: boolean;

	protected element: HTMLElement;
	protected value: HTMLInputElement;

	protected regGetter: () => number;
	protected regSetter: (val: number) => void;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new register display.
	 *
	 * @param name The register name.
	 *
	 * @param regGetter The getter function.
	 * @param regSetter The setter function.
	 */
	public constructor(name: string, regGetter: () => number, regSetter: (val: number) => void) {
		this.name = name;
		this.width = ['I', 'PC'].includes(name) ? 4 : 2;
		this.editable = false;

		this.element = this.TEMPLATE(<any>this);
		this.value = <HTMLInputElement>this.element.querySelector(':scope > .register-value');

		this.regGetter = regGetter;
		this.regSetter = regSetter;

		this.setEditable(false);

		const onInput = this.onInput.bind(this);
		this.value.addEventListener('blur', this.onBlur.bind(this));
		this.value.addEventListener('keydown', onInput);
		this.value.addEventListener('keyup', onInput);
		this.value.addEventListener('input', onInput);
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Handlers:                                                                                                 |
	// -------------------------------------------------------------------------------------------------------------

	protected onBlur(event: FocusEvent) {
		if (!this.editable) return;

		const value = this.value.value.length === 0 ? 0 : parseInt(this.value.value, 16);

		if (!isNaN(value)) this.regSetter(value);
		this.render();
	}

	protected onInput(event: Event & KeyboardEvent) {
		let key = null;

		if (event.key != null) {
			// Grab data from KeyboardEvent.
			if (this.SAFE_KEYS.includes(event.key)) return true;
			if (event.ctrlKey || event.metaKey) return true;

			// Save value.
			if (event.key === 'Enter' || event.key === 'Return') {
				this.value.blur();
				event.preventDefault();
				return false;
			}

			key = event.key;
		} else {
			// Grab data from InputEvent.
			if ((<any>event).inputType !== 'insertText') return true;
			key = (<any>event).data;
		}

		// Deny change if invalid.
		if (/[^a-f0-9]/i.test(key)) {
			event.preventDefault();
			return false;
		}

		return true;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Gets the element for the program frame.
	 * @returns The HTML element.
	 */
	public getElement(): HTMLElement {
		return this.element;
	}

	/**
	 * Sets the editability of the register.
	 * @param editable True if the register can be edited.
	 */
	public setEditable(editable: boolean): void {
		this.editable = editable;
		this.value.disabled = !editable;
	}

	/**
	 * Renders (updates) the display.
	 */
	public render(): void {
		this.value.value = this.regGetter()
			.toString(16)
			.padStart(this.width, '0');
	}

	/**
	 * Resets the display.
	 */
	public reset(): void {
		this.value.value = '-'.repeat(this.width);
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default RegisterDisplay;
export {RegisterDisplay};
