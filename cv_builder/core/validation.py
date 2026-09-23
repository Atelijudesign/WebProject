"""
CV Builder Pro — Validation
Validación declarativa de un CVData. Devuelve una lista de `Issue` con
severidad, sección y mensaje en español.
"""
from __future__ import annotations

import re
from dataclasses import dataclass
from enum import Enum
from typing import Iterable, List

from core.models import CVData


class Severity(str, Enum):
    ERROR = "error"      # bloquea el export
    WARNING = "warning"  # debería corregirse
    INFO = "info"        # sugerencia


@dataclass(frozen=True)
class Issue:
    severity: Severity
    section: str   # nombre legible de la sección
    field: str     # nombre del campo o "general"
    message: str

    def __str__(self) -> str:  # pragma: no cover
        return f"[{self.severity.value.upper()}] {self.section} · {self.field}: {self.message}"


# Regex simple pero suficientemente robusta. No intenta cubrir RFC 5322 completo.
_EMAIL_RE = re.compile(r"^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$")
_URL_RE = re.compile(r"^(https?://)?[\w.\-]+\.[a-zA-Z]{2,}(/[\w.\-~:/?#[\]@!$&'()*+,;=%]*)?$")


def _looks_like_email(s: str) -> bool:
    return bool(s) and bool(_EMAIL_RE.match(s.strip()))


def _looks_like_url(s: str) -> bool:
    return bool(s) and bool(_URL_RE.match(s.strip()))


def validate_personal(cv: CVData) -> List[Issue]:
    p = cv.personal
    issues: List[Issue] = []
    sec = "Personal"

    if not p.name.strip():
        issues.append(Issue(Severity.ERROR, sec, "name",
                            "El nombre es obligatorio."))
    if not p.email.strip():
        issues.append(Issue(Severity.ERROR, sec, "email",
                            "El email es obligatorio."))
    elif not _looks_like_email(p.email):
        issues.append(Issue(Severity.ERROR, sec, "email",
                            f"El email '{p.email}' no tiene formato válido."))

    for field_name, value in (("linkedin", p.linkedin),
                              ("github", p.github),
                              ("website", p.website)):
        if value.strip() and not _looks_like_url(value):
            issues.append(Issue(Severity.WARNING, sec, field_name,
                                f"'{value}' no parece una URL válida."))
    return issues


def validate_summary(cv: CVData) -> List[Issue]:
    text = cv.summary.text.strip()
    if not text:
        return [Issue(Severity.WARNING, "Resumen", "text",
                      "El resumen profesional está vacío.")]
    if len(text) < 80:
        return [Issue(Severity.INFO, "Resumen", "text",
                      "El resumen es muy corto (< 80 caracteres).")]
    if len(text) > 1200:
        return [Issue(Severity.INFO, "Resumen", "text",
                      "El resumen es muy largo (> 1200 caracteres). Considera recortar.")]
    return []


def validate_experience(cv: CVData) -> List[Issue]:
    issues: List[Issue] = []
    for i, e in enumerate(cv.experience, start=1):
        sec = f"Experiencia #{i}"
        if not e.position.strip():
            issues.append(Issue(Severity.ERROR, sec, "position",
                                "El cargo es obligatorio."))
        if not e.company.strip():
            issues.append(Issue(Severity.ERROR, sec, "company",
                                "La empresa es obligatoria."))
        if not e.start_date.strip():
            issues.append(Issue(Severity.WARNING, sec, "start_date",
                                "Sin fecha de inicio."))
        if not e.is_current and not e.end_date.strip():
            issues.append(Issue(Severity.WARNING, sec, "end_date",
                                "Sin fecha de fin (no marcaste 'Trabajo actual')."))
        if not e.description.strip():
            issues.append(Issue(Severity.INFO, sec, "description",
                                "Sin descripción; añade 2-4 logros por línea."))
    return issues


def validate_education(cv: CVData) -> List[Issue]:
    issues: List[Issue] = []
    for i, ed in enumerate(cv.education, start=1):
        sec = f"Educación #{i}"
        if not ed.institution.strip():
            issues.append(Issue(Severity.ERROR, sec, "institution",
                                "La institución es obligatoria."))
        if not ed.degree.strip():
            issues.append(Issue(Severity.WARNING, sec, "degree",
                                "Sin grado/título."))
        if not ed.start_date.strip():
            issues.append(Issue(Severity.INFO, sec, "start_date",
                                "Sin fecha de inicio."))
    return issues


def validate_skills(cv: CVData) -> List[Issue]:
    if not cv.skills:
        return [Issue(Severity.WARNING, "Habilidades", "general",
                      "No has añadido ninguna habilidad.")]
    for i, s in enumerate(cv.skills, start=1):
        if not s.name.strip():
            issues_list: List[Issue] = [Issue(
                Severity.ERROR, f"Habilidades #{i}", "name",
                "La habilidad está sin nombre.",
            )]
            return issues_list
    return []


def validate_all(cv: CVData) -> List[Issue]:
    """Devuelve todos los issues ordenados por severidad."""
    issues: List[Issue] = []
    issues.extend(validate_personal(cv))
    issues.extend(validate_summary(cv))
    issues.extend(validate_experience(cv))
    issues.extend(validate_education(cv))
    issues.extend(validate_skills(cv))
    issues.sort(key=lambda i: (i.severity.value, i.section))
    return issues


def has_blocking_errors(issues: Iterable[Issue]) -> bool:
    return any(i.severity == Severity.ERROR for i in issues)


def count_by_severity(issues: Iterable[Issue]) -> dict[str, int]:
    out = {s.value: 0 for s in Severity}
    for i in issues:
        out[i.severity.value] += 1
    return out
