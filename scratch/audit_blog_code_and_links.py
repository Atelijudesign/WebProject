import os
import re
import pathlib
import sys
import urllib.request
import urllib.error

if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

blog_dir = pathlib.Path(r"c:\Users\andre\Documents\Proyectos26\proyectos\WebProject\src\pages\blog")

print("=== 1. AUDITORÍA DE BLOQUES DE CÓDIGO EN ARTÍCULOS DEL BLOG ===")
posts_with_code = []

for f in blog_dir.glob("*.jsx"):
    content = f.read_text(encoding="utf-8")
    has_codeblock = "CodeBlock" in content
    has_code_tag = "<pre" in content or "```" in content
    if has_codeblock or has_code_tag:
        # Extraer snippets de títulos o lenguajes
        languages = re.findall(r'language=["\'](\w+)["\']', content)
        titles = re.findall(r'title=["\']([^"\']+)["\']', content)
        posts_with_code.append({
            "file": f.name,
            "languages": set(languages),
            "titles": titles
        })

print(f"Total de artículos con bloques de código: {len(posts_with_code)}\n")
for item in posts_with_code:
    print(f"📄 {item['file']}")
    print(f"   - Lenguajes: {list(item['languages'])}")
    print(f"   - Títulos de bloques: {item['titles']}")
    print()

print("=== 2. AUDITORÍA COMPLETA DE ENLACES (LINKS) EN ARTÍCULOS DEL BLOG ===")
external_urls = set()
internal_routes = set()

# Extraer todos los links de los artículos
for f in blog_dir.glob("*.jsx"):
    content = f.read_text(encoding="utf-8")
    
    # Links externos
    hrefs = re.findall(r'href=["\'](https?://[^"\']+)["\']', content)
    for h in hrefs:
        external_urls.add((h, f.name))
        
    # Links internos
    tos = re.findall(r'to=["\']([^"\']+)["\']', content)
    for t in tos:
        internal_routes.add((t, f.name))

print(f"🔍 Total de URLs externas encontradas: {len(external_urls)}")
print(f"🔍 Total de rutas internas encontradas: {len(internal_routes)}\n")

# Validar enlaces externos con HEAD request
print("--- Verificando estado HTTP de URLs externas ---")
broken_urls = []
valid_urls = []

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

for url, source_file in sorted(external_urls):
    req = urllib.request.Request(url, headers=headers, method='HEAD')
    status_code = None
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            status_code = response.getcode()
            valid_urls.append((url, status_code, source_file))
            print(f"  ✅ [{status_code}] {url} (en {source_file})")
    except urllib.error.HTTPError as e:
        # Algunos servidores bloquean HEAD (403/405/406), probamos GET
        try:
            req_get = urllib.request.Request(url, headers=headers, method='GET')
            with urllib.request.urlopen(req_get, timeout=5) as response_get:
                status_code = response_get.getcode()
                valid_urls.append((url, status_code, source_file))
                print(f"  ✅ [{status_code}] {url} (en {source_file})")
        except Exception as e2:
            broken_urls.append((url, str(e), source_file))
            print(f"  ❌ [{e.code}] {url} (en {source_file}) -> {e}")
    except Exception as e:
        broken_urls.append((url, str(e), source_file))
        print(f"  ❌ [ERROR] {url} (en {source_file}) -> {e}")

print("\n--- Resumen de Enlaces Externos ---")
print(f"Válidos: {len(valid_urls)} | Rotos / Con Error: {len(broken_urls)}")
