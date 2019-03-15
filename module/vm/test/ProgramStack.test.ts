//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import ProgramStack from '../src/ProgramStack';
// ---------------------------------------------------------------------------------------------------------------------
describe('ProgramStack', () => {
	it('constructor', () => {
		let stack = new ProgramStack(3);
	});

	it('push', () => {
		let stack = new ProgramStack(3);
		expect(() => stack.push(1)).not.toThrow();
		expect(() => stack.push(3)).not.toThrow();
		expect(() => stack.push(5)).not.toThrow();
		expect(() => stack.push(9)).toThrow();
		expect(stack.inspect()).toEqual([1, 3, 5]);
	});

	it('pop', () => {
		let stack = new ProgramStack(1);
		stack.push(5);
		expect(stack.pop()).toEqual(5);
		expect(() => stack.pop()).toThrow();
	});

	it('clear', () => {
		let stack = new ProgramStack(3);
		stack.push(3);
		stack.push(5);
		stack.pop();
		stack.clear();
		expect(stack.getPointer()).toEqual(-1);
		expect(Array.from(stack.inspectRaw())).toEqual([0, 0, 0]);
	});

	it('inspect', () => {
		let stack = new ProgramStack(3);
		stack.push(5);
		expect(stack.inspect()).toEqual([5]);
		stack.inspect()[0] = 1;
		expect(stack.inspect()).toEqual([5]);
	});

	it('inspectRaw', () => {
		let stack = new ProgramStack(3);
		stack.push(5);
		expect(stack.inspectRaw()).toEqual([5, 0, 0]);
		stack.inspect()[0] = 1;
		expect(stack.inspectRaw()).toEqual([5, 0, 0]);
	});

	it('getPointer', () => {
		let stack = new ProgramStack(1);
		expect(stack.getPointer()).toEqual(-1);
		stack.push(5);
		expect(stack.getPointer()).toEqual(0);
	});

	it('getCapacity', () => {
		let stack = new ProgramStack(1);
		expect(stack.getCapacity()).toEqual(1);
	});

	it('snapshot + restore', () => {
		let stack = new ProgramStack(1);
		let copy = new ProgramStack(1);
		stack.push(5);
		copy.restore(stack.snapshot());

		expect(stack).toEqual(copy);
	});
});
