#!/bin/sh
# Web versions of the master render (maestro-web-showreel.mp4) for the repo README:
#  - maestro-web-showreel-web.mp4: 1080p60, 2-pass 2.4 Mbps, about 9 MB (under GitHub's 10 MB video upload limit)
#  - highlights.webp: 9.7 s animated highlight loop, 960x540, 20 fps, about 3.5 MB
set -e
HERE=$(cd "$(dirname "$0")/.." && pwd)
cd "$HERE"
M=maestro-web-showreel.mp4
T=$(mktemp -d)
ffmpeg -v error -y -i $M -c:v libx264 -preset veryslow -b:v 2400k -pass 1 -passlogfile "$T/p" -an -f mp4 /dev/null
ffmpeg -v error -y -i $M -c:v libx264 -preset veryslow -b:v 2400k -maxrate 4800k -bufsize 9600k -pass 2 -passlogfile "$T/p" \
  -profile:v high -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:a aac -b:a 128k -movflags +faststart maestro-web-showreel-web.mp4
# One short cut per scene (video seconds).
node -e '
const segs = [[0.45, 2.3], [3.48, 4.5], [8.3, 9.3], [11.3, 12.2], [14.3, 15.2], [18.12, 18.95], [19.3, 20.3], [24.0, 24.9], [25.55, 26.95]];
const f = segs.map(([a, b], i) => `[0:v]trim=${a}:${b},setpts=PTS-STARTPTS,fps=20,scale=960:540:flags=lanczos,hqdn3d=2:2:3:3[v${i}]`).join(";");
process.stdout.write(f + ";" + segs.map((_, i) => `[v${i}]`).join("") + `concat=n=${segs.length}:v=1:a=0[out]`);' > "$T/hl.fg"
ffmpeg -v error -y -i $M -/filter_complex "$T/hl.fg" -map "[out]" -c:v libwebp_anim -quality 70 -compression_level 6 -loop 0 highlights.webp
rm -rf "$T"
ls -la maestro-web-showreel-web.mp4 highlights.webp
