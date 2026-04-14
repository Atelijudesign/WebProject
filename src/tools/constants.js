// Tools data for the tools landing page
export const tools = [
  {
    id: "profile-calculator",
    title: "Calculadora de Perfiles",
    description:
      "Calcula peso, área de sección y perímetro de cobertura para perfiles de acero personalizados. Define dimensiones y obtén resultados instantáneos.",
    href: "profile-calculator.html",
    icon: "fa-solid fa-calculator",
    gradient: "from-blue-600/20 to-blue-800/20",
    borderColor: "border-blue-700/30",
    tags: [
      { icon: "fa-solid fa-h", label: "H / I", color: "blue" },
      { icon: "fa-solid fa-c", label: "Canales", color: "blue" },
      { icon: "fa-solid fa-l", label: "Ángulos", color: "blue" },
      { icon: "fa-solid fa-square", label: "Tubos", color: "blue" },
      { icon: "fa-solid fa-file-excel", label: "Excel", color: "blue" },
    ],
  },
  {
    id: "catalogo-icha",
    title: "Catálogo ICHA",
    description:
      "Catálogo completo de perfiles ICHA con propiedades mecánicas precargadas. Busca perfiles, arma tu lista de materiales y exporta a Excel.",
    href: "catalogo-icha.html",
    icon: "fa-solid fa-database",
    gradient: "from-emerald-600/20 to-emerald-800/20",
    borderColor: "border-emerald-700/30",
    tags: [
      { icon: "fa-solid fa-i", label: "IN / IP", color: "emerald" },
      { icon: "fa-solid fa-h", label: "HN / PH", color: "emerald" },
      { icon: "fa-solid fa-database", label: "710 perfiles", color: "emerald" },
      { icon: "fa-solid fa-file-excel", label: "Excel", color: "emerald" },
    ],
  },
  {
    id: "buckling-shorteners",
    title: "Acortadores de Pandeo",
    description:
      "Calcula la separación máxima y cantidad mínima de acortadores para perfiles de doble ángulo (Perfil XL) laminados. Verifica criterios de diseño estructural instantáneamente.",
    href: "buckling-shorteners.html",
    icon: "fa-solid fa-ruler-combined",
    gradient: "from-blue-600/20 to-blue-800/20",
    borderColor: "border-blue-700/30",
    tags: [
      { icon: "fa-solid fa-l", label: "Perfil XL", color: "blue" },
      { icon: "fa-solid fa-arrows-left-right", label: "Pandeo", color: "blue" },
      { icon: "fa-solid fa-calculator", label: "Diseño", color: "blue" },
      { icon: "fa-solid fa-file-excel", label: "Excel", color: "blue" },
    ],
  },
  {
    id: "calculo-escaleras",
    title: "Calculadora de Escaleras",
    description:
      "Calcula escaleras estructurales entre distintos apoyos (Parrilla y Concreto) verificando instantáneamente la comodidad y seguridad para los usuarios.",
    href: "calculo-escaleras.html",
    icon: "fa-solid fa-stairs",
    gradient: "from-purple-600/20 to-purple-800/20",
    borderColor: "border-purple-700/30",
    tags: [
      { icon: "fa-solid fa-ruler", label: "Contrahuella", color: "purple" },
      { icon: "fa-solid fa-check-double", label: "Verificación", color: "purple" },
    ],
  },
];
