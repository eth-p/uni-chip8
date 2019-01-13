# Team CHIPotle Product Document

| [<- README](../../README.md) |

## Table of Contents

<!--- Only include level 3 (###) headers --->

- [**Meeting Schedule**](#meeting-schedule)  
  - [General Plan](#general-plan)
- [**Project Deliverables and Tools**](#project-deliverables-and-tools)
  - [Deliverables](#deliverables)
  - [Development Tools](#development-tools)
  - [Far Future](#far-future)
- [**Communication**](#communication)
  - [Via GitHub](#via-github)  
  - [Via Meetings](#via-meetings)  
  - [Via Discord](#via-discord)  
- [**Implementation Language**](#implementation-language)
- [**Software Development Process**](#software-development-process)
  - [Project Guidelines](#project-guidelines)
  - [Developer Process](#developer-process)
  - [Work Breakdown](#work-breakdown)
  - [Member Roles](#member-roles)
  - [Roles](#roles)
- [**Software Repository**](#software-repository)
- [**Testing**](#testing)
- [**Developer Environment**](#developer-environment)
  - [Repository Tools](#repository-tools)
  - [Linux Environment Requirements](#linux-environment-requirements)
  - [Windows Environment Requirements](#windows-environment-requirements)
  - [Detailed Setup Instructions for MacOS, Ubuntu and Windows](#detailed-setup-instructions-for-macos,-ubuntu-and-windows)
- [**Use Cases**](#use-cases)
  - [Release 1 Use Cases](#release-1-use-cases)
- [**Project Schedule**](#project-schedule)
- [**Project Contributors**](#project-contributors)
- [**All Information Sources and Citations**](#all-information-sources-and-citations)
  - [CHIP-8 Documentation](#chip-8-Documentation)

## Meeting Schedule

|Week|Date|Priorities|Notes|Minutes|
|---:|:---:|:---:|:---:|:---:|
|**1**|N/A|N/A|N/A|N/A|
|**2**|January 7|Release 0| |[week2](meeting-minutes/week2.md)|
|**3**|January 14|Release 0|Documentation due by midnight|[week3](meeting-minutes/week3.md)|
|**4**| | | | |
|**5**| | | | |
|**6**| | | | |
|**7**| | | | |
|**8**| | | | |
|**9**| | | | |
|**10**| | | | |
|**11**| | | | |
|**12**| | | | |

### General Plan

Our group plans to meet every Monday after the CMPT 276 lecture. This meeting ends when only one member is left attending. Members may wish to leave the meeting any time they want, but we ask that members stay for as long as they can. The meeting must be adjourned when CMPT 213 starts at 2:30 PM.

These meetings will be held Scrum-style, where we discuss **what we did up to the meeting**, **what we will be doing after the meeting**, and **any issues we encountered along the way**.

Additonal meetings may be held, where full attendance is not required. These addtional meetings are mainly focused on group-oriented work, such as discussing and working on the structure of the interpeter project.

## Project Deliverables and Tools

This section contains all deliverables and tools that we are planning to create, in-progress to create, or have completed.

### Deliverables

- [**CHIP-8 Emulator**](item-description/chip-8-emulator.md)
- [**CHIP-8 Debugger**](item-description/chip-8-debugger.md)

### Development Tools

- **Automated Repository Tests**
- **Local Repository Manager ([sct](#repository-tools))**
- **Local Unit Tests**

### Future

- **CHIP-8 Programs**
- **CHIP-8 Assembler**
- **Intermediate Representation -> WebAssembly optimizing JIT Compiler**

## Communication

Communication is done through in-person meetings, GitHub issues, and Discord.

### Via GitHub

GitHub issues are used for formal bug reports, feature requests, and code reviews. We take full advantage of the features provided by GitHub to organize and manage issues through the use of tags, assignees, and milestones.

The issue tracker will be used to identify components that need to be finished, and the developers assigned to them.

### Via Meetings

Meetings are scheduled for weekly progress updates and planning. During these meetings, we discuss the next week of activities and milestones.

### Via Discord

Discord is used for informal communication or as a place to discuss feature ideas or implementation details. If relevent, these discussions are later added to the project documentation or used as the basis for a GitHub issue.

## Implementation Language

We will be using TypeScript to implement the CHIP-8 emulator.

TypeScript was chosen over JavaScript because TypeScript is a statically typed, "compilied" language. Static typing will help the developers transition from familiar statically typed languages such as C++ and Java. "Compilation" support is also seen as a benefit as syntax and control flow errors can be flagged immediately before ever being shipped.

*Note that we use the term "compile" loosely when referring to TypeScript. More accurately, TypeScript is **transpiled** into JavaScript. Code in TypeScript is parsed and transformed into equivalent JavaScript code, which is used in the final product.*

TypeScript supports and polyfills the `async` and `await` keywords introduced in ECMAScript 7, which enable developers to operate on asynchronous JavaScript Promises as though they were synchronous constructs.

The CHIP-8 emulator and debugging engine will be designed with object-oriented principles and modularity in mind.

Major libraries and tools are discussed later in the document.

## Testing

Testing is done through the use of [Jest](https://jestjs.io/) unit tests. Tests are implemented on a per-module basis and are intended to prevent regressions and ensure that the code works as intended by the developers.

As well as being accessible to developers through the use of the `sct test` tool, the repository is tracked by CircleCI. On every commit, CircleCI will validate the project source code to ensure that it meets the project styling and code of conduct guidelines, as well as build and test the project in its entirety.

## Software Repository

We will use GitHub to host our private repository.

To view documentation on git use in-respository, view [this section](#git-version-control).

## Developer Environment

### Repository Tools

The project repository contains [in-house tools](https://github.com/eth-p/SFU-CMPT276/wiki/Tooling) which will help developers maintain code and repository quality.

#### Simple Contribution Tool

**sct** is the command file to execute in the repository root directory.  
To execute sct in Non-Windows systems, use `./sct`.  
To execute sct in Windows systems, use `./sct` if in PowerShell, or `sct` if in Command Prompt.

To view the command list in terminal, execute sct without any trailing commands or flags.

A command in the following table is executed as follows: `sct command`.

|Command|Purpose|
|-------|-------|
|build  |Build the project|
|check  |Check source code for guideline violations|
|fmt    |Format source code|
|help   |View subcommand help|
|info   |View project info|
|init   |Initialize the project|
|test   |Run module tests|

### Linux Environment Requirements

For the sake of consistency, we assume that a fresh install of [Ubuntu 18.10](https://www.ubuntu.com/download/desktop) will be the environment. If you wish to use a VM, we suggest VMware Workstation Pro 15 provided through the [SFU-VMAP partnership](https://services.cs.sfu.ca/).

Please install all of the following packages before executing `./sct init`.

All packages listed (**exception to nodejs**) may be installed through the `apt` command.
To install nodejs, please [refer to nodejs documentation.](https://github.com/nodesource/distributions/blob/master/README.md#deb)
nodejs through `apt` will yield an outdated version.

- **Language Packages**
  - `g++`
  - `python2.7`
  - `nodejs` 10.15, or later

- **Tool Packages**
  - `curl`
  - `git`
  - `git-lfs`
  - `make`
  - `node-gyp`
  - `libcurl4-openssl-dev`
  - `libssl-dev`
  - `build-essential`

### Windows Environment Requirements

Developers may use Windows machines for this project.  
The requirement for *Windows Subsystem for Linux* has been deprecated; you may uninstall WSL if you have it.

- **Required Installations**
  - [NodeJS for Windows](https://nodejs.org/en/)
  - [Git for Windows](https://git-scm.com/downloads)
- **Optional Installations**
  - [Visual Studio Code](https://code.visualstudio.com/)

### Detailed Setup Instructions for MacOS, Ubuntu and Windows

[Setup Page](../developer/Setup.md)

## Software Development Process

### Project Guidelines

- Source code will remain compatible for transpilation to ES5 JavaScript.
- Source code will be formatted according to a team standard.
- Source code will not contain any swear words.
- Members will contribute a fair amount of work.
  - Unfair discrepancies will be tracked for the class end-of-term review.
  - All public-facing documentation will include a contributor report.
  - "fair" will not be semantically analyzed and parsed through legalese. Don't be unreasonable.

### Developer Process

#### Git Version Control

Developers will **NOT** attempt to work directly on the master branch. The master branch is protected and any attempts to commit directly will be automatically rejected.

Please create your own development branch and work on that. Once your changes are complete, create a pull request `yourbranch -> master` in GitHub.

Pull requests will be automatically tested as laid out [here](#testing).

To ensure consistent commit quality, git hooks have been implemented repository wide.
These hooks will prevent you from creating commits that violate any of the following conditions:

- Formatting checks must pass.
- Profanity checks must pass.
- The commit message must follow this format: `[module]: [verb] [changes]`
  - Where `[module]` is a module in `sct info --list-modules`
  - Where `[changes]` does not end in punctuation.
  - Where `[verb]` is one of the following:
    - `Add`
    - `Change`
    - `Fix`
    - `Move`
    - `Refactor`
    - `Reformat`
    - `Rename`
    - `Remove`
    - `Update`

Before committing changes, please run `sct check` and `sct fmt`.

#### Major Refactoring

When planning major refactors, please create an issue ticket on GitHub so that all team members are aware of your intentions. Creating the ticket will help avoid any major merge conflicts where work by one member becomes redundant.

### Work Breakdown

To view what tasks to do, visit the repository issue tracker.
Members will be assigned tasks, and will be welcome to contribute to any others.

If a developer accepts a task, they will be given a due date. The due date will target several days before the Release. The buffer time is required for analysis for the next release, and code review in the current release.

#### Release 0 - Documentation and Analysis

We will be creating the initial product document.  
The product document will at minimum satisfy the requirements as laid out on the [project page](http://www.cs.sfu.ca/CourseCentral/276/tjd/project.html).  
The product document will include details on each module. These details will range from who is working on it, to how to understand the module.

#### Release 1 - Emulator I & Tools

We will be releasing an inital emulator.  
This emulator will be able to perform the the basic operation codes of the [CHIP-8 specification](https://en.wikipedia.org/wiki/CHIP-8).  
The emulator will be able to render basic details, and output sound to a HTML5 webpage.  
The emulator will be able to support basic, non-interactive programs such as simple looping "screensavers".

##### List of Items

- CHIP-8 VM
  - Full operation code support
  - Full graphics output
  - Full sound output
  - Interactive input not required
  - CHIP-8 Webpage
- Render CHIP-8 graphics to HTML5 webpage
  - Render CHIP-8 counters, registers, and stack
- **Module design:**
  - CHIP-8 System
    - CHIP-8 CPU
      - CHIP-8 counters, registers, and stack
      - CHIP-8 Opcode Jumptable
      - CHIP-8 Timer
    - CHIP-8 Graphics
      - Graphics Array
    - CHIP-8 Sound
    - CHIP-8 Webpage
      - HTML5 Canvas Object Renderer
    - **Notes:**
      - Abstraction Layers will only be able to communicate *iff* they differ by exactly one level.
      - Abstraction Layer 0: CPU
      - Abstraction Layer 1: System: Graphics, Sound, Input
      - Abstraction Layer 2: Webpage

#### Release 2 - Emulator II & Tools

Release 2 will include refinements to the emulator. The previous emulator will be designed to work, while Release 2 will focus on code quality and optimizations.  
Release 2 might include a CHIP-8 assembler to greatly improve program development.

#### Release 3 - Programs

We are targeting to begin video game development at this point.

#### Release 4 - Production

We are targeting to bring the deliverables into a release ready state. Source code will be reviewed for further optimizations.

### Member Roles

|Member|Team Lead|Emulator Dev|Tool Dev|Program Dev|Interactive Dev|Documentor|
|------:|:---------:|:------------:|:----------:|:--------:|:---------:|:----:|
|**Ethan Pini**| X | X | X | | | X |
|**Kyle Saburao**| X | X | | | X | X |
|**Anthony Pham***| | | | | | |
|**Henry Wang***| | | | | | |
|**Dan Amarasinghe***| | | | | | |
`*: Did not respond`

### Roles

|Role|Description|
|----|-----------|
|Team Lead|Directs team on project. Manages git repository.|
|Emulator Dev|Works on the CHIP-8 interpreter and debugger.|
|Tool Dev|Works on the build and test automation tools.|
|Program Dev|Works with CHIP-8 Assembly to produce programs.|
|Interactive Dev|Works with HTML5 to link the CHIP-8 to a webpage.|
|Documentor|Documents the project.|

## Use Cases

### Release 1 Use Cases

#### Developers

- will learn low level execution techniques.
- will learn the CHIP-8 architecture.
- will learn TypeScript.
- will improve on Object-Oriented Programming.

#### Users

- will ...

## Project Schedule

*TODO: Include a gantt chart*

## Project Contributors

### Release 0

- Ethan Pini
- Kyle Saburao

### Release 1

- Ethan Pini
- Kyle Saburao

## All Information Sources and Citations

### CHIP-8 Documentation

- <https://en.wikipedia.org/wiki/CHIP-8>
- <http://www.emulator101.com/introduction-to-chip-8.html>
- <http://www.multigesture.net/articles/how-to-write-an-emulator-chip-8-interpreter/>
- <http://devernay.free.fr/hacks/chip8/C8TECH10.HTM>
