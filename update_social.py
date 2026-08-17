import re
from pathlib import Path

BASE_DIR = Path(".")

# The regex should match the `<div class="footer-social">...</div>` block
# We will use re.sub with re.DOTALL

def process_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    original = content

    # Using a regex to find the footer-social block
    pattern = re.compile(r'<div class="footer-social">.*?</div>', re.DOTALL)
    
    replacement = """<div class="footer-social">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="LearnSphere on Facebook"><i class="fa-brands fa-facebook-f" aria-hidden="true"></i></a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="LearnSphere on Instagram"><i class="fa-brands fa-instagram" aria-hidden="true"></i></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="LearnSphere on X"><i class="fa-brands fa-x-twitter" aria-hidden="true"></i></a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LearnSphere on LinkedIn"><i class="fa-brands fa-linkedin-in" aria-hidden="true"></i></a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" aria-label="LearnSphere on YouTube"><i class="fa-brands fa-youtube" aria-hidden="true"></i></a>
          </div>"""

    content = pattern.sub(replacement, content)

    if content != original:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated {file_path}")

for file in BASE_DIR.rglob("*.html"):
    process_file(file)
