import re
from pathlib import Path

BASE_DIR = Path(r"c:\Users\vv356\Downloads\LearnSphere-Tutoring-HTML-Template\LearnSphere-Tutoring-HTML-Template")

def clean_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    original = content
    
    # Clean data-search-text
    content = re.sub(r'data-search-text="([^"]*)Study Tips([^"]*)"', r'data-search-text="\1Time Management\2"', content, flags=re.IGNORECASE)
    
    # Clean meta description
    content = re.sub(r'content="Study tips,\s*', 'content="Time management advice, ', content, flags=re.IGNORECASE)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Cleaned {filepath.name}")

for filepath in BASE_DIR.rglob("*.html"):
    clean_file(filepath)
