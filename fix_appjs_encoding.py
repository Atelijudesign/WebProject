#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fix encoding issues in app.js
"""

import re

# Read the file
with open('proyectos-bim/app.js', 'r', encoding='utf-8', errors='replace') as f:
    content = f.read()

# Fix corrupted Unicode characters
replacements = {
    '\ufffd\ufffd\ufffd': '📊',  # Replacement sequences
    '\ufffd': '',  # Single replacement char
    '\u201c': '—',  # Left double quotation mark
    '\u201d': '—',  # Right double quotation mark
    '\u2013': '–',  # En dash
    '\u2014': '—',  # Em dash
    '\u2018': ''',  # Left single quotation mark
    '\u2019': ''',  # Right single quotation mark
    '\u00c3\u00b1': 'ñ',  # ñ encoded incorrectly
    '\u00e1': 'á',
    '\u00e9': 'é',
    '\u00ed': 'í',
    '\u00f3': 'ó',
    '\u00fa': 'ú',
    '\u00d1': 'Ñ',
    '\u00bf': '¿',
    '\u00a1': '¡',
    '\u00f1': 'ñ',
}

# Apply replacements
for old, new in replacements.items():
    content = content.replace(old, new)

# Fix specific patterns
content = re.sub(r'20\d{2}[\u201c\u201d\u2013\u2014]20\d{2}', lambda m: m.group(0).replace('\u201c', '–').replace('\u201d', '–').replace('\u2013', '–').replace('\u2014', '–'), content)
content = re.sub(r'Ene[\u201c\u201d\u2013\u2014]May', 'Ene–May', content)
content = re.sub(r'(?<=[a-zA-Z])[\u201c\u201d\u2013\u2014](?=\s)', '—', content)

# Fix emoji placeholders
content = content.replace('📊', '📊')
content = content.replace('🔍', '🔍')
content = content.replace('✕', '✕')
content = content.replace('▦', '▦')
content = content.replace('🔩', '🔩')
content = content.replace('🏗️', '🏗️')
content = content.replace('⚡', '⚡')

# Fix city names
content = content.replace('¿Quetilpué', 'Quilpué')
content = content.replace('¿Quétmetal', 'Quilmetal')

# Write back
with open('proyectos-bim/app.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Fixed encoding issues in app.js")
