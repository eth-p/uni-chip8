# Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
# MIT License
# ----------------------------------------------------------------------------------------------------------------------
cd "$root"

# Check if git-lfs is installed.
git lfs &>/dev/null || die - <<-MESSAGE
	git-lfs is not installed.
	${ANSI_DEFAULT}
	Please install it from the following link:
	${ANSI_LINK}    https://git-lfs.github.com/\n
MESSAGE

# Add git hooks.
srun git lfs install
