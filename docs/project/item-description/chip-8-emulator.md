# CHIP-8 Emulator

| [<-- Product Document](../Product-Document.md) |

## Description

The CHIP-8 emulator module.  
This module is separate from input and output.


### Targeted Capabilities and Features @ Release 4

- Basic CHIP-8 functionality.

## Release History

### Release 0
**Targets:**  
- N/A

**Developers:**  
- N/A

### Release 1
**Targets:**  
- Implement basic structure.
- Implement all 35 opcodes. 

**Developers:**  
- Ethan Pini, user@sfu.ca
- Kyle Saburao, ksaburao@sfu.ca

### Release 2
**Targets:**  
- What you will be doing. 

**Developers:**  
- Name, user@sfu.ca

### Release 3
**Targets:**  
- What you will be doing. 

**Developers:**  
- Name, user@sfu.ca

### Release 4
**Targets:**  
- What you will be doing. 

**Developers:**  
- Name, user@sfu.ca

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

**Example**
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

###



## Developer Resources and Citations

- [Wikipedia Page on Bitwise Operations](https://en.wikipedia.org/wiki/Bitwise_operation)
- [Wikipedia Page on CHIP-8](https://en.wikipedia.org/wiki/CHIP-8)
- <http://www.emulator101.com/introduction-to-chip-8.html>
- <http://www.multigesture.net/articles/how-to-write-an-emulator-chip-8-interpreter/>
- <http://devernay.free.fr/hacks/chip8/C8TECH10.HTM>
