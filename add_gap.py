import os
import glob

# For blog files
blog_files = glob.glob("blog*.html")
for f in blog_files:
    with open(f, "r", encoding="utf-8") as file:
        content = file.read()
    
    if '<div class="widget">\n        <h3>Newsletter</h3>' in content:
        content = content.replace(
            '<div class="widget">\n        <h3>Newsletter</h3>',
            '<div class="widget" style="margin-top: 3rem;">\n        <h3>Newsletter</h3>'
        )
        with open(f, "w", encoding="utf-8") as file:
            file.write(content)
        print(f"Updated {f}")

# For courses.html
with open("courses.html", "r", encoding="utf-8") as file:
    content = file.read()
if '<div class="footer-newsletter">' in content:
    content = content.replace(
        '<div class="footer-newsletter">',
        '<div class="footer-newsletter" style="margin-top: 3rem;">'
    )
    with open("courses.html", "w", encoding="utf-8") as file:
        file.write(content)
    print("Updated courses.html")

