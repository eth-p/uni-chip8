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

# Install dependencies.
srun npm install --progress=false --loglevel=error
