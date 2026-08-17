import os
import re
from pathlib import Path

BASE_DIR = Path(r"c:\Users\vv356\Downloads\LearnSphere-Tutoring-HTML-Template\LearnSphere-Tutoring-HTML-Template")

patterns = [
    re.compile(r'study\s*tips', re.IGNORECASE),
    re.compile(r'study[_-]tips', re.IGNORECASE),
    re.compile(r'student\s*motivation', re.IGNORECASE),
    re.compile(r'student[_-]motivation', re.IGNORECASE),
]

def search_files():
    for filepath in BASE_DIR.rglob("*"):
        if filepath.is_file() and filepath.suffix in ['.html', '.js']:
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                    for i, pattern in enumerate(patterns):
                        if pattern.search(content):
                            print(f"Found match {i} in {filepath.name}")
            except Exception:
                pass

search_files()
