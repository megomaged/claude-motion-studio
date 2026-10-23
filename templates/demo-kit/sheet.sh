#!/bin/bash
# Contact sheet: frames at 10/25/50/75/95 % of an mp4, 5 across. Usage: sheet.sh in.mp4 out.png [w]
in="$1"; out="$2"; w="${3:-400}"
FF=${FFMPEG:-ffmpeg}
dur=$($FF -i "$in" 2>&1 | sed -n 's/.*Duration: \([0-9:.]*\).*/\1/p' | awk -F: '{print $1*3600+$2*60+$3}')
tmp=$(mktemp -d)
i=0
for p in 0.10 0.25 0.50 0.75 0.95; do
  t=$(awk "BEGIN{print $dur*$p}")
  $FF -v error -ss "$t" -i "$in" -frames:v 1 -vf "scale=$w:-2" "$tmp/f$i.png"; i=$((i+1))
done
$FF -v error -y -i "$tmp/f0.png" -i "$tmp/f1.png" -i "$tmp/f2.png" -i "$tmp/f3.png" -i "$tmp/f4.png" -filter_complex "hstack=inputs=5" "$out"
rm -rf "$tmp"; echo "$out ($dur s)"
