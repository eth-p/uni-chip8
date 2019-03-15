//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Emitter from '@chipotle/types/Emitter';
import StateProvider from '@chipotle/wfw/StateProvider';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * A user interface dialog.
 */
class Dialog<T = never> extends Emitter<'show' | 'hide' | T> {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected frame: HTMLElement;
	protected content!: HTMLElement;
	protected titleText?: HTMLElement;
	protected titleControls?: HTMLElement;
	protected stateProvider: StateProvider<boolean>;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new dialog from a `+dialog` element.
	 * @param dialog The dialog element.
	 */
	public constructor(dialog: HTMLElement) {
		super();

		this.frame = dialog;
		this.stateProvider = new StateProvider<boolean>(false);
		this.invalidate();
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Invalidates the cached selectors.
	 */
	public invalidate(): void {
		let title = <HTMLElement>this.frame.querySelector(':scope > .dialog-title');
		this.titleText = <HTMLElement>title.querySelector(':scope > .title');
		this.titleControls = <HTMLElement>title.querySelector(':scope > .buttons');
		this.content = <HTMLElement>this.frame.querySelector(':scope > .viewport > .content');
	}

	/**
	 * Hides the dialog.
	 */
	public hide(): void {
		this.frame.classList.remove('visible');
		this.frame.classList.add('hide');
		this.emit('hide');
		this.stateProvider.value = false;
	}

	/**
	 * Shows the dialog.
	 */
	public show(): void {
		this.frame.classList.remove('hide');
		this.frame.classList.add('visible');
		this.emit('show');
		this.stateProvider.value = true;
	}

	/**
	 * Sets the visibility of the dialog.
	 * @param visible The visibility.
	 */
	public setVisible(visible: boolean): void {
		if (visible) {
			this.show();
		} else {
			this.hide();
		}
	}

	/**
	 * Gets the visibility of the dialog.
	 * @returns The visibility.
	 */
	public isVisible(): boolean {
		return this.frame.classList.contains('visible');
	}

	/**
	 * Gets a state provider for the visibility of the dialog.
	 * @returns The visibility state provider.
	 */
	public getVisibilityProvider(): StateProvider<boolean> {
		return this.stateProvider;
	}

	/**
	 * Gets the dialog's frame element.
	 * @returns The dialog frame.
	 */
	public getElement(): HTMLElement {
		return this.frame;
	}

	/**
	 * Gets an element inside the dialog.
	 *
	 * @param query The query string.
	 *
	 * @returns The element, or null if none found.
	 */
	public getContentElement(query?: string): HTMLElement | null {
		if (query == null) return this.content;
		return this.content.querySelector(`:scope ${query}`);
	}

	/**
	 * Gets elements inside the dialog.
	 *
	 * @param query The query string.
	 *
	 * @returns The elements, or an empty array.
	 */
	public getContentElements(query: string): HTMLElement[] {
		return Array.from(this.content.querySelectorAll(`:scope ${query}`));
	}

	/**
	 * Gets the dialog's control button container.
	 * @returns The control button container, or null if it doesn't exist.
	 */
	public getControls(): HTMLElement | null {
		return this.titleControls == null ? null : this.titleControls;
	}

	/**
	 * Sets the dialog's width.
	 * @param width The width.
	 */
	public setWidth(width: number | string): void {
		if (typeof width === 'number') {
			width = `${width}px`;
		}

		this.frame.style.width = width;
	}

	/**
	 * Sets the dialog's height.
	 * @param height The height.
	 */
	public setHeight(height: number | string): void {
		if (typeof height === 'number') {
			height = `${height}px`;
		}

		this.frame.style.height = height;
	}

	/**
	 * Gets the dialog's bounding box.
	 * @returns The client bounding rect of the dialog.
	 */
	public getBoundingBox(): ClientRect {
		return this.frame.getBoundingClientRect();
	}

	/**
	 * Sets the window title.
	 *
	 * @param text The title string.
	 * @param html Whether or not to treat the title string as HTML.
	 */
	public setTitle(text: string, html?: boolean): void {
		if (this.titleText == null) return;
		if (html === true) {
			this.titleText.innerHTML = text;
		} else {
			this.titleText.textContent = text;
		}
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default Dialog;
export {Dialog};
