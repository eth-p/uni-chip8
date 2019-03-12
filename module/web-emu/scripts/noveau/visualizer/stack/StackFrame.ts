//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import ProgramAddress from '@chipotle/vm/ProgramAddress';

import Template from '@chipotle/wfw/Template';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * An entry in the stack visualizer.
 */
class StackFrame {
	// -------------------------------------------------------------------------------------------------------------
	// | Constants:                                                                                                |
	// -------------------------------------------------------------------------------------------------------------

	protected readonly TEMPLATE: (typeof StackFrame)['TEMPLATE'] = (<any>this.constructor).TEMPLATE;
	public static readonly TEMPLATE = Template.compile<string>({
		classes: 'stack-frame',
		children: [
			{
				classes: 'stack-frame-index',
				text: label => label
			},
			{
				classes: 'stack-frame-value',
				text: '----'
			}
		]
	});

	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected frame: 'PC' | number;
	protected hidden: boolean;

	protected element: HTMLElement;
	protected label: HTMLElement;
	protected value: HTMLElement;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	public constructor(frame: 'PC' | number) {
		this.frame = frame;
		this.element = this.TEMPLATE(`-${frame.toString().padStart(2, '0')}`);
		this.label = <HTMLElement>this.element.querySelector(':scope > .stack-frame-index');
		this.value = <HTMLElement>this.element.querySelector(':scope > .stack-frame-value');

		this.hidden = frame !== 'PC';
		this.setVisible(frame === 'PC');
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Gets the element for the stack frame.
	 * @returns The HTML element.
	 */
	public getElement(): HTMLElement {
		return this.element;
	}

	/**
	 * Sets the visibility of the element.
	 * @param visible The visibility.
	 */
	public setVisible(visible: boolean): void {
		this.hidden = !visible;
		this.element.classList[visible ? 'remove' : 'add']('hide');
	}

	/**
	 * Gets the visibility of the element.
	 * @returns True if the element is visible.
	 */
	public isVisible(): boolean {
		return !this.hidden;
	}

	/**
	 * Sets the value of the stack frame.
	 * @param value The value.
	 */
	public set(value: ProgramAddress): void {
		if (this.hidden) this.setVisible(true);
		this.value.textContent = value.toString(16).padStart(4, '0');
	}

	/**
	 * Sets an empty value for the stack frame.
	 */
	public setEmpty(): void {
		this.value.textContent = '----';
	}

	/**
	 * Resets the stack frame.
	 */
	public reset(): void {
		this.setVisible(this.frame === 'PC');
		this.setEmpty();
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default StackFrame;
export {StackFrame};
