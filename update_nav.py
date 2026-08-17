import os
import re

target_dir = r"."

def get_active_str(file_path, link_type):
    basename = os.path.basename(file_path).lower()
    if link_type == "home":
        if basename in ["index.html", "home-2.html"]:
            return ' aria-current="page"'
    elif link_type == "about":
        if basename == "about.html":
            return ' aria-current="page"'
    elif link_type == "courses":
        if basename in ["courses.html", "course-details.html"]:
            return ' aria-current="page"'
    elif link_type == "blog":
        if basename.startswith("blog"):
            return ' aria-current="page"'
    elif link_type == "pricing":
        if basename == "pricing.html":
            return ' aria-current="page"'
    elif link_type == "contact":
        if basename == "contact.html":
            return ' aria-current="page"'
    return ""

def process_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # The block we are looking for is exactly:
    # <ul class="nav-menu">
    # ...
    # </ul>
    # Followed by: <div class="drawer-tools">
    
    # We will build the new nav-menu block based on the file name
    home_active = get_active_str(file_path, "home")
    about_active = get_active_str(file_path, "about")
    courses_active = get_active_str(file_path, "courses")
    blog_active = get_active_str(file_path, "blog")
    pricing_active = get_active_str(file_path, "pricing")
    contact_active = get_active_str(file_path, "contact")
    
    basename = os.path.basename(file_path).lower()
    home1_active = ' style="font-weight: bold; color: var(--primary);"' if basename == "index.html" else ""
    home2_active = ' style="font-weight: bold; color: var(--primary);"' if basename == "home-2.html" else ""
    
    new_nav = f"""<ul class="nav-menu">
          <li class="has-dropdown">
            <a class="nav-link" href="index.html"{home_active} data-dropdown-trigger aria-expanded="false" aria-controls="menu-home-d">
              Home<i class="fa-solid fa-chevron-down nav-caret" aria-hidden="true"></i>
            </a>
            <ul class="dropdown-menu" id="menu-home-d"><li><a href="index.html"{home1_active}>Home 1</a></li><li><a href="home-2.html"{home2_active}>Home 2</a></li></ul>
          </li>
          <li><a class="nav-link" href="about.html"{about_active}>About</a></li>
          <li><a class="nav-link" href="courses.html"{courses_active}>Courses</a></li>
          <li><a class="nav-link" href="blog.html"{blog_active}>Blog</a></li>
          <li><a class="nav-link" href="pricing.html"{pricing_active}>Pricing</a></li>
          <li><a class="nav-link" href="contact.html"{contact_active}>Contact</a></li>
        </ul>"""

    # We use regex to find the block
    pattern = re.compile(r'<ul class="nav-menu">.*?</ul>(?=\s*<div class="drawer-tools">)', re.DOTALL)
    
    if pattern.search(content):
        new_content = pattern.sub(new_nav, content)
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {file_path}")

for root, dirs, files in os.walk(target_dir):
    for f in files:
        if f.endswith('.html'):
            process_file(os.path.join(root, f))
