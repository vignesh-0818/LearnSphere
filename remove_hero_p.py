import os
import glob
from bs4 import BeautifulSoup, NavigableString

directory = r"c:\Users\vv356\Downloads\LearnSphere-Tutoring-HTML-Template\LearnSphere-Tutoring-HTML-Template"

files = glob.glob(os.path.join(directory, "*.html"))

updated_count = 0

for filepath in files:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    soup = BeautifulSoup(content, 'html.parser')
    modified = False

    # Find hero containers
    for container in soup.find_all(['section', 'div']):
        classes = container.get('class', [])
        if 'hero' in classes or 'page-hero' in classes or 'auth-aside' in classes:
            # Skip if it's some deeply nested non-hero thing, but usually 'hero' class is at the top
            
            # Find the first h1 or h2 inside the container
            heading = container.find(['h1', 'h2'])
            if heading:
                # Find the next sibling that is a tag
                nxt = heading.next_sibling
                while nxt and isinstance(nxt, NavigableString):
                    nxt = nxt.next_sibling
                
                if nxt and nxt.name == 'p':
                    nxt.extract()
                    modified = True

    if modified:
        with open(filepath, "w", encoding="utf-8") as f:
            # bs4 might modify formatting slightly, but usually it's acceptable.
            # However, to preserve exact formatting, maybe it's better to use regex?
            f.write(str(soup))
        updated_count += 1
        print(f"Updated {os.path.basename(filepath)}")

print(f"Total updated: {updated_count}")
