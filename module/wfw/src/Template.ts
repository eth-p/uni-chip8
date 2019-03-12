//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Optional from '@chipotle/types/Optional';

import ElementAttributes from './ElementAttributes';
import ElementListeners from './ElementListeners';
import ElementName from './ElementName';
import ElementStyles from './ElementStyles';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * A class that builds HTML structures from a template and data.
 */
class Template<O = any, X = never> {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected structure: Template.Structure<O>;
	protected code: string[];
	protected late: Template.LateBuild<O>[];

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new template.
	 *
	 * @param structure The template structure.
	 */
	public constructor(structure: Template.Structure<O>) {
		this.structure = structure;
		this.code = [];
		this.late = [];
	}

	// -------------------------------------------------------------------------------------------------------------
	// | API:                                                                                                      |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Compiles a template.
	 *
	 * @returns The generator function.
	 */
	public compile(): Template.Compiled<O> {
		const structure = this.structure;
		const children = structure.children == null ? [] : this.compileChildren(structure.children);

		this.genCreateElement(structure.type == null ? 'div' : structure.type);
		if (structure.id != null) this.genSetId(structure.id);
		if (structure.classes != null) this.genSetClasses(structure.classes);
		if (structure.attr != null) this.genSetAttributes(structure.attr);
		if (structure.data != null) this.genSetAttributes(structure.data, 'data-');
		if (structure.styles != null) this.genSetStyles(structure.styles);
		if (structure.text != null) this.genSetText(structure.text);
		if (structure.children != null) this.genChildren(children);
		if (structure.events != null) this.genEventListeners(structure.events);
		if (structure.oncreate != null) this.genCreateListener(structure.oncreate);

		let compiled = new Function(
			'var late = arguments[0];' +
				'return function (opts) {' +
				`    ${this.code.join(';\n')};` +
				'    for (var i = 0; i < late.length; i++) late[i]($, opts);' +
				'    return $;' +
				'}'
		)(this.late);

		// Clean up.
		this.code = [];
		this.late = [];

		// Return.
		return compiled;
	}

	/**
	 * Compiles an element generator.
	 *
	 * @param options The generator options.
	 *
	 * @returns The element generator function.
	 */
	public static compile<O = any>(options: Template.Structure<O>): Template.Compiled<O> {
		return new Template<O>(options).compile();
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Codegen:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	protected genCreateElement(type: ElementName<X>): void {
		this.code.push(`var $ = document.createElement(${JSON.stringify(type)})`);
	}

	protected genSetAttribute(attribute: string, value: string | Template.LateValue<O, Optional<string>>): void {
		if (typeof value === 'function') {
			this.late.push(function(e, o) {
				let val = value(o);
				if (val != null) e.setAttribute(attribute, val);
			});
		} else {
			this.code.push(`$.setAttribute(${JSON.stringify(attribute)}, ${JSON.stringify(value)})`);
		}
	}

	protected genSetAttributes(
		attributes: ElementAttributes | {[key: string]: string | Template.LateValue<O, Optional<string>>},
		prepend?: string
	): void {
		for (let [attribute, value] of Object.entries(attributes)) {
			this.genSetAttribute(prepend == null ? attribute : `${prepend}${attribute}`, value);
		}
	}

	protected genSetClass(name: string | Template.LateValue<O, Optional<string>>): void {
		if (typeof name === 'function') {
			this.late.push(function(e, o) {
				let val = name(o);
				if (val != null) e.classList.add(val);
			});
		} else {
			this.code.push(`$.classList.add(${JSON.stringify(name)})`);
		}
	}

	protected genSetClasses(
		classes: (string | Template.LateValue<O, string>) | (string | Template.LateValue<O, Optional<string>>)[]
	): void {
		let classArray = classes instanceof Array ? classes : [classes];
		for (let name of classArray) {
			this.genSetClass(name);
		}
	}

	protected genSetId(id: string | Template.LateValue<O, Optional<string>>): void {
		if (typeof id === 'function') {
			this.late.push(function(e, o) {
				let val = id(o);
				if (val == null) {
					e.removeAttribute('id');
				} else {
					e.id = val;
				}
			});
		} else {
			this.code.push(`$.id = ${JSON.stringify(id)}`);
		}
	}

	protected genSetStyles(styles: ElementStyles): void {
		for (let [style, value] of Object.entries(styles)) {
			this.genSetStyle(style, value);
		}
	}

	protected genSetStyle(style: string, value: string | Template.LateValue<O, string>): void {
		if (typeof value === 'function') {
			this.late.push(function(e, o) {
				(<any>e.style)[style] = value(o);
			});
		} else {
			this.code.push(`$.style[${JSON.stringify(style)}] = ${JSON.stringify(value)}`);
		}
	}

	protected genSetText(text: string | Template.LateValue<O, string>): void {
		if (typeof text === 'function') {
			this.late.push(function(e, o) {
				e.textContent = text(o);
			});
		} else {
			this.code.push(`$.textContent = ${JSON.stringify(text)}`);
		}
	}

	protected genEventListener(event: string, listener: any): void {
		this.late.push(function(e) {
			e.addEventListener(event, listener);
		});
	}

	protected genEventListeners(events: ElementListeners<O>): void {
		for (let [event, listener] of Object.entries(events)) {
			this.genEventListener(event, listener);
		}
	}

	protected genCreateListener(listener: (element: HTMLElement, options: O) => void): void {
		this.late.push(listener);
	}

	protected genChildren(children: Template.Compiled<O>[]): void {
		this.late.push(function(e, o) {
			for (let child of children) {
				e.appendChild(child(o));
			}
		});
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Compiles children of an element generator.
	 *
	 * @param children The children options.
	 *
	 * @returns The children generator functions.
	 */
	protected compileChildren(children: Template.Children<O, X>): Template.Compiled<O>[] {
		return <any>children.map(child => {
			if (child instanceof Node) return () => child.cloneNode(true);
			if (typeof child === 'function') return child;
			return new (Object.getPrototypeOf(this)).constructor(child).compile();
		});
	}
}

namespace Template {
	/**
	 * A compiled generator.
	 */
	export type Compiled<O> = (opts: O) => HTMLElement;

	/**
	 * A child element.
	 */
	export type Children<O, X = never> = (Structure<O, X> | Compiled<O> | HTMLElement)[];

	/**
	 * A late-binding value.
	 * These are called during runtime.
	 */
	export type LateValue<O, R> = (opts: O) => R;

	/**
	 * A late-build function.
	 * These are called during runtime.
	 */
	export type LateBuild<O> = (element: HTMLElement, opts: O) => void;

	/**
	 * All possible options for an element generator.
	 */
	export interface Structure<O, X = never> {
		type?: ElementName;
		styles?: ElementStyles;
		text?: string | LateValue<O, string>;
		id?: string | LateValue<O, string>;
		attr?: ElementAttributes | {[key: string]: string | LateValue<O, Optional<string>>};
		data?: ElementAttributes | {[key: string]: string | LateValue<O, Optional<string>>};
		classes?: (string | LateValue<O, string>) | (string | LateValue<O, Optional<string>>)[];
		events?: ElementListeners<O>;
		oncreate?: (element: HTMLElement, options: O) => void;
		children?: Children<O, X>;
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default Template;
export {Template};
