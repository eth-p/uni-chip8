build win32 x64 "favicon.ico"
echo "Zipping app package..."
zip --symlinks -r "$OUT/release-win32_x64.zip" * >/dev/null
