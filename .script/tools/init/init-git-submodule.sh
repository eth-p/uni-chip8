# Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
# MIT License
# ----------------------------------------------------------------------------------------------------------------------
cd "$root"

# Check if git is installed.
command -v git &>/dev/null || die - <<-MESSAGE
	git is not installed.
	${ANSI_DEFAULT}
	Please install it from your system package repository.
MESSAGE

# Initialize submodules.
srun git submodule update --init --recursive
