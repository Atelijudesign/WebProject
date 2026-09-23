import { FC } from "react";

export interface SEOHeadProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  keywords?: string;
  schema?: Record<string, unknown> | null;
}

declare const SEOHead: FC<SEOHeadProps>;
export default SEOHead;

export function getShareUrl(path: string): string;
