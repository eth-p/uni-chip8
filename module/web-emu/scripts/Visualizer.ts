//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {ALL_TRUE} from '@chipotle/wfw/StateReducer';
import State from '@chipotle/wfw/State';
import StateProvider from '@chipotle/wfw/StateProvider';
import Animator from '@chipotle/wfw/Animator';
import Trigger from '@chipotle/wfw/Trigger';

import App from './App';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * An abstract base class for a visualizer.
 */
abstract class Visualizer extends App {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected animator!: Animator;
	protected animatorState: State<boolean>;
	protected setting: string | null;

	protected frame!: HTMLElement;
	protected container!: HTMLElement;

	private visible: StateProvider<boolean>;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new visualizer.
	 *
	 * @param triggers The visualizer triggers.
	 * @param setting The visualizer enabled setting.
	 *
	 * @param requires_debug If the visualizer requires debugging enabled.
	 */
	public constructor(triggers: {render: Trigger; reset: Trigger}, setting: string | null, requires_debug?: boolean) {
		super();

		this.setting = setting;
		this.visible = new StateProvider<boolean>(true);
		this.render = this.render.bind(this);

		this.animatorState = new State<boolean>(ALL_TRUE);
		this.animatorState.addProvider(this.visible);
		this.animatorState.addProviderFrom(this.state.emulator.running, value => value);

		triggers.render.onTrigger(() => this.animator.render());
		triggers.reset.onTrigger(() => {
			(<any>this).reset();
			(<any>this).animator.render();
		});

		if (requires_debug) {
			this.animatorState.addProviderFrom(this.state.emulator.debug, v => v);
		}
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Hooks:                                                                                                    |
	// -------------------------------------------------------------------------------------------------------------

	protected initState(this: App.Fragment<this>): void {
		this.animator = new Animator(this.animatorState, this.render);
	}

	protected initListener(this: App.Fragment<this>): void {
		if (this.setting != null) {
			this.settings.onChange(<any>this.setting, (e, v) => this.setVisible(v));
		}
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                    |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Sets the visibility of the visualizer.
	 * @param visible The visibility.
	 */
	public setVisible(visible: boolean): void {
		this.visible.value = visible;
		this.frame.classList[visible ? 'remove' : 'add']('hide');
	}

	/**
	 * Gets the visibility state of the visualizer.
	 * @returns True if the visualizer should be visible.
	 */
	public isVisible(): boolean {
		return this.visible.value;
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
