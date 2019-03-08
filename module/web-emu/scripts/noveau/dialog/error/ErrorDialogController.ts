//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Dialog from '@chipotle/wfw/Dialog';

import App from '../../App';

import ErrorTranslator from './ErrorTranslator';
import ErrorTranslatorSimple from './ErrorTranslatorSimple';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * The class for controlling the error dialog.
 */
class ErrorDialogController extends App {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected dialog!: Dialog;
	protected dialogMessage!: HTMLElement;
	protected dialogTroubleshoot!: HTMLElement;
	protected dialogTrace!: HTMLElement;
	protected translator: ErrorTranslator;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	public constructor() {
		super();

		this.translator = new ErrorTranslator();
		this.settings.onChange(
			'enable_debugger',
			(_, val) => (this.translator = new (val ? ErrorTranslator : ErrorTranslatorSimple)())
		);
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Hooks:                                                                                                    |
	// -------------------------------------------------------------------------------------------------------------

	protected init(this: App.Fragment<this>): void {
		this.dialog = new Dialog(<HTMLElement>document.querySelector('#dialog-error'));
		this.dialogMessage = this.dialog.getContentElement('> .message')!;
		this.dialogTroubleshoot = this.dialog.getContentElement('> .troubleshooting')!;
		this.dialogTrace = this.dialog.getContentElement('> .trace')!;

		// Add listeners.
		this.addListener('error', (error, category) => {
			this.setError(error);
			this.dialog.show();
		});

		// Add providers.
		this.state.dialog.visible.addProvider(this.dialog.getVisibilityProvider());

		// Connect triggers.
		this.triggers.dialog.error.hide.onTrigger(() => this.dialog.hide());
		this.triggers.dialog.error.show.onTrigger(() => this.dialog.show());
		this.triggers.dialog.error.setError.onTrigger(this.setError.bind(this));

		// Ready.
		this.ready();
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Sets the dialog error details.
	 *
	 * @param error The error object.
	 */
	public setError(error: Error): void {
		let message = this.translator.getMessage(error);

		this.dialogMessage.textContent = message.message;
		this.dialogTrace.textContent = message.trace || '';
		this.dialogTroubleshoot.textContent = message.troubleshooting;

		if (message.trace == null) {
			this.dialogTrace.classList.add('hide');
		} else {
			this.dialogTrace.classList.remove('hide');
		}
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default ErrorDialogController;
export {ErrorDialogController};
