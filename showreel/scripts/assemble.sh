#!/bin/sh
# Concatenates the motion-blurred lossless chunks (out/chunks), converts to BT.709 4:2:0 and muxes
# out/mix.wav into showreel/maestro-web-showreel.mp4.
set -e
HERE=$(cd "$(dirname "$0")/.." && pwd)
cd "$HERE/out"
ls chunks/chunk_*.mkv | sort | sed "s/^/file '/; s/$/'/" > chunks.txt
# The chunks were converted from RGB with ffmpeg's default BT.601 matrix.
ffmpeg -v error -stats -y -f concat -safe 0 -i chunks.txt -i mix.wav \
  -vf "setpts=N/(60*TB),scale=in_color_matrix=bt601:out_color_matrix=bt709:in_range=tv:out_range=tv,format=yuv420p" \
  -r 60 -c:v libx264 -preset slow -crf 15 -profile:v high -level 4.2 -x264-params "aq-mode=3:aq-strength=0.9" \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv \
  -c:a aac -b:a 320k -ar 48000 -movflags +faststart -shortest -metadata title="MAESTRO web — Showreel" \
  "$HERE/maestro-web-showreel.mp4"
ffmpeg -v error -y -ss 5.0 -i "$HERE/maestro-web-showreel.mp4" -frames:v 1 -q:v 2 "$HERE/poster.jpg"
echo "done → $HERE/maestro-web-showreel.mp4"
