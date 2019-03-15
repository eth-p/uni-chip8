//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import App from '../../App';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 keypad and key press visualizer.
 * This is technically a visualizer, but doesn't extend Visualizer since it's passive.
 */
class KeypadVisualizer extends App {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected container!: HTMLElement;
	protected keys!: HTMLElement[];

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
		this.container = <HTMLElement>document.querySelector('#emulator-keypad');
		this.keys = <HTMLElement[]>Array.from(this.container.querySelectorAll(':scope [data-keypad-key]')).sort(
			(a: Element, b: Element) => {
				let aKey = parseInt(a.getAttribute('data-keypad-key')!, 16);
				let bKey = parseInt(b.getAttribute('data-keypad-key')!, 16);
				return aKey - bKey;
			}
		);
	}

	protected async initListener(this: App.Fragment<this>): Promise<void> {
		this.settings.onChange(['show_keypad'], (s, v) => this.setVisible(v));
		this.emulator.addListener('keydown', key => this.keys[parseInt(key, 16)].classList.add('pressed'));
		this.emulator.addListener('keyup', key => this.keys[parseInt(key, 16)].classList.remove('pressed'));

		const onDown = this.wrapListener(key => this.emulator.keydown(key));
		const onUp = this.wrapListener(key => this.emulator.keyup(key));

		for (let key of this.keys) {
			key.addEventListener('touchstart', onDown);
			key.addEventListener('mousedown', onDown);
			key.addEventListener('touchend', onUp);
			key.addEventListener('mouseup', onUp);
		}
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Internal:                                                                                                 |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Wraps a listener to make it easier to implement keydown/keyup.
	 *
	 * @param listener The listener to wrap.
	 *
	 * @returns The wrapped listener.
	 */
	protected wrapListener(listener: (key: string) => void) {
		return function(event: MouseEvent | TouchEvent) {
			if (event.target == null) return;

			let key = (<HTMLElement>event.target).getAttribute('data-keypad-key');
			if (key == null) return;

			listener(key);
			event.preventDefault();
			event.stopImmediatePropagation();
			return false;
		};
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Sets the visibility of the keypad.
	 * @param visible The visibility.
	 */
	public setVisible(visible: boolean): void {
		this.container.classList[visible ? 'remove' : 'add']('hide');
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default KeypadVisualizer;
export {KeypadVisualizer};
