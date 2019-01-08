export class CHIP8emu {

    // How do we make sure that big endianess is actually the case here

    // 8-bit values
    private _stack_pointer: number;
    private _delay_timer: number;
    private _sound_timer: number;

    // 16-bit values
    private _program_counter: number;
    private _i: number;

    // Arrays

    private _MEM: Int8Array;
    private _V: Int8Array;
    private _STACK: Int8Array;

    constructor() {
        this._stack_pointer = 0x0;
        this._delay_timer = 0x0;
        this._sound_timer = 0x0;

        // Program memory always starts at _MEM[0x200]
        this._program_counter = 0x200;
        this._i = 0x0;

        this._MEM = new Int8Array(0x1000);
        this._V = new Int8Array(0x10);
        this._STACK = new Int8Array(0x10);

        for (var i: number = 0x0; i < 0x1000; ++i) {
            this._MEM[i] = 0x0;
        }

        for (var i: number = 0x0; i < 0x10; ++i) {
            this._V[i] = 0x0;
            this._STACK[i] = 0x0;
        }
    }

    private cycle(): void {
        let opcode: number
            = this.constructOpCode(this._MEM[this._program_counter], this._MEM[this._program_counter + 1]);
        this._program_counter += 2;

        // Figure out all of this stuff, even if it is not needed just for readability.
        let nnn = (opcode & 0x0FFF);
        let nn = (opcode & 0x00FF);
        let n = (opcode & 0x000F);
        let x = (opcode & 0x0F00) >> 8;
        let y = (opcode & 0x00F0) >> 4;

        switch (opcode & 0xF000) {
            default:
                break;
        }
    }


    private constructOpCode(leftByte: number, rightByte: number): number {
        return (leftByte << 8) | rightByte;
    }
}