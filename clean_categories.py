import re
from pathlib import Path

BASE_DIR = Path(r"c:\Users\vv356\Downloads\LearnSphere-Tutoring-HTML-Template\LearnSphere-Tutoring-HTML-Template")

def clean_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    original = content
    
    # Remove category list items from sidebars
    content = re.sub(r'<li>\s*<a class="widget-link" href="[^"]*">\s*<span>Study Tips</span>.*?</a>\s*</li>', '', content, flags=re.IGNORECASE|re.DOTALL)
    content = re.sub(r'<li>\s*<a class="widget-link" href="[^"]*">\s*<span>Student Motivation</span>.*?</a>\s*</li>', '', content, flags=re.IGNORECASE|re.DOTALL)
    
    # Replace in tags
    content = re.sub(r'<a href="[^"]*">Study Tips</a>', '<a href="blog.html">Time Management</a>', content, flags=re.IGNORECASE)
    content = re.sub(r'<a href="[^"]*">Student Motivation</a>', '<a href="blog.html">Parent Guidance</a>', content, flags=re.IGNORECASE)
    
    # Replace in prose / meta text
    content = re.sub(r'Study Tips ·', 'Time Management ·', content, flags=re.IGNORECASE)
    
    # Specifically for "Monthly study tips for parents" -> "Monthly newsletter for parents"
    content = re.sub(r'Monthly study tips', 'Monthly newsletter', content, flags=re.IGNORECASE)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Cleaned {filepath.name}")

for filepath in BASE_DIR.rglob("*.html"):
    clean_file(filepath)
