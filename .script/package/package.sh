#!/usr/bin/env bash
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(dirname "$(dirname "$HERE")")"

PROJECT_NAME="CHIP-8"
PROJECT_VERSION="$(./sct info --project-version)"
PROJECT_COPYRIGHT="$(./sct info --project-copyright)"
OUT="${ROOT}/artifacts"
TARGET="release"

build() {
	local PLATFORM="$1"
	local ARCH="$2"
	local ICON="$3"

	local ARGS=()
	if [ -n "$ICON" ]; then
		ARGS+=(--icon "out/assets/images/${ICON}")
	fi

	npx electron-packager ./out --out artifacts-out \
		${ARGS[@]} \
		--platform "$PLATFORM" \
		--arch "$ARCH" \
		--app-version "$PROJECT_VERSION" \
		--app-copyright "$PROJECT_COPYRIGHT" \
		--overwrite

	cd "${ROOT}/artifacts-out/${PROJECT_NAME}-${PLATFORM}-${ARCH}/"
}

cd "$ROOT"
set -e
[ -d "artifacts" ] || mkdir artifacts
(source "${HERE}/package-for-darwin.sh") &&
(source "${HERE}/package-for-linux.sh") &&
(source "${HERE}/package-for-windows.sh")
