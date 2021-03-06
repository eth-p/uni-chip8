//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Dialog from '@chipotle/wfw/Dialog';

import App from '../../App';
import Savestate from '../../Savestate';

import SavestateEntry from './SavestateEntry';
import VMSnapshot from '@chipotle/vm/VMSnapshot';

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
	protected container!: HTMLElement;

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
		this.dialog = new Dialog(document.getElementById('dialog-savestates')!, this.triggers.dialog.savestates);
		this.state.dialog.visible.addProvider(this.dialog.getVisibilityProvider());

		this.container = this.dialog.getContentElement()!;

		// Generate list.
		this.refresh();
		for (let entry of this.entries) {
			this.container.appendChild(entry.getElement());
		}
	}

	protected initListener(this: App.Fragment<this>): void {
		this.savestates.addListener('update', setting => {
			if (setting.startsWith('savestate_')) this.refresh();
		});

		this.container.addEventListener('click', event => {
			if (event.target == null) return;

			const button = <HTMLElement>event.target;
			const slot = button.getAttribute('data-savestate-slot');
			const action = button.getAttribute('data-savestate-action');

			if (slot == null || action == null) return;

			if (action === 'load') {
				const setting = this.savestates.get(<any>`savestate_${slot}`);
				if (setting != null) {
					this.emulator.loadState(setting);
					this.dialog.hide();
				}
			} else if (action === 'save') {
				if (this.state.emulator.loaded.value) {
					this.savestates.set(<any>`savestate_${slot}`, this.emulator.saveState());
					this.savestates.save();
					this.dialog.hide();
				}
			} else if (action === 'delete') {
				this.savestates.set(<any>`savestate_${slot}`, null);
				this.savestates.save();
			}
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
			const savestate: Savestate | null = this.savestates.get(<any>`savestate_${entry.getSlot()}`);
			const enabled = savestate != null && savestate.snapshot.__VERS === VMSnapshot.VERSION;
			const invalid = savestate != null && savestate.snapshot.__VERS !== VMSnapshot.VERSION;

			entry.setLoadEnabled(enabled);
			if (enabled) {
				entry.setImage(savestate!.screenshot);
				entry.setDate(new Date(savestate!.date));
				entry.setError(null);
			} else if (invalid) {
				entry.setImage(savestate!.screenshot);
				entry.setDate(new Date(savestate!.date));
				entry.setError('Incompatible savestate version.');
			}
		}
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default SavestateDialog;
export {SavestateDialog};
