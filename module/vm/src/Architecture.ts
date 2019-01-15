//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import ISA from './ISA';
import Op from './Op';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A computer architecture.
 * This class represents the available components and instruction set of a specific computer.
 */
export default abstract class Architecture {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The instruction set.
	 */
	public readonly isa: Op<this>[];

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new computer architecture.
	 * @param isa The instruction set of the architecture.
	 */
	protected constructor(isa: ISA<Architecture>) {
		this.isa = isa.map(op => new op());
	}
}
