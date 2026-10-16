import React from "react";
import {
  buildIchaProfileSvg,
  buildAiscProfileSvg,
} from "./ProfileSvgFactory";

export interface ProfileSectionViewerProps {
  readonly svgHtml?: string;
  readonly ichaProfile?: Record<string, unknown> | null;
  readonly ichaSeries?: string;
  readonly aiscProfile?: Record<string, unknown> | null;
  readonly aiscUnitSys?: "metric" | "imperial" | string;
  readonly profileName?: string;
  readonly className?: string;
}

export const ProfileSectionViewer: React.FC<ProfileSectionViewerProps> = ({
  svgHtml,
  ichaProfile,
  ichaSeries,
  aiscProfile,
  aiscUnitSys = "metric",
  profileName = "Perfil Estructural",
  className = "w-full h-full flex items-center justify-center",
}) => {
  let renderedSvg = "";

  if (svgHtml) {
    renderedSvg = svgHtml;
  } else if (ichaProfile && ichaSeries) {
    renderedSvg = buildIchaProfileSvg(ichaProfile, ichaSeries);
  } else if (aiscProfile) {
    renderedSvg = buildAiscProfileSvg(aiscProfile, aiscUnitSys);
  }

  if (!renderedSvg) {
    return (
      <div
        className={`${className} text-slate-500 font-mono text-xs`}
        role="status"
        aria-label="Sin esquema disponible"
      >
        <span>Sin esquema disponible</span>
      </div>
    );
  }

  return (
    <div
      className={className}
      role="img"
      aria-label={`Esquema técnico de sección transversal: ${profileName}`}
      dangerouslySetInnerHTML={{ __html: renderedSvg }}
    />
  );
};
