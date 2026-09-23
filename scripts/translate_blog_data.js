import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const filePath = path.resolve("src/data/blog_data.js");
const fileUrl = pathToFileURL(filePath).href;

const EN_DATA = {
  "gemelos-digitales-prefabricacion-modular-mineria": {
    title_en: "Digital Twins & Modular Prefabrication in Mining: From 3D Laser Scanning to Off-Site Assembly",
    description_en: "How the convergence of LiDAR point clouds, federated structural models, and IoT sensors is transforming the construction of mining processing and crushing plants.",
    categories_en: ["Mining", "Digital Twins", "LiDAR", "Structures", "IoT"],
    badgeText_en: "Mining 4.0",
    thumb_title_en: "Digital Twins",
    thumb_sub_en: "Mining & Modular Off-Site"
  },
  "revit-api-webview2-migracion-cefsharp": {
    title_en: "Revit API: Farewell CefSharp, Hello Native Microsoft Edge WebView2",
    description_en: "Autodesk permanently removes CefSharp in favor of WebView2 in Revit. How to build web interfaces in React and Tailwind CSS for C# Add-ins without DLL conflicts.",
    categories_en: ["Revit API", "C#", "WebView2", "BIM Dev", "React"],
    badgeText_en: "Revit API",
    thumb_title_en: "Revit WebView2",
    thumb_sub_en: "React UI in C# Add-ins"
  },
  "plan-bim-chile-estandar-proyectos-publicos": {
    title_en: "Plan BIM Chile: Definitive Guide to the Standard for Public Projects (EIR, BEP, 25 BIM Uses & Roles)",
    description_en: "Comprehensive breakdown of the CORFO BIM Standard for public tenders in Chile: Information Requirements (EIR), Pre/Post-Award BEP, the 25 BIM Uses, and Roles Matrix.",
    categories_en: ["Planbim Chile", "National Standard", "Public Tenders", "BIM Management"],
    badgeText_en: "CORFO / Planbim",
    thumb_title_en: "Plan BIM Chile",
    thumb_sub_en: "Public Projects Standard"
  },
  "revit-2027-scan-to-bim-vigas-acero-reality3d": {
    title_en: "Revit 2027 + Reality3D: Automated Modeling and Segmentation of Steel Beams from Point Clouds",
    description_en: "How to convert industrial plant LiDAR laser scans into native Revit ICHA/AISC structural steel profiles automatically using 3D segmentation algorithms.",
    categories_en: ["Scan-to-BIM", "Revit 2027", "Structural Steel", "Point Clouds"],
    badgeText_en: "Reality3D",
    thumb_title_en: "Scan-to-BIM",
    thumb_sub_en: "Steel Beams & LiDAR"
  },
  "validacion-automatizada-iso-19650-tiempo-real": {
    title_en: "Real-Time Automated ISO 19650 Standards Validation: From the CDE to Native Authoring Models",
    description_en: "How to implement continuous compliance validation engines and ISO 19650 Quality Gates across Common Data Environments (CDE) and BIM authoring tools (Revit, Tekla, ACC).",
    categories_en: ["ISO 19650", "BIM", "CDE", "Automation"],
    badgeText_en: "ISO 19650",
    thumb_title_en: "ISO 19650",
    thumb_sub_en: "Quality Gates & CDE"
  },
  "revit-2027-armaduras-longitudinales-transversales": {
    title_en: "Revit 2027: Automated Generation of Longitudinal Rebar from Transverse Reinforcement",
    description_en: "Technical analysis of Revit 2027: automated placement and alignment of longitudinal bars referenced directly against existing stirrups, ties, and spirals.",
    categories_en: ["Revit", "Rebar", "BIM"],
    badgeText_en: "Revit 2027",
    thumb_title_en: "Revit 2027",
    thumb_sub_en: "Longitudinal Rebar"
  },
  "revit-2025-api-net8": {
    title_en: "Revit 2025 & .NET 8: The Architectural Leap for BIM Developers",
    description_en: "The Revit 2025 API abandons .NET Framework to embrace modern .NET 8, delivering massive performance gains while requiring developers to migrate their C# Add-ins.",
    categories_en: ["Revit API", "C#", "BIM Dev"],
    badgeText_en: "BIM Dev",
    thumb_title_en: "Revit 2025 API",
    thumb_sub_en: "Migration to .NET 8"
  },
  "revit-2027-1-enfierraduras-3d": {
    title_en: "Revit 2027.1: Placing Standard Rebar Directly in 3D Views",
    description_en: "Autodesk updated Revit to version 2027.1 introducing the capability to place standard reinforcing bars directly in 3D views using Expand to Host and By Two Points.",
    categories_en: ["Revit", "Rebar", "BIM"],
    badgeText_en: "Revit 2027.1",
    thumb_title_en: "Revit 2027.1",
    thumb_sub_en: "Direct 3D Rebar"
  },
  "revit-2027-peso-enfierradura-rule-numbering": {
    title_en: "Revit 2027: Automatic Rebar Weight Calculation and Rule-Based Numbering",
    description_en: "Native automatic calculation and display of rebar mass in element properties, schedules, and tags, alongside the Rule-Based Numbering engine for standardizing component marks.",
    categories_en: ["Revit", "Takeoff", "BIM"],
    badgeText_en: "Takeoff & QTO",
    thumb_title_en: "Revit 2027",
    thumb_sub_en: "Mass & Rule-Based Numbering"
  },
  "tekla-structures-2026-sp3-model-sharing": {
    title_en: "Tekla Structures 2026 SP3: Model View Synchronization Fix in Tekla Model Sharing",
    description_en: "Trimble released Tekla Structures 2026 SP3, resolving model view desynchronization and mark glitches in multi-user projects using Tekla Model Sharing.",
    categories_en: ["Tekla", "Steel", "Cloud"],
    badgeText_en: "Tekla SP3",
    thumb_title_en: "Tekla 2026 SP3",
    thumb_sub_en: "Model Sharing Sync Fix"
  },
  "graitec-steel-2027-joint-multi-edit": {
    title_en: "Graitec STEEL 2027 / Advance Steel: Joint Multi-Edit and Joint Groups",
    description_en: "The Graitec STEEL 2027 suite for Advance Steel introduces Joint Multi-Edit and Joint Groups, enabling bulk parameter updates across multiple structural steel connections.",
    categories_en: ["Advance Steel", "Steel", "Graitec"],
    badgeText_en: "Connections",
    thumb_title_en: "Graitec 2027",
    thumb_sub_en: "Joint Multi-Edit"
  },
  "tekla-model-sharing-cache-server-v4": {
    title_en: "Cache Server V4 for Tekla Model Sharing (2026+ Releases)",
    description_en: "Trimble released version V4 of the Cache Server for Tekla Model Sharing, re-engineered for the modern data architecture of Tekla Structures 2026 and beyond.",
    categories_en: ["Tekla", "Infrastructure", "Networks"],
    badgeText_en: "Servers",
    thumb_title_en: "Tekla Cache V4",
    thumb_sub_en: "LAN Accelerator 2026+"
  },
  "dynamo-core-3-6-optimizacion-rendimiento": {
    title_en: "Dynamo Core 3.6: 2x Loading Speed Optimization and File Close Redesign",
    description_en: "Dynamo Core 3.6 cuts graph opening times in half and accelerates heavy node closing by up to 4x, alongside 16% speed improvements in Code Block execution.",
    categories_en: ["Dynamo", "BIM Dev", "Python"],
    badgeText_en: "Dynamo Core",
    thumb_title_en: "Dynamo 3.6",
    thumb_sub_en: "2x Load Speed · 4x Close"
  },
  "revit-sdk-2027-2-revitlookup": {
    title_en: "Revit .NET SDK 2027.2 and Official RevitLookup GitHub Repository",
    description_en: "Official Revit .NET SDK updated to version 2027.2 alongside the release of the updated RevitLookup version on GitHub for deep inspection of model database and geometry.",
    categories_en: ["C#", "Revit API", "BIM Dev"],
    badgeText_en: "Revit API",
    thumb_title_en: "SDK 2027.2",
    thumb_sub_en: "RevitLookup GitHub"
  },
  "vibe-coding-revit-python-shell-pyrevit": {
    title_en: "Hybrid Scripting 'Vibe Coding' with RevitPythonShell and pyRevit",
    description_en: "Exploring workflows combining Large Language Models (LLMs) with RevitPythonShell and pyRevit to generate Python scripts on the fly and test API functions in real time.",
    categories_en: ["Python", "pyRevit", "AI"],
    badgeText_en: "pyRevit",
    thumb_title_en: "Vibe Coding",
    thumb_sub_en: "Python Shell + LLM"
  },
  "ia-clash-triage-clasificacion-interferencias-bim": {
    title_en: "AI Models for Clash Triage and Automated BIM Clash Classification",
    description_en: "Machine learning algorithms that analyze coordination clash data in Navisworks/ACC, filtering out geometric false positives and prioritizing critical structural collisions.",
    categories_en: ["AI", "Navisworks", "BIM"],
    badgeText_en: "BIM AI",
    thumb_title_en: "Clash Triage",
    thumb_sub_en: "AI Clash Classification"
  },
  "ia-takeoff-cubicacion-estructuras-acero": {
    title_en: "AI Tools for Structural Steel & Concrete Takeoff (AI Takeoff)",
    description_en: "Adoption of AI-powered takeoff platforms capable of processing 2D and 3D engineering documentation and classifying reinforced concrete members and structural steel shapes.",
    categories_en: ["AI", "Takeoff", "Steel"],
    badgeText_en: "AI Takeoff",
    thumb_title_en: "AI Takeoff",
    thumb_sub_en: "2D/3D Structural Takeoff"
  },
  "whats-new-revit-2027-1": {
    title_en: "What's New in Revit 2027.1: Autodesk Assistant AI, GPU Rendering & EC3 Carbon Analysis",
    description_en: "Technical review of Revit 2027.1: AI conversational assistant, native GPU-accelerated real-time viewport rendering, direct EC3 embodied carbon calculator integration, and smart numbering.",
    categories_en: ["Revit", "BIM", "AI", "Autodesk"],
    badgeText_en: "Revit 2027.1",
    thumb_title_en: "Revit 2027.1",
    thumb_sub_en: "AI Assistant · GPU Render · EC3"
  },
  "catalogo-aisc-v150-online": {
    title_en: "Online AISC v15.0 Catalog: 2,130 Structural Profiles with Metric & Imperial Units",
    description_en: "Search, filter, and quantify W, HSS, C, L, and PIPE profiles directly in your browser. Dual SI Metric ↔ US Imperial system, 2D SVG diagrams, and takeoff calculator with Excel export.",
    categories_en: ["AISC", "Steel", "Web Tools"],
    badgeText_en: "Tools",
    thumb_title_en: "AISC v15.0",
    thumb_sub_en: "2,130 Profiles · Dual Units"
  },
  "konstruedu-especialista-bim-revit": {
    title_en: "Konstruedu BIM Specialist: Is It Worth It? My Honest Review",
    description_en: "127 hours, 14 courses and international certification. I review Konstruedu's BIM Modeling with Revit specialization from my perspective as a structural designer with 15+ years of experience.",
    categories_en: ["Revit", "BIM", "Education"],
    badgeText_en: "BIM Training",
    thumb_title_en: "Konstruedu",
    thumb_sub_en: "127h · 14 courses"
  },
  "pyrevit-peso-volumen": {
    title_en: "From 2 Hours to 10 Seconds: Structural Weight and Volume pyRevit Plugin",
    description_en: "How I automated weight and volume quantification in Revit models with a pyRevit plugin that detects materials, classifies steel profiles, and generates instant reports.",
    categories_en: ["Python", "Revit API"],
    badgeText_en: "BIM Plugin",
    thumb_title_en: "2h → 10s",
    thumb_sub_en: "Weights & Volumes"
  },
  "herramientas-bim-acero": {
    title_en: "Web Tools for Structural Steel: Custom Calculator + ICHA Catalog",
    description_en: "Parametric steel profile calculator and official ICHA digital catalog featuring interactive search, 2D SVG diagrams, and professional Excel takeoff export.",
    categories_en: ["ICHA", "Steel", "Web Tools"],
    badgeText_en: "Tools",
    thumb_title_en: "BIM Tools",
    thumb_sub_en: "Structural Steel"
  },
  "pyrevit-accelerator": {
    title_en: "pyRevit Accelerator: The Fast Track to Building Custom Revit Apps",
    description_en: "Discover why pyRevit is the fastest way to build productivity tools for Revit. App anatomy, the 7-step development framework, and the definitive C# comparison.",
    categories_en: ["Python", "Revit API"],
    badgeText_en: "pyRevit",
    thumb_title_en: "pyRevit",
    thumb_sub_en: "Accelerator"
  },
  "bim-dev-roadmap": {
    title_en: "From Site Designer to BIM Software Developer in 12 Months",
    description_en: "Comprehensive guide for AEC professionals transitioning into BIM development. Hybrid approach: Python/pyRevit for rapid wins + C#/.NET for enterprise-grade performance.",
    categories_en: ["pyRevit", "C#", "Roadmap"],
    badgeText_en: "Roadmap",
    thumb_title_en: "Roadmap",
    thumb_sub_en: "pyRevit + C#"
  },
  "revit-structure-futuro": {
    title_en: "Closing the Gap Between Design and Detailing: The Future of Revit Structure",
    description_en: "Analysis of Autodesk's structural roadmap: automated steel connections, autonomous analytical models, and the convergence of Revit, Tekla, and Advance Steel.",
    categories_en: ["Revit", "Steel"],
    badgeText_en: "Revit Structure",
    thumb_title_en: "Revit Structure",
    thumb_sub_en: "Roadmap 2025+"
  },
  "revit-support-clinic": {
    title_en: "Support Clinic Secrets: What We Learned at AU 2025 About Steel",
    description_en: "Advanced troubleshooting for structural steel connections, diagnosing family breakages, and fixing disconnected analytical models in complex projects.",
    categories_en: ["Support", "Steel"],
    badgeText_en: "Support",
    thumb_title_en: "Revit Support",
    thumb_sub_en: "Clinic 2025"
  }
};

import(fileUrl).then(({ BLOG_POSTS, BLOG_CATEGORIES }) => {
  const updatedPosts = BLOG_POSTS.map(p => {
    const en = EN_DATA[p.id];
    if (!en) return p;
    return {
      ...p,
      title_en: en.title_en,
      description_en: en.description_en,
      categories_en: en.categories_en,
      thumbnail: {
        ...p.thumbnail,
        title_en: en.thumb_title_en,
        subtitle_en: en.thumb_sub_en,
        badgeText_en: en.badgeText_en
      }
    };
  });

  const content = `export const BLOG_POSTS = ${JSON.stringify(updatedPosts, null, 2)};\n\nexport const BLOG_CATEGORIES = ${JSON.stringify(BLOG_CATEGORIES, null, 2)};\n`;
  fs.writeFileSync(filePath, content, "utf-8");
  console.log("Successfully updated blog_data.js with complete English translations.");
});
