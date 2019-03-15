//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import App from '../App';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * The class that handles showing and hiding the dialog overlay.
 */
class DialogController extends App {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected overlay!: HTMLElement;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	public constructor() {
		super();
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Hooks:                                                                                                    |
	// -------------------------------------------------------------------------------------------------------------

	protected initDOM(this: App.Fragment<this>): void {
		this.overlay = <HTMLElement>document.getElementById('dialogs');
	}

	protected initState(this: App.Fragment<this>): void {
		this.state.dialog.visible.addListener('change', visible => {
			this.overlay.classList[visible ? 'add' : 'remove']('visible');
			document.body.classList[visible ? 'add' : 'remove']('no-scroll');
			document.body.scrollTop = 0;
		});
	}

	protected initListener(this: App.Fragment<this>): void {
		// When a dialog is visible, reset the scroll position on input unfocus.
		// This fixes a bug where the scroll will be stuck on phones after typing something.
		document.addEventListener('focusout', event => {
			if (!this.state.dialog.visible.value) return;
			if (event.target == null || (<Node>event.target).nodeName !== 'INPUT') return;

			const target = <HTMLInputElement>event.target;
			if (target.type === 'color' || target.type === 'checkbox') return;

			document.body.scrollTop = 0;
		});
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default DialogController;
export {DialogController};
