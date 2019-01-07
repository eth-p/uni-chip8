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
# WARNING: If you ignore this step, you may run into issues using 'sct
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



## Setup - Windows (via WSL)

Follow [this guide](https://docs.microsoft.com/en-us/windows/wsl/install-win10) to install WSL using an Ubuntu-based distribution, then follow the [Ubuntu Linux setup instructions](#setup---ubuntu-linux).

