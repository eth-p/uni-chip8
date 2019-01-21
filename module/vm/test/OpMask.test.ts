//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import OpMask from '../src/OpMask';
// ---------------------------------------------------------------------------------------------------------------------

describe('OpMask', () => {
	it('constructor', () => {
		let opmask = new OpMask({
			mask: 0xff00,
			p1: 0x00f0,
			p2: 0x000f
		});

		let opmask2 = new OpMask({
			mask: 0xf00f,
			p1: 0x0ff0,
			p2: 0x0000
		});

		let opmask3 = new OpMask({
			mask: 0xf000,
			p1: 0x0f00,
			p2: 0x00f0,
			p3: 0x000f
		});

		expect(opmask.mask).toStrictEqual(0xff00);
		expect(opmask.maskLSB).toStrictEqual(8);
		expect(opmask.maskMSB).toStrictEqual(15);
		expect(opmask.priority).toStrictEqual(7);
		expect(opmask.p1).toStrictEqual(0x00f0);
		expect(opmask.p1LSB).toStrictEqual(4);
		expect(opmask.p1MSB).toStrictEqual(7);
		expect(opmask.p2).toStrictEqual(0x000f);
		expect(opmask.p2LSB).toStrictEqual(0);
		expect(opmask.p2MSB).toStrictEqual(3);
		expect(opmask3.p3).toStrictEqual(0x000f);
	});

	it('decodeParameter1', () => {
		let opmask = new OpMask({
			mask: 0xff00,
			p1: 0x00f0,
			p2: 0x000f
		});

		expect(opmask.decodeParameter1(0xf0c0)).toStrictEqual(0x000c);
		expect(opmask.decodeParameter1(0xffff)).toStrictEqual(0x000f);
		expect(opmask.decodeParameter1(0xff0f)).toStrictEqual(0x0000);
		expect(opmask.decodeParameter1(0xbeef)).toStrictEqual(0x000e);
	});

	it('decodeParameter2', () => {
		let opmask = new OpMask({
			mask: 0xff00,
			p1: 0x00f0,
			p2: 0x000f
		});

		expect(opmask.decodeParameter2(0xf00d)).toStrictEqual(0x000d);
		expect(opmask.decodeParameter2(0xffff)).toStrictEqual(0x000f);
		expect(opmask.decodeParameter2(0xfff0)).toStrictEqual(0x0000);
		expect(opmask.decodeParameter2(0xbeef)).toStrictEqual(0x000f);
	});

	it('decodeParameter3', () => {
		let opmask = new OpMask({
			mask: 0xf000,
			p1: 0x0f00,
			p2: 0x00f0,
			p3: 0x000f
		});

		expect(opmask.decodeParameter3(0xf00d)).toStrictEqual(0x000d);
		expect(opmask.decodeParameter3(0xffff)).toStrictEqual(0x000f);
		expect(opmask.decodeParameter3(0xfff0)).toStrictEqual(0x0000);
		expect(opmask.decodeParameter3(0xbeef)).toStrictEqual(0x000f);
	});
});
