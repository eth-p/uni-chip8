# Team 15 CHIPotle: User Manual

|<- [Index](../Index.md)|

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
 Since dev hosts the webserver, this is normal.  
 To stop dev, hit Control-C in the terminal and follow the instructions to stop the batch job.

# To view the local website while running './sct dev', open the following in a web browser
http://127.0.0.1:8080

```

## Testing

*Note: If you are using Command Prompt on Windows, exclude the prefix `./` for all commands.*

```bash

Assuming that the repository was already initalizied.

# Run all module unit tests
./sct test

# Check source code for formatting and profanity
./sct check

```

## Website Visualizer

![website](images/website.jpg)

### Browser Support

Your browser must be up-to-date.

#### Desktop

- Google Chrome
- Mozilla Firefox
- Microsoft Edge

#### Mobile

- iOS Safari
- Android Google Chrome

**Note:** Reverse stepping is not implemented at this point.  
**Known issues:** 

- Vibrator does not work on iOS.

### Running Programs

Users can run programs that we made, or can upload their own ROM files.

![load-demo](images/load-demo.png)

### Settings

#### Change Frequency

![freq](images/settings-general.png)

#### Enabling Debugger Output

![debugger](images/settings-debug.png)
