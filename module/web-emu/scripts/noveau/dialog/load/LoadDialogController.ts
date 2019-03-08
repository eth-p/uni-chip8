//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import DialogTabbed from '@chipotle/wfw/DialogTabbed';
import ElementFactory from '@chipotle/wfw/ElementFactory';

import App from '../../App';

import ProgramDatabase from './ProgramDatabase';
import Program from './Program';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * The class for controlling the load dialog.
 */
class LoadDialogController extends App {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected dialog!: DialogTabbed;
	protected dialogLists!: Map<String, HTMLElement>;
	protected database: ProgramDatabase;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	public constructor() {
		super();

		this.database = new ProgramDatabase();
		this.database.addListener('load', () => (<any>this).createLists());
		this.database.addListener('error', () => (<any>this).errorLists());
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Hooks:                                                                                                    |
	// -------------------------------------------------------------------------------------------------------------

	protected init(this: App.Fragment<this>): void {
		this.database.load();

		this.dialog = new DialogTabbed(document.getElementById('dialog-load')!);

		// Get library lists.
		this.dialogLists = new Map();
		for (let element of this.dialog.getElement().querySelectorAll('[data-library]')) {
			this.dialogLists.set(element.getAttribute('data-library')!, <HTMLElement>element);
		}

		// Add providers.
		this.state.dialog.visible.addProvider(this.dialog.getVisibilityProvider());

		// Connect triggers.
		this.triggers.dialog.load.show.addListener('trigger', () => this.dialog.show());
		this.triggers.dialog.load.hide.addListener('trigger', () => this.dialog.hide());

		// Add listeners.
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

		this.ready();
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
		return PROGRAM_ELEMENT.template('rom', program.url)
			.template('name', program.name)
			.template('info', program.info)
			.template('author', {name: program.authorName, url: program.authorPage})
			.create();
	}
}

// ---------------------------------------------------------------------------------------------------------------------

const PROGRAM_ELEMENT = new ElementFactory('div', {
	classes: ['program-library-item'],
	template: {
		rom: (f, v) => f.data('program-rom', v)
	}
})
	.child('div', {classes: 'program-name'}, f => {
		f.setTemplateFunction('name', (f, n) => {
			f.text(n);
		});
	})
	.child('a', {classes: 'program-author'}, f => {
		f.setTemplateFunction('author', (f, a) => {
			f.text(a.name);
			f.attr('href', a.url);
		});
	})
	.child('div', {classes: 'program-info'}, f => {
		f.setTemplateFunction('info', (f, i) => {
			f.text(i);
		});
	});

// ---------------------------------------------------------------------------------------------------------------------
export default LoadDialogController;
export {LoadDialogController};
