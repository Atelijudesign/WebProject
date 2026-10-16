# 📊 Guía Maestra: Exclusión de Tráfico Interno y Telemetría Limpia en GA4
**Proyecto:** `andresgallop.com`  
**Objetivo:** Eliminar el 100% del ruido generado por visitas de desarrollo, pruebas locales y accesos propios del dueño (IP `201.188.24.94`), garantizando métricas reales de visitantes, retención y conversiones.

---

## 🛡️ 1. Exclusión a Nivel de Aplicación (Automática en el Código)

Ya está implementado en la aplicación web el sistema inteligente en [`src/utils/analytics.js`](file:///c:/Users/andre/Documents/Proyectos26/proyectos/WebProject/src/utils/analytics.js) y [`src/components/Footer.jsx`](file:///c:/Users/andre/Documents/Proyectos26/proyectos/WebProject/src/components/Footer.jsx):

### A. Detección Automática de Desarrollo
- Si accedes desde `localhost`, `127.0.0.1` o previews de Vercel/Netlify, **las métricas se pausan automáticamente** y no envían eventos a GA4.

### B. Botón de Escudo en el Footer (Para tus dispositivos móviles y PC)
1. Abre [https://www.andresgallop.com](https://www.andresgallop.com) en tu celular o computador.
2. Ve al pie de página (Footer). Al lado de la etiqueta `v2.5.0`, verás el botón:
   - `[Tráfico Normal]` ➔ Haz clic sobre él.
   - Cambiará a `[Filtro Interno ON]` con un icono de escudo dorado.
3. **Efecto Inmediato:** Guarda la bandera `agp_internal_traffic = true` en tu navegador y activa `window['ga-disable-GA_MEASUREMENT_ID'] = true`. Todas tus pruebas, cargas del modelo 3D y descargas quedan 100% aisladas sin ensuciar tus reportes.

---

## 🌐 2. Exclusión a Nivel de Servidor / Red en Google Analytics 4 (GA4)

Para asegurar que cualquier acceso desde tu conexión de internet hogar/oficina con la IP **`201.188.24.94`** sea descartado por los servidores de Google antes de entrar a tus reportes:

### Paso 1: Definir la Regla de Tráfico Interno
1. Entra a [Google Analytics (analytics.google.com)](https://analytics.google.com/).
2. Haz clic en el engranaje inferior izquierdo **Administrar** (Admin).
3. En la columna **Recopilación y modificación de datos**, haz clic en **Flujos de datos** (Data Streams).
4. Selecciona tu flujo web de `andresgallop.com`.
5. Abajo, en la sección **Google Tag (etiqueta de Google)**, haz clic en **Configurar ajustes de etiquetas** (Configure tag settings).
6. Haz clic en **Mostrar todo** (Show all) y selecciona **Definir tráfico interno** (Define internal traffic).
7. Haz clic en **Crear**:
   - **Nombre de la regla:** `IP Andrés Gallo (Conexión Hogar/Oficina)`
   - **traffic_type:** `internal` (dejar el valor por defecto)
   - **Tipo de concordancia de IP:** `La dirección IP es igual a`
   - **Valor:** `201.188.24.94`
8. Haz clic en **Crear**.

---

### Paso 2: Activar el Filtro de Datos Interno
1. Vuelve a la pantalla principal de **Administrar** en GA4.
2. En la sección **Visualización de datos**, haz clic en **Filtros de datos** (Data Filters).
3. Verás un filtro predeterminado llamado **Internal Traffic** (Tráfico interno).
4. Su estado inicial suele estar en `Prueba` (Testing).
5. Haz clic en los tres puntos a la derecha ➔ **Editar filtro** ➔ cambia el estado de `Prueba` a **`Activo`** (Active).
6. Haz clic en **Guardar**.

> 💡 **Nota:** Al ponerlo en `Activo`, Google Analytics descartará permanentemente todas las visitas que provengan de tu IP `201.188.24.94`.

---

## 🎯 3. Eventos Clave Personalizados Instrumentados

A partir de la Fase 3, la aplicación emite los siguientes eventos limpios de alto valor:

| Evento GA4 | Descripción | Dónde se dispara |
|---|---|---|
| `model3d_activated` | Usuario activó el modelo 3D del Hero tras ver el póster. | Botón "Explorar Modelo 3D" en Hero. |
| `cv_download` | Descarga de currículum con desglose de formato (`pdf`, `docx`, `latex`, `txt`). | Botones de exportación en [CvAtsBuilder](file:///c:/Users/andre/Documents/Proyectos26/proyectos/WebProject/src/pages/CvAtsBuilder.jsx). |
| `manual_requested` | Solicitud de acceso a la bóveda de manuales y cursos de SP3D. | Formulario en [SmartPlant3DInteractiveMasterLab](file:///c:/Users/andre/Documents/Proyectos26/proyectos/WebProject/src/pages/blog/SmartPlant3DInteractiveMasterLab.jsx). |
| `tool_interaction` | Uso y exportaciones de las calculadoras ICHA (`export_excel`, `export_pdf`). | Pestañas de cubicación en [IchaCatalog](file:///c:/Users/andre/Documents/Proyectos26/proyectos/WebProject/src/pages/IchaCatalog.jsx). |
| `social_outbound_click` | Clics a tus perfiles profesionales externos (LinkedIn, YouTube, TikTok). | Iconos de redes en [Footer.jsx](file:///c:/Users/andre/Documents/Proyectos26/proyectos/WebProject/src/components/Footer.jsx). |

---

## 📈 4. Verificación de Funcionamiento

Para comprobar que tus eventos funcionan sin distorsión:
1. En GA4, entra a **Informes** ➔ **Tiempo real** (Realtime).
2. Abre tu web desde una ventana de incógnito o un dispositivo móvil con datos móviles (4G/5G).
3. Verás los eventos `model3d_activated` y `page_view` reflejándose en tiempo real.
4. Luego conéctate a tu WiFi local (IP `201.188.24.94`) o pulsa `[Filtro Interno ON]`: verás que tus interacciones dejan de registrarse en Realtime, confirmando la pureza absoluta de tus métricas.
