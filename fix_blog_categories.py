import re
from pathlib import Path

BASE_DIR = Path(r"c:\Users\vv356\Downloads\LearnSphere-Tutoring-HTML-Template\LearnSphere-Tutoring-HTML-Template")

def fix_blog_html(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    original = content

    # 1. Remove Study Tips category chips/sidebar links
    content = re.sub(r'<button class="chip"[^>]*data-filter="study"[^>]*>.*?</button>', '', content)
    content = re.sub(r'<li>\s*<button class="chip"[^>]*data-filter="study"[^>]*>.*?</button>\s*</li>', '', content)
    
    # 2. Remove Student Motivation category chips/sidebar links (assuming data-filter="motivation" or similar)
    content = re.sub(r'<button class="chip"[^>]*data-filter="motivation"[^>]*>.*?</button>', '', content)
    content = re.sub(r'<li>\s*<button class="chip"[^>]*data-filter="motivation"[^>]*>.*?</button>\s*</li>', '', content)
    # Just in case they used data-filter="student" or text "Student Motivation"
    content = re.sub(r'<button class="chip"[^>]*data-filter="[^"]*"[^>]*>Student Motivation</button>', '', content)
    content = re.sub(r'<li>\s*<button class="chip"[^>]*data-filter="[^"]*"[^>]*>.*?Student Motivation.*?</button>\s*</li>', '', content)

    # 3. Change "Study Tips" and "Student Motivation" badges/categories on articles
    # If article has data-category="study", change to data-category="time"
    content = re.sub(r'data-category="study"', 'data-category="time"', content)
    content = re.sub(r'<span class="badge">Study Tips</span>', '<span class="badge">Time Management</span>', content)
    content = re.sub(r'data-category="motivation"', 'data-category="parents"', content)
    content = re.sub(r'<span class="badge">Student Motivation</span>', '<span class="badge">Parent Guidance</span>', content)

    # 4. Map the links to correct detail pages
    def map_links(match):
        article_html = match.group(0)
        
        # Link mappings
        if "Study Routine That Actually Sticks" in article_html:
            article_html = re.sub(r'href="blog-details[^"]*"', 'href="blog-details-study-routine.html"', article_html)
        elif "Exam Preparation" in article_html and "30 Days Checklist" in article_html:
            article_html = re.sub(r'href="blog-details[^"]*"', 'href="blog-details-exam-prep.html"', article_html)
        elif "Mathematics Habits" in article_html:
            article_html = re.sub(r'href="blog-details[^"]*"', 'href="blog-details-maths.html"', article_html)
        elif "Science Stick" in article_html:
            article_html = re.sub(r'href="blog-details[^"]*"', 'href="blog-details-science.html"', article_html)
        elif "Time Management for Class" in article_html:
            article_html = re.sub(r'href="blog-details[^"]*"', 'href="blog-details-time-management.html"', article_html)
        elif "Parent Guidance" in article_html or "Parents" in article_html:
            # We must be careful not to replace it if it's the "Parent Guidance" sidebar item, but we are inside an <article> or <li> for Recent Posts
            article_html = re.sub(r'href="blog-details[^"]*"', 'href="blog-details-parent-guide.html"', article_html)
        
        return article_html

    # Apply to cards
    content = re.sub(r'<article class="card card-hover post-card.*?</article>', map_links, content, flags=re.DOTALL)
    
    # Apply to Recent Posts in sidebar or footer
    content = re.sub(r'<li class="recent-post-item.*?</article></li>', map_links, content, flags=re.DOTALL)
    content = re.sub(r'<li class="recent-post-item.*?(?:</li>|</a>\s*</div>\s*</li>)', map_links, content, flags=re.DOTALL)
    # More generic for recent posts
    content = re.sub(r'<div class="widget">.*?<h3>Recent Posts</h3>.*?</ul>', map_links, content, flags=re.DOTALL)
    # Footer recent posts
    content = re.sub(r'<h3>Recent Posts</h3>.*?</ul>', map_links, content, flags=re.DOTALL)


    if content != original:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated blog links and categories in {file_path}")


for file in BASE_DIR.rglob("*.html"):
    fix_blog_html(file)

