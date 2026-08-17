import re
from pathlib import Path

BASE_DIR = Path(r"c:\Users\vv356\Downloads\LearnSphere-Tutoring-HTML-Template\LearnSphere-Tutoring-HTML-Template")

# Mapping of file names to metadata based on what should be in blog.html
blogs = {
    "blog-details-exam-prep.html": {
        "title": "Exam Preparation: The Last 30 Days Checklist",
        "category": "Exam Prep",
        "author": "Sofia Marino",
        "date": "05 Aug 2026",
        "read_time": "6 min read",
        "image": "assets/images/blog-2.jpg",
        "desc": "A step-by-step guide to organizing the final month before board exams to maximize retention and minimize stress."
    },
    "blog-details-maths.html": {
        "title": "Five Mathematics Habits of Confident Students",
        "category": "Mathematics",
        "author": "Amelia Hart",
        "date": "20 Jul 2026",
        "read_time": "5 min read",
        "image": "assets/images/course-math.jpg",
        "desc": "Discover the small daily habits that build long-term confidence in algebra, geometry, and advanced mathematics."
    },
    "blog-details-parent-guide.html": {
        "title": "A Parent's Guide to Supporting Homework Time",
        "category": "Parent Guidance",
        "author": "Dr. Clara Lin",
        "date": "10 Aug 2026",
        "read_time": "7 min read",
        "image": "assets/images/blog-1.jpg",
        "desc": "How parents can create a productive homework environment without micro-managing their child's learning process."
    },
    "blog-details-science.html": {
        "title": "Making Science Stick with Everyday Experiments",
        "category": "Science",
        "author": "Daniel Okafor",
        "date": "14 Jul 2026",
        "read_time": "5 min read",
        "image": "assets/images/course-science.jpg",
        "desc": "Simple physics and chemistry experiments you can do at home to bring textbook concepts to life."
    },
    "blog-details-time-management.html": {
        "title": "Time Management for Class 9 and 10 Students",
        "category": "Time Management",
        "author": "Ethan Blake",
        "date": "28 Jun 2026",
        "read_time": "6 min read",
        "image": "assets/images/blog-3.jpg",
        "desc": "Balancing school, tutoring, and extracurriculars using the time-blocking technique."
    },
    "blog-details-study-routine.html": {
        "title": "How to Build a Study Routine That Actually Sticks",
        "category": "Time Management",
        "author": "Amelia Hart",
        "date": "12 Aug 2026",
        "read_time": "5 min read",
        "image": "assets/images/blog-1.jpg",
        "desc": "Stop relying on motivation. Here is how to create a systematic study schedule that feels natural."
    }
}

for filename, data in blogs.items():
    filepath = BASE_DIR / filename
    if not filepath.exists():
        continue
    
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Update Title tag
    content = re.sub(r'<title>.*?</title>', f'<title>{data["title"]} | LearnSphere Tutoring Centre</title>', content)
    content = re.sub(r'content="How to Build a Study Routine[^"]*"', f'content="{data["title"]} | LearnSphere"', content)
    
    # Update H1
    content = re.sub(r'<h1>.*?</h1>', f'<h1>{data["title"]}</h1>', content)
    
    # Update Category badge
    content = re.sub(r'<span class="badge"[^>]*>.*?</span>', f'<span class="badge" style="background:var(--primary);color:#fff;border:none;">{data["category"]}</span>', content, count=1)
    
    # Update Author
    content = re.sub(r'<li class="meta"><i class="fa-regular fa-user" aria-hidden="true"></i>\s*.*?</li>', f'<li class="meta"><i class="fa-regular fa-user" aria-hidden="true"></i>{data["author"]}</li>', content)
    
    # Update Date
    content = re.sub(r'<li class="meta"><i class="fa-regular fa-calendar" aria-hidden="true"></i>\s*.*?</li>', f'<li class="meta"><i class="fa-regular fa-calendar" aria-hidden="true"></i>{data["date"]}</li>', content)
    
    # Update Read Time
    content = re.sub(r'<li class="meta"><i class="fa-regular fa-clock" aria-hidden="true"></i>\s*.*?</li>', f'<li class="meta"><i class="fa-regular fa-clock" aria-hidden="true"></i>{data["read_time"]}</li>', content)
    
    # Update Image
    content = re.sub(r'<div class="blog-hero-image">.*?<img src="[^"]*"', f'<div class="blog-hero-image">\n          <img src="{data["image"]}"', content, flags=re.DOTALL)
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
        
    print(f"Updated {filename}")

