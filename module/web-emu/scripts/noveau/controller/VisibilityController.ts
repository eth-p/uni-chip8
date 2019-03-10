//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import App from '../App';
import Trigger from '@chipotle/wfw/Trigger';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * The class that handles conditional visibility elements.
 */
class VisibilityController extends App {
	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	public constructor() {
		super();
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Hooks:                                                                                                    |
	// -------------------------------------------------------------------------------------------------------------

	protected init(this: App.Fragment<this>): void {
		this.settings.onChange('enable_debugger', (k, v) => {
			document.body.classList[v ? 'add' : 'remove']('debugger-enabled');
			document.body.classList[v ? 'remove' : 'add']('debugger-disabled');
		});

		this.settings.onChange('enable_advanced_settings', (k, v) => {
			document.body.classList[v ? 'add' : 'remove']('advanced-enabled');
			document.body.classList[v ? 'remove' : 'add']('advanced-disabled');
		});

		// Ready!
		this.ready();
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default VisibilityController;
export {VisibilityController};
