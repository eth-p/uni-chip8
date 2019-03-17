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
		this.dialog = new Dialog(document.getElementById('dialog-savestates')!);
		this.state.dialog.visible.addProvider(this.dialog.getVisibilityProvider());

		this.container = this.dialog.getContentElement()!;

		// Generate list.
		this.refresh();
		for (let entry of this.entries) {
			this.container.appendChild(entry.getElement());
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

		this.container.addEventListener('click', event => {
			if (event.target == null) return;

			const button = <HTMLElement>event.target;
			const slot = button.getAttribute('data-savestate-slot');
			const action = button.getAttribute('data-savestate-action');

			if (slot == null || action == null) return;

			if (action === 'load') {
				const setting = this.settings.get(<any>`savestate_${slot}`);
				if (setting != null) {
					this.emulator.loadState(setting);
					this.dialog.hide();
				}
			} else if (action === 'save') {
				if (this.state.emulator.loaded.value) {
					this.settings.set(<any>`savestate_${slot}`, this.emulator.saveState());
					this.settings.save();
					this.dialog.hide();
				}
			} else if (action === 'delete') {
				this.settings.set(<any>`savestate_${slot}`, null);
				this.settings.save();
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
			const savestate: Savestate | null = this.settings.get(<any>`savestate_${entry.getSlot()}`);
			const enabled = savestate != null;

			entry.setLoadEnabled(enabled);
			if (enabled) {
				entry.setImage(savestate!.screenshot);
				entry.setDate(new Date(savestate!.date));
			}
		}
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default SavestateDialog;
export {SavestateDialog};
