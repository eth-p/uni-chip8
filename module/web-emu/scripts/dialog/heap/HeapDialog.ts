//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Dialog from '@chipotle/wfw/Dialog';

import App from '../../App';

import HeapMemoryViewer from './HeapMemoryViewer';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * The dialog for viewing the program heap.
 */
class HeapDialog extends App {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected dialog!: Dialog;
	protected viewerMemory!: HeapMemoryViewer;
	protected needsRefresh: boolean;
	protected needsRegenerate: boolean;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	public constructor() {
		super();

		this.needsRefresh = true;
		this.needsRegenerate = true;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Hooks:                                                                                                    |
	// -------------------------------------------------------------------------------------------------------------

	protected initDOM(this: App.Fragment<this>): void {
		this.dialog = new Dialog(document.getElementById('dialog-heap')!, this.triggers.dialog.heap);
		this.dialog.addListener('show', () => (this.needsRefresh ? this.refresh(true) : null));

		this.state.dialog.visible.addProvider(this.dialog.getVisibilityProvider());

		this.viewerMemory = new HeapMemoryViewer(
			this.dialog.getContentElement('#dialog-heap-viewer .memory-contents')!,
			this.emulator.vm.program
		);
	}

	protected initListener(this: App.Fragment<this>): void {
		this.emulator.addListener('load', () => {
			this.needsRegenerate = true;
		});

		this.emulator.addListener('step', () => this.refresh());
		this.dialog.addListener('show', () => this.refresh());
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Refreshes the dialog components.
	 * This will update the viewer and disassembler.
	 */
	public refresh(force?: boolean): void {
		if (!force && !this.dialog.isVisible()) {
			this.needsRefresh = true;
			return;
		}

		this.needsRefresh = false;

		// Regenerate the viewer.
		if (this.needsRegenerate) {
			this.viewerMemory.generate();
		}

		// Refresh the viewer.
		this.viewerMemory.refresh();
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default HeapDialog;
export {HeapDialog};
