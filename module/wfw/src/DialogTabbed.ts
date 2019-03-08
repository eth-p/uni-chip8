//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Dialog from '@chipotle/wfw/Dialog';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A user interface dialog...
 * With tabbed panes!
 */
class DialogTabbed extends Dialog<'switch'> {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected tabBar!: HTMLElement;
	protected tabItems!: HTMLElement[];
	protected panes!: Map<String, {tabs: HTMLElement[]; pane: HTMLElement}>;
	protected _clickListener: (event: MouseEvent) => void;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new dialog from a `+dialog` element.
	 * @param dialog The dialog element.
	 */
	public constructor(dialog: HTMLElement) {
		super(dialog);

		this._clickListener = (event: MouseEvent) => {
			if (!(event.target instanceof HTMLElement)) return;
			let target = event.target.getAttribute('data-target');
			if (target != null) {
				this.setPane(target);
			}
		};

		this.invalidate();
		this.setPane(
			Array.from(this.panes.values())
				.map(p => p.pane)
				.find(p => p.getAttribute('data-default') != null)!
				.getAttribute('data-pane')!
		);
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Invalidates the cached selectors.
	 */
	public invalidate(): void {
		super.invalidate();

		this.tabBar = <HTMLElement>this.frame.querySelector(':scope > .toolbar');
		this.tabItems = Array.from(this.tabBar.querySelectorAll(':scope > *[data-target]'));

		this.tabBar.removeEventListener('click', this._clickListener);
		this.tabBar.addEventListener('click', this._clickListener);

		this.panes = new Map();
		for (let pane of this.content.querySelectorAll(':scope > *[data-pane]')) {
			this.panes.set(pane.getAttribute('data-pane')!, {
				pane: <HTMLElement>pane,
				tabs: this.tabItems.filter(x => x.getAttribute('data-target') === pane.getAttribute('data-pane'))
			});
		}
	}

	/**
	 * Sets the visible pane of the dialog.
	 * @param id The pane ID.
	 */
	public setPane(id: string): boolean {
		if (!this.panes.has(id)) return false;

		for (let [key, {tabs, pane}] of this.panes.entries()) {
			pane.classList[key === id ? 'remove' : 'add']('hide');
			tabs.forEach(x => x.classList[key === id ? 'add' : 'remove']('active'));
		}

		this.emit('switch', id);
		return true;
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default DialogTabbed;
export {DialogTabbed};
