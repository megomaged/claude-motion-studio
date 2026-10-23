"""Synthesize a 6.4 s, 120 BPM groove (kick / clap / hats / bass / pad / pluck) from scratch with numpy.
Original audio for the audio-reactive demo: no samples, no third-party loops.
Usage: python3 beat.py <out.wav>"""
import sys, wave
import numpy as np

SR = 44100
BPM = 120
BEAT = 60 / BPM
DUR = 6.4
N = int(SR * DUR)
t = np.arange(N) / SR
mix = np.zeros((N, 2))
rng = np.random.default_rng(7)


def place(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N:
        return
    s = sig[: N - i] * gain
    mix[i:i + len(s), 0] += s * (1 - max(pan, 0))
    mix[i:i + len(s), 1] += s * (1 + min(pan, 0))


def kick():
    d = 0.45
    tt = np.arange(int(SR * d)) / SR
    f = 46 + 110 * np.exp(-tt * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-tt * 7.5) + 0.25 * np.sin(ph * 2) * np.exp(-tt * 30)


def clap():
    d = 0.3
    tt = np.arange(int(SR * d)) / SR
    n = rng.standard_normal(len(tt))
    env = np.exp(-tt * 18) + 0.6 * np.exp(-((tt - 0.012) ** 2) / 2e-5) + 0.5 * np.exp(-((tt - 0.024) ** 2) / 2e-5)
    # crude band-pass: difference of two one-pole lowpasses
    return highpass(lowpass(n, 2600), 900) * env * 1.4


def hat(open_=False):
    d = 0.18 if open_ else 0.05
    tt = np.arange(int(SR * d)) / SR
    return highpass(rng.standard_normal(len(tt)), 7000) * np.exp(-tt * (14 if open_ else 70))


def lowpass(x, fc):
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.zeros_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc
        y[i] = acc
    return y


def highpass(x, fc):
    return x - lowpass(x, fc)


def saw(freq, d, detune=0.0):
    tt = np.arange(int(SR * d)) / SR
    out = np.zeros_like(tt)
    for k in (-detune, 0, detune):
        ph = (tt * freq * (1 + k)) % 1.0
        out += 2 * ph - 1
    return out / 3


def note(m):
    return 440 * 2 ** ((m - 69) / 12)


# A minor → F → C → G (one bar each, last bar cut at 6.4 s)
chords = [(57, [69, 72, 76]), (53, [65, 69, 72]), (48, [64, 67, 72]), (55, [67, 71, 74])]
for bar, (root, tri) in enumerate(chords):
    t0 = bar * 4 * BEAT
    # pad
    for m in tri:
        p = lowpass(saw(note(m), 4 * BEAT, 0.006), 1800)
        env = np.minimum(1, np.arange(len(p)) / (0.15 * SR)) * np.exp(-np.arange(len(p)) / SR * 0.4)
        place(p * env, t0, 0.09, pan=(m % 3 - 1) * 0.4)
    # bass on 8ths with octave hop
    for e in range(8):
        m = root - 12 + (12 if e % 4 == 3 else 0)
        b = lowpass(saw(note(m), BEAT / 2 * 0.9), 500)
        env = np.exp(-np.arange(len(b)) / SR * 6)
        place(b * env, t0 + e * BEAT / 2, 0.42)
    # pluck arpeggio on 16ths
    for s in range(16):
        m = tri[[0, 1, 2, 1][s % 4]] + (12 if s % 8 >= 4 else 0)
        p = lowpass(saw(note(m), 0.22), 3200)
        env = np.exp(-np.arange(len(p)) / SR * 16)
        place(p * env, t0 + s * BEAT / 4, 0.07, pan=0.5 if s % 2 else -0.5)

for b in range(int(DUR / BEAT) + 1):
    at = b * BEAT
    place(kick(), at, 0.95)
    if b % 4 == 3:
        place(kick(), at + BEAT * 0.75, 0.6)  # syncopated pickup
    if b % 2 == 1:
        place(clap(), at, 0.5)
    for h in range(2):
        place(hat(open_=(h == 1 and b % 2 == 1)), at + h * BEAT / 2, 0.22 if h else 0.14, pan=0.3)

# fade out the last 0.25 s, normalise to −1 dBFS peak
fade = np.ones(N)
k = int(0.25 * SR)
fade[-k:] = np.linspace(1, 0, k)
mix *= fade[:, None]
mix = np.tanh(mix * 1.1)
mix /= np.max(np.abs(mix)) / 0.89
pcm = (mix * 32767).astype("<i2")
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("wrote", sys.argv[1], f"{DUR}s")
