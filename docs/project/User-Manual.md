# Team 15 CHIPotle: User Manual

| <- [Index](../Index.md) |

If you just want to use the running production release of the website, [visit the actual hosted website](https://chip.netlify.com).

If you want to be able to to:

- try the build system
- try the automated tests
- host the local webserver

please complete the prerequisites before doing anything else.

## Prerequisites

### Setup - MacOS (via Homebrew)

```bash

# Install NodeJS
brew install \
	node

```

### Setup - Ubuntu Linux

```bash

# Install curl
sudo apt install curl

# Install NodeJS
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -

sudo apt install -y nodejs

# Install packages required for building nodegit.
# WARNING: If you ignore this step, you may run into issues using 'sct init' or 'npm install'.
sudo apt install -y \
	build-essential \
	libcurl4-openssl-dev \
	libssl-dev

```

### Setup - Windows

First, download and install the following applications.
- **Required Installations**
  - [NodeJS for Windows](https://nodejs.org/en/)

After, open PowerShell with administrative permissions as shown in the following picture:

![powershell-admin](images/setup-powershelladmin.png)

 (using the start menu), then enter the following command:
```
npm install --global windows-build-tools
```

## Repository Initialization

Unzip the repository to your desired location.  
Go into the unzipped directory and open a terminal application such as *bash* or *PowerShell* set to that directory.

In general, `./sct` must be executed in the same directory as the sct executable file in the root directory of the repository.

*Note: If you are using Command Prompt on Windows, exclude the prefix `./` for all commands.*

*Note: To directly open PowerShell on Windows, on the directory of the repository, open the repository folder and do `Shift-Right Click` on an empty area in the folder window.*

*Note: If you are using PowerShell, you will have to change the background colour because the default blue breaks the console output.*

Run the following commands in the terminal:

```bash

# To initialize the repository, if you have not done so already
./sct init

# sct will complain that git is not installed. Just ignore this and hit `Enter` to continue whenever that option comes up.
# There will be an error at the end of `sct init` but it will be fine.

# To build the project
./sct build --release

# To host the website on a local website
./sct dev

# Note for dev: The console output will stall after compiling files.  
# Since dev hosts the webserver, this is normal.  
# To stop dev, hit Control-C in the terminal and follow the
# instructions to stop the batch job.

# To view the local website while running './sct dev', open the following in a web browser
http://127.0.0.1:8080

```

## Testing

*Note: If you are using Command Prompt on Windows, exclude the prefix `./` for all commands.*

```bash

# Assuming that the repository was already initalizied.

# Run all module unit tests
./sct test

# Check source code for formatting and profanity
./sct check

```

## Website Visualizer

![website](images/emulator.png)

### Display

The display confirms to the 64x32 resolution specification.
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

![sprite maker image](images/sprite-maker-2.png)

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