import os
import re
from pathlib import Path

BASE_DIR = Path(r"c:\Users\vv356\Downloads\LearnSphere-Tutoring-HTML-Template\LearnSphere-Tutoring-HTML-Template")

def process_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    original = content
    
    # 1. We must find the EXACT block for each blog card and replace its href.
    # We can split the content into <article or <li or <h3> or whatever holds the link and title.
    # The safest way is to just do direct text replacement or very tight regex.
    
    # Let's fix the Study Routine title links.
    # The HTML usually looks like: <a href="wrong.html">How to Build a Study Routine That Actually Sticks</a>
    content = re.sub(r'href="[^"]+"([^>]*>\s*How to Build a Study Routine)', r'href="blog-details-study-routine.html"\1', content, flags=re.IGNORECASE)
    
    # Fix Exam Prep
    content = re.sub(r'href="[^"]+"([^>]*>\s*Exam Preparation: The Last 30 Days)', r'href="blog-details-exam-prep.html"\1', content, flags=re.IGNORECASE)
    
    # Fix Parent Guide
    content = re.sub(r'href="[^"]+"([^>]*>\s*A Parent\'?s? Guide to Supporting)', r'href="blog-details-parent-guide.html"\1', content, flags=re.IGNORECASE)
    
    # Fix Maths
    content = re.sub(r'href="[^"]+"([^>]*>\s*Five Mathematics Habits)', r'href="blog-details-maths.html"\1', content, flags=re.IGNORECASE)
    
    # Fix Science
    content = re.sub(r'href="[^"]+"([^>]*>\s*Making Science Stick)', r'href="blog-details-science.html"\1', content, flags=re.IGNORECASE)
    
    # Fix Time Management
    content = re.sub(r'href="[^"]+"([^>]*>\s*Time Management for Class)', r'href="blog-details-time-management.html"\1', content, flags=re.IGNORECASE)
    
    # For Recent posts, it's <a class="mini-post" href="..."><img><span><strong>TITLE</strong>
    # Let's use a very tight regex without DOTALL, or just match within 200 characters.
    content = re.sub(r'href="[^"]+"((?:(?!href=).){0,200}?How to Build a Study Routine)', r'href="blog-details-study-routine.html"\1', content, flags=re.IGNORECASE | re.DOTALL)
    content = re.sub(r'href="[^"]+"((?:(?!href=).){0,200}?Exam Preparation: The Last 30 Days)', r'href="blog-details-exam-prep.html"\1', content, flags=re.IGNORECASE | re.DOTALL)
    content = re.sub(r'href="[^"]+"((?:(?!href=).){0,200}?A Parent\'?s? Guide to Supporting)', r'href="blog-details-parent-guide.html"\1', content, flags=re.IGNORECASE | re.DOTALL)
    content = re.sub(r'href="[^"]+"((?:(?!href=).){0,200}?Five Mathematics Habits)', r'href="blog-details-maths.html"\1', content, flags=re.IGNORECASE | re.DOTALL)
    content = re.sub(r'href="[^"]+"((?:(?!href=).){0,200}?Making Science Stick)', r'href="blog-details-science.html"\1', content, flags=re.IGNORECASE | re.DOTALL)
    content = re.sub(r'href="[^"]+"((?:(?!href=).){0,200}?Time Management for Class)', r'href="blog-details-time-management.html"\1', content, flags=re.IGNORECASE | re.DOTALL)
    
    # What about Course Details links that might have been messed up by the same logic?
    # My previous script used: lambda m: replace_course_link(m) inside <article>. That was SAFE because it replaced within the bounds of the card!
    # So courses are fine!
    
    if content != original:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Fixed {file_path}")

for file in BASE_DIR.rglob("*.html"):
    process_file(file)

