import re
from pathlib import Path

BASE_DIR = Path(r"c:\Users\vv356\Downloads\LearnSphere-Tutoring-HTML-Template\LearnSphere-Tutoring-HTML-Template")

def process_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    original = content

    # Footer links are direct links like: <a href="course-details.html?course=math">Mathematics Mastery</a>
    content = re.sub(r'href="course-details\.html[^"]*"([^>]*>\s*Mathematics Mastery)', r'href="course-details.html?course=mathematics-mastery"\1', content, flags=re.IGNORECASE)
    content = re.sub(r'href="course-details\.html[^"]*"([^>]*>\s*General Science)', r'href="course-details.html?course=general-science-lab"\1', content, flags=re.IGNORECASE)
    content = re.sub(r'href="course-details\.html[^"]*"([^>]*>\s*English Language)', r'href="course-details.html?course=english-language-literature"\1', content, flags=re.IGNORECASE)
    content = re.sub(r'href="course-details\.html[^"]*"([^>]*>\s*Computer Science)', r'href="course-details.html?course=computer-science-basics"\1', content, flags=re.IGNORECASE)

    if content != original:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated footer links in {file_path}")

for file in BASE_DIR.rglob("*.html"):
    process_file(file)

