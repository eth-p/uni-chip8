# CHIP-8 Emulator

| [<-- Product Document](../Product-Document.md) |

## Description

The CHIP-8 emulator module.  
This module is separate from input and output.

### Targeted Capabilities and Features @ Release 4

- Basic CHIP-8 functionality.

## Developer Notes

### Basic Memory Details

CHIP-8 specification calls for big-endianness. Most significant bytes are at the left.  

```
let n = 220
big endian: 0b1101 1100
little endian: 0b1100 1101
```

#### 8-bit values

- `sp`
  - Stack pointer
  - Simple 8 bit index number
  - Points to the top of `S`

- `d`
  - Delay timer
  - Decrements at 60hz *iff* `d > 0`
  - Used for waits (?)

- `s`
  - Sound timer
  - Decrements at 60hz *iff* `s > 0`
  - CHIP-8 system outputs constant frequency sound *iff* `s > 0`

#### 16-bit values

- `pc`
  - The index to the current location in `MEM`
  - Execute `pc += 2` after calculating opcode

- `i`
  - Stores memory addresses

#### Arrays

- `MEM`
  - 4096 (0x1000) size main memory
  - Each value is 8 bits
  - `MEM[0x0]` through `MEM[0xFFF]`
  - `0x0` to `0x1ff` is reserved
  - Programs start at `0x200`

- `V`
  - 16 (0x10) size data register
  - Each value is 8 bits
  - `V[0x0]` through `V[0xF]`
  - `V[0xF]` is reserved as a CHIP-8 flag:
     Arithmetic carry flag or draw pixel unset detect

- `S`
  - 16 (0x10) size address stack
  - Each value is 8 bits
  - `S[0x0]` through `S[0xF]`
  - Used to return from subroutines
  - Top of `S` is `S[sp]`
  - When entering a new subroutine, push the current `pc` address, assuming it was double incremented after fetch/decode, to the stack, then increment `sp`.

### Opcodes constants

Following constants are derived from the current opcode.

- `opcode = (MEM[pc] << 8) | (MEM[pc + 1])`

- `nnn`
  - `nnn = (opcode & 0x0FFF)`

- `nn`
  - `nn = (opcode & 0x00FF)`

- `n`
  - `n = (opcode & 0x000F)`

- `x`
  - `x = (opcode & 0x0F00) >> 8`

- `y`
  - `y = (opcode & 0x00F0) >> 4`

#### Example

```
pc = 0x350
MEM[pc] = 0x05 = 0b0000 0101
MEM[pc + 1] = 0xA7 = 0b1010 0111

// Reducing masked bits to full nibbles (4 bit chunks) for clarity

// Opcode is constructed with all 4 nibbles from MEM[pc] and MEM[pc + 1]
// Each value in MEM is 8 bits wide

// Let opcode = WXYZ
// W = First 4 bits of MEM[pc]
// X = Last 4 bits of MEM[pc]
// Y = First 4 bits of MEM[pc + 1]
// Z = Last 4 bits of MEM[pc + 1]

// operator <<: Bit shift value 1 left (equivalent to * 2)
// (0xA == 0b1010 == 0d10) << 1 == (0x14 == 0b0001 0100 == 0d20)

// operator >>: Bit shift value 1 right (equivalent to / 2)
// (0x14 == 0b0001 0100 == 0d20) >> 1 == (0xA == 0b1010 == 0d10)

// operator &: AND both values together (AND bit columns together)
// (0b1010 0000 & 0b0000 1010) == 0b0000 0000
// ((0xF6 == 0b1111 0110) & 0xF0) == (0xF0 == 0b1111 0000)

// operator |: OR both values together (OR bit columns together)
// (0b1010 0000 | 0b0000 1010) == 0b1010 1010

// Therefore to construct the opcode, MEM[pc] must be shifted 8 bits left,
// then OR with MEM[pc + 1].

// 0xF == 0b1111, so 0x...F... with operator & acts as a mask
// to select certain nibbles.

opcode = (MEM[0x350] << 8) | (MEM[0x351]) = 0x05A7 == 0b0000 0101 1010 0111

nnn = (opcode & 0x0FFF) = 0x05A7 == 0x5A7 == 0b0000 0101 1010 0111 == 0b0101 1010 0111

nn = (opcode & 0x00FF) = 0x00A7 == 0xA7 == 0b0000 0000 1010 0111 == 0b1010 0111

n = (opcode & 0x000F) = 0x0007 == 0x7 == 0b0000 0000 0000 0111 == 0b0111

x = (opcode & 0x0F00) >> 8 = 0x0005 == 0x5 == 0b0000 0000 0000 0101 == 0b0101

y = (opcode & 0x00F0) >> 4 = 0x000A == 0xA == 0b0000 0000 0000 1010 == 0b1010
```

### Conditional (a < b)

```
English
1. COPY a into V[x] (V[x] = a)
2. COPY b into V[y] (V[y] = b)
3. COPY V[x] into V[z] (V[z] = V[x])
4. SUBTRACT V[y] from V[z] (V[z] = V[y] - V[z])
5. IF V[0xF] == 0x00, Skip next. (0x00 means borrow, so a less than b)
6. JUMP program counter to MEM[n + 1] (a >= b is result)
7. FIRST conditional block address
...
n. LAST conditional block address
n + 1. OUTSIDE conditional block

CHIP-8 Assembly
0x200: 0x6000 + a; // SET V[0] to a.
0x202: 0x6100 + b; // SET V[1] to b.
0x204: 0x8200; // COPY V[0] into V[2].
0x206: 0x8215; // SUB V[1] FROM V[2]. SET IF NO BORROW.
0x208: 0x3F00; // COND: V[0xF] == 0 -> NO SUB BORROW. SKIP NEXT IF TRUE.
0x20A: 0x1300; // COND LOGICAL FALSE: JUMP TO AFTER COND BLOCK. a >= b
0x20C: ...... // COND LOGICAL TRUE: CONTINUE NORMALLY. a < b
...
0x300: ...... // AFTER COND BLOCK (PARENTHESIS EQUIVALENT)
```

### Raw Conditional Test Code

```ts
Please note that this has not been officially validated.
These subroutines start at 0x210.
///////////////////////////////////////////////////////////////////////
// Less Than conditional subroutine
// a < b
// Load a into VC
// Load b into VD
// Store truth in VE

cpu.loadOpcode(0x210, 0x8CD5); // VC -= VD
cpu.loadOpcode(0x212, 0x3F00); // CONDITIONAL VF == 0
// VF == 1: a >= b GOTO OUTSIDE BLOCK
cpu.loadOpcode(0x214, 0x1218);
// VF == 0: a < b STAY INSIDE BLOCK
cpu.loadOpcode(0x216, 0x6E01); // VE = 1
cpu.loadOpcode(0x218, 0x121A); // GOTO RETURN
// OUTSIDE BLOCK
cpu.loadOpcode(0x21A, 0x6E00); // VE = 0
cpu.loadOpcode(0x21C, 0x00EE); // RETURN
///////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////
// Greater Than conditional subroutine
// a > b
// Load a into VC
// Load b into VD
// Store truth in VE

// Test VC != VD
// 	False:
//		Return False by default
//	True:
//		Test (VC -= VD) VF == 1:
//			True:
//				Return True (VC != VD and no borrow)
//			False:
//				Return False (VC != VD and borrow)

cpu.loadOpcode(0x21E, 0x9CD0); // CONDITIONAL VC != VD
// VC == VD
cpu.loadOpcode(0x220, 0x122A); // GOTO False Exit
// VC != VD: TEST (VC -= VD)
cpu.loadOpcode(0x222, 0x8CD5); // VC -= VD
cpu.loadOpcode(0x224, 0x3F01); // CONDITIONAL VF == 1
// VF != 1 (Borrow)
cpu.loadOpcode(0x226, 0x122A); // GOTO FALSE EXIT
// VF == 1 (No borrow)
cpu.loadOpcode(0x228, 0x6E01); // VE = 1
cpu.loadOpcode(0x22A, 0x122C); // GOTO RETURN
// FALSE EXIT FALL THROUGH
cpu.loadOpcode(0x22C, 0x6E00); // VE = 0
cpu.loadOpcode(0x22E, 0x00EE); // RETURN
///////////////////////////////////////////////////////////////////////
```


## Developer Resources and Citations

- [Wikipedia Page on Bitwise Operations](https://en.wikipedia.org/wiki/Bitwise_operation)
- [Wikipedia Page on CHIP-8](https://en.wikipedia.org/wiki/CHIP-8)
- <http://www.emulator101.com/introduction-to-chip-8.html>
- <http://www.multigesture.net/articles/how-to-write-an-emulator-chip-8-interpreter/>
- <http://devernay.free.fr/hacks/chip8/C8TECH10.HTM>
