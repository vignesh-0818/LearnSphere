import re
from pathlib import Path

path = Path(r"c:\Users\vv356\Downloads\LearnSphere-Tutoring-HTML-Template\LearnSphere-Tutoring-HTML-Template\tutors.html")
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract all <article class="card ..."> blocks
matches = re.finditer(r'<article\b[^>]*>.*?</article>', content, flags=re.DOTALL)
for m in matches:
    article = m.group(0)
    print("----- TUTOR -----")
    print(article)
    
