//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Template from '@chipotle/wfw/Template';

import App from '../../App';
import Program from './Program';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * A visualizer for
 * This displays the state of the CHIP-8 stack.
 */
class LibraryEntry {
	// -------------------------------------------------------------------------------------------------------------
	// | Constants:                                                                                                |
	// -------------------------------------------------------------------------------------------------------------

	protected readonly TEMPLATE: (typeof LibraryEntry)['TEMPLATE'] = (<any>this.constructor).TEMPLATE;
	public static readonly TEMPLATE = Template.compile<Program>({
		classes: 'program-library-item',
		oncreate: (e, o) => e.setAttribute('data-program-rom', o.url),
		children: [
			{
				classes: 'program-name',
				text: o => o.name
			},
			{
				type: 'a',
				classes: 'program-author',
				text: o => o.authorName,
				attr: {
					href: o => o.authorPage
				}
			},
			{
				classes: 'program-info',
				text: o => o.info
			}
		]
	});

	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected program: Program;

	protected element: HTMLElement;
	protected author: HTMLAnchorElement;
	protected name: HTMLElement;
	protected info: HTMLElement;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	public constructor(program: Program) {
		this.program = program;

		this.element = this.TEMPLATE(program);
		this.author = <HTMLAnchorElement>this.element.querySelector('.program-author');
		this.name = <HTMLElement>this.element.querySelector('.program-name');
		this.info = <HTMLElement>this.element.querySelector('.program-info');
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Gets the program.
	 */
	public getProgram(): Program {
		return this.program;
	}

	/**
	 * Gets the element for the program library entry.
	 * @returns The HTML element.
	 */
	public getElement(): HTMLElement {
		return this.element;
	}

	/**
	 * Gets the element for the author of this program.
	 * @returns The HTML element.
	 */
	public getAuthorElement(): HTMLAnchorElement {
		return this.author;
	}

	/**
	 * Gets the element for the name of this program.
	 * @returns The HTML element.
	 */
	public getNameElement(): HTMLElement {
		return this.name;
	}

	/**
	 * Gets the element for the description of this program.
	 * @returns The HTML element.
	 */
	public getInfoElement(): HTMLElement {
		return this.info;
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default LibraryEntry;
export {LibraryEntry};
