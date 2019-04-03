# Team 15 CHIPotle: Changelog

| <- [Index](../Index.md) |

## Release 0 (Planning)

### Developer

- **ci:** Added CircleCI for testing.
- **ci:** Added automatic code checking.
- **tools:** Created collaboration tools.
- **tools:** Created `./sct build` to build the project.
- **tools:** Created `./sct fmt` to format source code.
- **tools:** Created `./sct branch` to simplify working with branches.
- **tools:** Created `./sct commit` to simplify commits.
- **tools:** Created `./sct push` to push commits (with forced reformatting).
- **tools:** Created `./sct pull` to pull commits.
- **tools:** Created `./sct check` to check for code issues.
- **tools:** Created `./sct test` to run unit tests.
- **tools:** Created `./sct @query` to query project information.
- **vm:** Updated VM to include other CHIP-8 fields.
- **vm:** Removed address register field from VMRegister.
- **vm:** Updated VM imports to pass validation.
- **vm:** Added preliminary tests for CHIP-8 VM.
- **vm:** Added conditional opcodes for memory and register values.
- **R&D:** Implemented [test CHIP-8](https://macedir.github.io/chip8/).
- **tools:** Created online [CHIP-8 sprite maker](https://macedir.github.io/CHIP8-SpriteMaker/) v1.0.

### Documentation

- **docs:** Added contributing guide.
- **docs:** Added Project Document file.
- **docs:** Added meeting minutes template file.
- **docs:** Update Product Document to reflect tentative details before Week 2 meeting.
- **docs:** Added item description pages, and item description template page.
- **docs:** Update Product Document to reflect tentative details before Week 3 meeting.
- **docs:** Added temporary Gantt chart.
- **docs:** Changed organization of the content in communication section of Product Document.
- **docs:** Added Gantt chart.
- **docs:** Updated Product Document for Release 0 readiness.
- **docs:** Restructured documentation to optimize use out of [markdown-folder-to-html](https://github.com/joakin/markdown-folder-to-html).

## Release 1

### Developer

- **chip-arch:** Implemented CHIP-8 emulator.
- **chip-arch:** Implemented opcodes.
- **tools:** Added `sct dev` for local hosting of the website.
- **chip-arch:** Implemented opcode tests.
- **web-x:** Implemented visualizer website for the emulator.
- **chip-arch:** Add randomization to opcode tests.
- **chip-roms:** Add DVD logo game.
- **chip-roms:** Add C-ZERO game.
- **chip-roms:** Add Warshaw's Revenge game.
- **chip-roms:** Add DVD logo demo.
- **chip-roms:** Add maze demo.
- **tools:** Created `./sct dev` to host a local webserver for the visualizer website.
- **tools:** Removed `./sct branch`.
- **tools:** Removed `./sct commit`.
- **tools:** Removed `./sct push`.
- **tools:** Removed `./sct pull`.

### Documentation

- **docs:** Added test CHIP-8 to product document.
- **docs:** Added link to assembler documentation in product document.
- **docs:** Added visualizer website page, including debugger features.
- **docs:** Added sprite maker page.
- **docs:** Added user manual for other people who want to use a local copy of the repository.
- **docs**: Updated release schedules and gantt chart.

### Schedule

- **Release:** Moved programs to release 2 due to early completion of emulator and website.

## Release 2

### Developer

- **chip-roms:** Added Brick Breaker game.
- **chip-roms:** Redid DVD game.
- **chip-roms:** Remove MAZE rom.
- **chip-roms:** Added Dino game.
- **chip-roms:** Added Snake Game.
- **web-x**: Added register manipulation. (when paused).

### Documentation

- **docs:** Added week 8 meeting minutes.

### Schedule

- **Release:** Moved reverse debugger to release 4.
- **Release:** Changed assembler to encompass release 3 & 4.
- **Release:** Added Vancouver Driving Simulator to release 3.
- **Release:** Added Flappy Bird to release 3.

## Release 3

### Developer

- **chip-roms:** Add work on Nuclear Launch game.
- **chip-roms:** Add Laser Defence game.
- **web-x:** Update "About" page to show more details.
- **web-x:** Add analytics to website.
- **web-x:** Refactor everything part 1.
- **chip-roms:** Add 'Artifacts' ROM.
- **chip-roms:** Add 'Stop watch' ROM.
- **chip-roms:** Add 'Advanced Warfare' game.
- **chip-roms:** Add 'Maze' ROM.

### Schedule

- **Release:** Replace Vancouver Driving Simulator with Laser Defence.
- **Release:** Move reverse-debugger into Release 3.
- **Release:** Add MAZE 2.0 and SFU-related program to Release 3.
- **Release:** Add Sprite Maker 2.0 into Release 4.
- **Release:** Move assembler into Release 4.
- **Release:** Remove assembler from Release 4.

## Release 4

### Developer

- **web-tools:** Add Sprite Maker 2.0
- **web-tools:** Add Excel Sprite Maker.
- **web-emu:** Add savestates.
- **web-emu:** Add backstepping.
- **web-x:** Refactor everything part 2.

### Release

- **Schedule:** Move code freeze to April 1st.

## Release 4 (Production Changelog)

**Advanced Settings.**  
A new checkbox was added to show/hide advanced settings.
The following settings were changed to only show with advanced settings enabled:

- Clock Speed
- Debug Settings (Yes, all of them.)

**Deterministic RNG.**  
The `RNG` instruction was changed to use a seeded Xorshift32 pseudorandom number generator. This allows for deterministic savestates, which means that a program will always behave predictably once its state has been saved. Unfortunately, it also came at the slight cost of random number quality.

**Settings Wipe.**  
In order to facilitate some of the new changes, user settings were wiped out.
You will need to reconfigure the emulator.

## Additions

**Savestates.**  
You can now have 10 unique savestates (including quicksave/quickload). If you have a custom game that you had to keep loading in manually, you can now just save it as a savestate! How cool is that?

**Reverse Debugging.**
If you enable the "Tracing" option in debug settings, it is now possible to undo up to **5 minutes** of CHIP-8 history. That's a whole 5 minutes more than the last release!

**Reverse Stepping.**  
Even if "Tracing" is disabled, the emulator can undo any cycles that were stepped forwards while it was paused.
*No stacks were harmed in the making of this feature.*

**Sound Tone Setting.**  
With advanced settings enabled, you can now change the frequency of the beep sound made by the emulator.

**Deflicker Setting.**
You asked (well... no, you didn't... but we digress.) for it, and we delivered! You can now enable deflicker mode to reduce the severity of that iconic CHIP-8 sprite flicker.

**Program Memory Viewer.**  
You can now view a hex dump of the program memory.
Please be warned, it's not exactly fast however.
*Seriously. Don't use it on mobile.*

**Sprite Editor Tool.** (Web Only)  
A fancy new sprite-editor tool has been added at [https://chip.netlify.com/tools/sprite-editor/](https://chip.netlify.com/tools/sprite-editor).
Draw a dog! Or a cat! ...or something that we really can't say out loud, but know you'll probably draw before any of the previous suggestions.

<details>
  <summary><strong>Super Secret Feature.</strong> (Web Only)</summary>
  <div>
    You can now download some of our games to try on your own emulator! Make sure to enable advanced settings and browse the program list on a desktop computer. 
  </div>
</details>

## Changes

**Increased Clock Speed Limit.**  
We changed the maximum clock speed to 10 KHz (10,000 Hz). If you found any game or program chugging along at 5 KHz, you shouldn't have a problem with it at twice the speed.

**Upgraded Dialogs.**
The entire dialog system was thrown out and recreated. While this doesn't mean much for you non-technical users, it does give you those sweet, sweet, larger-than-300px dialog windows when you're on desktop devices.

**Upgraded Program List.**
The menu for loading programs went through an overhaul. It's now 80% easier to use on mobile, and 100% better looking on desktop.

**Boosted Performance.**
A couple tinkers here and a few bug fixes there... And voila! The emulator now runs faster and no longer chews through your processor when its paused. 