import os
import re

blog_dir = r"c:\Users\andre\Documents\Proyectos26\proyectos\WebProject\src\pages\blog"
components_import = 'import ShareArticle from "../../components/ShareArticle";\n'

for filename in os.listdir(blog_dir):
    if not filename.endswith(".jsx"):
        continue
        
    filepath = os.path.join(blog_dir, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Skip BlogCatalog.jsx
    if filename == "BlogCatalog.jsx":
        continue

    # Add import if not present
    if "import ShareArticle" not in content:
        # insert after the first import or after SEOHead import
        content = re.sub(r'(import SEOHead.*?;\n)', r'\1' + components_import, content)
        if "import ShareArticle" not in content:
            # fallback
            content = re.sub(r'^(import .*?;)', r'\1\n' + components_import, content, count=1)
            
    # Replace the <section className="py-10 bg-[#070d18] ...> ... </section>
    pattern = re.compile(
        r'(\{\s*/\*\s*(?:SHARE BUTTONS|Share Buttons Section|Share Buttons|Share buttons|Share Buttons Area|Share Buttons Widget)[^\n]*\s*\n)?\s*<section className="py-10 bg-\[#070d18\].*?</section>',
        re.DOTALL | re.IGNORECASE
    )
    
    replacement = r'{/* ─── SHARE BUTTONS ─── */}\n      <ShareArticle url={shareUrl} title={shareTitle} />'
    
    new_content = pattern.sub(replacement, content)
    
    # Also clean up unused useState variables for 'copied' (avoiding lint errors)
    new_content = re.sub(r'^\s*const\s+\[copied,\s*setCopied\]\s*=\s*useState\(false\);\n', '', new_content, flags=re.MULTILINE)
    
    # Clean up handleCopyLink function
    new_content = re.sub(r'^\s*const\s+handleCopyLink\s*=\s*\(\)\s*=>\s*\{\s*\n\s*navigator\.clipboard\.writeText[^\}]+\}\);\s*\n\s*\};\n', '', new_content, flags=re.MULTILINE)
    
    if new_content != content:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated {filename}")
    else:
        print(f"No match found in {filename}")

