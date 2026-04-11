import os

# Mapa maestro de correcciones basado en la versión de producción y auditoría visual
CLEAN_MAP = [
    # 1. Limpieza de artefactos de reparación previa
    (b'NCGLYPH', b''),
    (b'\xc3\xa2\xc2\x90', b''), # Rastro de NCGLYPH
    (b'\xc3\xaf\xc2\xbf\xc2\xbd', b''), # Carácter de reemplazo
    
    # 2. Navegación y Símbolos (→, ←, ©, °, …)
    (b'\xc3\xa2\xe2\x80\xa6', b'\xe2\x80\xa6'),         # …
    (b'\xc3\xa2\xc2\x86\xc2\x92', b'\xe2\x86\x92'),     # →
    (b'\xc3\xa2\xc2\x86\xc2\x90', b'\xe2\x86\x90'),     # ←
    (b'\xc3\x82\xc2\xa9', b'\xc2\xa9'),                 # ©
    (b'\xc3\x82\xc2\xba', b'\xc2\xba'),                 # º
    (b'\xc3\x82\xc2\xb2', b'\xc2\xb2'),                 # ²
    (b'\xc3\x82\xc2\xb3', b'\xc2\xb3'),                 # ³
    
    # 3. Emojis de Contacto (📧, 💼, 💻)
    (b'\xc3\xb0\xc5\xb8\xe2\x80\x9c\xc2\xa7', b'\xf0\x9f\x93\xa7'), # 📧
    (b'\xf0\x9f\x93\x8a\xc2\xa7', b'\xf0\x9f\x93\xa7'),             # 📧 (alternate)
    (b'\xf0\x9f\xc2\x92\xc2\xbb', b'\xf0\x9f\x92\xbb'),             # 💻
    (b'\xc3\xb0\xc5\xb8\xe2\x80\x9c\xc2\x8a', b'\xf0\x9f\x93\x8a'), # 📊
    
    # 4. Emojis de Servicios y Proyectos
    (b'\xc3\xb0\xc5\xb8\xc2\x9a\xe2\x82\xac', b'\xf0\x9f\x9a\x80'), # 🚀
    (b'\xc3\xb0\xc5\xb8\xe2\x80\x9c\xc2\x8b', b'\xf0\x9f\x93\x8b'), # 📋
    (b'\xc3\xb0\xc5\xb8\xc2\x8c\xc2\x8e', b'\xf0\x9f\x8c\x8e'),     # 🌎
    (b'\xc3\xb0\xc5\xb8\xc2\x94\xc2\x84', b'\xf0\x9f\x94\x84'),     # 🔄
    (b'\xc3\xb0\xc5\xb8\xca\xba\xc3\xaf\xc2\xb8\xc2\x8f', b'\xe2\x9a\x99\xef\xb8\x8f'), # ⚙️
    (b'\xc3\xb0\xc5\xb8\xe2\x80\x9c\xc2\x85', b'\xf0\x9f\x93\x85'), # 📅
    
    # 5. Fixes específicos para Proyectos-BIM (🏗️, 🏭, 🏅)
    (b'\xc3\xb0\xc5\xb8\xc2\x8f\xe2\x80\x97\xc3\xaf\xc2\xb8\xc2\x8f', b'\xf0\x9f\x8f\x97\xef\xb8\x8f'), # 🏗️
    (b'\xc3\xb0\xc5\xb8\xc2\x8f\xc2\xad', b'\xf0\x9f\x8f\xad'),     # 🏭
    (b'\xc3\xb0\xc5\xb8\xc5\xbd\xe2\x80\x93', b'\xf0\x9f\x8e\x96'), # 🏅 (alternate)
    (b'\xc3\xb0\xc5\xb8\xc2\x8d\xc2\x93', b'\xf0\x9f\x8d\x93'),     # 🍓 (o similar)
]

# Carpetas a procesar
TARGET_DIRS = ['.', 'proyectos-bim', 'tool', 'blog', 'project', 'js']

print("=== INICIANDO LIMPIEZA GLOBAL DEFINITIVA ===")

for tdir in TARGET_DIRS:
    if not os.path.exists(tdir): continue
    print(f"\nProcesando directorio: {tdir}")
    for root, dirs, files in os.walk(tdir):
        # Evitar carpetas de sistema
        if any(p.startswith('.') for p in root.split(os.sep) if p != '.'):
            continue
            
        for fname in files:
            if fname.endswith(('.html', '.js', '.css')):
                fpath = os.path.join(root, fname)
                try:
                    with open(fpath, 'rb') as f:
                        data = f.read()
                    
                    orig_data = data
                    for bad, good in CLEAN_MAP:
                        data = data.replace(bad, good)
                    
                    # Fix específico para años de experiencia si es index o proyectos
                    if 'index.html' in fname:
                        data = data.replace(b'data-count="15"', b'data-count="17"')
                        # Garantizar icono Calendar FontAwesome en lugar de emoji roto
                        if b'A\xc3\xb1os Experiencia' in data or b'A\xd1OS EXPERIENCIA' in data:
                            data = data.replace(b'\xf0\x9f\xc2\x93\n', b'<i class="fa-solid fa-calendar-check"></i>')
                    
                    if data != orig_data:
                        with open(fpath, 'wb') as f:
                            f.write(data)
                        print(f"  [OK] Reparado: {fpath}")
                except Exception as e:
                    print(f"  [ERROR] Al procesar {fpath}: {e}")

print("\n=== LIMPIEZA COMPLETADA CON ÉXITO ===")
