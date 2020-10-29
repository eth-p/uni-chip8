# Developer Guide: Setup

| [&lt;--](../index.md) |

## Requirements

The following software is required:

- [NodeJS](https://nodejs.org/) (v10, via `nvm`)
- Git
- [Git LFS](https://git-lfs.github.com/)

**Note:**
Any versions later than NodeJS v10 will not work due to dependency requirements. This requirement only affects the build tools, and will not have any security or compatibility implications towards the build artifacts.

## Setup - MacOS (via Homebrew)

```bash
# Install NodeJS, Git, Git LFS.
brew install \
	nvm \
	git \
	git-lfs

# Clone the repo.
git clone "git@github.com:eth-p/uni-chip8.git" chip8
cd chip8

# Initialize the tooling scripts.
nvm
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
git clone "git@github.com:eth-p/uni-chip8.git" chip8
cd chip8

# Initialize the tooling scripts.
./sct init
```

## Setup - Windows

First, download and install the following applications.
- **Required Installations**
  - [NVM for Windows](https://github.com/coreybutler/nvm-windows)
  - [Git for Windows](https://git-scm.com/downloads)

After, go to your preferred directory and open PowerShell with `SHIFT-(RIGHT-CLICK)`, then enter the following commands:
```
nvm
npm install --global windows-build-tools

git clone "git@github.com:eth-p/uni-chip8.git" chip8

cd chip8

./sct init
```
