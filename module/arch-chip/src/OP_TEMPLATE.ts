//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Uint16 from '@chipotle/types/Uint16';

import OperandType from '@chipotle/isa/OperandType';
import OperandTags from '@chipotle/isa/OperandTags';

import {Operation, Context} from './Operation';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * CHIP-8 INSTRUCTION:
 *
 * '0000'
 */
export default class OP_TEMPLATE extends Operation {
	public constructor() {
		super('TMP', 0x0000, [
			// {
			// 	mask: 0x0000,
			// 	type: OperandType.REGISTER,
			// 	tags: {[OperandTags.IS_DESTINATION]: true}
			// }
		]);
	}

	public execute(this: void, context: Context, operands: Uint16[]): void {
		// const p1 = operands[0];
	}
}
