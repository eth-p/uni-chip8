//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
/**
 * A user interface window.
 */
class UIWindow {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected element: HTMLElement;
	protected realElement: HTMLElement;
	protected title?: HTMLElement;
	protected panes?: HTMLElement[];
	protected tabs?: HTMLElement[];

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new UI window from an element.
	 * This element can either be a '+window' or a '+desktop-overlay' with a single '+window' inside it.
	 *
	 * @param window The window element.
	 */
	public constructor(window: HTMLElement) {
		if (window.classList.contains('window')) {
			this.element = window;
			this.realElement = window;
		} else {
			this.element = window;
			this.realElement = <HTMLElement>window.querySelector(':scope > .window')!;
		}

		this.invalidate();
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Invalidates the cached data.
	 */
	public invalidate() {
		this.title = <HTMLElement>this.realElement.querySelector(':scope > .window-title > .title');

		if (this.realElement.classList.contains('tabbed')) {
			this.tabs = Array.from(this.realElement.querySelectorAll(':scope > .toolbar > [data-target]'));
			this.panes = Array.from(this.realElement.querySelectorAll(':scope > .content > [data-pane]'));

			// Add event listener for tabs.
			let tabbar = <HTMLElement>this.tabs[0].parentNode;
			if (tabbar.getAttribute('data-registered') == null) {
				tabbar.setAttribute('data-registered', '1');
				tabbar.addEventListener('click', evt => {
					let target = <HTMLElement>evt.target;
					let attr = target.getAttribute('data-target');
					if (attr != null) {
						this.setPane(attr);
					}
				});
			}
		}
	}

	/**
	 * Hides the window.
	 */
	public hide() {
		this.element.classList.remove('visible');
		this.element.classList.add('hide');
	}

	/**
	 * Shows the window.
	 */
	public show() {
		this.element.classList.remove('hide');
		this.element.classList.add('visible');
	}

	/**
	 * Sets the visible pane.
	 * This is only applicable to tabbed windows.
	 * @param pane
	 */
	public setPane(pane: string) {
		// Set active pane.
		if (this.panes != null) {
			for (let el of this.panes) {
				if (el.getAttribute('data-pane') === pane) {
					el.classList.remove('hide');
				} else {
					el.classList.add('hide');
				}
			}
		}

		// Set active tab.
		if (this.tabs != null) {
			for (let el of this.tabs) {
				if (el.getAttribute('data-target') === pane) {
					el.classList.add('active');
				} else {
					el.classList.remove('active');
				}
			}
		}
	}

	/**
	 * Sets the window title.
	 *
	 * @param text The title string.
	 * @param html Whether or not to treat the title string as HTML.
	 */
	public setTitle(text: string, html?: boolean) {
		if (this.title == null) return;
		if (html === true) {
			this.title.innerHTML = text;
		} else {
			this.title.innerText = text;
		}
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default UIWindow;
export {UIWindow};
