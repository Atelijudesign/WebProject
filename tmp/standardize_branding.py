import os
import re

# Master Nav and Footer templates
NAV_TEMPLATE = """  <!-- NAVBAR -->
  <nav class="glass">
    <div class="nav-inner">
      <a href="{root}index.html#home" class="nav-logo" style="gap: 0;">Andrés Gallo P.<span>BIM</span></a>
      <div class="nav-links" id="navLinks">
        <a href="{root}index.html#home">Inicio</a>
        <a href="{root}index.html#about">Sobre Mí</a>
        <a href="{root}index.html#automation">Automatización</a>
        <a href="{root}index.html#services">Servicios</a>
        <a href="{root}index.html#portfolio">Portafolio</a>
        <a href="{root}proyectos-bim/">Proyectos</a>
        <a href="{root}blog/blog.html">Blog</a>
        <a href="{root}tool/index.html">Herramientas</a>
        <a href="{root}index.html#contact" class="nav-cta">Contacto →</a>
      </div>
      <button class="nav-toggle" id="navToggle" aria-label="Menú">☰</button>
    </div>
  </nav>"""

FOOTER_TEMPLATE = """  <!-- FOOTER -->
  <footer>
    <div class="container">
      <div class="footer-inner">
        <div class="footer-logo">Andrés Gallo P.<span>BIM</span></div>
        <div class="footer-copy">© 2026 Andrés Gallo P. Todos los derechos reservados.</div>
        <div class="footer-tagline">// Diseñado con ingeniería y código</div>
      </div>
    </div>
  </footer>"""

def process_file(filepath):
    # Calculate root relative path
    rel_path = os.path.relpath(filepath, base_dir)
    rel_dir = os.path.dirname(rel_path)
    
    if rel_dir == "." or rel_dir == "":
        root = ""
    else:
        root = "../" * rel_dir.replace("\\", "/").count("/")
        if not root: root = "../"

    content = None
    encodings = ['utf-8', 'utf-8-sig', 'latin-1', 'cp1252']
    used_encoding = None

    for enc in encodings:
        try:
            with open(filepath, 'r', encoding=enc) as f:
                content = f.read()
            used_encoding = enc
            break
        except UnicodeDecodeError:
            continue

    if content is None:
        print(f"Failed to read: {filepath}")
        return

    # Get customized nav and footer for this file's depth
    nav = NAV_TEMPLATE.format(root=root)
    footer = FOOTER_TEMPLATE.format(root=root)

    # Standardize links: if it's the root itself, remove index.html#... to just #...
    if root == "":
        nav = nav.replace("index.html#", "#")

    # Regex to find nav and footer blocks
    new_content = re.sub(r'<!-- NAVBAR -->\s*<nav.*?>.*?</nav>', nav, content, flags=re.DOTALL | re.IGNORECASE)
    if new_content == content:
        new_content = re.sub(r'<nav.*?>.*?</nav>', nav, content, flags=re.DOTALL | re.IGNORECASE)
    
    final_content = re.sub(r'<!-- FOOTER -->\s*<footer.*?>.*?</footer>', footer, new_content, flags=re.DOTALL | re.IGNORECASE)
    if final_content == new_content:
        final_content = re.sub(r'<footer.*?>.*?</footer>', footer, new_content, flags=re.DOTALL | re.IGNORECASE)

    if final_content != content:
        with open(filepath, 'w', encoding='utf-8') as f: # Always write back as UTF-8
            f.write(final_content)
        print(f"Updated: {filepath} (root: {root}) [enc: {used_encoding}]")
    else:
        print(f"No changes in: {filepath} [enc: {used_encoding}]")

base_dir = r"c:\Users\andre\Desktop\WebProject"
for root_dir, dirs, files in os.walk(base_dir):
    if any(x in root_dir for x in ["node_modules", "dist", ".git", ".idea", ".gemini", ".claude"]):
        continue
    for file in files:
        if file.endswith(".html"):
            process_file(os.path.join(root_dir, file))
