"""Audit WebProject blog posts against the shared design contract."""

from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
BLOG_DIR = PROJECT_ROOT / "src" / "pages" / "blog"


@dataclass
class AuditResult:
    path: Path
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)


def discover_posts(paths: list[str]) -> list[Path]:
    if paths:
        candidates = [Path(value).resolve() for value in paths]
    else:
        candidates = sorted(BLOG_DIR.glob("*.jsx"))

    posts = []
    for path in candidates:
        if not path.is_file():
            raise FileNotFoundError(f"Post not found: {path}")
        text = path.read_text(encoding="utf-8")
        if "<ShareArticle" in text:
            posts.append(path)
    return posts


def audit_post(path: Path) -> AuditResult:
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()
    result = AuditResult(path=path)

    required_tokens = {
        "SEOHead": "SEOHead is required",
        "<h1": "exactly one visible article title is required",
        "<ShareArticle": "ShareArticle is required at the end",
        "<BlogBackButton": "BlogBackButton is required",
        "useTranslation": "useTranslation is required for bilingual UI labels",
    }
    for token, message in required_tokens.items():
        if token not in text:
            result.errors.append(message)

    if text.count("<h1") != 1:
        result.errors.append(f"expected one <h1>; found {text.count('<h1')}")
    if text.count("<ShareArticle") != 1:
        result.errors.append(
            f"expected one ShareArticle; found {text.count('<ShareArticle')}"
        )

    share_line = next(
        (index for index, line in enumerate(lines, start=1) if "<ShareArticle" in line),
        0,
    )
    if share_line and share_line / max(len(lines), 1) < 0.80:
        result.errors.append("ShareArticle must be located in the final 20% of the post")

    legacy_back_link = re.search(
        r'<Link\b(?=[^>]*\bto="/blog")[^>]*>[\s\S]*?'
        r'(?:Back to Blog|Volver al Blog|Volver al blog)[\s\S]*?</Link>',
        text,
    )
    if legacy_back_link:
        result.errors.append("replace the local /blog link with BlogBackButton")

    for semantic_tag in ("<article", "<header", "<main", "<section"):
        if semantic_tag not in text:
            result.warnings.append(f"missing semantic {semantic_tag[1:]} element")

    section_count = len(re.findall(r"<section\b", text))
    if section_count >= 5 and "<BlogScrollSpyTOC" not in text:
        result.warnings.append(
            f"{section_count} sections detected; add BlogScrollSpyTOC for navigation"
        )

    if len(lines) >= 700 and "BlogScrollSpyTOC" not in text:
        result.warnings.append("long-form post should provide BlogScrollSpyTOC")

    return result


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Audit React blog posts against the WebProject design standard."
    )
    parser.add_argument("paths", nargs="*", help="Optional post files to audit")
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Treat design warnings as failures (required for new/refactored posts)",
    )
    args = parser.parse_args()

    try:
        posts = discover_posts(args.paths)
    except FileNotFoundError as error:
        print(f"ERROR: {error}", file=sys.stderr)
        return 2

    if not posts:
        print("ERROR: no blog posts found", file=sys.stderr)
        return 2

    results = [audit_post(path) for path in posts]
    error_count = sum(len(result.errors) for result in results)
    warning_count = sum(len(result.warnings) for result in results)

    for result in results:
        if not result.errors and not result.warnings:
            continue
        relative_path = result.path.relative_to(PROJECT_ROOT)
        print(f"\n{relative_path}")
        for message in result.errors:
            print(f"  ERROR: {message}")
        for message in result.warnings:
            print(f"  WARN:  {message}")

    print(
        f"\nAudited {len(results)} posts: "
        f"{error_count} errors, {warning_count} warnings."
    )

    if error_count or (args.strict and warning_count):
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
