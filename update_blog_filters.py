import os
import glob
import re

directory = r"c:\Users\vv356\Downloads\LearnSphere-Tutoring-HTML-Template\LearnSphere-Tutoring-HTML-Template"
blog_files = glob.glob(os.path.join(directory, "**", "blog*.html"), recursive=True)

category_map = {
    "all": "all",
    "exam": "exam-preparation",
    "math": "mathematics",
    "science": "science-learning",
    "parents": "parent-guidance",
    "time": "time-management",
    "study": "study-tips", # just in case
}

def replace_chip(match):
    # match.group(1) is everything before data-filter
    # match.group(2) is the filter value
    # match.group(3) is everything after data-filter
    # match.group(4) is the inner HTML
    prefix = match.group(1)
    filter_val = match.group(2)
    suffix = match.group(3)
    inner = match.group(4)
    
    new_cat = category_map.get(filter_val, filter_val)
    href = f'blog.html?category={new_cat}' if new_cat != 'all' else 'blog.html'
    
    # Replace button with a
    prefix = prefix.replace('<button', f'<a href="{href}"')
    # Remove type="button"
    prefix = prefix.replace('type="button"', '')
    # Replace data-filter with data-category-link
    # Also remove aria-pressed since it's an a tag, but we can just let CSS handle is-active
    suffix = suffix.replace('aria-pressed="false"', '').replace('aria-pressed="true"', '')
    
    return f'{prefix} data-category-link="{new_cat}" {suffix}>{inner}</a>'

for filepath in blog_files:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Replace all <button class="chip"... data-filter="...">...</button>
    content = re.sub(r'(<button[^>]+class="[^"]*chip[^"]*"[^>]+)data-filter="([^"]+)"([^>]*)>(.*?)</button>', replace_chip, content, flags=re.DOTALL)
    
    # 2. Remove data-filter-group from parent elements
    content = content.replace('data-filter-group data-filter-target="#post-grid"', '')
    content = content.replace('data-filter-group', '')
    
    # 3. For blog.html, update data-category in <article>
    if os.path.basename(filepath) == 'blog.html':
        def update_article_category(match):
            cat = match.group(1)
            new_cat = category_map.get(cat, cat)
            return match.group(0).replace(f'data-category="{cat}"', f'data-category="{new_cat}"')
            
        content = re.sub(r'<article[^>]+data-category="([^"]+)"', update_article_category, content)
        
        # 4. Inject CSS and Script into blog.html right after <div class="grid g-2" id="post-grid">
        target = '<div class="grid g-2" id="post-grid">'
        injection = """<div class="grid g-2" id="post-grid">
          <style>
            #post-grid.filter-category-exam-preparation > article:not([data-category~="exam-preparation"]) { display: none !important; }
            #post-grid.filter-category-mathematics > article:not([data-category~="mathematics"]) { display: none !important; }
            #post-grid.filter-category-science-learning > article:not([data-category~="science-learning"]) { display: none !important; }
            #post-grid.filter-category-parent-guidance > article:not([data-category~="parent-guidance"]) { display: none !important; }
            #post-grid.filter-category-time-management > article:not([data-category~="time-management"]) { display: none !important; }
            #post-grid.filter-category-study-tips > article:not([data-category~="study-tips"]) { display: none !important; }
          </style>
          <script>
            (function(){
              var c = new URLSearchParams(window.location.search).get("category");
              if(c && c !== 'all') {
                document.getElementById("post-grid").classList.add("filter-category-" + c);
              }
              document.addEventListener("DOMContentLoaded", function() {
                // Update active chips
                document.querySelectorAll('.chip').forEach(function(chip) {
                  chip.classList.remove('is-active');
                });
                var activeChips = document.querySelectorAll('[data-category-link="' + (c && c !== 'all' ? c : 'all') + '"]');
                activeChips.forEach(function(chip) {
                  chip.classList.add('is-active');
                });
              });
            })();
          </script>"""
          
        if target in content and "filter-category-mathematics" not in content:
            content = content.replace(target, injection)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Updated {filepath}")
