//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {ProgramAddress, toHexString} from '@chipotle/vm/ProgramAddress';

import Template from '@chipotle/wfw/Template';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * An entry in the program visualizer.
 */
class ProgramFrame {
	// -------------------------------------------------------------------------------------------------------------
	// | Constants:                                                                                                |
	// -------------------------------------------------------------------------------------------------------------

	protected readonly TEMPLATE: (typeof ProgramFrame)['TEMPLATE'] = (<any>this.constructor).TEMPLATE;
	public static readonly TEMPLATE = Template.compile<boolean>({
		classes: 'program-frame',
		children: [
			{
				classes: ['program-frame-index', current => (current ? 'current' : undefined)],
				text: '----'
			},
			{
				classes: 'program-frame-value'
			}
		]
	});

	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected offset: number;

	protected element: HTMLElement;
	protected label: HTMLElement;
	protected value: HTMLElement;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new program frame.
	 * @param offset The offset from the program counter.
	 */
	public constructor(offset: number) {
		this.offset = offset;
		this.element = this.TEMPLATE(offset === 0);
		this.label = <HTMLElement>this.element.querySelector(':scope > .program-frame-index');
		this.value = <HTMLElement>this.element.querySelector(':scope > .program-frame-value');
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
	 * Sets the value of the program frame.
	 * @param value The value.
	 */
	public set(address: ProgramAddress, value: string): void {
		this.label.textContent = toHexString(address);
		this.value.textContent = value;
	}

	/**
	 * Sets an empty value for the stack frame.
	 */
	public setEmpty(): void {
		this.label.textContent = '----';
		this.value.textContent = '';
	}

	/**
	 * Resets the stack frame.
	 */
	public reset(): void {
		this.setEmpty();
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default ProgramFrame;
export {ProgramFrame};
