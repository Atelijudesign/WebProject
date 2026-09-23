import re

def extract_text(file_in, file_out):
    with open(file_in, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Remove scripts and styles
    html = re.sub(r'<script.*?</script>', '', html, flags=re.DOTALL)
    html = re.sub(r'<style.*?</style>', '', html, flags=re.DOTALL)
    
    # Extract text from p, h1-h6, li
    matches = re.findall(r'<(p|h[1-6]|li)[^>]*>(.*?)</\1>', html, flags=re.DOTALL | re.IGNORECASE)
    
    text_blocks = []
    for tag, content in matches:
        # Clean inner html
        clean_text = re.sub(r'<[^>]+>', '', content)
        clean_text = clean_text.strip()
        if clean_text:
            if tag.lower().startswith('h'):
                level = int(tag[1])
                text_blocks.append(f"{'#' * level} {clean_text}\n")
            elif tag.lower() == 'li':
                text_blocks.append(f"- {clean_text}")
            else:
                text_blocks.append(f"{clean_text}\n")
                
    # extract images
    imgs = re.findall(r'<img[^>]+src="([^">]+)"[^>]*>', html, flags=re.IGNORECASE)
    for img in imgs:
        if img.startswith('http'):
            text_blocks.append(f"![Image]({img})\n")

    with open(file_out, 'w', encoding='utf-8') as f:
        f.write("\n".join(text_blocks))

if __name__ == '__main__':
    extract_text(
        r"C:\Users\andre\.gemini\antigravity-ide\brain\e3a3ef07-5ce8-4dbe-a82b-4a43231ed7c6\.system_generated\steps\815\content.md",
        r"C:\Users\andre\.gemini\antigravity-ide\brain\e3a3ef07-5ce8-4dbe-a82b-4a43231ed7c6\clean_article.md"
    )
