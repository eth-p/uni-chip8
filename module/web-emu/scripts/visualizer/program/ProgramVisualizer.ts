//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import App from '../../App';
import Visualizer from '../../Visualizer';

import ProgramFrame from './ProgramFrame';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * Program visualizer.
 * This displays the CHIP-8 program.
 */
class ProgramVisualizer extends Visualizer {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected container!: HTMLElement;

	protected itemsBefore: number;
	protected itemsAfter: number;

	protected frames!: ProgramFrame[];

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	public constructor() {
		super(App.triggers.visualizer.program, 'show_disassembler', true);

		this.itemsBefore = 0;
		this.itemsAfter = 0;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Hooks:                                                                                                    |
	// -------------------------------------------------------------------------------------------------------------

	protected initDOM(this: App.Fragment<this>): void {
		this.frame = <HTMLElement>document.querySelector('#visualizer-program');
		this.container = <HTMLElement>this.frame.querySelector(':scope > .visualizer-content');
		this.regenerate();
	}

	protected async initListener(this: App.Fragment<this>): Promise<void> {
		await (<any>Visualizer.prototype).initListener.call(<any>this);
		this.settings.onChange(['disassemble_prev_count', 'disassemble_next_count'], () => this.regenerate());
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Regenerates the visualizer items.
	 */
	protected regenerate() {
		while (this.container.firstChild != null) this.container.removeChild(this.container.firstChild);

		// Cache the draw numbers.
		this.itemsBefore = this.settings.disassemble_prev_count;
		this.itemsAfter = this.settings.disassemble_next_count;

		// Create the frames.
		this.frames = [];
		for (let i = -this.itemsBefore; i < this.itemsAfter; i++) {
			let frame = new ProgramFrame(i);

			this.frames.push(frame);
			this.container.appendChild(frame.getElement());
		}
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Implementation:                                                                                           |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * @override
	 */
	public render(this: App.Fragment<this>): void {
		const vm = this.emulator.vm;
		const start = vm.program_counter - this.itemsBefore * 2;
		const max = this.itemsBefore + this.itemsAfter;
		const eof = vm.program.data == null ? 0 : vm.program.data.length;

		const program = this.emulator.vm.program;
		const disassembler = this.disassembler;

		// Draw.
		let addr = start;
		for (let i = 0; i < max; i++, addr += 2) {
			const frame = this.frames[i];

			if (addr < 0 || addr >= eof) {
				frame.reset();
			} else {
				frame.set(addr, disassembler.disassemble(program.fetch(addr)));
			}
		}
	}

	/**
	 * @override
	 */
	public reset(): void {
		for (let frame of this.frames) {
			frame.reset();
		}
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default ProgramVisualizer;
export {ProgramVisualizer};
