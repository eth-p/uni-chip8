//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import App from '../../App';
import Visualizer from '../../Visualizer';

import RegisterDisplay from './RegisterDisplay';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * Register visualizer.
 * This displays the CHIP-8 register contents.
 */
class RegisterVisualizer extends Visualizer {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected container!: HTMLElement;

	protected displays!: RegisterDisplay[];

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	public constructor() {
		super(App.triggers.visualizer.register, 'show_registers', true);

		this.displays = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0xa, 0xb, 0xc, 0xd, 0xe, 0xf, 'DT', 'ST', 'I', 'PC'].map(
			<any>this.createDisplay,
			this
		);
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Hooks:                                                                                                    |
	// -------------------------------------------------------------------------------------------------------------

	protected initDOM(this: App.Fragment<this>): void {
		this.frame = <HTMLElement>document.querySelector('#visualizer-registers');
		this.container = <HTMLElement>this.frame.querySelector(':scope > .visualizer-content');

		for (let display of this.displays) {
			this.container.appendChild(display.getElement());
		}
	}

	protected async initState(this: App.Fragment<this>): Promise<void> {
		await (<any>Visualizer.prototype).initState.call(<any>this);

		this.state.emulator.paused.addListener('change', paused => {
			const loaded = this.state.emulator.loaded.value;
			for (let display of this.displays) {
				display.setEditable(paused && loaded);
			}
		});
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a register display component.
	 *
	 * @param register The register.
	 * @returns The display component.
	 */
	protected createDisplay(register: number | 'DT' | 'ST' | 'I' | 'PC'): RegisterDisplay {
		const vm = this.emulator.vm;

		if (typeof register === 'number') {
			const vRegisters = vm.register_data;
			return new RegisterDisplay(
				`V${register.toString(16).toUpperCase()}`,
				() => {
					return vRegisters[register];
				},
				v => {
					vRegisters[register] = v;
				}
			);
		}

		switch (register) {
			case 'DT':
				return new RegisterDisplay('DT', () => vm.register_timer, v => (vm.register_timer = v));

			case 'ST':
				return new RegisterDisplay('ST', () => vm.register_sound, v => (vm.register_sound = v));

			case 'I':
				return new RegisterDisplay('I', () => vm.register_index, v => (vm.register_index = v));

			case 'PC':
				return new RegisterDisplay('PC', () => vm.program_counter, v => (vm.program_counter = v));

			default:
				throw new Error(`Unknown register: ${register}`);
		}
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Implementation:                                                                                           |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * @override
	 */
	public render(this: App.Fragment<this>): void {
		for (let display of this.displays) {
			display.render();
		}
	}

	/**
	 * @override
	 */
	public reset(): void {
		for (let display of this.displays) {
			display.reset();
		}
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default RegisterVisualizer;
export {RegisterVisualizer};
