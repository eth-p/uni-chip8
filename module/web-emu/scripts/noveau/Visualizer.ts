//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Animator from '@chipotle/wfw/Animator';

import App from './App';
import Trigger from '@chipotle/wfw/Trigger';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * An abstract base class for a visualizer.
 */
abstract class Visualizer extends App {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected animator!: Animator;
	protected setting: string;

	protected frame!: HTMLElement;
	protected container!: HTMLElement;

	private visible: boolean;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	public constructor(triggers: {render: Trigger; reset: Trigger}, setting: string) {
		super();

		this.setting = setting;
		this.visible = true;
		this.render = this.render.bind(this);
		triggers.render.onTrigger(() => this.animator.render());
		triggers.reset.onTrigger(() => {
			(<any>this).reset();
			(<any>this).animator.render();
		});
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Hooks:                                                                                                    |
	// -------------------------------------------------------------------------------------------------------------

	protected initState(this: App.Fragment<this>): void {
		this.animator = new Animator(this.state.emulator.running, this.render);
	}

	protected initListener(this: App.Fragment<this>): void {
		this.settings.onChange(<any>this.setting, (e, v) => this.setVisible(v));
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                    |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Sets the visibility of the visualizer.
	 * @param visible The visibility.
	 */
	public setVisible(visible: boolean): void {
		this.visible = visible;
		this.frame.classList[visible ? 'remove' : 'add']('hide');
	}

	/**
	 * Gets the visibility state of the visualizer.
	 * @returns True if the visualizer should be visible.
	 */
	public isVisible(): boolean {
		return this.visible;
	}

	/**
	 * Renders the visualizer.
	 */
	public abstract render(this: App.Fragment<this>): void;

	/**
	 * Resets the visualizer.
	 */
	public abstract reset(this: App.Fragment<this>): void;
}

// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
export default Visualizer;
export {Visualizer};
