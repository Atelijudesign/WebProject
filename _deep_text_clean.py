import os

# Saneamiento profundo de texto usando solo literales de bytes ASCII para evitar SyntaxError.
# á: \xc3\xa1, é: \xc3\xa9, í: \xc3\xad, ó: \xc3\xb3, ú: \xc3\xba, ñ: \xc3\xb1

DEEP_CLEAN_MAP = [
    # 1. Unidades técnicas (cm², m²) y símbolos comunes
    (b'cm\xc3\xadc\xc3\xa2\xe2\x80\x9a\xc2\xac\xc2\xb2', b'cm\xb2'),
    (b'cm\xc3\xadc\xc3\xa2\xe2\x80\x9a\xc2\xac', b'cm\xb2'),
    (b'm\xc3\xadc\xc3\xa2\xe2\x80\x9a\xc2\xac\xc2\xb2', b'm\xb2'),
    (b'm\xc3\xadc\xc3\xa2\xe2\x80\x9a\xc2\xac', b'm\xb2'),
    
    # 2. Separadores decorativos corruptos
    (b'\xc3\xa2\xc2\x95\xc2\x90', b'-'), 
    (b'\xc2\x90\xc3\xa2\xc2\x95\xc2\x90', b'-'),
    (b'\xc3\xa2\xe2\x80\xa2\xc2\x90', b'-'),
    (b'\xc2\x90\xc3\xa2\xe2\x80\xa2\xc2\x90', b'-'),
    
    # 3. Comentarios de JavaScript
    (b'\xc3\xa2\xe2\x80\x9d\xe2\x82\xac', b' // '),
    
    # 4. Acentos en etiquetas de texto (Byte literals)
    (b'Dise\xc3\xadc\xc3\xa2\xe2\x80\x9a\xc2\xac\xc2\xb1o', b'Dise\xc3\xb1o'), # Diseño
    (b'C\xc3\xadc\xc3\xa2\xe2\x80\x9a\xc2\xac\xc2\xb1lculo', b'C\xc3\xa1lculo'), # Cálculo
    (b'Ubicaci\xc3\xadc\xc3\xa2\xe2\x80\x9a\xc2\xac\xc2\xb3n', b'Ubicaci\xc3\xb3n'), # Ubicación
    (b'Informaci\xc3\xadc\xc3\xa2\xe2\x80\x9a\xc2\xac\xc2\xb3n', b'Informaci\xc3\xb3n'), # Información

    # 5. Símbolos especiales
    (b'\xe2\x80\x9ce2\x82ac', b''),
    (b'NCGLYPH', b''),
]

for root, dirs, files in os.walk('.'):
    if any(p.startswith('.') for p in root.split(os.sep) if p != '.'):
        continue
    for fname in files:
        if fname.endswith(('.html', '.js')):
            fpath = os.path.join(root, fname)
            try:
                with open(fpath, 'rb') as f:
                    data = f.read()
                
                original = data
                for bad, good in DEEP_CLEAN_MAP:
                    data = data.replace(bad, good)

                if data != original:
                    with open(fpath, 'wb') as f:
                        f.write(data)
                    print(f"Saneado: {fpath}")
            except Exception as e:
                print(f"Error en {fpath}: {e}")

print("Limpieza profunda de texto finalizada.")
