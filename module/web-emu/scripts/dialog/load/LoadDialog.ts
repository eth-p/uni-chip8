//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import DialogTabbed from '@chipotle/wfw/DialogTabbed';

import App from '../../App';

import Library from './Library';
import Program from './Program';
import LibraryEntry from './LibraryEntry';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * The class for controlling the load dialog.
 */
class LoadDialog extends App {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected dialog!: DialogTabbed;
	protected dialogLists!: Map<String, HTMLElement>;
	protected dialogUploadBox!: HTMLElement;
	protected dialogUploadField!: HTMLInputElement;
	protected database: Library;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	public constructor() {
		super();

		this.database = new Library();
		this.database.addListener('load', () => (<any>this).createLists());
		this.database.addListener('error', () => (<any>this).errorLists());
		this.database.addListener('error', ex => console.error(ex));
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Hooks:                                                                                                    |
	// -------------------------------------------------------------------------------------------------------------

	protected initDOM(this: App.Fragment<this>): void {
		this.database.load();

		this.dialog = new DialogTabbed(document.getElementById('dialog-load')!, this.triggers.dialog.load);
		this.dialogUploadBox = this.dialog.getContentElement('#program-upload-display')!;
		this.dialogUploadField = <HTMLInputElement>this.dialog.getContentElement('#program-upload');

		this.state.dialog.visible.addProvider(this.dialog.getVisibilityProvider());

		// Get library lists.
		this.dialogLists = new Map();
		for (let element of this.dialog.getContentElements('[data-library]')) {
			this.dialogLists.set(element.getAttribute('data-library')!, <HTMLElement>element);
		}
	}

	protected initListener(this: App.Fragment<this>): void {
		this.state.emulator.loading.addListener('change', v => (!v ? this.dialog.hide() : void 0));
		this.dialog.getElement().addEventListener('click', event => {
			let target = <HTMLElement>event.target;
			if (target == null) return;
			while (target !== this.dialog.getElement() && target != null) {
				let url = target.getAttribute('data-program-rom');
				if (url != null) {
					this.triggers.rom.loadRemote.trigger(url);
					return;
				}

				target = <HTMLElement>target.parentNode;
			}
		});

		// Add upload support.
		this.dialogUploadField.addEventListener('change', () => {
			this.triggers.rom.loadLocal.trigger(this.dialogUploadField.files![0]);
			return false;
		});

		this.dialogUploadBox.addEventListener('drop', this.uploadDrop.bind(this));
		this.dialogUploadBox.addEventListener('dragenter', this.uploadNothing.bind(this));
		this.dialogUploadBox.addEventListener('dragover', e => {
			e.preventDefault();
			e.stopPropagation();
			e.dataTransfer!.dropEffect = 'copy';
		});

		// Disable drag and drop on the window itself.
		window.addEventListener('dragover', this.uploadNothing.bind(this));
		window.addEventListener('drop', this.uploadNothing.bind(this));
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Handlers:                                                                                                 |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * An event handler to upload a program using drag and drop.
	 * @param event The event.
	 */
	protected uploadDrop(event: DragEvent): boolean {
		event.preventDefault();
		event.stopPropagation();

		if (event.dataTransfer!.files[0] instanceof Blob) {
			this.triggers.rom.loadLocal.trigger(event.dataTransfer!.files[0]);
		}

		return false;
	}

	/**
	 * An event handler to hide the drag and drop cursor.
	 * @param event The event.
	 */
	protected uploadNothing(event: Event & DragEvent): boolean {
		event.preventDefault();
		event.stopPropagation();

		if (event.dataTransfer != null) {
			event.dataTransfer.dropEffect = 'none';
		}

		return false;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Displays an error message in the game lists.
	 */
	protected errorLists(this: App.Fragment<this>): void {
		for (let [type, element] of this.dialogLists.entries()) {
			while (element.firstChild != null) element.removeChild(element.firstChild);
			element.appendChild(document.createTextNode('Failed to load game library.'));
		}
	}

	/**
	 * Creates and populates the game lists.
	 */
	protected createLists(this: App.Fragment<this>): void {
		for (let [type, element] of this.dialogLists.entries()) {
			while (element.firstChild != null) element.removeChild(element.firstChild);
			for (let program of this.database.getPrograms(p => p.type === type)) {
				element.appendChild(this.createListItem(program));
			}
		}
	}

	/**
	 * Creates a list entry item for a given program.
	 * @param program The program object.
	 */
	protected createListItem(this: App.Fragment<this>, program: Program): HTMLElement {
		return new LibraryEntry(program).getElement();
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default LoadDialog;
export {LoadDialog};
