import re
from pathlib import Path

BASE_DIR = Path(r"c:\Users\vv356\Downloads\LearnSphere-Tutoring-HTML-Template\LearnSphere-Tutoring-HTML-Template")
tutors_file = BASE_DIR / "tutors.html"

with open(tutors_file, 'r', encoding='utf-8') as f:
    content = f.read()

tutors = ['Amelia Hart', 'Daniel Okafor', 'Sofia Marino', 'Ethan Blake']
tutor_data = {}

matches = re.finditer(r'<article\b[^>]*>.*?</article>', content, flags=re.DOTALL)
for m in matches:
    article = m.group(0)
    for t in tutors:
        if t in article:
            tutor_data[t] = article
            
for t in tutors:
    if t not in tutor_data:
        print(f"Missing {t}")
    else:
        print(f"Found {t}")
        
