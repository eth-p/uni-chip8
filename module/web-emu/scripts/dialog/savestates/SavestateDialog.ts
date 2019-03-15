//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Dialog from '@chipotle/wfw/Dialog';

import App from '../../App';

import SavestateEntry from './SavestateEntry';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * The class for controlling the savestates dialog.
 */
class SavestateDialog extends App {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected dialog!: Dialog;
	protected entries: SavestateEntry[];

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	public constructor() {
		super();

		this.entries = ['quicksave', 1, 2, 3, 4, 5, 6, 7, 8, 9].map(slot => new SavestateEntry(<any>slot));
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Hooks:                                                                                                    |
	// -------------------------------------------------------------------------------------------------------------

	protected initDOM(this: App.Fragment<this>): void {
		this.dialog = new Dialog(document.getElementById('dialog-savestates')!);
		this.state.dialog.visible.addProvider(this.dialog.getVisibilityProvider());

		const container = this.dialog.getContentElement()!;

		// Generate list.
		for (let entry of this.entries) {
			container.appendChild(entry.getElement());
		}
	}

	protected initTrigger(this: App.Fragment<this>): void {
		this.triggers.dialog.savestates.show.onTrigger(() => this.dialog.show());
		this.triggers.dialog.savestates.hide.onTrigger(() => this.dialog.hide());
	}

	protected initListener(this: App.Fragment<this>): void {}

	// -------------------------------------------------------------------------------------------------------------
	// | Handlers:                                                                                                 |
	// -------------------------------------------------------------------------------------------------------------

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------
}

// ---------------------------------------------------------------------------------------------------------------------
export default SavestateDialog;
export {SavestateDialog};
