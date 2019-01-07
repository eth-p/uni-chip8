# Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
# MIT License
# ----------------------------------------------------------------------------------------------------------------------
cd "$BASE"

# Check if npm is installed.
command -v npm &>/dev/null || die - <<-MESSAGE
	npm is not installed.
	${ANSI_DEFAULT}
	Please install it from the following link:
	${ANSI_LINK}    https://nodejs.org/en/\n
MESSAGE

# Install packages for nodegit.
command -v apt-get &>/dev/null && {
	sudo apt-get install -y \
		libcurl4-openssl-dev \
		libssl-dev \
		build-essential
}

# Install dependencies.
srun npm install --progress=false --loglevel=error
