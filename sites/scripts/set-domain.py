#!/usr/bin/env python3
"""Заменяет YOUR-DOMAIN.ru на ваш домен во всех файлах сайта.

Использование:  python3 scripts/set-domain.py example.ru
"""
import pathlib
import sys

if len(sys.argv) != 2:
    sys.exit("Укажите домен: python3 scripts/set-domain.py example.ru")

domain = sys.argv[1].replace("https://", "").replace("http://", "").strip("/")
root = pathlib.Path(__file__).resolve().parent.parent
files = list(root.glob("*.html")) + list(root.glob("*/index.html")) + [root / "robots.txt", root / "sitemap.xml"]

count = 0
for p in files:
    if p.exists():
        text = p.read_text(encoding="utf-8")
        if "YOUR-DOMAIN.ru" in text:
            p.write_text(text.replace("YOUR-DOMAIN.ru", domain), encoding="utf-8")
            count += 1
            print("обновлён:", p.relative_to(root))
print(f"Готово. Файлов изменено: {count}")
