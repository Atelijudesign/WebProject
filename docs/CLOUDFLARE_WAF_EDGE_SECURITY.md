# 🛡️ Guía Maestra: Configuración de Cloudflare WAF & Edge Security
**Proyecto:** `andresgallop.com`  
**Objetivo:** Detener el tráfico malicioso, spiders de datacenters comerciales (AWS, DigitalOcean, Hetzner) y escáneres de vulnerabilidades en el **Borde de la Red (Edge)** de Cloudflare antes de que toquen tu hosting, ahorrando el 100% de CPU y ancho de banda en peticiones falsas.

---

## 📋 Diagnóstico del Log de Producción

En las 1.141 peticiones registradas:
* **451 peticiones procedían de Estados Unidos**, concentradas en rangos de hosting de **AWS** (AS16509 / AS14618) y herramientas headless.
* **129 peticiones de Kazajistán y Polonia**, correspondientes a escaneos automatizados buscando vulnerabilidades WordPress (`/wp-login.php`, `/.env`, `/lander`).
* **127 peticiones de redirección 301** generadas por llamadas HTTP directas a la IP o al dominio apex sin caché previa.

Aplicando las siguientes **3 Reglas WAF Gratuitas** en Cloudflare, el tráfico espurio se neutraliza en el Edge con **cero costo de servidor**.

---

## 🚀 1. Reglas WAF Personalizadas (Custom Rules)

En tu panel de [Cloudflare](https://dash.cloudflare.com/):  
Navega a: **Seguridad (Security)** ➔ **WAF** ➔ **Reglas personalizadas (Custom Rules)** ➔ **Crear regla (Create rule)**.

---

### 🛑 Regla 1: Bloqueo de Escáneres de Vulnerabilidades
* **Nombre de la Regla:** `Bloqueo Escaners PHP y Vulnerabilidades`
* **Tipo de Expresión (Editor de expresiones / Edit expression):**
```text
(http.request.uri.path contains ".php" or 
 http.request.uri.path contains ".env" or 
 http.request.uri.path contains "/wp-" or 
 http.request.uri.path contains "/xmlrpc" or 
 http.request.uri.path contains "/lander" or 
 http.request.uri.path contains "/sberchat" or 
 http.request.uri.path contains "/cgi-bin")
```
* **Acción (Action):** **`Bloquear` (Block)**.
* **Impacto:** Los escáneres reciben un `403 Forbidden` directo desde el PoP de Cloudflare más cercano. Tu servidor de origen ni siquiera se entera de la petición.

---

### 🤖 Regla 2: Desafío a Datacenters y Nubes Comerciales (AWS / DigitalOcean / Hetzner)
* **Nombre de la Regla:** `Challenge Datacenter Scraping (AWS/DigitalOcean/Hetzner)`
* **Tipo de Expresión (Edit expression):**
```text
((ip.geoip.asnum in {16509 14618 14061 24940 51167 16276}) and (not cf.client.bot))
```
> **Explicación de ASNs:**
> - `16509` y `14618`: Amazon Web Services (AWS)
> - `14061`: DigitalOcean
> - `24940`: Hetzner Online
> - `51167`: Contabo
> - `16276`: OVH
> - `not cf.client.bot`: **Protege a los motores de búsqueda legítimos** (Googlebot, Bingbot, etc.), asegurando que nunca sean bloqueados.
* **Acción (Action):** **`Desafío administrado` (Managed Challenge)**.
* **Impacto:** Los navegadores automatizados (Headless Chrome, Puppeteer, Scrapy) no pueden resolver el desafío y son detenidos al instante. Si un usuario legítimo utiliza una VPN alojada en AWS, simplemente verá un check rápido de Cloudflare de 1 segundo.

---

### 🚫 Regla 3: Bloqueo de User-Agents Vacíos o Scrapers Agresivos
* **Nombre de la Regla:** `Bloqueo Bad User Agents y Requests Vacios`
* **Tipo de Expresión (Edit expression):**
```text
((http.user_agent eq "" or 
  http.user_agent contains "sqlmap" or 
  http.user_agent contains "nikto" or 
  http.user_agent contains "wpscan" or 
  http.user_agent contains "masscan" or 
  http.user_agent contains "acunetix" or 
  http.user_agent contains "python-requests") and (not cf.client.bot))
```
* **Acción (Action):** **`Bloquear` (Block)**.

---

## ⚡ 2. Reglas de Caché en el Edge (Cache Rules)

Para garantizar que el modelo 3D (`/models/nave-licuadores.glb`), las imágenes WebP y fuentes web nunca gasten transferencia de tu hosting:

Navega a: **Caché (Caching)** ➔ **Reglas de caché (Cache Rules)** ➔ **Crear regla**.
* **Nombre:** `Caché Inmutable Assets Pesados y Modelos 3D`
* **Expresión:**
```text
(http.request.uri.path ends_with ".glb" or 
 http.request.uri.path ends_with ".webp" or 
 http.request.uri.path ends_with ".woff2" or 
 http.request.uri.path ends_with ".js" or 
 http.request.uri.path ends_with ".css")
```
* **Ajustes de caché:**
  * **Elegibilidad de caché:** *Apto para caché (Eligible for cache)*.
  * **TTL de Edge:** *Respetar encabezados de origen* o forzar a *1 mes*.
  * **TTL de Navegador:** *1 año*.
* **Impacto:** Cloudflare entregará el 100% de estos archivos desde su caché perimetral mundial.

---

## 🔒 3. Ajustes Globales Recomendados en Cloudflare

1. **Security ➔ Bots:**
   * Activar **Bot Fight Mode**: Encendido.
2. **Security ➔ Settings:**
   * **Security Level:** `Medium`.
   * **Browser Integrity Check (BIC):** `On` (comprueba encabezados HTTP sospechosos comunes en herramientas de ataque).
3. **SSL/TLS ➔ Edge Certificates:**
   * **Always Use HTTPS:** `On`.
   * **Minimum TLS Version:** `TLS 1.2`.
   * **Opportunistic Encryption:** `On`.

---

## 📊 4. Monitoreo y Resultados Esperados

Tras aplicar estas reglas:
1. En **Seguridad ➔ Eventos (Events)** verás la gráfica de peticiones bloqueadas en tiempo real.
2. El consumo de peticiones y ancho de banda en tu hosting bajará entre un **70% y 85%**.
3. El tiempo de respuesta para visitantes reales en Chile y Latinoamérica mejorará drásticamente gracias a la caché en el Edge.
