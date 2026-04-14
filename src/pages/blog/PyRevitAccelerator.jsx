import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";


export default function PyRevitAccelerator() {
  

  const copyBlock = (e) => {
    const pre = e.target.closest('.code-block').querySelector('pre');
    navigator.clipboard.writeText(pre.innerText.trim()).then(() => {
      e.target.textContent = '✓ Copiado';
      setTimeout(() => e.target.textContent = 'Copiar', 2000);
    });
  };

  return (
    <div className="bg-gray-50 dark:bg-bim-dark min-h-screen transition-colors duration-300">
      
    </div>
  );
}
