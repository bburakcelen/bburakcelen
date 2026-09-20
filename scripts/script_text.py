"""Yerel metin dosyalarından seslendirme script'ini sırayla çeker.

de.ts / en.ts sahne kayıtlarında `script:` alanı seslendirmenin o sahneye
düşen cümlesidir. Sahneler s01..s61 sırasıyla okunur; dosyadaki sıra zaten
anlatım sırası olduğu için ek bir sıralamaya gerek yok.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Hem tek hem çift tırnak; kaçışlı tırnakları da tolere eder.
FIELD = re.compile(r"""script:\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)')""")


def unescape(s: str) -> str:
    return (
        s.replace("\\'", "'")
        .replace('\\"', '"')
        .replace("\\n", " ")
        .replace("\\\\", "\\")
    )


def load(locale: str) -> list[str]:
    src = (ROOT / "src" / "script" / "text" / f"{locale}.ts").read_text(encoding="utf-8")
    out = []
    for m in FIELD.finditer(src):
        raw = m.group(1) if m.group(1) is not None else m.group(2)
        text = unescape(raw).strip()
        if text:
            out.append(text)
    return out


if __name__ == "__main__":
    for loc in sys.argv[1:] or ["en", "de"]:
        lines = load(loc)
        words = sum(len(l.split()) for l in lines)
        chars = sum(len(l) for l in lines)
        print(f"{loc}: {len(lines)} satır, {words} kelime, {chars} karakter")
