import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const blogDir = path.resolve("src/pages/blog");
const blogDataUrl = pathToFileURL(path.resolve("src/data/blog_data.js")).href;

const COMMON_REPLACEMENTS = [
  {
    regex: /Volver al Blog/g,
    replace: '{isEn ? "Back to Blog" : "Volver al Blog"}'
  },
  {
    regex: /(\d+)\s+min\s+lectura/g,
    replace: '{isEn ? "$1 min read" : "$1 min lectura"}'
  },
  {
    regex: /Ver Video en YouTube/g,
    replace: '{isEn ? "Watch on YouTube" : "Ver Video en YouTube"}'
  },
  {
    regex: /Ver Repositorio en GitHub/g,
    replace: '{isEn ? "View Repository on GitHub" : "Ver Repositorio en GitHub"}'
  },
  {
    regex: /Ver Repositorio/g,
    replace: '{isEn ? "View Repository" : "Ver Repositorio"}'
  },
  {
    regex: />\s*Conclusiones Clave\s*</g,
    replace: '>{isEn ? "Key Conclusions" : "Conclusiones Clave"}<'
  },
  {
    regex: />\s*Conclusión\s*</g,
    replace: '>{isEn ? "Conclusion" : "Conclusión"}<'
  },
  {
    regex: />\s*Fuentes Oficiales y Documentación de Migración\s*</g,
    replace: '>{isEn ? "Official Sources & Migration Documentation" : "Fuentes Oficiales y Documentación de Migración"}<'
  },
  {
    regex: />\s*Fuentes Oficiales y Recursos\s*</g,
    replace: '>{isEn ? "Official Resources & Documentation" : "Fuentes Oficiales y Recursos"}<'
  },
  {
    regex: />\s*Fuentes y Documentación Oficial de Referencia\s*</g,
    replace: '>{isEn ? "Official Reference & Documentation" : "Fuentes y Documentación Oficial de Referencia"}<'
  },
  {
    regex: /Figura (\d+):/g,
    replace: '{isEn ? "Figure $1:" : "Figura $1:"}'
  },
  {
    regex: />\s*Resumen de Acciones para BIM Devs\s*</g,
    replace: '>{isEn ? "Action Summary for BIM Devs" : "Resumen de Acciones para BIM Devs"}<'
  },
  {
    regex: />\s*Resumen de Acciones\s*</g,
    replace: '>{isEn ? "Action Summary" : "Resumen de Acciones"}<'
  },
  {
    regex: />\s*Código de Ejemplo\s*</g,
    replace: '>{isEn ? "Sample Code" : "Código de Ejemplo"}<'
  }
];

async function main() {
  const { BLOG_POSTS } = await import(blogDataUrl);
  const postMap = new Map();
  BLOG_POSTS.forEach(p => {
    postMap.set(p.slug, p);
    postMap.set(p.id, p);
  });

  const files = fs.readdirSync(blogDir).filter(f => f.endsWith(".jsx") && f !== "BlogCatalog.jsx");

  console.log(`Processing ${files.length} blog post components...`);

  let updatedCount = 0;

  for (const file of files) {
    const filePath = path.join(blogDir, file);
    let code = fs.readFileSync(filePath, "utf-8");

    // 1. Find slug
    const slugMatch = code.match(/getShareUrl\(["']\/blog\/([^"']+)["']\)/);
    const slug = slugMatch ? slugMatch[1] : null;
    const postData = slug ? postMap.get(slug) : null;

    if (!postData) {
      console.warn(`[WARN] Could not find postData for ${file} (slug: ${slug})`);
    }

    // Skip VibeCodingRevitPython.jsx if already fully bilingual
    if (file === "VibeCodingRevitPython.jsx") {
      console.log(`Skipping already bilingual file: ${file}`);
      continue;
    }

    // 2. Ensure useTranslation is imported
    if (!code.includes("useTranslation")) {
      code = code.replace(
        /import React, \{([^}]*)\} from "react";/,
        'import React, {$1} from "react";\nimport { useTranslation } from "../../context/LanguageContext";'
      );
      if (!code.includes("useTranslation")) {
        code = 'import { useTranslation } from "../../context/LanguageContext";\n' + code;
      }
    }

    // 3. Ensure const { language } = useTranslation(); const isEn = language === "en"; inside the component
    if (!code.includes("const isEn =")) {
      const matchComp = code.match(/export default function ([A-Za-z0-9_]+)\s*\(\)\s*\{/);
      if (matchComp) {
        const compDecl = matchComp[0];
        code = code.replace(
          compDecl,
          `${compDecl}\n  const { language } = useTranslation();\n  const isEn = language === "en";`
        );
      }
    }

    // 4. Update shareTitle to be bilingual
    if (postData && postData.title_en) {
      code = code.replace(
        /const shareTitle = encodeURIComponent\(["']([^"']+)["']\);/,
        (match, originalTitle) => {
          return `const shareTitle = encodeURIComponent(isEn ? ${JSON.stringify(postData.title_en)} : ${JSON.stringify(originalTitle)});`;
        }
      );
    }

    // 5. Update SEOHead to be bilingual
    if (postData && postData.title_en && postData.description_en) {
      code = code.replace(
        /<SEOHead\s+title=["']([^"']+)["']\s+description=["']([^"']+)["']/g,
        (match, t, d) => `<SEOHead\n        title={isEn ? ${JSON.stringify(postData.title_en)} : ${JSON.stringify(t)}}\n        description={isEn ? ${JSON.stringify(postData.description_en)} : ${JSON.stringify(d)}}`
      );
    }

    // 6. Update Hero H1 and Hero P
    if (postData && postData.title_en && postData.description_en) {
      // Find H1 followed by Hero P
      const heroRegex = /(<h1[^>]*>)([\s\S]*?)(<\/h1>\s*<p[^>]*>)([\s\S]*?)(<\/p>)/;
      const heroMatch = code.match(heroRegex);
      if (heroMatch && !heroMatch[2].includes("isEn ?")) {
        const [full, h1Open, h1Content, mid, pContent, pClose] = heroMatch;
        const newHero = `${h1Open}
            {isEn ? ${JSON.stringify(postData.title_en)} : (
              <>${h1Content.trim()}</>
            )}
          ${mid}
            {isEn ? ${JSON.stringify(postData.description_en)} : (
              <>${pContent.trim()}</>
            )}
          ${pClose}`;
        code = code.replace(full, newHero);
      }
    }

    // 7. Apply Common Replacements
    COMMON_REPLACEMENTS.forEach(({ regex, replace }) => {
      code = code.replace(regex, replace);
    });

    fs.writeFileSync(filePath, code, "utf-8");
    updatedCount++;
    console.log(`✓ Updated ${file} (${slug})`);
  }

  console.log(`Successfully updated ${updatedCount} blog post files!`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
