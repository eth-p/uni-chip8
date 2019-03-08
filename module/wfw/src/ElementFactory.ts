//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------

/**
 * A class to generate HTML element structures.
 */
class ElementFactory {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	public readonly element: HTMLElement;
	protected top: ElementFactory;
	protected templates: Map<String, TemplateCallback>;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new element factory.
	 *
	 * @param type The element type.
	 * @param options The element options.
	 */
	public constructor(type: TagName, options?: TagOptions);

	/**
	 * Creates a new element factory.
	 *
	 * @param type The element type.
	 * @param id The element ID.
	 * @param options The element options.
	 */
	public constructor(type: TagName, id: string, options?: TagOptions);

	public constructor(type: TagName, idOrOptions?: string | TagOptions, options?: TagOptions) {
		this.top = this;
		this.templates = new Map();

		let opts = typeof options === 'object' ? options : typeof idOrOptions === 'object' ? idOrOptions : {};
		let id = typeof idOrOptions === 'string' ? idOrOptions : null;
		let el = (this.element = document.createElement(type));

		// ID
		if (id != null) this.element.id = id;

		// Options
		if (opts.classes != null) el.classList.add(...(opts.classes instanceof Array ? opts.classes : [opts.classes]));
		if (opts.data != null) Object.entries(opts.data).forEach(([k, v]) => this.data(k, v));
		if (opts.styles != null) Object.assign(el.style, opts.styles);
		if (opts.text != null) el.textContent = opts.text;
		if (opts.template != null) Object.entries(opts.template).forEach(([k, v]) => this.setTemplateFunction(k, v));
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Appends a child element.
	 *
	 * @param type The element type.
	 * @param fn The callback function.
	 */
	public child(type: TagName, fn: TagCallback): this;

	/**
	 * Appends a child element.
	 *
	 * @param type The element type.
	 * @param options The element options.
	 * @param fn The callback function.
	 */
	public child(type: TagName, options: TagOptions, fn: TagCallback): this;

	/**
	 * Appends a child element.
	 *
	 * @param type The element type.
	 * @param id The element ID.
	 * @param fn The callback function.
	 */
	public child(type: TagName, id: string, fn: TagCallback): this;

	/**
	 * Appends a child element.
	 *
	 * @param type The element type.
	 * @param id The element ID.
	 * @param options The element options.
	 * @param fn The callback function.
	 */
	public child(type: TagName, id: string, options: TagOptions, fn: TagCallback): this;

	public child(
		type: TagName,
		p1: string | TagOptions | TagCallback,
		p2?: TagOptions | TagCallback,
		p3?: TagCallback
	): this {
		let cb = null;
		let id = null;
		let opts = null;

		if (p3 == null && p2 == null && typeof p1 === 'function') {
			cb = p1;
		} else if (p3 == null && typeof p2 === 'function') {
			cb = p2;
			if (typeof p1 === 'string') {
				id = p1;
			} else {
				opts = p1;
			}
		} else if (typeof p3 === 'function') {
			cb = p3;
			opts = p2;
			id = p1;
		}

		let child = new (<any>this.constructor)(type, id, opts);
		child.top = this.top;
		child.templates = this.top.templates;

		if (cb != null) cb(child);

		this.element.appendChild(child.element);
		return this;
	}

	/**
	 * Sets the text contents.
	 * This will remove all children.
	 *
	 * @param text The text.
	 */
	public text(text: string): this {
		this.element.textContent = text;
		return this;
	}

	/**
	 * Sets a data attribute.
	 *
	 * @param name The attribute name.
	 * @param value The attribute value.
	 */
	public data(name: string, value: string): this {
		this.element.setAttribute(`data-${name}`, value);
		return this;
	}

	/**
	 * Sets an attribute.
	 *
	 * @param name The attribute name.
	 * @param value The attribute value.
	 */
	public attr(name: string, value: string): this {
		this.element.setAttribute(name, value);
		return this;
	}

	/**
	 * Creates the element.
	 * @returns The element instance.
	 */
	public create(): HTMLElement {
		return <HTMLElement>this.element.cloneNode(true);
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods: Templating                                                                                       |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Sets a template function.
	 *
	 * @param id The template ID.
	 * @param fn The template function.
	 */
	public setTemplateFunction(id: string, fn: TemplateCallback): this {
		this.templates.set(id, (...args) => fn.apply(this, [this].concat(args)));
		return this;
	}

	/**
	 * Runs a template function.
	 *
	 * @param id The template ID.
	 * @param value The template value.
	 */
	public template(id: string, value: any): this {
		(<any>this.templates.get(id))(value);
		return this;
	}
}

type TemplateCallback = (factory: ElementFactory, value: any) => void;
type TagCallback = (factory: ElementFactory) => void;
type TagName = keyof HTMLElementTagNameMap;

interface TagOptions {
	classes?: string | string[];
	styles?: CSSStyleDeclaration;
	data?: TagAttributes;
	text?: string;
	template?: {[key: string]: TemplateCallback};
}

interface TagAttributes {
	[key: string]: string;
}

// ---------------------------------------------------------------------------------------------------------------------
export default ElementFactory;
export {ElementFactory};
export {TagAttributes};
export {TagCallback};
export {TagName};
export {TagOptions};
