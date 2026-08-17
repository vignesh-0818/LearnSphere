import os
import re
import json
from pathlib import Path

BASE_DIR = Path(r"c:\Users\vv356\Downloads\LearnSphere-Tutoring-HTML-Template\LearnSphere-Tutoring-HTML-Template")

def process_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    original_content = content

    # 1. REMOVE TAGS WIDGET FROM BLOG SIDEBARS
    content = re.sub(r'<div class="widget">\s*<h3(?:[^>]*)>Tags</h3>.*?</div>\s*(?=</aside>|<div class="widget"|</div>)', '', content, flags=re.IGNORECASE | re.DOTALL)
    content = re.sub(r'<div class="widget">\s*<h3>Tags</h3>.*?</div>', '', content, flags=re.IGNORECASE | re.DOTALL)

    # 2. FIX RECENT POSTS BLOG LINKS
    content = re.sub(r'href="blog-details\.html"([^>]*>\s*<img[^>]*>.*?Exam Preparation)', r'href="blog-details-exam-prep.html"\1', content, flags=re.IGNORECASE | re.DOTALL)
    content = re.sub(r'href="blog-details\.html"([^>]*>.*?Exam Preparation)', r'href="blog-details-exam-prep.html"\1', content, flags=re.IGNORECASE | re.DOTALL)
        
    content = re.sub(r'href="blog-details\.html"([^>]*>\s*<img[^>]*>.*?Mathematics Habits)', r'href="blog-details-maths.html"\1', content, flags=re.IGNORECASE | re.DOTALL)
    content = re.sub(r'href="blog-details\.html"([^>]*>.*?Mathematics Habits)', r'href="blog-details-maths.html"\1', content, flags=re.IGNORECASE | re.DOTALL)

    content = re.sub(r'href="blog-details\.html"([^>]*>\s*<img[^>]*>.*?Making Science Stick)', r'href="blog-details-science.html"\1', content, flags=re.IGNORECASE | re.DOTALL)
    content = re.sub(r'href="blog-details\.html"([^>]*>.*?Making Science Stick)', r'href="blog-details-science.html"\1', content, flags=re.IGNORECASE | re.DOTALL)

    content = re.sub(r'href="blog-details\.html"([^>]*>.*?Study Routine)', r'href="blog-details-study-routine.html"\1', content, flags=re.IGNORECASE | re.DOTALL)
    content = re.sub(r'href="blog-details\.html"([^>]*>.*?Parent\'?s? Guide)', r'href="blog-details-parent-guide.html"\1', content, flags=re.IGNORECASE | re.DOTALL)

    # 3. FIX COURSE LINKS
    def replace_course_link(match):
        card_content = match.group(0)
        if "Mathematics Mastery" in card_content or "math" in card_content.lower():
            return card_content.replace('href="course-details.html"', 'href="course-details.html?course=math"')
        elif "General Science" in card_content or "science" in card_content.lower():
            return card_content.replace('href="course-details.html"', 'href="course-details.html?course=science"')
        elif "English Language" in card_content or "english" in card_content.lower():
            return card_content.replace('href="course-details.html"', 'href="course-details.html?course=english"')
        elif "Computer Science" in card_content or "computer" in card_content.lower():
            return card_content.replace('href="course-details.html"', 'href="course-details.html?course=cs"')
        else:
            return card_content.replace('href="course-details.html"', 'href="course-details.html?course=math"')

    content = re.sub(r'<article[^>]*>.*?</article>', lambda m: replace_course_link(m), content, flags=re.IGNORECASE | re.DOTALL)
    
    # Check for direct text replacements (like in Footer)
    content = content.replace('href="course-details.html">Mathematics Mastery', 'href="course-details.html?course=math">Mathematics Mastery')
    content = content.replace('href="course-details.html">General Science', 'href="course-details.html?course=science">General Science')
    content = content.replace('href="course-details.html">English Language', 'href="course-details.html?course=english">English Language')
    content = content.replace('href="course-details.html">Computer Science', 'href="course-details.html?course=cs">Computer Science')

    # Fix generic navbar links that say Courses but point to course-details.html
    content = re.sub(r'href="course-details\.html"([^>]*>Courses<)', r'href="courses.html"\1', content)

    if content != original_content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated {file_path}")

for file in BASE_DIR.rglob("*.html"):
    process_file(file)
