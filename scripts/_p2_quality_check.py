#!/usr/bin/env python3
"""P2 quality checks for content consistency.

Checks:
1) Mojibake/broken-encoding patterns in HTML files.
2) Required blog navigation ids/tokens in every blog entry.
3) Single nav baseline hash across blog pages.
4) Required tool navigation ids/tokens in every tool page.
5) Single nav baseline hash across project pages.
6) Internal links and anchors resolving to existing local targets.
"""

from __future__ import annotations

import hashlib
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BLOG_DIR = ROOT / "blog"
TOOL_DIR = ROOT / "tool"
PROJECT_DIR = ROOT / "project"
HTML_FILES = sorted(ROOT.rglob("*.html"))
BLOG_FILES = sorted(BLOG_DIR.glob("*.html"))
TOOL_FILES = sorted(TOOL_DIR.glob("*.html"))
PROJECT_FILES = sorted(PROJECT_DIR.glob("*.html"))

BAD_TEXT_RE = re.compile(r"(Ã|Â|â|�)")
NAV_BLOCK_RE = re.compile(r"<nav[\s\S]*?</nav>", re.IGNORECASE)
LINK_RE = re.compile(r'''(?:href|src)\s*=\s*["']([^"']+)["']''', re.IGNORECASE)
ID_RE = re.compile(r'''\bid\s*=\s*["']([^"']+)["']''', re.IGNORECASE)

REQUIRED_BLOG_NAV_TOKENS = (
    'id="desktop-menu"',
    'id="mobile-menu-button"',
    'id="mobile-menu"',
    "fa-layer-group",
)

REQUIRED_TOOL_NAV_TOKENS = (
    'id="desktop-menu"',
    'id="mobile-menu-button"',
    'id="mobile-menu"',
    "fa-layer-group",
    'href="../blog/blog.html"',
    'href="../proyectos-bim/index.html"',
    'href="../index.html#contact"',
)

REQUIRED_PROJECT_NAV_TOKENS = (
    'id="desktop-menu"',
    'id="mobile-menu-button"',
    'id="mobile-menu"',
    "fa-layer-group",
    'href="../blog/blog.html"',
    'href="../tool/index.html"',
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


def check_tool_nav_tokens() -> list[str]:
    errors: list[str] = []
    for file_path in TOOL_FILES:
        text = file_path.read_text(encoding="utf-8", errors="replace")
        for token in REQUIRED_TOOL_NAV_TOKENS:
            if token not in text:
                rel = file_path.relative_to(ROOT)
                errors.append(f"[tool-nav-token] {rel}: missing {token}")
    return errors


def check_project_nav_tokens() -> list[str]:
    errors: list[str] = []
    for file_path in PROJECT_FILES:
        text = file_path.read_text(encoding="utf-8", errors="replace")
        for token in REQUIRED_PROJECT_NAV_TOKENS:
            if token not in text:
                rel = file_path.relative_to(ROOT)
                errors.append(f"[project-nav-token] {rel}: missing {token}")
    return errors


def check_project_nav_hash() -> list[str]:
    errors: list[str] = []
    hashes: dict[str, list[str]] = {}

    for file_path in PROJECT_FILES:
        text = file_path.read_text(encoding="utf-8", errors="replace")
        nav_match = NAV_BLOCK_RE.search(text)
        if not nav_match:
            rel = file_path.relative_to(ROOT)
            errors.append(f"[project-nav-block] {rel}: <nav> block not found")
            continue
        nav = nav_match.group(0)
        nav_hash = hashlib.md5(nav.encode("utf-8")).hexdigest()[:8]
        hashes.setdefault(nav_hash, []).append(file_path.name)

    if len(hashes) > 1:
        errors.append("[project-nav-hash] Project nav mismatch detected across files:")
        for nav_hash, files in sorted(hashes.items()):
            errors.append(f"  - {nav_hash}: {', '.join(sorted(files))}")

    return errors


def _resolve_target(file_path: Path, raw: str) -> tuple[Path | None, str | None]:
    if raw.startswith(("http://", "https://", "mailto:", "tel:", "javascript:")):
        return None, None
    if raw.startswith("/_vercel/"):
        return None, None

    path_part, _, fragment = raw.partition("#")
    path_part, _, _query = path_part.partition("?")

    if not path_part:
        return file_path, fragment or None

    if path_part.startswith("/"):
        target = (ROOT / path_part.lstrip("/")).resolve()
    else:
        target = (file_path.parent / path_part).resolve()

    return target, fragment or None


def check_internal_links() -> list[str]:
    errors: list[str] = []
    html_files = [p for p in HTML_FILES if p.suffix.lower() == ".html"]

    for file_path in html_files:
        text = file_path.read_text(encoding="utf-8", errors="replace")
        ids = set(ID_RE.findall(text))
        file_issues: list[str] = []
        lines = text.splitlines()

        for line_no, line in enumerate(lines, start=1):
            for match in LINK_RE.finditer(line):
                raw = match.group(1).strip()
                target_path, fragment = _resolve_target(file_path, raw)
                if target_path is None:
                    continue

                if not target_path.exists():
                    file_issues.append(f"  - L{line_no}: [link-missing] {raw}")
                    continue

                if fragment:
                    target_text = target_path.read_text(encoding="utf-8", errors="replace")
                    target_ids = set(ID_RE.findall(target_text))
                    if fragment not in (ids if target_path == file_path else target_ids):
                        file_issues.append(f"  - L{line_no}: [anchor-missing] {raw}")

        if file_issues:
            rel = file_path.relative_to(ROOT)
            errors.append(f"[links] {rel}")
            errors.extend(file_issues)

    return errors


def main() -> int:
    checks = [
        check_bad_text,
        check_blog_nav_tokens,
        check_blog_nav_hash,
        check_tool_nav_tokens,
        check_project_nav_tokens,
        check_project_nav_hash,
        check_internal_links,
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
    print(f"- tool pages checked: {len(TOOL_FILES)}")
    print(f"- project pages checked: {len(PROJECT_FILES)}")
    print("- blog/project nav baseline: consistent")
    print("- tool nav tokens: present")
    print("- internal links: resolved")
    print("- mojibake patterns: none found")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

