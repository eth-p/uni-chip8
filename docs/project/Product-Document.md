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

## Implementation Language

We will be using TypeScript to implement the CHIP-8 emulator.  

TypeScript was chosen over Javascript because TypeScript is a statically typed, "compilied" language. Static typing will help the developers transition from familiar statically typed languages such as C++ and Java. "Compilation" support is also seen as a benefit as syntactical errors can be flagged immediately before ever being shipped.  

*Note that compilation support is quoted. More accurately, Typescript is **transpiled** into Javascript. Code in TypeScript is reduced into equivalent code in Javascript. Syntactical errors prevent the transpilation from completing.*

TypeScript supports *async/await*, where code that would normally halt execution (such as waiting for user input) could potentially not block critical systems such as the CHIP-8 timers. *(is this correct?)*

*TODO: Include other reasons and explanations.*

The CHIP-8 will be designed with object-oriented principles and modularity in mind.

Major libraries and tools are discussed later in the document.

## Software Development Methodology

*Discuss continuous integration and member roles*

### Project Guidelines

- Source code will be formatted according to a team standard. 
- Source code will not contain any swear words.

## Software Repository

We will use GitHub to host our private repository.

## Communication Tools

Discord will be the primary form of communication online.

## Testing Tools

On GitHub, we will use CircleCI to automatically validate incoming commits.
*(is this correct?)*



## Developer Environment

The project repository contains in-house tools which will help developers maintain code and repository quality.  

These tools have been designed to run in a Linux terminal, therefore we ask that all developers have the capacity to run bash scripts on their primary environment. The end of this section details basic requirements that all developers should have on their development environment.

`sct` is the command file to execute in the repository root directory.  
To view the command list in terminal, execute `./sct` without any trailing command.  

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

- **Language Packages**
  - g++
  - python2.7
  - nodejs
    - [**DO NOT INSTALL DIRECTLY THROUGH APT**](https://github.com/nodesource/distributions/blob/master/README.md#deb)
  
- **Tool Packages**
  - curl
  - git
  - git-lfs
  - make
  - node-gyp
  - libcurl4-openssl-dev
  - libssl-dev
  - build-essential

### Windows Environment Requirements

To faciliate development consistency, we ask that all members on Windows 10 enable the Windows Subsystem for Linux.

**Note:** There is currently an outstanding, but tracked issue with WSL (*Windows Subsystem for Linux*) where the Windows *Antimalware Service Executable* process will aggressively monitor an active WSL terminal. As a result, a developer may suffer performance degradation in running WSL terminal commands.  
To counteract this issue, the root directory of the WSL installation package and any associated major processes must be excluded from the default Windows Antimalware Service. Please consider the ramifications before attempting this fix.  

- **Windows Subsystem for Linux**
  - Ubuntu from the Windows Store
  - All standard Linux packages

- **Optional**
  - NodeJS for Windows
  - Git for Windows
  - Visual Studio Code

## Use Cases

*TODO: Determine what qualifies for use cases.*

## Work Breakdown

## Project Schedule 