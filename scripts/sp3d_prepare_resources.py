"""Fase 1 - Depuracion y preparacion de recursos SmartPlant 3D.

Extrae imagenes embebidas de los manuales EFV, elimina duplicados,
descarta logos repetitivos (imagenes que aparecen en la mayoria de las
paginas, tipicamente marcas de agua o logotipos corporativos ajenos),
optimiza a WebP y genera un manifiesto por articulo.

Uso:
    python scripts/sp3d_prepare_resources.py
"""

from __future__ import annotations

import hashlib
import json
import os
from pathlib import Path

import fitz  # PyMuPDF
from PIL import Image

SOURCE_DIR = Path(
    r"C:\Users\andre\Downloads\Manual Intergraph_SmartPlant_3D\Manuales SP3D"
)
PROJECT_ROOT = Path(__file__).resolve().parents[1]
ASSETS_ROOT = PROJECT_ROOT / "public" / "assets" / "blog"
DOCS_ROOT = PROJECT_ROOT / "docs" / "sp3d_series"

MAX_WIDTH = 1400
WEBP_QUALITY = 82
MIN_IMAGE_BYTES = 8_000  # descarta iconos diminutos / balas
LOGO_PAGE_RATIO = 0.35  # imagen presente en >35% de paginas => logo/marca


def extract_article_images(pdf_name: str, article_slug: str, prefix: str) -> dict:
    """Extrae, deduplica y optimiza las imagenes de un manual EFV."""
    pdf_path = SOURCE_DIR / pdf_name
    out_dir = ASSETS_ROOT / article_slug / prefix
    out_dir.mkdir(parents=True, exist_ok=True)

    doc = fitz.open(pdf_path)
    page_count = doc.page_count

    # 1. Mapa xref -> paginas donde aparece (deteccion de logos repetidos)
    xref_pages: dict[int, list[int]] = {}
    for page_index in range(page_count):
        for img in doc[page_index].get_images(full=True):
            xref = img[0]
            xref_pages.setdefault(xref, []).append(page_index + 1)

    # 2. Extraccion con deduplicacion por hash de contenido
    seen_hashes: dict[str, str] = {}
    manifest: list[dict] = []
    logo_xrefs = {
        xref
        for xref, pages in xref_pages.items()
        if len(set(pages)) / page_count > LOGO_PAGE_RATIO
    }

    for page_index in range(page_count):
        for img_index, img in enumerate(doc[page_index].get_images(full=True)):
            xref = img[0]
            if xref in logo_xrefs:
                continue
            pix = fitz.Pixmap(doc, xref)
            if pix.n - pix.alpha > 3:
                pix = fitz.Pixmap(fitz.csRGB, pix)
            raw = pix.tobytes("png")
            if len(raw) < MIN_IMAGE_BYTES:
                continue
            digest = hashlib.sha256(raw).hexdigest()
            if digest in seen_hashes:
                continue

            image = Image.open(__import__("io").BytesIO(raw))
            if image.width > MAX_WIDTH:
                ratio = MAX_WIDTH / image.width
                image = image.resize(
                    (MAX_WIDTH, int(image.height * ratio)), Image.LANCZOS
                )
            filename = f"{prefix}-p{page_index + 1:02d}-{img_index + 1}.webp"
            image.save(out_dir / filename, "WEBP", quality=WEBP_QUALITY)
            seen_hashes[digest] = filename
            manifest.append(
                {
                    "file": filename,
                    "source_page": page_index + 1,
                    "width": image.width,
                    "height": image.height,
                }
            )

    doc.close()

    manifest_path = out_dir / "manifest.json"
    manifest_path.write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    return {
        "pdf": pdf_name,
        "pages": page_count,
        "logos_excluidos": len(logo_xrefs),
        "imagenes_extraidas": len(manifest),
        "salida": str(out_dir.relative_to(PROJECT_ROOT)),
    }


def main() -> None:
    targets = [
        ("01 SmartPlant3D Common_EFV.pdf", "sp3d-fundamentos-grillas", "common"),
        ("02 SmartPlant3D Grillas_EFV.pdf", "sp3d-fundamentos-grillas", "grillas"),
    ]
    results = [extract_article_images(pdf, slug, prefix) for pdf, slug, prefix in targets]
    DOCS_ROOT.mkdir(parents=True, exist_ok=True)
    report_path = DOCS_ROOT / "fase1_extraccion_assets.json"
    report_path.write_text(
        json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    for row in results:
        print(row)


if __name__ == "__main__":
    raise SystemExit(main())
