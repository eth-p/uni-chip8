//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Lexer from '../src/Lexer';
import TokenType from '../src/TokenType';
// ---------------------------------------------------------------------------------------------------------------------

describe('Lexer', () => {
	it('constructor', () => {
		let source = 'test';
		let lexer = new Lexer(source);
		expect((<any>lexer).lines).toEqual(['test']);
		expect((<any>lexer).current).toEqual('test');
		expect(lexer.getLine()).toEqual(0);
		expect(lexer.getColumn()).toEqual(0);
	});

	it('hasNext', () => {
		let lexer = new Lexer('');
		expect(lexer.hasNext()).toStrictEqual(true);
		lexer.next();
		expect(lexer.hasNext()).toStrictEqual(false);
	});

	it('next', () => {
		let lexer = new Lexer('test ing');
		let next = lexer.next();
		expect(next.text).toStrictEqual('test');
		expect(next.type).toStrictEqual(TokenType.UNKNOWN);
		next = lexer.next();
		expect(next.text).toStrictEqual(' ');
		expect(next.type).toStrictEqual(TokenType.UNKNOWN);

		lexer = new Lexer('');
		next = lexer.next();
		expect(next.text).toStrictEqual('\n');
		expect(next.type).toStrictEqual(TokenType.EOL);
	});

	it('reset', () => {
		let lexer = new Lexer('test\ning test');
		lexer.next();
		lexer.next();
		lexer.next();
		lexer.reset();
		expect((<any>lexer).current).toStrictEqual('test');
		expect(lexer.getColumn()).toStrictEqual(0);
		expect(lexer.getLine()).toStrictEqual(0);
	});

	it('getColumn()', () => {
		let lexer = new Lexer('test ing');
		lexer.next();
		expect(lexer.getColumn()).toStrictEqual(4);
	});

	it('getLine()', () => {
		let lexer = new Lexer('test');
		lexer.next();
		lexer.next();
		expect(lexer.getLine()).toStrictEqual(1);
	});

	it('toArray', () => {
		let lexer = new Lexer('test\ning test');
		let tokens = lexer.toArray();

		expect(tokens).toBeInstanceOf(Array);
		expect(tokens.length).toStrictEqual(6);

		expect(tokens[0]).toHaveProperty('text', 'test');
		expect(tokens[0]).toHaveProperty('type', TokenType.UNKNOWN);

		expect(tokens[1]).toHaveProperty('text', '\n');
		expect(tokens[1]).toHaveProperty('type', TokenType.EOL);

		expect(tokens[2]).toHaveProperty('text', 'ing');
		expect(tokens[2]).toHaveProperty('type', TokenType.UNKNOWN);

		expect(tokens[3]).toHaveProperty('text', ' ');
		expect(tokens[3]).toHaveProperty('type', TokenType.UNKNOWN);

		expect(tokens[4]).toHaveProperty('text', 'test');
		expect(tokens[4]).toHaveProperty('type', TokenType.UNKNOWN);

		expect(tokens[5]).toHaveProperty('text', '\n');
		expect(tokens[5]).toHaveProperty('type', TokenType.EOL);
	});
});

describe('Lexer Tokenization', () => {
	it('Comments', () => {
		let lexer = new Lexer('hello world; and goodbye!');
		let result = lexer.toArray().map(x => x.text);
		expect(result).toEqual(['hello', ' ', 'world', '; and goodbye!', '\n']);
	});

	it('Whitespace', () => {
		let lexer = new Lexer(' \t x\ty z ');
		let result = lexer.toArray().map(x => x.text);
		expect(result).toEqual([' \t ', 'x', '\t', 'y', ' ', 'z', ' ', '\n']);
	});

	it('Label', () => {
		let lexer = new Lexer('hello:\tworld');
		let result = lexer.toArray().map(x => x.text);
		expect(result).toEqual(['hello', ':', '\t', 'world', '\n']);
	});

	it('Directive', () => {
		let lexer = new Lexer('.syntax att');
		let result = lexer.toArray().map(x => x.text);
		expect(result).toEqual(['.', 'syntax', ' ', 'att', '\n']);
	});

	it('Macro', () => {
		let lexer = new Lexer('.macro name p1:reg, p2=$4');
		let result = lexer.toArray().map(x => x.text);
		expect(result).toEqual(['.', 'macro', ' ', 'name', ' ', 'p1', ':', 'reg', ',', ' ', 'p2', '=', '$4', '\n']);
	});

	it('Expression', () => {
		let lexer = new Lexer('( 1 + 9)');
		let result = lexer.toArray().map(x => x.text);
		expect(result).toEqual(['(', ' ', '1', ' ', '+', ' ', '9', ')', '\n']);
	});

	it('Sprites', () => {
		let lexer = new Lexer('| abc\n| def ;comment');
		let result = lexer.toArray().map(x => x.text);
		expect(result).toEqual(['| abc', '\n', '| def', ' ', ';comment', '\n']);
	});

	it('Precedence', () => {
		let lexer = new Lexer('add$va,0f 3h[]!;abc[]');
		let result = lexer.toArray().map(x => x.text);
		expect(result).toEqual(['add', '$va', ',', '0f', ' ', '3h', '[', ']', '!', ';abc[]', '\n']);
	});

	it('Instruction (AT&T)', () => {
		let lexer = new Lexer('add $5, %va');
		let result = lexer.toArray().map(x => x.text);
		expect(result).toEqual(['add', ' ', '$5', ',', ' ', '%va', '\n']);
	});

	it('Instruction (Intel)', () => {
		let lexer = new Lexer('add va, 0f3h');
		let result = lexer.toArray().map(x => x.text);
		expect(result).toEqual(['add', ' ', 'va', ',', ' ', '0f3h', '\n']);
	});
});
