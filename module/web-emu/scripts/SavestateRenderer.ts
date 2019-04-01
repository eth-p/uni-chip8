//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import VMContext from '@chipotle/vm/VMContext';

import Chip from '@chipotle/chip-arch/Chip';
import ChipDisplayRenderer from '@chipotle/chip-arch/ChipDisplayRenderer';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * A class that renders preview images for savestates.
 * This uses the ChipDisplayRenderer under the hood.
 */
class SavestateRenderer {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected canvas: HTMLCanvasElement;
	protected context: CanvasRenderingContext2D;
	protected renderer: ChipDisplayRenderer;

	protected readonly width: number;
	protected readonly height: number;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new savestate renderer.
	 * @param vm The virtual machine to render.
	 */
	public constructor(vm: VMContext<Chip>) {
		this.canvas = document.createElement('canvas');
		this.canvas.width = this.width = vm.display.WIDTH;
		this.canvas.height = this.height = vm.display.HEIGHT;

		this.context = this.canvas.getContext('2d')!;
		this.renderer = new ChipDisplayRenderer(vm.display);
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Renders the current screen of the virtual machine.
	 * This will be used as the savestate preview image.
	 */
	public render(): string {
		this.renderer.render(this.context, this.width, this.height, false, false);
		return this.canvas.toDataURL();
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default SavestateRenderer;
export {SavestateRenderer};
