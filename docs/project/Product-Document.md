# SFU-CMPT276 Product Document

| [<- README](../../README.md) |

## Table of Contents

- [**Meeting Schedule**](#meeting-schedule)
- [**Project Deliverables and Tools**](#project-deliverables-and-tools)
  - [*Deliverables*](#deliverables)
  - [*Development Tools*](#development-tools)
  - [*Far Future Ideas*](#far-future-ideas)
- [**Implementation Language**](#implementation-language)
- [**Software Repository**](#software-repository)
- [**Software Development Methodology**](#software-development-methodology)
  - [*Work Breakdown*](#work-breakdown)
  - [*Project Guidelines*](#project-guidelines)
  - [*Member Roles*](#member-roles)
- [**Communication**](#communication)
- [**Testing**](#testing)
- [**Developer Environment**](#developer-environment)
  - [*Repository Tools*](#repository-tools)
  - [*Linux Environment Requirements*](#linux-environment-requirements)
  - [*Windows Environment Requirements*](#windows-environment-requirements)
  - [*Detailed Setup Instructions for MacOS, Ubuntu and Windows*](#detailed-setup-instructions-for-macos,-ubuntu-and-windows)
- [**Use Cases**](#use-cases)
- [**Project Schedule**](#project-schedule)
- [**Information Sources**](#information-sources)
  - [*CHIP-8 Documentation*](#chip-8-Documentation)

## Meeting Schedule

|Week|Date|Priorities|Notes|Minutes|
|---:|:---:|:---:|:---:|:---:|
|**1**|N/A|N/A|N/A|N/A|
|**2**|January 7|Release 0| |[week2](meeting-minutes/week2.md)|
|**3**| | | | |
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

If required additonal meetings may be held, where full attendance is not required. These addtional meetings are mainly focused on group-oriented work, such as discussing the structure of the interpeter project.

## Project Deliverables and Tools

This section contains all deliverables and tools that we are planning to create, in-progress to create, or have completed.

<!--- Find a different system later on --->
**Legend:** `ITEM (STATE, START WEEK OF CURRENT STATE)`

### Deliverables

- **CHIP-8 Emulator** *(Planning, Week 2)*
- **CHIP-8 Debugger** *(Planning, Week 2)*

### Development Tools

- **Automated Repository Tests** *(In Work, Week 1)*
- **Local Repository Manager ([sct](#repository-tools))** *(In Work, Week 1)*
- **Local Unit Tests** *(In Work, Week 1)*

### Far Future

- **Intermediate Representation -> WebAssembly optimizing JIT Compiler** *(Idea)*

## Implementation Language

We will be using TypeScript to implement the CHIP-8 emulator.

TypeScript was chosen over JavaScript because TypeScript is a statically typed, "compilied" language. Static typing will help the developers transition from familiar statically typed languages such as C++ and Java. "Compilation" support is also seen as a benefit as syntax and control flow errors can be flagged immediately before ever being shipped.

*Note that we use the term "compile" loosely when referring to TypeScript. More accurately, TypeScript is **transpiled** into JavaScript. Code in TypeScript is parsed and transformed into equivalent JavaScript code, which is used in the final product.*

TypeScript supports and polyfills the `async` and `await` keywords introduced in ECMAScript 7, which enable developers to operate on asynchronous JavaScript Promises as though they were synchronous constructs.

The CHIP-8 emulator and debugging engine will be designed with object-oriented principles and modularity in mind.

Major libraries and tools are discussed later in the document.

## Software Repository

We will use GitHub to host our private repository.

## Software Development Methodology

### Developer Process

When planning major refactors, please create an issue on GitHub so that all team members are aware of your intentions. Creating an issue will help avoid any major merge conflicts where work by one member become redundant.

### Work Breakdown

#### Release 0

We will be creating the initial product document.

#### Release 1

We will be releasing an inital interpreter.
This interpreter should be able to perform the the basic computational functions of the CHIP-8 specification.

#### Release 2
#### Release 3
#### Release 4

### Project Guidelines

- Source code will be formatted according to a team standard.
- Source code will not contain any swear words.

### Member Roles
<!--- Tentative Roles --->
|Member|Team Lead|Emulator Dev|Tool Dev|Game Dev|Documentor|
|------:|:---------:|:------------:|:----------:|:--------:|:---------:|
|**Ethan Pini**| X | X | X | | X |
|**Kyle Saburao**| X | X | | | X |
|**Dan Amarasinghe**| | | | | |
|**Anthony Pham**| | | | | |
|**Henry Wang**| | | | | |

## Communication

Discord will be the primary form of communication online.

## Testing

On GitHub, we will use CircleCI to automatically validate incoming commits. This will check the commits against code style guidelines and unit tests, preventing developers from merging branches that would introduce regressions or bugs.

Furthermore, these testing and validation tools are exposed to developers through the in-house command line script, `sct`. For further details, view the [repository tools section.](#repository-tools)

## Developer Environment

### Repository Tools

The project repository contains in-house tools which will help developers maintain code and repository quality.

These tools have been designed to run in a bash terminal, therefore we ask that all developers have the capacity to run bash scripts on their environment. The rest of this section details basic requirements that all developers should satisfy on their development environment.

`sct` is the command file to execute in the repository root directory.
To view the command list in terminal, execute exactly `./sct`.

A command in the following table is executed as follows: `./sct command`.


<!--- I changed the purpose text for some commands to explicitly indicate that the
commands work on the local repository --->

|Command|Purpose|
|-------|-------|
|`@query`|Query project information|
|`branch`|Create or switch branches|
|`build`|Build the project|
|`check`|Check to see if local source code passes project guidelines|
|`commit`|Commit local changes to current branch|
|`fmt`  |Format local source code|
|`init` |Initialize the local repository|
|`pull` |Pull remote changes from GitHub|
|`push` |Push local changes to GitHub|
|`test` |Run local unit tests|

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

To faciliate development consistency, we ask that all developers on Windows 10 enable [*Windows Subsystem for Linux.*](https://docs.microsoft.com/en-us/windows/wsl/install-win10)
Windows Subsystem for Linux allows Windows to run a bash terminal without having to operate an entire virtual machine. Thus, a develop

- **Windows Subsystem for Linux**
  - Ubuntu from the [Windows Store](https://www.microsoft.com/en-ca/p/ubuntu/9nblggh4msv6?rtc=1&activetab=pivot:overviewtab)
  - All standard [Linux packages](#linux-environment-requirements)

- **Optional**
  - [NodeJS for Windows](https://nodejs.org/en/)
  - [Git for Windows](https://git-scm.com/downloads)
  - [Visual Studio Code](https://code.visualstudio.com/)

**Note:**
There is currently an [outstanding, but tracked issue](https://github.com/Microsoft/WSL/issues/1932) with WSL (*Windows Subsystem for Linux*) where the Windows *Antimalware Service Executable* process will aggressively monitor an active WSL terminal [due to differences in Windows and Linux](https://github.com/Microsoft/WSL/issues/873#issuecomment-391810696). As a result, a developer may suffer performance degradation in running WSL terminal commands.

To temporarily counteract this issue, the root directory of the WSL installation package and any associated major processes would be excluded from the Windows Antimalware Service. **Please consider the ramifications before attempting this fix.**

### Detailed Setup Instructions for MacOS, Ubuntu and Windows
[Setup Page](../developer/Setup.md)

## Use Cases

*TODO: Determine what qualifies for use cases.*

## Project Schedule

*TODO: Include a gantt chart*

## Information Sources

### CHIP-8 Documentation

- <https://en.wikipedia.org/wiki/CHIP-8>
- <http://www.emulator101.com/introduction-to-chip-8.html>
- <http://www.multigesture.net/articles/how-to-write-an-emulator-chip-8-interpreter/>
- <http://devernay.free.fr/hacks/chip8/C8TECH10.HTM>
