#!/bin/bash
INPUT="build/icon.png"
ICONSET="build/icon.iconset"
OUTPUT="build/icon.icns"

mkdir -p "$ICONSET"

sizes=(16 32 128 256 512)
for size in "${sizes[@]}"; do
    sips -z $size $size "$INPUT" --out "${ICONSET}/icon_${size}x${size}.png"
    sips -z $((size*2)) $((size*2)) "$INPUT" --out "${ICONSET}/icon_${size}x${size}@2x.png"
done

iconutil -c icns "$ICONSET" -o "$OUTPUT"
rm -rf "$ICONSET"

echo "✅ 新图标已生成: $OUTPUT"