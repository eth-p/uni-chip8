//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Dialog from '@chipotle/wfw/Dialog';

import App from '../../App';
import Savestate from '../../Savestate';

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

		this.entries = ['quickslot', 1, 2, 3, 4, 5, 6, 7, 8, 9].map(slot => new SavestateEntry(<any>slot));
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Hooks:                                                                                                    |
	// -------------------------------------------------------------------------------------------------------------

	protected initDOM(this: App.Fragment<this>): void {
		this.dialog = new Dialog(document.getElementById('dialog-savestates')!);
		this.state.dialog.visible.addProvider(this.dialog.getVisibilityProvider());

		const container = this.dialog.getContentElement()!;

		// Generate list.
		this.refresh();
		for (let entry of this.entries) {
			container.appendChild(entry.getElement());
		}
	}

	protected initTrigger(this: App.Fragment<this>): void {
		this.triggers.dialog.savestates.show.onTrigger(() => this.dialog.show());
		this.triggers.dialog.savestates.hide.onTrigger(() => this.dialog.hide());
	}

	protected initListener(this: App.Fragment<this>): void {
		this.settings.addListener('update', setting => {
			if (setting.startsWith('savestate_')) this.refresh();
		});
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Handlers:                                                                                                 |
	// -------------------------------------------------------------------------------------------------------------

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Refreshes the savestate dialog entries.
	 * This will update the image and date.
	 */
	public refresh(): void {
		for (let entry of this.entries) {
			let savestate: Savestate | null = this.settings.get(<any>`savestate_${entry.getSlot()}`);
			if (savestate != null) {
				entry.setImage(savestate.screenshot);
				entry.setDate(new Date(savestate.date));
			}
		}
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default SavestateDialog;
export {SavestateDialog};
