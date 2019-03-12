//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import App from '../../App';
import Visualizer from '../../Visualizer';

import StackFrame from './StackFrame';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * Stack visualizer.
 * This displays the state of the CHIP-8 stack.
 */
class StackVisualizer extends Visualizer {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected container!: HTMLElement;
	protected framePC: StackFrame;
	protected frames: StackFrame[];

	protected lastPointer: number;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	public constructor() {
		super(App.triggers.visualizer.stack, 'show_stack');

		this.lastPointer = -1;
		this.framePC = new StackFrame('PC');
		this.frames = [];
		for (let i = 0; i < this.emulator.vm.stack.getCapacity(); i++) {
			this.frames[i] = new StackFrame(i);
		}

		console.log(this);
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Hooks:                                                                                                    |
	// -------------------------------------------------------------------------------------------------------------

	protected initDOM(this: App.Fragment<this>): void {
		this.frame = <HTMLElement>document.querySelector('#visualizer-stack');
		this.container = <HTMLElement>this.frame.querySelector(':scope > .visualizer-content');

		this.container.appendChild(this.framePC.getElement());
		for (let frame of this.frames) {
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
		this.framePC.set(this.emulator.vm.program_counter);

		const stackObject = this.emulator.vm.stack;
		const stack = stackObject.inspectRaw();
		const pointer = stackObject.getPointer();

		// Clear all frames.
		if (pointer !== this.lastPointer) {
			this.lastPointer = pointer;

			if (pointer < stackObject.getCapacity() - 1) {
				this.frames[pointer + 1].setVisible(true);
			}

			for (let frame of this.frames) {
				frame.setEmpty();
			}
		}

		// Render used frames.
		for (let i = 0; i <= pointer; i++) {
			this.frames[pointer - i].set(stack[i]);
		}
	}

	/**
	 * @override
	 */
	public reset(): void {
		this.framePC.reset();
		this.lastPointer = -2;
		for (let frame of this.frames) frame.reset();
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default StackVisualizer;
export {StackVisualizer};
