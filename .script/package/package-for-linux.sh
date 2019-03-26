build linux x64 "favicon.png"
echo "Zipping app package..."
zip -r "$OUT/release-linux_x64.zip" * >/dev/null
