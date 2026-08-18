import os
import re

dir_path = r"c:\Users\vv356\Downloads\LearnSphere-Tutoring-HTML-Template-fixed (2)\LearnSphere-Tutoring-HTML-Template"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # Remove the brand tag lines: <span class="brand-tag">TUTORING CENTRE</span>
    content = re.sub(r'[ \t]*<span class="brand-tag">TUTORING CENTR[E|ER]</span>[\r\n]*', '', content, flags=re.IGNORECASE)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

count = 0
for root, dirs, files in os.walk(dir_path):
    for filename in files:
        if filename.endswith(".html"):
            filepath = os.path.join(root, filename)
            if process_file(filepath):
                count += 1
                print(f"Updated {filename}")

print(f"\nUpdated {count} HTML files in total.")
