"""Fase 1 - OCR del manual escaneado 605829625-SmartPlant-3D-Common.pdf.

El PDF de 143 paginas no tiene capa de texto (0 paginas con texto).
Se renderiza cada pagina a 200 DPI y se aplica Tesseract (eng+spa).
Salida: docs/sp3d_series/fuentes/common_ocr_texto.txt
        docs/sp3d_series/fuentes/common_ocr_marcas.json (conteo de marcas)
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import fitz
import pytesseract
from PIL import Image

pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)
TESSDATA = r"C:\Users\andre\tessdata"

SOURCE = Path(
    r"C:\Users\andre\Downloads\Manual Intergraph_SmartPlant_3D"
    r"\01_Manuales_y_Guias\605829625-SmartPlant-3D-Common.pdf"
)
PROJECT_ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = PROJECT_ROOT / "docs" / "sp3d_series" / "fuentes"
OUT_DIR.mkdir(parents=True, exist_ok=True)

BRANDS = ["ecopetrol", "seringtec", "intergraph", "hexagon"]


def main() -> int:
    doc = fitz.open(SOURCE)
    chunks: list[str] = []
    hits = {brand: 0 for brand in BRANDS}

    for index in range(doc.page_count):
        pix = doc[index].get_pixmap(dpi=200)
        image = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
        text = pytesseract.image_to_string(
            image, lang="eng+spa", config=f"--tessdata-dir {TESSDATA}"
        )
        lowered = text.lower()
        for brand in BRANDS:
            hits[brand] += lowered.count(brand)
        chunks.append(f"===== PAGINA {index + 1} =====\n{text.strip()}")
        if (index + 1) % 10 == 0:
            print(f"OCR {index + 1}/{doc.page_count}", flush=True)

    (OUT_DIR / "common_ocr_texto.txt").write_text(
        "\n\n".join(chunks), encoding="utf-8"
    )
    (OUT_DIR / "common_ocr_marcas.json").write_text(
        json.dumps(hits, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    print("OCR completado:", doc.page_count, "paginas")
    print("Marcas detectadas:", hits)
    return 0


if __name__ == "__main__":
    sys.exit(main())
