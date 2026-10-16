const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outDir = path.join(__dirname, 'public', 'assets', 'img');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const tasks = [
  // 1. ABSORMEX
  {
    src: 'F:/06-A.G.P_INFO_TECNICA/02-OFFICE/00-Afry/00-2022/Abosrmex Projects/152000318-001_ABSORMEX/00-Documentación/00-Cliente/01_Reference/Client/Fotos planta/FOTOS DRON 09.01.23/DJI_0683.JPG',
    dest: 'absormex_portada.webp',
    width: 1920
  },
  {
    src: 'F:/06-A.G.P_INFO_TECNICA/02-OFFICE/00-Afry/00-2022/Abosrmex Projects/152000318-001_ABSORMEX/00-Documentación/00-Cliente/01_Reference/Client/Fotos planta/FOTOS DRON 09.01.23/DJI_0684.JPG',
    dest: 'absormex_01.webp',
    width: 1600
  },
  {
    src: 'F:/06-A.G.P_INFO_TECNICA/02-OFFICE/00-Afry/00-2022/Abosrmex Projects/152000318-001_ABSORMEX/00-Documentación/00-Cliente/01_Reference/Client/Fotos planta/FOTOS DRON 09.01.23/DJI_0488.JPG',
    dest: 'absormex_02.webp',
    width: 1600
  },
  {
    src: 'F:/06-A.G.P_INFO_TECNICA/02-OFFICE/00-Afry/00-2022/Abosrmex Projects/152000318-001_ABSORMEX/00-Documentación/00-Cliente/01_Reference/Client/Fotos planta/Esquina noreste nave MP02.jpg',
    dest: 'absormex_03.webp',
    width: 1600
  },

  // 2. CMPC LAJA
  {
    src: 'F:/06-A.G.P_INFO_TECNICA/02-OFFICE/00-Afry/00-2022/CMPC Projects/152000288-001_CMPC-LAJA/01_Proyecto -Estructura metálica IC/01_EST_Estructura metálica IC/00-Documentos/Fotos Fibra 04-11-22/R0011731.JPG',
    dest: 'cmpc_laja_portada.webp',
    width: 1920
  },
  {
    src: 'F:/06-A.G.P_INFO_TECNICA/02-OFFICE/00-Afry/00-2022/CMPC Projects/152000288-001_CMPC-LAJA/01_Proyecto -Estructura metálica IC/01_EST_Estructura metálica IC/00-Documentos/Fotos Fibra 04-11-22/R0011720.JPG',
    dest: 'cmpc_laja_01.webp',
    width: 1600
  },
  {
    src: 'F:/06-A.G.P_INFO_TECNICA/02-OFFICE/00-Afry/00-2022/CMPC Projects/152000288-001_CMPC-LAJA/01_Proyecto -Estructura metálica IC/01_EST_Estructura metálica IC/00-Documentos/Fotos Fibra 04-11-22/R0011735.JPG',
    dest: 'cmpc_laja_02.webp',
    width: 1600
  },
  {
    src: 'F:/06-A.G.P_INFO_TECNICA/02-OFFICE/00-Afry/00-2022/CMPC Projects/152000288-001_CMPC-LAJA/01_Proyecto -Estructura metálica IC/01_EST_Estructura metálica IC/00-Documentos/Fotos Fibra 04-11-22/R0011738.JPG',
    dest: 'cmpc_laja_03.webp',
    width: 1600
  },

  // 3. MONTES DEL PLATA (URUGUAY)
  {
    src: 'F:/06-A.G.P_INFO_TECNICA/02-OFFICE/00-Afry/00-2022/MDP Projects/152000289-001_Feed forward depurador secundario a primario DE/05_Steel/00-Designers/00-Documents/Documents/Planta MDP.jpg',
    dest: 'mdp_depurador_portada.webp',
    width: 1920
  },
  {
    src: 'F:/06-A.G.P_INFO_TECNICA/02-OFFICE/00-Afry/00-2022/MDP Projects/152000289-001_Feed forward depurador secundario a primario DE/05_Steel/1. Info/152000289-001_Fotos visita MDP(02-2023)/PANO_20230214_144925.jpg',
    dest: 'mdp_01.webp',
    width: 1920
  },
  {
    src: 'F:/06-A.G.P_INFO_TECNICA/02-OFFICE/00-Afry/00-2022/MDP Projects/152000289-001_Feed forward depurador secundario a primario DE/05_Steel/1. Info/152000289-001_Fotos visita MDP(02-2023)/PANO_20230214_094740.jpg',
    dest: 'mdp_02.webp',
    width: 1920
  },
  {
    src: 'F:/06-A.G.P_INFO_TECNICA/02-OFFICE/00-Afry/00-2022/MDP Projects/152000289-001_Feed forward depurador secundario a primario DE/05_Steel/1. Info/152000289-001_Fotos visita MDP(02-2023)/PANO_20230215_160750.jpg',
    dest: 'mdp_03.webp',
    width: 1920
  },

  // 4. SOFTYS ZARATE (ARGENTINA)
  {
    src: 'F:/06-A.G.P_INFO_TECNICA/02-OFFICE/00-Afry/00-2022/Softys Projects/152000169-001_SOFTYS ZARATE_CENTINA ZARATE/00-Documentación/Client/Topografia y batimetria/152000169-001-0000-E-0700_R1/PLANO LEVANTAMIENTO.jpg',
    dest: 'softys_zarate_portada.webp',
    width: 1920
  },
  {
    src: 'F:/06-A.G.P_INFO_TECNICA/02-OFFICE/00-Afry/00-2022/Softys Projects/152000169-001_SOFTYS ZARATE_CENTINA ZARATE/00-Documentación/Civiles/Info/Layout alt 3/Layout preliminar.jpg',
    dest: 'softys_zarate_01.webp',
    width: 1600
  },
  {
    src: 'F:/06-A.G.P_INFO_TECNICA/02-OFFICE/00-Afry/00-2022/Softys Projects/152000169-001_SOFTYS ZARATE_CENTINA ZARATE/00-Documentación/Civiles/fig. 1.png',
    dest: 'softys_zarate_02.webp',
    width: 1600
  },

  // 5. CMPC SANTA FE (CHILE)
  {
    src: 'C:/Users/andre/.gemini/antigravity-ide/brain/25a4efcd-0724-41f9-94f5-d1de74e0da62/scratch/santafe_raw/santafe_dissolving_tank_01.png',
    dest: 'cmpc_santafe_portada.webp',
    width: 1920
  },
  {
    src: 'C:/Users/andre/.gemini/antigravity-ide/brain/25a4efcd-0724-41f9-94f5-d1de74e0da62/scratch/santafe_raw/santafe_plataformas_torres.png',
    dest: 'cmpc_santafe_01.webp',
    width: 1600
  },
  {
    src: 'C:/Users/andre/.gemini/antigravity-ide/brain/25a4efcd-0724-41f9-94f5-d1de74e0da62/scratch/santafe_raw/santafe_canalizaciones.png',
    dest: 'cmpc_santafe_02.webp',
    width: 1600
  },
  {
    src: 'C:/Users/andre/.gemini/antigravity-ide/brain/25a4efcd-0724-41f9-94f5-d1de74e0da62/scratch/santafe_raw/santafe_dissolving_tank_02.png',
    dest: 'cmpc_santafe_03.webp',
    width: 1600
  }
];

async function run() {
  console.log(`Starting processing of ${tasks.length} images...`);
  for (const t of tasks) {
    const targetPath = path.join(outDir, t.dest);
    try {
      if (!fs.existsSync(t.src)) {
        console.warn(`[SKIP] Missing source: ${t.src}`);
        continue;
      }
      console.log(`Processing: ${path.basename(t.src)} -> ${t.dest}`);
      await sharp(t.src)
        .resize(t.width, null, { withoutEnlargement: true, fit: 'inside' })
        .webp({ quality: 85, effort: 4 })
        .toFile(targetPath);
      
      const stats = fs.statSync(targetPath);
      console.log(`[OK] Generated ${t.dest} (${Math.round(stats.size / 1024)} KB)`);
    } catch (err) {
      console.error(`[ERROR] Failed to process ${t.dest}:`, err.message);
    }
  }
  console.log('All image processing tasks completed.');
}

run();
