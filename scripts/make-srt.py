#!/usr/bin/env python3
"""Seslendirme kaydından YouTube altyazısı (SRT) üretir.

Konuşma tanıma modeline erişim yok; ama gerek de yok: metin zaten elimizde
(seslendirme bu script'ten okundu). Yani iş transkripsiyon değil HİZALAMA.

Yöntem:
  1. Ses tek kanala indirilip 16 kHz'e düşürülür.
  2. 10 ms adımlarla RMS zarfı çıkarılır.
  3. Histerezisli eşikle konuşma/sessizlik ayrılır; yakın parçalar birleşip
     "söyleyiş" (utterance) bloklarına dönüşür.
  4. Script satırları bu bloklara dinamik programlamayla, sırayı bozmadan
     eşlenir. Maliyet: satırın metin içindeki kümülatif payı ile bloğun
     süre içindeki kümülatif payı arasındaki fark.
  5. Her satır ekrana sığacak parçalara bölünür, süresi karakter ağırlığına
     göre dağıtılır.

Bu yaklaşım transkripsiyondan daha doğru sonuç veriyor: altyazı metni
script'le birebir aynı kalıyor, yalnız zamanlama sesten geliyor.

Kullanım:
  python3 scripts/make-srt.py <ses> <script.txt> <çıktı.srt>
"""
from __future__ import annotations

import math
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
FFMPEG = ROOT / "node_modules" / "@remotion" / "compositor-linux-x64-gnu" / "ffmpeg"

SR = 16_000
HOP = 160          # 10 ms
WIN = 480          # 30 ms

# Konuşma/sessizlik eşikleri, gürültü tabanı ile tepe arasında oran olarak.
ON_RATIO = 0.48
OFF_RATIO = 0.30
MIN_SILENCE = 0.20   # bundan kısa boşluk, söyleyişi bölmez
MIN_SPEECH = 0.12    # bundan kısa ses, konuşma sayılmaz

# Altyazı biçimi
MAX_LINE = 42
MAX_LINES = 2
CUE_GAP = 0.06       # ardışık altyazılar arasında görsel boşluk
MIN_CUE = 0.7
SNAP = 1.0           # satır sınırı bu mesafedeki duraklamaya oturur
MAX_CPS = 26.0       # saniyede karakter üst sınırı (denetim için)
MAX_CUE = 7.0


# ----------------------------------------------------------------- ses

def decode(path: Path) -> np.ndarray:
    """MP3 -> tek kanal, 16 kHz, float32 [-1, 1].

    Remotion'un ffmpeg'i ham s16le muxer'ı olmadan derlenmiş, o yüzden
    araya geçici bir WAV giriyor."""
    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / "mono.wav"
        subprocess.run(
            [str(FFMPEG), "-v", "error", "-y", "-i", str(path),
             "-ac", "1", "-ar", str(SR), "-c:a", "pcm_s16le", str(wav)],
            check=True, stderr=subprocess.PIPE,
        )
        with wave.open(str(wav), "rb") as w:
            assert w.getnchannels() == 1 and w.getsampwidth() == 2
            raw = w.readframes(w.getnframes())
    return np.frombuffer(raw, dtype="<i2").astype(np.float32) / 32768.0


def envelope(x: np.ndarray) -> np.ndarray:
    """10 ms adımlı RMS zarfı, dB cinsinden."""
    n = 1 + max(0, (len(x) - WIN)) // HOP
    frames = np.lib.stride_tricks.as_strided(
        x, shape=(n, WIN), strides=(x.strides[0] * HOP, x.strides[0])
    )
    rms = np.sqrt((frames.astype(np.float64) ** 2).mean(axis=1))
    return 20 * np.log10(rms + 1e-9)


def utterances(db: np.ndarray) -> list[tuple[float, float]]:
    """Histerezisli eşikle konuşma bloklarını bulur."""
    floor = float(np.percentile(db, 12))
    peak = float(np.percentile(db, 95))
    on = floor + ON_RATIO * (peak - floor)
    off = floor + OFF_RATIO * (peak - floor)

    hot = db > on
    warm = db > off
    live = np.zeros(len(db), dtype=bool)
    speaking = False
    for i in range(len(db)):
        if speaking:
            speaking = warm[i]
        else:
            speaking = hot[i]
        live[i] = speaking

    # Kenarları zamana çevir
    edges = np.diff(live.astype(np.int8))
    starts = list((np.flatnonzero(edges == 1) + 1))
    ends = list(np.flatnonzero(edges == -1) + 1)
    if live[0]:
        starts.insert(0, 0)
    if live[-1]:
        ends.append(len(live))

    segs = [(s * HOP / SR, e * HOP / SR) for s, e in zip(starts, ends)]

    # Kısa boşlukları kapat
    merged: list[list[float]] = []
    for s, e in segs:
        if merged and s - merged[-1][1] < MIN_SILENCE:
            merged[-1][1] = e
        else:
            merged.append([s, e])

    return [(s, e) for s, e in merged if e - s >= MIN_SPEECH]


# -------------------------------------------------------------- hizalama

def weights(lines: list[str]) -> np.ndarray:
    """Satır ağırlığı: konuşma süresiyle en iyi korele olan ölçü karakter
    sayısı. Kelime sayısı, uzun Almanca bileşik kelimelerde yanıltıyor."""
    return np.array([max(1, len(l)) for l in lines], dtype=np.float64)


def speech_clock(utts: list[tuple[float, float]]):
    """Sessizlikleri atan bir 'konuşma saati' kurar.

    Anlatıcı sessizlikte metin ilerletmediği için metni duvar saatine değil
    bu saate göre dağıtmak gerekiyor; yoksa uzun duraklamalardan sonra
    altyazı sürekli geri kalıyor.
    """
    starts = np.array([a for a, _ in utts])
    ends = np.array([b for _, b in utts])
    cum = np.concatenate([[0.0], np.cumsum(ends - starts)])
    return starts, ends, cum


def to_wall(t: float, starts, ends, cum) -> float:
    i = int(np.clip(np.searchsorted(cum, t, side="right") - 1, 0, len(starts) - 1))
    return float(min(starts[i] + (t - cum[i]), ends[i]))


def spans(lines: list[str], utts: list[tuple[float, float]]) -> list[tuple[float, float]]:
    """Her satıra bir zaman aralığı verir.

    İki adım: (1) metin, konuşma saatinde karakter ağırlığına göre bölünür —
    bu, saniyedeki karakterin baştan sona dengeli kalmasını garantiler;
    (2) satır sınırları yakınlarındaki gerçek duraklamalara oturtulur, yani
    altyazı cümle ortasında değil nefes alınan yerde değişir.
    """
    starts, ends, cum = speech_clock(utts)
    w = weights(lines)
    share = np.concatenate([[0.0], np.cumsum(w)]) / w.sum()
    marks = [to_wall(cum[-1] * x, starts, ends, cum) for x in share]

    # Duraklamalar: (önceki bitiş, sonraki başlangıç, orta nokta)
    gaps = [(float(ends[i]), float(starts[i + 1]), float((ends[i] + starts[i + 1]) / 2))
            for i in range(len(utts) - 1)]
    mids = np.array([g[2] for g in gaps]) if gaps else np.zeros(0)

    # Sınır başına (önceki satırın bitişi, sonraki satırın başlangıcı).
    # İzin verilen kaydırma, komşu satırların kendi sürelerine bağlı: sabit
    # bir pay kısa satırları tamamen yutuyordu.
    cuts: list[tuple[float, float]] = []
    used: set[int] = set()
    for i, t in enumerate(marks[1:-1], start=1):
        room = 0.34 * min(t - marks[i - 1], marks[i + 1] - t)
        limit = min(SNAP, max(0.12, room))
        k = -1
        if len(mids):
            j = int(np.argmin(np.abs(mids - t)))
            if abs(mids[j] - t) <= limit and j not in used:
                k = j
        if k >= 0:
            used.add(k)
            cuts.append((gaps[k][0], gaps[k][1]))
        else:
            cuts.append((t - CUE_GAP / 2, t + CUE_GAP / 2))

    head = float(starts[0])
    tail = float(ends[-1])
    out: list[tuple[float, float]] = []
    prev = head
    for i in range(len(lines)):
        end = cuts[i][0] if i < len(cuts) else tail
        nxt = cuts[i][1] if i < len(cuts) else tail
        # Duraklamaya oturma satırı yutmasın
        if end - prev < 0.25:
            end = prev + 0.25
            nxt = max(nxt, end + CUE_GAP)
        out.append((prev, end))
        prev = nxt
    return out


# ---------------------------------------------------------------- altyazı

# Satır sonunda asılı kalmaması gereken kelimeler (Almanca + İngilizce).
DANGLING = {
    "der", "die", "das", "den", "dem", "des", "ein", "eine", "einen", "einem",
    "einer", "eines", "und", "oder", "aber", "mit", "von", "vom", "zu", "zur",
    "zum", "für", "auf", "in", "im", "an", "am", "bei", "beim", "nach", "über",
    "unter", "vor", "ist", "sind", "war", "waren", "wird", "werden", "hat",
    "haben", "hatte", "wir", "du", "ihr", "sie", "er", "es", "ich", "man",
    "nicht", "kein", "keine", "wenn", "dass", "weil", "als", "wie", "so",
    "noch", "nur", "auch", "schon", "sehr", "mehr", "dann", "hier", "dort",
    "mein", "meine", "dein", "deine", "unser", "unsere", "sich", "sein",
    "the", "a", "an", "and", "or", "but", "of", "to", "in", "on", "at", "for",
    "with", "from", "is", "are", "was", "were", "we", "you", "it", "that",
    "this", "our", "your",
}


def wrap(text: str, max_lines: int = MAX_LINES) -> list[str]:
    """Metni dengeli satırlara böler.

    Açgözlü sarma ilk satırı doldurup ikinciye tek kelime bırakıyordu
    ("... Spot / Trading,"). Burada bütün kırılma noktaları birlikte
    seçiliyor: satırlar eşit uzunluğa yakın olsun, kırılma noktalamadan
    sonra düşsün, satır sonunda işlev kelimesi asılı kalmasın.
    """
    words = text.split()
    if not words:
        return [""]
    if len(text) <= MAX_LINE:
        return [text]

    k = min(max_lines, max(2, math.ceil(len(text) / MAX_LINE)))
    n = len(words)
    # pos[i] = ilk i kelimenin tek satırdaki uzunluğu
    pos = [0]
    for w in words:
        pos.append(pos[-1] + len(w) + (1 if pos[-1] else 0))
    target = pos[n] / k

    ENDS = (",", ".", "!", "?", ";", ":", "\u2026", "\u2013")
    INF = float("inf")
    best = [[INF] * (k + 1) for _ in range(n + 1)]
    back = [[0] * (k + 1) for _ in range(n + 1)]
    best[0][0] = 0.0

    for j in range(1, k + 1):
        for i in range(1, n + 1):
            for t in range(j - 1, i):
                if best[t][j - 1] == INF:
                    continue
                width = pos[i] - pos[t] - (1 if t else 0)
                if width > MAX_LINE:
                    continue
                cost = best[t][j - 1] + (width - target) ** 2
                if i < n:
                    last = words[i - 1]
                    if last.endswith(ENDS):
                        cost -= target * 1.6
                    if last.strip(",.;:!?\u2026\u2013\u201e\u201c\"'").lower() in DANGLING:
                        cost += target * 2.4
                if cost < best[i][j]:
                    best[i][j] = cost
                    back[i][j] = t

    j = min(range(1, k + 1), key=lambda q: best[n][q])
    if best[n][j] == INF:
        # Hiçbir bölme sığmadı (çok uzun tek kelime): açgözlü geri dönüş
        out, cur = [], ""
        for w in words:
            cand = f"{cur} {w}".strip()
            if len(cand) <= MAX_LINE or not cur:
                cur = cand
            else:
                out.append(cur)
                cur = w
        if cur:
            out.append(cur)
        return out

    idx, lines = n, []
    while j > 0:
        t = back[idx][j]
        lines.append(" ".join(words[t:idx]))
        idx, j = t, j - 1
    return list(reversed(lines))


def split_balanced(text: str, n: int) -> list[str]:
    """Metni n parçaya böler; kesme noktalarını dengeli tutar ve mümkünse
    noktalamadan sonra seçer.

    Naif bölme, satırın sonunda tek kelimelik artıklar bırakıyordu
    ("... zusammen.") — ekranda yarım saniye görünüp kayboluyorlardı.
    """
    words = text.split()
    if n <= 1 or len(words) <= n:
        return [text]

    pos, acc = [], 0
    for w in words:
        acc += len(w) + 1
        pos.append(acc - 1)
    total = pos[-1]

    ENDS = (",", ".", "!", "?", ";", ":", "\u2026", "\u2013", "\u201c", '"')
    cuts: set[int] = set()
    for k in range(1, n):
        target = total * k / n
        window = total / (n * 1.4)
        best, best_cost = None, None
        for i in range(len(words) - 1):
            if i in cuts:
                continue
            d = abs(pos[i] - target)
            if d > window:
                continue
            cost = d - (window * 0.55 if words[i].endswith(ENDS) else 0.0)
            if best_cost is None or cost < best_cost:
                best, best_cost = i, cost
        if best is None:
            best = min((i for i in range(len(words) - 1) if i not in cuts),
                       key=lambda i: abs(pos[i] - target), default=None)
        if best is not None:
            cuts.add(best)

    chunks, start = [], 0
    for c in sorted(cuts):
        chunks.append(" ".join(words[start : c + 1]))
        start = c + 1
    chunks.append(" ".join(words[start:]))
    return [c for c in chunks if c]


def cues_for(text: str) -> list[str]:
    """Bir script satırını ekrana sığan altyazı bloklarına böler."""
    budget = MAX_LINE * MAX_LINES
    n = max(1, math.ceil(len(text) / budget))
    for _ in range(6):
        chunks = split_balanced(text, n)
        wrapped = [wrap(c) for c in chunks]
        if all(len(w) <= MAX_LINES and max(len(l) for l in w) <= MAX_LINE for w in wrapped):
            break
        n += 1
    return ["\n".join(w) for w in wrapped]


def stamp(t: float) -> str:
    ms = int(round(t * 1000))
    ms = max(0, ms)
    h, ms = divmod(ms, 3_600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def build(lines: list[str], span: list[tuple[float, float]], total: float) -> list[tuple[float, float, str]]:
    raw: list[list] = []
    for text, (a, b) in zip(lines, span):
        blocks = cues_for(text)
        w = np.array([max(1, len(x)) for x in blocks], dtype=np.float64)
        share = np.concatenate([[0.0], np.cumsum(w)]) / w.sum()
        for k, blk in enumerate(blocks):
            raw.append([a + (b - a) * share[k], a + (b - a) * share[k + 1], blk])

    # Hızlı kalan bloklar, komşusunda boş süre varsa ondan ödünç alır.
    # Orantısal dağıtım tabanı zaten dengeli; bu yalnız duraklamaya oturma
    # sırasında sıkışan birkaç bloğu düzeltiyor.
    def chars(i: int) -> int:
        return len(raw[i][2].replace("\n", " "))

    for _ in range(3):
        for i in range(len(raw)):
            need = chars(i) / MAX_CPS - (raw[i][1] - raw[i][0])
            if need <= 0.01:
                continue
            # sağdan ödünç
            if i + 1 < len(raw):
                slack = (raw[i + 1][1] - raw[i + 1][0]) - chars(i + 1) / MAX_CPS
                take = min(need, max(0.0, slack))
                if take > 0:
                    raw[i][1] += take
                    raw[i + 1][0] += take
                    need -= take
            # soldan ödünç
            if need > 0.01 and i > 0:
                slack = (raw[i - 1][1] - raw[i - 1][0]) - chars(i - 1) / MAX_CPS
                take = min(need, max(0.0, slack))
                if take > 0:
                    raw[i][0] -= take
                    raw[i - 1][1] -= take

    out: list[tuple[float, float, str]] = []
    for i, (a, b, txt) in enumerate(raw):
        nxt = raw[i + 1][0] if i + 1 < len(raw) else total
        b = min(b, a + MAX_CUE)
        if b - a < MIN_CUE:
            b = a + MIN_CUE
        # Sonraki bloğun üstüne binme; binecekse aradaki boşluğu paylaş
        b = min(b, max(a + 0.35, nxt - CUE_GAP))
        out.append((max(0.0, a), min(b, total), txt))
    return out


def main() -> None:
    audio, script, dest = (Path(p) for p in sys.argv[1:4])
    lines = [l.strip() for l in script.read_text(encoding="utf-8").splitlines() if l.strip()]

    x = decode(audio)
    total = len(x) / SR
    utts = utterances(envelope(x))

    span = spans(lines, utts)
    cues = build(lines, span, total)

    dest.write_text(
        "".join(
            f"{i}\n{stamp(a)} --> {stamp(b)}\n{txt}\n\n"
            for i, (a, b, txt) in enumerate(cues, 1)
        ),
        encoding="utf-8",
    )

    words = sum(len(l.split()) for l in lines)
    speech = sum(e - s for s, e in utts)
    print(f"ses            : {total/60:.0f}:{total%60:05.2f}  ({total:.2f} sn)")
    print(f"konuşma        : {speech:.1f} sn  (%{100*speech/total:.0f}), sessizlik {total-speech:.1f} sn")
    print(f"söyleyiş bloğu : {len(utts)}")
    print(f"script         : {len(lines)} satır, {words} kelime "
          f"-> {words/(speech/60):.0f} kelime/dk (konuşma süresine göre)")
    cps = np.array([len(t.replace(chr(10), " ")) / (b - a) for a, b, t in cues])
    durs = np.array([b - a for a, b, _ in cues])
    over = int((cps > MAX_CPS).sum())
    print(f"altyazı        : {len(cues)} blok -> {dest}")
    print(f"blok süresi    : ort {durs.mean():.2f} sn, min {durs.min():.2f}, max {durs.max():.2f}")
    print(f"karakter/sn    : ort {cps.mean():.1f}, min {cps.min():.1f}, max {cps.max():.1f} "
          f"({over} blok {MAX_CPS:.0f} üstünde)")
    srt_words = sum(len(t.replace(chr(10), " ").split()) for _, _, t in cues)
    print(f"metin denetimi : script {words} kelime, altyazı {srt_words} kelime "
          f"-> {'birebir' if srt_words == words else 'FARKLI'}")


if __name__ == "__main__":
    main()
