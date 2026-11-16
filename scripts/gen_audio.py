"""Synthesizes all loopable audio in public/audio (original, royalty-free). Run: npm run audio"""
import numpy as np, wave, os
SR, N = 22050, 22050 * 20
rng = np.random.default_rng(7)
t = np.arange(N) / SR
out = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio'); os.makedirs(out, exist_ok=True)

def colored(f):  # FFT-shaped noise is periodic, so it loops seamlessly
    sp = np.fft.rfft(rng.standard_normal(N)); fr = np.fft.rfftfreq(N, 1 / SR); fr[0] = 1
    return np.fft.irfft(sp * f(fr), N)
def norm(x, p=0.8): return x / (np.max(np.abs(x)) + 1e-9) * p
def add(buf, i, s):  # wrap-around add keeps loops seamless
    np.add.at(buf, (int(i) + np.arange(len(s))) % N, s)
def lp(f, c): return 1 / (1 + (f / c) ** 2)
def hp(f, c): return 1 - lp(f, c)
def save(name, x):
    x = np.clip(norm(x), -1, 1)
    with wave.open(f'{out}/{name}.wav', 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype('<i2').tobytes())
def drops(rate, level):
    b = np.zeros(N)
    for _ in range(int(rate * 20)):
        k = int(0.004 * SR); add(b, rng.integers(N), rng.standard_normal(k) * np.exp(-np.arange(k) / (k / 4)) * rng.uniform(.2, 1) * level)
    return b
def pitched(buf, i, f, dur, amp, harm=(1, .4, .2, .1), dec=3.0):
    tt = np.arange(int(dur * SR)) / SR
    s = sum(a * np.sin(2 * np.pi * f * (k + 1) * tt) for k, a in enumerate(harm)) * np.exp(-tt * dec) * amp
    s[:200] *= np.linspace(0, 1, 200); add(buf, i, s)

save('white', colored(lambda f: np.ones_like(f)))
save('brown', colored(lambda f: 1 / f))
save('rain', norm(colored(lambda f: hp(f, 800) * lp(f, 9000) / f ** .3)) + drops(60, .25))
save('heavy-rain', norm(colored(lambda f: hp(f, 300) * lp(f, 7000) / f ** .2)) * 1.2 + drops(220, .35))
th = norm(colored(lambda f: hp(f, 200) * lp(f, 5000) / f ** .3)) * .7
for pos in (3.5, 12.5):
    d = (t - pos) % 20; e = np.exp(-d / 1.6) * (d < 6) * (1 + .5 * np.sin(2 * np.pi * 7 * t))
    th += norm(colored(lambda f: lp(f, 120) / f ** .5)) * e * 1.6
save('thunderstorm', th)
sw = sum(np.sin(2 * np.pi * (n / 20) * t + n) * a for n, a in ((2, 1), (3, .6), (5, .3)))
save('ocean', norm(colored(lambda f: lp(f, 2500) / f ** .5)) * (.55 + .45 * sw / 1.9))
wind = norm(colored(lambda f: lp(f, 600) / f ** .4)) * (.6 + .4 * np.sin(2 * np.pi * t / 10))
for _ in range(40):
    d = rng.uniform(.08, .2); tt = np.arange(int(d * SR)) / SR; f0 = rng.uniform(2400, 4200)
    add(wind, rng.integers(N), np.sin(2 * np.pi * (f0 * tt + 900 * tt ** 2 / d)) * np.sin(np.pi * tt / d) * .12)
save('forest', wind)
fire = norm(colored(lambda f: lp(f, 400) / f ** .6)) * .5
for _ in range(260):
    k = int(rng.uniform(.002, .02) * SR); add(fire, rng.integers(N), rng.standard_normal(k) * np.exp(-np.arange(k) / (k / 5)) * rng.uniform(.1, 1) ** 2)
save('fireplace', fire)
cafe = norm(colored(lambda f: hp(f, 150) * lp(f, 1800) / f ** .3)) * (.7 + .3 * np.sin(2 * np.pi * t * .5) * np.sin(2 * np.pi * t * 1.3))
for _ in range(9): pitched(cafe, rng.integers(N), rng.uniform(2800, 4200), .5, .12, (1, .5), 9)
save('cafe', cafe)

m = lambda n: 440 * 2 ** ((n - 69) / 12)
pi = np.zeros(N)
for i in range(14): pitched(pi, i * 1.43 * SR, m(rng.choice([57, 60, 62, 64, 67, 69, 72, 76]) - (12 if i % 4 == 0 else 0)), 5, .5, (1, .5, .25, .12, .06), 1.1)
save('soft-piano', pi)
lo = np.zeros(N); beat = 60 / 72 * SR
for c, ch in enumerate([[57, 60, 64, 67], [53, 57, 60, 64], [48, 52, 55, 59], [55, 59, 62, 65]]):
    for n in ch: pitched(lo, c * 4 * beat, m(n), 4.6, .22, (1, .3, .1), 1.3)
    pitched(lo, c * 4 * beat, m(ch[0] - 12), 3, .35, (1, .2), 1.5)
for b in range(16):
    s = b * beat
    if b % 4 in (0, 2): tt = np.arange(int(.25 * SR)) / SR; add(lo, s, np.sin(2 * np.pi * (45 + 80 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 12) * .6)
    k = int(.04 * SR); add(lo, s + beat / 2, np.diff(rng.standard_normal(k + 1)) * np.exp(-np.arange(k) / 300) * .12)
lo += drops(25, .03)
save('lofi', lo)
print('done')
