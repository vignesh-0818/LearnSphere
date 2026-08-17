import re
from pathlib import Path

BASE_DIR = Path(r"c:\Users\vv356\Downloads\LearnSphere-Tutoring-HTML-Template\LearnSphere-Tutoring-HTML-Template")

def process_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    original = content

    # Replace dummy pagination links with coming-soon.html
    # We look for <li><a href="#">2</a></li> and so on.
    # Also <li><span class="is-disabled"><i class="fa-solid fa-arrow-left ico-dir" aria-hidden="true"></i>Prev</span></li>
    
    # Let's use a targeted replace for pagination elements
    content = re.sub(r'<li><span class="is-disabled">([^<]*<i[^>]*></i>\s*Prev)</span></li>', r'<li><a href="coming-soon.html">\1</a></li>', content)
    content = re.sub(r'<li><a href="#">(2)</a></li>', r'<li><a href="coming-soon.html">2</a></li>', content)
    content = re.sub(r'<li><a href="#">(3)</a></li>', r'<li><a href="coming-soon.html">3</a></li>', content)
    content = re.sub(r'<li><a href="#">(Next[^<]*<i[^>]*></i>)</a></li>', r'<li><a href="coming-soon.html">\1</a></li>', content)

    if content != original:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated pagination in {file_path}")

for file in BASE_DIR.rglob("*.html"):
    process_file(file)

