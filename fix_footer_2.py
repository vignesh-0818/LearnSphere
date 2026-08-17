import re
from pathlib import Path

BASE_DIR = Path(r"c:\Users\vv356\Downloads\LearnSphere-Tutoring-HTML-Template\LearnSphere-Tutoring-HTML-Template")

def process_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    original = content

    content = re.sub(r'course-details\.html\?course=mathematics\b', 'course-details.html?course=mathematics-mastery', content)
    content = re.sub(r'course-details\.html\?course=science\b', 'course-details.html?course=general-science-lab', content)
    content = re.sub(r'course-details\.html\?course=english\b', 'course-details.html?course=english-language-literature', content)
    content = re.sub(r'course-details\.html\?course=math\b', 'course-details.html?course=mathematics-mastery', content)
    content = re.sub(r'course-details\.html\?course=cs\b', 'course-details.html?course=computer-science-basics', content)

    if content != original:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated footer links in {file_path}")

for file in BASE_DIR.rglob("*.html"):
    process_file(file)

