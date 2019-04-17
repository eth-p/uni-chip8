# CHIP-8 Emulator Manual

| [&lt;--](../index.md) | 

## Website Visualizer

![website](../images/emulator.png)

### Display

The display conforms to the 64x32 resolution specification.
Under settings, the website will by default scale the display to a larger size while maintaining the aspect ratio.

### Keypad

#### On the website

|Col1|Col2|Col3|Col4|
|----|----|----|----|
|1|2|3|C|
|4|5|6|D|
|7|8|9|E|
|A|0|B|F|

#### Default keymappings

Each key in the following table associates to the on-screen button in the same position on the website keypad.

|Col1|Col2|Col3|Col4|
|----|----|----|----|
|1|2|3|4|
|Q|W|E|R|
|A|S|D|F|
|Z|X|C|V|

### Debugger

#### Registers

Outputs the current values of each register.  
When the program is paused, a user may be able
to manipulate the register value by clicking on the value itself.

#### Stack

Outputs the addresses stored in the call stack.

#### Program Disassembler

Outputs [cowgod's](http://devernay.free.fr/hacks/chip8/C8TECH10.HTM) format for disassembled instructions around the current instruction.

#### Prev

Reverses the CHIP-8 emulator to the last instruction.  

#### Next

Steps the CHIP-8 emulator to the next instruction.

#### Memory

View a hex dump of the program memory

### Other Buttons

#### Load

Users can run programs that we made, or upload their own ROM files.

#### Reset

Resets the CHIP-8 to default values and sets the program counter to 0x200.

#### Pause | Resume

Pauses and resumes the currently loaded CHIP-8 program.

#### Savestates

Opens a menu to manage program save states.

#### Settings

Change miscellaneous settings such as the clock speed, or enabling/disabling the debugger.

## Website Sprite Maker

![sprite maker image](../images/sprite-maker-2.png)

### About

Sprite Maker 2.0 allows for easy creation of CHIP-8 sprites.

### Buttons

- **Shift Up**
  - Moves the contents of the entire canvas up.  
  Pixels shifted above the canvas will be lost.
- **Shift Down**
  - Moves the contents of the entire canvas down.  
  Pixels shifted below the canvas will be lost.
- **Shift Left**
  - Moves the contents of the entire canvas left.  
  Pixels shifted left of the canvas will be lost.
- **Shift Right**
  - Moves the contents of the entire canvas right.  
  Pixels shifted right of the canvas will be lost.
- **Align**
  - Moves the contents of the entire canvas to the top-left most possible position.  
  Useful for aligning the actual set pixels with the DRW operation code.
- **Clear**
  - Clears the canvas.
- **Hexadecimal**
  - Set the output to base 16.
- **Decimal**
  - Set the output to base 10.
- **Binary**
  - Set the output to base 2.
- **Prefix**
  - Toggle prefixes.

### Output

Outputs the sprite row values in base 2, 10 or 16 format.

## Browser Support

Your browser must be up-to-date. Due to Javascript's ubiquity, our website works on most modern devices.

### Desktop

- Google Chrome
- Mozilla Firefox
- Microsoft Edge

### Mobile

- iOS Safari
- Android Google Chrome

**Known Issues:**

- Vibration does not work on iOS.
