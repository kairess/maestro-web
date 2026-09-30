#!/bin/sh
# Soundtrack: Dies Irae 0–29.5 s delayed by the 0.5 s upbeat, a reversed swell into the first hit,
# and an equal-power crossfade to the game's Fail rendition at 18.05–20.33 s (same curve as
# failMix() in reel.js). Output: out/mix.wav (about -12.6 LUFS, -0.9 dBTP).
set -e
HERE=$(cd "$(dirname "$0")/.." && pwd)
A="$HERE/../public/audio/Verdi_DiesIrae"
mkdir -p "$HERE/out"
ffmpeg -v error -y -i "$A/Verdi_DiesIrae.ogg" -i "$A/Verdi_DiesIrae_Fail.ogg" -i "$A/Verdi_DiesIrae.ogg" \
  -/filter_complex "$HERE/scripts/audio.fg" -map "[out]" -c:a pcm_s24le "$HERE/out/mix.wav"
echo "audio ready → $HERE/out/mix.wav"
