import re
from pathlib import Path

BASE_DIR = Path(r"c:\Users\vv356\Downloads\LearnSphere-Tutoring-HTML-Template\LearnSphere-Tutoring-HTML-Template")
about_file = BASE_DIR / "about.html"

with open(about_file, 'r', encoding='utf-8') as f:
    content = f.read()

# I will find each tutor's article block and replace 'href="tutors.html"' with 'href="tutor-xyz.html"'
tutors = {
    'Amelia Hart': 'tutor-amelia-hart.html',
    'Daniel Okafor': 'tutor-daniel-okafor.html',
    'Sofia Marino': 'tutor-sofia-marino.html',
    'Ethan Blake': 'tutor-ethan-blake.html'
}

def update_link(match):
    article = match.group(0)
    for name, link in tutors.items():
        if f"<h3>{name}</h3>" in article:
            # We want to replace only the "View Profile" link at the bottom of the card.
            # It usually looks like: <a class="btn btn-outline btn-sm" href="tutors.html">View Profile
            article = re.sub(r'href="tutors\.html"(>View Profile)', f'href="{link}"\\1', article)
    return article

new_content = re.sub(r'<article class="card card-hover reveal" data-search-text="[^"]+">.*?</article>', update_link, content, flags=re.DOTALL)

if new_content != content:
    with open(about_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Updated about.html links")
else:
    print("No changes needed or regex didn't match")

