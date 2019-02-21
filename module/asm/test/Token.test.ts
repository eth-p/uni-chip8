//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Token from '../src/Token';
import TokenType from '../src/TokenType';
// ---------------------------------------------------------------------------------------------------------------------

describe('Token', () => {
	it('constructor', () => {
		let token = new Token(TokenType.PARAMETER_CONSTANT, '32', 1, 5);
		expect(token.type).toStrictEqual(TokenType.PARAMETER_CONSTANT);
		expect(token.text).toStrictEqual('32');
		expect(token.line).toStrictEqual(1);
		expect(token.column).toStrictEqual(5);
	});

	it('toString', () => {
		let token = new Token(TokenType.PARAMETER_CONSTANT, '32', 1, 5);
		expect(token.toString()).toStrictEqual('32');
	});
});
