//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------

/**
 * Chip-8 sprite.
 *
 * ```
 * 01101110 => | SS PPP |
 * 01001110 => | S  PPP |
 * 11001000 => |SS  P   |
 * ```
 */
class ChipKeyboard {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	public keys: Array<boolean>;

	// -------------------------------------------------------------------------------------------------------------
	// | Setters and Getter aliases:                                                                               |
	// -------------------------------------------------------------------------------------------------------------

	public set KEY_0(state: boolean) {
		this.keys[0] = state;
	}

	public get KEY_0(): boolean {
		return this.keys[0];
	}

	public set KEY_1(state: boolean) {
		this.keys[1] = state;
	}

	public get KEY_1(): boolean {
		return this.keys[1];
	}

	public set KEY_2(state: boolean) {
		this.keys[2] = state;
	}

	public get KEY_2(): boolean {
		return this.keys[2];
	}

	public set KEY_3(state: boolean) {
		this.keys[3] = state;
	}

	public get KEY_3(): boolean {
		return this.keys[3];
	}

	public set KEY_4(state: boolean) {
		this.keys[4] = state;
	}

	public get KEY_4(): boolean {
		return this.keys[4];
	}

	public set KEY_5(state: boolean) {
		this.keys[5] = state;
	}

	public get KEY_5(): boolean {
		return this.keys[5];
	}

	public set KEY_6(state: boolean) {
		this.keys[6] = state;
	}

	public get KEY_6(): boolean {
		return this.keys[6];
	}

	public set KEY_7(state: boolean) {
		this.keys[7] = state;
	}

	public get KEY_7(): boolean {
		return this.keys[7];
	}

	public set KEY_8(state: boolean) {
		this.keys[8] = state;
	}

	public get KEY_8(): boolean {
		return this.keys[8];
	}

	public set KEY_9(state: boolean) {
		this.keys[9] = state;
	}

	public get KEY_9(): boolean {
		return this.keys[9];
	}

	public set KEY_A(state: boolean) {
		this.keys[0xa] = state;
	}

	public get KEY_A(): boolean {
		return this.keys[0xa];
	}

	public set KEY_B(state: boolean) {
		this.keys[0xb] = state;
	}

	public get KEY_B(): boolean {
		return this.keys[0xb];
	}

	public set KEY_C(state: boolean) {
		this.keys[0xc] = state;
	}

	public get KEY_C(): boolean {
		return this.keys[0xc];
	}

	public set KEY_D(state: boolean) {
		this.keys[0xd] = state;
	}

	public get KEY_D(): boolean {
		return this.keys[0xd];
	}

	public set KEY_E(state: boolean) {
		this.keys[0xe] = state;
	}

	public get KEY_E(): boolean {
		return this.keys[0xe];
	}

	public set KEY_F(state: boolean) {
		this.keys[0xf] = state;
	}

	public get KEY_F(): boolean {
		return this.keys[0xf];
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new keyboard.
	 */
	public constructor() {
		this.keys = new Array<boolean>(16);
		this.keys.fill(false);
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Resets the keyboard key states.
	 */
	reset() {
		this.keys.fill(false);
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default ChipKeyboard;
export {ChipKeyboard};
