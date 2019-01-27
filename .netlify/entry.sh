#!/usr/bin/env bash
# ----------------------------------------------------------------------------------------------------------------------
# Copyright (C) 2019 Ethan Pini <epini@sfu.ca>
# MIT License
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Netlify build scripts.
# This is... unfortunately needed. Netlify doesn't play nicely with git-lfs.
# ----------------------------------------------------------------------------------------------------------------------
# Fix LFS:
echo "Fixing LFS files..."
[[ "$(git remote -v | wc -l)" -eq 0 ]] && {
	git remote add origin "https://github.com/eth-p/SFU-CMPT276.git"
}

git lfs install --local
git checkout . || exit $?

# Fix SCT:
mkdir -p ".tmp" &>/dev/null
touch ".tmp/sct-setup" &>/dev/null

# Run.
echo "Running build scripts..."
"$@"
exit $?
