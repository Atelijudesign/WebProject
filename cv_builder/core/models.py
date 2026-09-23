"""
CV Builder Pro — Data Models
Pydantic models with validation for CV data.
"""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field, field_validator
from typing import List

class PersonalInfo(BaseModel):
    name: str = ""
    title: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    linkedin: str = ""
    github: str = ""
    website: str = ""

    # Los archivos .cvb antiguos pueden contener campos de foto. Se ignoran
    # explícitamente para mantener compatibilidad sin volver a exportarlos.
    model_config = ConfigDict(extra="ignore")

class SummarySection(BaseModel):
    text: str = ""


class TargetJob(BaseModel):
    """Vacante objetivo utilizada solo para la revisión ATS local."""
    title: str = ""
    description: str = ""

class ExperienceEntry(BaseModel):
    company: str = ""
    position: str = ""
    start_date: str = ""
    end_date: str = ""
    is_current: bool = False
    location: str = ""
    description: str = ""  # Markdown‑like bullet lines separated by '\n'

class EducationEntry(BaseModel):
    institution: str = ""
    degree: str = ""
    field_of_study: str = ""
    start_date: str = ""
    end_date: str = ""
    gpa: str = ""
    description: str = ""

class SkillEntry(BaseModel):
    name: str = ""
    level: int = Field(default=3, ge=1, le=5)  # 1–5
    category: str = ""  # e.g. "BIM", "Programming", "Software"

class LanguageEntry(BaseModel):
    name: str = ""
    level: str = ""  # Native, C2, C1, B2, B1, A2, A1

class CertificationEntry(BaseModel):
    name: str = ""
    issuer: str = ""
    date: str = ""
    credential_id: str = ""
    url: str = ""

class ProjectEntry(BaseModel):
    name: str = ""
    description: str = ""
    technologies: str = ""  # comma‑separated
    url: str = ""
    date: str = ""

class PublicationEntry(BaseModel):
    title: str = ""
    publisher: str = ""
    date: str = ""
    url: str = ""
    description: str = ""

class CVData(BaseModel):
    personal: PersonalInfo = Field(default_factory=PersonalInfo)
    target_job: TargetJob = Field(default_factory=TargetJob)
    summary: SummarySection = Field(default_factory=SummarySection)
    experience: List[ExperienceEntry] = Field(default_factory=list)
    education: List[EducationEntry] = Field(default_factory=list)
    skills: List[SkillEntry] = Field(default_factory=list)
    languages: List[LanguageEntry] = Field(default_factory=list)
    certifications: List[CertificationEntry] = Field(default_factory=list)
    projects: List[ProjectEntry] = Field(default_factory=list)
    publications: List[PublicationEntry] = Field(default_factory=list)

    # Allow string for summary by converting to SummarySection
    @field_validator('summary', mode='before')
    def _coerce_summary(cls, v):
        if isinstance(v, str):
            return {'text': v}
        return v

    # Visual configuration
    template: str = Field(default="executive")  # executive | minimal | technical
    accent_color: str = Field(default="#1a2332")
    font_family: str = Field(default="Inter")

    model_config = ConfigDict(from_attributes=True)
