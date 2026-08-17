import re
from pathlib import Path

BASE_DIR = Path(r"c:\Users\vv356\Downloads\LearnSphere-Tutoring-HTML-Template\LearnSphere-Tutoring-HTML-Template")

def update_image(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    original = content
    
    # In blog.html and index.html: it's inside the article card for Study Routine
    # We can match the article block
    def replace_card_img(match):
        article_html = match.group(0)
        if "Study Routine That Actually Sticks" in article_html:
            article_html = re.sub(r'src="assets/images/blog-1\.jpg"', 'src="assets/images/study-routine.jpg"', article_html)
        return article_html

    # For blog cards
    content = re.sub(r'<article class="card card-hover post-card.*?</article>', replace_card_img, content, flags=re.DOTALL)
    
    # In blog-details-study-routine.html, it's the hero image
    if filepath.name == "blog-details-study-routine.html":
        content = re.sub(r'<div class="blog-hero-image">\s*<img src="assets/images/blog-1\.jpg"', 
                         '<div class="blog-hero-image">\n          <img src="assets/images/study-routine.jpg"', content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated image in {filepath.name}")

for filepath in BASE_DIR.rglob("*.html"):
    update_image(filepath)
