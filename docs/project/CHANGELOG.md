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

## Release 1

### Developer

- **chip-roms:** Added Brick Breaker game.
- **chip-roms:** Redid DVD game.
- **chip-roms:** Added Invader game.
