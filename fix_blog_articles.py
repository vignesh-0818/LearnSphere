import re
from pathlib import Path

BASE_DIR = Path(r"c:\Users\vv356\Downloads\LearnSphere-Tutoring-HTML-Template\LearnSphere-Tutoring-HTML-Template")

blogs = {
    "blog-details-study-routine.html": {
        "title": "How to Build a Study Routine That Actually Sticks",
        "category": "Time Management",
        "subtitle": "A realistic weekly plan beats a perfect one. Here is the routine we set up with new students in their first fortnight.",
        "author": "Amelia Hart",
        "date": "12 Aug 2026",
        "read_time": "6 min read",
        "comments": "12 comments",
        "image": "assets/images/study-routine.jpg"
    },
    "blog-details-exam-prep.html": {
        "title": "Exam Preparation: The Last 30 Days Checklist",
        "category": "Exam Prep",
        "subtitle": "What to revise, what to skip and how to run timed past papers without burning out before the exam.",
        "author": "Daniel Okafor",
        "date": "05 Aug 2026",
        "read_time": "8 min read",
        "comments": "8 comments",
        "image": "assets/images/blog-2.jpg"
    },
    "blog-details-parent-guide.html": {
        "title": "A Parent's Guide to Supporting Homework Time",
        "category": "Parent Guidance",
        "subtitle": "Small changes at the kitchen table can remove most homework arguments. Six practical ideas to try this week.",
        "author": "Sofia Marino",
        "date": "28 Jul 2026",
        "read_time": "5 min read",
        "comments": "14 comments",
        "image": "assets/images/blog-3.jpg"
    },
    "blog-details-maths.html": {
        "title": "Five Mathematics Habits of Confident Students",
        "category": "Mathematics",
        "subtitle": "Confidence in maths is a habit, not a talent. These five behaviours show up in almost every high scorer we teach.",
        "author": "Amelia Hart",
        "date": "20 Jul 2026",
        "read_time": "7 min read",
        "comments": "5 comments",
        "image": "assets/images/course-math.jpg"
    },
    "blog-details-science.html": {
        "title": "Making Science Stick with Everyday Experiments",
        "category": "Science",
        "subtitle": "Kitchen-table experiments that reinforce the Class 6–8 syllabus without any special equipment.",
        "author": "Priya Raman",
        "date": "14 Jul 2026",
        "read_time": "6 min read",
        "comments": "2 comments",
        "image": "assets/images/course-science.jpg"
    },
    "blog-details-time-management.html": {
        "title": "Time Management for Class 9 and 10 Students",
        "category": "Time Management",
        "subtitle": "Board years get busy fast. Here is how our students split revision, school work and rest across a normal week.",
        "author": "Ethan Blake",
        "date": "02 Jul 2026",
        "read_time": "5 min read",
        "comments": "11 comments",
        "image": "assets/images/blog-1.jpg"
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
    
    # Update H1
    content = re.sub(r'<h1>.*?</h1>', f'<h1>{data["title"]}</h1>', content)
    
    # Update subtitle (paragraph right after h1)
    # The current subtitle format is usually <p>Category · Subtitle</p>
    content = re.sub(r'<h1>(.*?)</h1>\s*<p>.*?</p>', f'<h1>\\1</h1>\n      <p>{data["category"]} · {data["subtitle"]}</p>', content)
    
    # Update Category badge
    content = re.sub(r'<span class="badge"[^>]*>.*?</span>', f'<span class="badge" style="background:var(--primary);color:#fff;border:none;">{data["category"]}</span>', content, count=1)
    
    # Update Author
    content = re.sub(
        r'<li class="meta">(<img[^>]*>|<i class="fa-regular fa-user"[^>]*></i>)[^<]*</li>', 
        f'<li class="meta">\\g<1>{data["author"]}</li>', 
        content
    )
    
    # Update Date
    content = re.sub(
        r'<li class="meta"><i class="fa-regular fa-calendar"[^>]*></i>\s*.*?</li>', 
        f'<li class="meta"><i class="fa-regular fa-calendar" aria-hidden="true"></i>{data["date"]}</li>', 
        content
    )
    
    # Update Read Time
    content = re.sub(
        r'<li class="meta"><i class="fa-regular fa-clock"[^>]*></i>\s*.*?</li>', 
        f'<li class="meta"><i class="fa-regular fa-clock" aria-hidden="true"></i>{data["read_time"]}</li>', 
        content
    )
    
    # Update Comments
    content = re.sub(
        r'<li class="meta"><i class="fa-regular fa-comments"[^>]*></i>\s*.*?</li>', 
        f'<li class="meta"><i class="fa-regular fa-comments" aria-hidden="true"></i>{data["comments"]}</li>', 
        content
    )
    
    # Update inner hero image (the one inside article-body)
    # <img src="..." alt="..." style="border-radius:var(--r-xl);width:100%;" width="1200" height="800">
    content = re.sub(
        r'<img src="[^"]*"([^>]*style="border-radius:var\(--r-xl\);width:100%;"[^>]*)>', 
        f'<img src="{data["image"]}"\\1>', 
        content
    )
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
        
    print(f"Updated {filename}")
