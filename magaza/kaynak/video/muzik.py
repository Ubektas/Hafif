#!/usr/bin/env python3
"""Tanıtım videosu için özgün fon müziği (telifsiz, tamamen burada sentezlenir).

Kullanım: python3 muzik.py <süre_sn> <çıktı.wav>
Do majör, 100 BPM; yumuşak pad + arpej + bas + hafif ritim, sentetik yankı.
"""
import sys
import wave
import numpy as np

SURE = float(sys.argv[1]) if len(sys.argv) > 1 else 38.0
OUT = sys.argv[2] if len(sys.argv) > 2 else "muzik.wav"
SR = 44100
N = int(SURE * SR)
t = np.arange(N) / SR
BEAT = 60 / 100
GIRIS = 3.6           # ilk sahne (logo) sırasında yalnızca pad
BITIS = SURE - 4.4    # kapanış sahnesinde ritim susar

def hz(m):  # MIDI → Hz
    return 440.0 * 2 ** ((m - 69) / 12)

# Akorlar (MIDI): Cmaj9, Am9, Fmaj7(#11'siz), G6sus — her biri 2 ölçü (8 vuruş)
AKOR = [
    (48, [60, 64, 67, 71, 74]),
    (45, [57, 60, 64, 67, 71]),
    (41, [57, 60, 64, 65, 69]),
    (43, [55, 59, 62, 64, 67]),
]
UZ = 8 * BEAT

def env(n, a, r):
    e = np.ones(n)
    ai, ri = int(a * SR), int(r * SR)
    if ai: e[:ai] = np.linspace(0, 1, ai)
    if ri: e[-ri:] *= np.linspace(1, 0, ri)
    return e

pad = np.zeros(N); bas = np.zeros(N); arp = np.zeros(N); ritim = np.zeros(N)
rng = np.random.default_rng(7)

k = 0; bas_t = 0.0
while bas_t < SURE:
    kok, notlar = AKOR[k % len(AKOR)]
    a = int(bas_t * SR); b = min(N, int((bas_t + UZ + 1.2) * SR)); n = b - a
    if n <= 0: break
    tt = np.arange(n) / SR
    e = env(n, 1.1, 1.6)
    for m in notlar:
        f = hz(m)
        for d in (-0.12, 0.0, 0.11):            # hafif detune, koro etkisi
            ff = f * 2 ** (d / 12)
            for h, amp in ((1, 1.0), (2, .35), (3, .16), (4, .07)):
                pad[a:b] += amp * np.sin(2 * np.pi * ff * h * tt + rng.uniform(0, 6.28)) * e * 0.018
    fb = hz(kok)
    bas[a:b] += (np.sin(2 * np.pi * fb * tt) + .25 * np.sin(2 * np.pi * 2 * fb * tt)) * env(n, .05, 1.2) * 0.16
    # arpej: sekizlik notalar, akor notaları yukarı-aşağı
    if bas_t + UZ > GIRIS:
        sira = notlar + [notlar[-1] + 5] + notlar[::-1][1:-1]
        for j in range(16):
            st = bas_t + j * BEAT / 2
            if st < GIRIS or st > SURE - 1.0: continue
            m = sira[j % len(sira)] + 12
            ia = int(st * SR); L = int(.9 * SR); ib = min(N, ia + L); tt2 = np.arange(ib - ia) / SR
            f = hz(m)
            v = (np.sin(2 * np.pi * f * tt2) + .3 * np.sin(2 * np.pi * 2 * f * tt2) + .08 * np.sin(2 * np.pi * 3 * f * tt2))
            v *= np.exp(-tt2 * 5.5) * np.minimum(1, tt2 / .004)
            hiz = 1.0 if st < BITIS else max(0, 1 - (st - BITIS) / 2.5)
            arp[ia:ib] += v * 0.055 * (0.8 + 0.2 * (j % 2 == 0)) * hiz
    bas_t += UZ; k += 1

# ritim: yumuşak kick (vuruşlarda) + çok hafif hi-hat (ara vuruşlarda)
b_t = GIRIS
while b_t < BITIS:
    ia = int(b_t * SR); L = int(.28 * SR); ib = min(N, ia + L); tt2 = np.arange(ib - ia) / SR
    f = 48 + 70 * np.exp(-tt2 * 28)
    ritim[ia:ib] += np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt2 * 13) * 0.22
    ih = int((b_t + BEAT / 2) * SR); Lh = int(.05 * SR); jh = min(N, ih + Lh)
    if jh > ih:
        nz = rng.standard_normal(jh - ih); nz = np.diff(np.concatenate([[0], nz]))   # basit tiz filtre
        ritim[ih:jh] += nz * np.exp(-np.arange(jh - ih) / SR * 90) * 0.02
    b_t += BEAT

# yankı: üstel sönen gürültü darbesiyle FFT konvolüsyonu (yalnızca pad + arpej)
ir_n = int(2.4 * SR)
ir = rng.standard_normal(ir_n) * np.exp(-np.arange(ir_n) / SR * 2.6)
ir /= np.sqrt(np.sum(ir ** 2))
def yanki(x):
    L = 1 << int(np.ceil(np.log2(len(x) + ir_n)))
    y = np.fft.irfft(np.fft.rfft(x, L) * np.fft.rfft(ir, L), L)[:len(x)]
    return y

islak = yanki(pad + arp)
sol = pad * .8 + arp * .9 + bas + ritim + islak * .55
sag = pad * .8 + np.roll(arp, int(.012 * SR)) * .9 + bas + ritim + np.roll(islak, int(.017 * SR)) * .55

ana = np.ones(N)
ana[:int(1.2 * SR)] = np.linspace(0, 1, int(1.2 * SR))
fo = int(3.2 * SR); ana[-fo:] *= np.linspace(1, 0, fo) ** 1.5
st = np.stack([sol * ana, sag * ana], axis=1)
st = np.tanh(st * 1.2) / 1.2            # yumuşak sınırlama
st *= 0.5 / np.max(np.abs(st))   # fon müziği: yaklaşık -16 LUFS
pcm = (st * 32767).astype(np.int16)
with wave.open(OUT, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print(f"{OUT}: {SURE:.1f} sn")
