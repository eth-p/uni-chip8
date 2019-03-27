//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import ChipDisplayRenderer from '@chipotle/chip-arch/ChipDisplayRenderer';

import App from '../../App';
import Visualizer from '../../Visualizer';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * Screen visualizer.
 * This renders the CHIP-8 screen.
 */
class ScreenVisualizer extends Visualizer {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected context!: CanvasRenderingContext2D;
	protected canvas!: HTMLCanvasElement;
	protected canvasWidth: number;
	protected canvasHeight: number;

	protected renderer: ChipDisplayRenderer;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	public constructor() {
		super(App.triggers.screen, null);

		this.renderer = new ChipDisplayRenderer(App.emulator.vm.display);
		this.canvasWidth = 0;
		this.canvasHeight = 0;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Hooks:                                                                                                    |
	// -------------------------------------------------------------------------------------------------------------

	protected initDOM(this: App.Fragment<this>): void {
		this.frame = this.container = <HTMLElement>document.querySelector('#emulator-screen');
		this.canvas = <HTMLCanvasElement>this.frame.querySelector(':scope > .screen');
		this.context = this.canvas.getContext('2d')!;

		this.reset();
	}

	protected async initTrigger(this: App.Fragment<this>): Promise<void> {
		this.triggers.screen.resize.onTrigger(this.resize.bind(this));
	}

	protected async initListener(this: App.Fragment<this>): Promise<void> {
		await (<any>Visualizer.prototype).initListener.call(<any>this);

		// Listeners to resize and redraw the screen.
		window.addEventListener('resize', () => this.reset());
		this.settings.addListener('update', setting => {
			if (
				setting.startsWith('display_') ||
				setting.startsWith('screen_') ||
				setting.startsWith('enable_') ||
				setting.startsWith('show_')
			) {
				this.reset();
			}
		});

		// Listeners for redrawing the screen.
		// This one will clear the screen when a program is loaded.
		this.emulator.addListener('load', () => {
			this.clear();
		});

		// Listeners for screen settings.
		this.settings.onChange('display_deflicker', (s, v) => {
			this.renderer.setDeflicker(v ? 0.2 : 0);
			this.render();
		});

		this.settings.onChange('screen_foreground', (s, v) => {
			this.renderer.setForeground(v);
			this.render();
		});

		this.settings.onChange('screen_background', (s, v) => {
			this.renderer.setBackground(v);
			this.render();
		});
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Recalculates and resizes the CHIP-8 screen.
	 * This is an extremely expensive operation, causing two layouts/reflows.
	 */
	public resize(): void {
		const canvas = this.canvas;
		const container = this.container;

		if (canvas.width !== container.offsetWidth || canvas.height !== container.offsetHeight) {
			// Force canvas to zero size, allowing parent to shrink.
			this.canvas.width = 0;
			this.canvas.height = 0;

			// Force canvas to parent size.
			this.canvasWidth = canvas.width = container.offsetWidth;
			this.canvasHeight = canvas.height = container.offsetHeight;
		}
	}

	/**
	 * Clears the screen.
	 */
	public clear(this: App.Fragment<this>): void {
		const deflicker = this.renderer.getDeflicker();

		this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		this.renderer.setDeflicker(0);
		this.render();
		this.renderer.setDeflicker(deflicker);
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Implementation:                                                                                           |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * @override
	 */
	public render(this: App.Fragment<this>): void {
		this.renderer.render(
			this.context,
			this.canvasWidth,
			this.canvasHeight,
			this.settings.display_scaling,
			this.settings.display_frameless
		);
	}

	/**
	 * @override
	 */
	public reset(this: App.Fragment<this>): void {
		this.resize();

		this.clear();
		this.render();
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default ScreenVisualizer;
export {ScreenVisualizer};
