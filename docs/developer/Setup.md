# Team 15 CHIPotle: Setup

| <- [Index](../Index.md) |

## Requirements

The following software is required:

- [NodeJS](https://nodejs.org/) (10.15 or later)
- Git
- [Git LFS](https://git-lfs.github.com/)

## Setup - MacOS (via Homebrew)

```bash
# Install NodeJS, Git, Git LFS.
brew install \
	node \
	git \
	git-lfs

# Clone the repo.
git clone "git@github.com:eth-p/SFU-CMPT276.git" cmpt276
cd cmpt276

# Initialize the tooling scripts.
./sct init

```

## Setup - Ubuntu Linux

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

# Clone the repo.
git clone "git@github.com:eth-p/SFU-CMPT276.git" cmpt276
cd cmpt276

# Initialize the tooling scripts.
./sct init
```

## Setup - Windows

First, download and install the following applications.
- **Required Installations**
  - [NodeJS for Windows](https://nodejs.org/en/)
  - [Git for Windows](https://git-scm.com/downloads)

After, go to your preferred directory and open PowerShell with `SHIFT-(RIGHT-CLICK)`, then enter the following commands:
```
npm install --global windows-build-tools

git clone "git@github.com:eth-p/SFU-CMPT276.git"

cd SFU-CMPT276

./sct init
```
