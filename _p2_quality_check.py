#!/usr/bin/env python3
"""P2 quality checks for content consistency.

Checks:
1) Mojibake/broken-encoding patterns in HTML files.
2) Required blog navigation ids/tokens in every blog entry.
3) Single nav baseline hash across blog pages.
"""

from __future__ import annotations

import hashlib
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BLOG_DIR = ROOT / "blog"
HTML_FILES = sorted(ROOT.rglob("*.html"))
BLOG_FILES = sorted(BLOG_DIR.glob("*.html"))

BAD_TEXT_RE = re.compile(r"(Ã|Â|â|�)")
NAV_BLOCK_RE = re.compile(r"<nav[\\s\\S]*?</nav>", re.IGNORECASE)

REQUIRED_BLOG_NAV_TOKENS = (
    'id="desktop-menu"',
    'id="mobile-menu-button"',
    'id="mobile-menu"',
    "fa-layer-group",
)


def find_bad_lines(text: str) -> list[int]:
    lines: list[int] = []
    for i, line in enumerate(text.splitlines(), start=1):
        if BAD_TEXT_RE.search(line):
            lines.append(i)
    return lines


def check_bad_text() -> list[str]:
    errors: list[str] = []
    for file_path in HTML_FILES:
        text = file_path.read_text(encoding="utf-8", errors="replace")
        lines = find_bad_lines(text)
        if lines:
            rel = file_path.relative_to(ROOT)
            preview = ", ".join(str(n) for n in lines[:8])
            errors.append(f"[bad-text] {rel}: lines {preview}")
    return errors


def check_blog_nav_tokens() -> list[str]:
    errors: list[str] = []
    for file_path in BLOG_FILES:
        text = file_path.read_text(encoding="utf-8", errors="replace")
        for token in REQUIRED_BLOG_NAV_TOKENS:
            if token not in text:
                rel = file_path.relative_to(ROOT)
                errors.append(f"[nav-token] {rel}: missing {token}")
    return errors


def check_blog_nav_hash() -> list[str]:
    errors: list[str] = []
    hashes: dict[str, list[str]] = {}

    for file_path in BLOG_FILES:
        text = file_path.read_text(encoding="utf-8", errors="replace")
        nav_match = NAV_BLOCK_RE.search(text)
        if not nav_match:
            rel = file_path.relative_to(ROOT)
            errors.append(f"[nav-block] {rel}: <nav> block not found")
            continue
        nav = nav_match.group(0)
        nav_hash = hashlib.md5(nav.encode("utf-8")).hexdigest()[:8]
        hashes.setdefault(nav_hash, []).append(file_path.name)

    if len(hashes) > 1:
        errors.append("[nav-hash] Blog nav mismatch detected across files:")
        for nav_hash, files in sorted(hashes.items()):
            errors.append(f"  - {nav_hash}: {', '.join(sorted(files))}")

    return errors


def main() -> int:
    checks = [
        check_bad_text,
        check_blog_nav_tokens,
        check_blog_nav_hash,
    ]

    all_errors: list[str] = []
    for check in checks:
        all_errors.extend(check())

    if all_errors:
        print("P2 quality check FAILED")
        for err in all_errors:
            print(err)
        return 1

    print("P2 quality check OK")
    print(f"- html files checked: {len(HTML_FILES)}")
    print(f"- blog entries checked: {len(BLOG_FILES)}")
    print("- nav baseline: consistent")
    print("- mojibake patterns: none found")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

