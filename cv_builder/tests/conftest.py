"""
Conftest para tests del CV Builder.
Añade la carpeta `cv_builder/` al sys.path para poder importar core/ y ui/.
"""
import sys
from pathlib import Path

_CV_BUILDER = Path(__file__).resolve().parent.parent
if str(_CV_BUILDER) not in sys.path:
    sys.path.insert(0, str(_CV_BUILDER))
