# User Manual

If you just want to use the running production release of the website, [visit the actual hosted website](https://chip.netlify.com).

Please complete the prerequisites before doing anything else.

## Prerequisites

### Setup - MacOS (via Homebrew)

```bash
# Install NodeJS, Git, Git LFS.
brew install \
	node \
	git \
	git-lfs

```

### Setup - Ubuntu Linux

```bash
# Install NodeJS
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt install -y nodejs

# Install Git
sudo apt install -y git

# Install Git LFS
sudo apt install -y software-properties-common
sudo add-apt-repository ppa:git-core/ppa
sudo apt install -y git-lfs

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
  - [Git for Windows](https://git-scm.com/downloads)

![powershell-admin](images/setup-powershelladmin.png)

After, open PowerShell with administrative permissions as shown in the picture above (using the start menu), then enter the following command:
```
npm install --global windows-build-tools

```

## Repository Initialization

Unzip the repository to your desired location.  
Go into the unzipped directory and open a terminal application such as *bash* or *PowerShell* set to that directory.

Run the following commands in the terminal.  
Note that in general, `./sct` must be executed in the same directory as the sct executable file in the root directory of the repository.

*Note: If you are using Command Prompt on Windows, exclude the prefix `./` for all commands.*

*Note: To open PowerShell on Windows, on the directory of the repository, open the repository folder and do `Shift-Right Click` on an empty area in the folder window.*

*Note: If you are using PowerShell, you will have to change the background colour because the default blue breaks the console output.*

```

# To initialize the repository, if you have not done so already
./sct init

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

```

Assuming that the repository was already initalizied.

# Run all module unit tests
./sct test

# Check source code for formatting and profanity.
./sct check

```