#!/bin/bash
# Export one demo to the repo: demo.mp4 (H.264 BT.709 faststart, ≤3 MB) + demo.gif (540 px, ≤2.5 MB) + poster.png (540 px).
# Usage: export.sh <master.mp4> <gif-master.mp4|-> <dest dir> <poster seconds> [gif colors=128] [dither=bayer:bayer_scale=3] [gif fps=15] [crf=22]
#  gif-master: a 540-px, 15-fps render with the backdrop frozen (--props '{"gif":true}'); "-" = scale the master.
set -e
in="$1"; gm="$2"; dst="$3"; pt="$4"; cols="${5:-128}"; dith="${6:-bayer:bayer_scale=3}"; fps="${7:-15}"; crf="${8:-22}"
FF=${FFMPEG:-ffmpeg}
mkdir -p "$dst"; tmp=$(mktemp -d)
if $FF -i "$in" 2>&1 | grep -q "Audio:"; then A=(-c:a aac -b:a 128k); else A=(-an); fi
$FF -v error -y -i "$in" -c:v libx264 -preset slow -crf "$crf" -pix_fmt yuv420p -tag:v avc1 \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 -movflags +faststart "${A[@]}" "$dst/demo.mp4"
[ "$gm" = "-" ] && gm="$in"
VF="fps=$fps,scale=540:-1:flags=lanczos"
$FF -v error -y -i "$gm" -vf "$VF,palettegen=max_colors=$cols:stats_mode=diff" "$tmp/pal.png"
$FF -v error -y -i "$gm" -i "$tmp/pal.png" -lavfi "$VF[x];[x][1:v]paletteuse=dither=$dith:diff_mode=rectangle" -loop 0 "$dst/demo.gif"
$FF -v error -y -ss "$pt" -i "$in" -frames:v 1 -vf "scale=540:-1:flags=lanczos" "$dst/poster.png"
rm -rf "$tmp"
printf "%-28s mp4 %5.2f MB  gif %5.2f MB  poster %4.0f KB\n" "$(basename "$dst")" \
  "$(echo "$(stat -f%z "$dst/demo.mp4")/1048576" | bc -l)" "$(echo "$(stat -f%z "$dst/demo.gif")/1048576" | bc -l)" "$(echo "$(stat -f%z "$dst/poster.png")/1024" | bc -l)"
