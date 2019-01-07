# SFU-CMPT276 Product Document

| [<- README](../../README.md) |

## Meeting Schedule

|Week|Date|Priorities|Notes|Minutes|
|---:|:---:|:---:|:---:|:---:|
|**1**|N/A|N/A|N/A|N/A|
|**2**|*Tentative: January 7*|Release 0| |[week2](meeting-minutes/week2.md)|
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

## Communication Tools

Discord will be the primary form of communication online.

## Software Repository

We will use GitHub to host our private repository.

## Testing Tools

On GitHub, we will use CircleCI to automatically validate incoming commits.
(is this correct?)

## Implementation Language

We will be using TypeScript to implement the CHIP-8 emulator.  

TypeScript was chosen over Javascript because TypeScript is a statically typed, "compilied" language. Static typing will help the developers transition from familiar statically typed languages such as C++ and Java. "Compilation" support is also seen as a benefit as syntactical errors can be flagged immediately before ever being shipped.  

*Note that compilation support is quoted. More accurately, Typescript is **transpiled** into Javascript. Code in TypeScript is reduced into equivalent code in Javascript. Syntactical errors prevent the transpilation from completing.*

TypeScript supports *async/await*, where code that would normally halt execution (such as waiting for user input) could potentially not block critical systems such as the CHIP-8 timers. (is this correct?)

*TODO: Include other reasons and explanations.*

The CHIP-8 will be designed with object-oriented principles and modularity in mind.

## Developer Environment Requirements

### Linux Environment

- Language Packages
  - g++
  - python2.7
  - nodejs
    - [**DO NOT INSTALL DIRECTLY THROUGH APT**](https://github.com/nodesource/distributions/blob/master/README.md#deb)
  
- Tool Packages
  - curl
  - git
  - git-lfs
  - make
  - node-gyp
  - libcurl4-openssl-dev
  - libssl-dev
  - build-essential

### Windows Environment

To faciliate development consistency, we ask that all members on Windows 10 enable the Windows Subsystem for Linux.
Local development tools have been designed to run in a bash shell with various Linux packages.

- Windows Subsystem for Linux
  - Ubuntu from Windows Store
  - All standard Linux packages

- *Optional*
  - NodeJS for Windows
  - Git for Windows
  - Visual Studio Code

## Use Cases

*TODO: Determine what qualifies for use cases.*

## Work Breakdown

## Project Schedule 