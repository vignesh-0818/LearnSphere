import re
from pathlib import Path

BASE_DIR = Path(r"c:\Users\vv356\Downloads\LearnSphere-Tutoring-HTML-Template\LearnSphere-Tutoring-HTML-Template")

def process_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    original = content
    
    # First, let's fix the links in the course cards.
    # We will search for course titles and update the closest course-details.html?course=...
    
    # 1. Mathematics Mastery
    content = re.sub(r'href="course-details\.html[^"]*"([^>]*>\s*Mathematics Mastery)', r'href="course-details.html?course=mathematics-mastery"\1', content, flags=re.IGNORECASE)
    
    # 2. General Science Lab
    content = re.sub(r'href="course-details\.html[^"]*"([^>]*>\s*General Science Lab)', r'href="course-details.html?course=general-science-lab"\1', content, flags=re.IGNORECASE)
    
    # 3. English Language & Literature
    content = re.sub(r'href="course-details\.html[^"]*"([^>]*>\s*English Language)', r'href="course-details.html?course=english-language-literature"\1', content, flags=re.IGNORECASE)
    
    # 4. Computer Science Basics
    content = re.sub(r'href="course-details\.html[^"]*"([^>]*>\s*Computer Science Basics)', r'href="course-details.html?course=computer-science-basics"\1', content, flags=re.IGNORECASE)
    
    # 5. Physics for Board Exams
    content = re.sub(r'href="course-details\.html[^"]*"([^>]*>\s*Physics for Board Exams)', r'href="course-details.html?course=physics-board-exams"\1', content, flags=re.IGNORECASE)
    
    # 6. Foundation Numeracy
    content = re.sub(r'href="course-details\.html[^"]*"([^>]*>\s*Foundation Numeracy)', r'href="course-details.html?course=foundation-numeracy"\1', content, flags=re.IGNORECASE)
    
    # 7. Chemistry Concepts
    content = re.sub(r'href="course-details\.html[^"]*"([^>]*>\s*Chemistry Concepts)', r'href="course-details.html?course=chemistry-concepts"\1', content, flags=re.IGNORECASE)
    
    # 8. Social Science & Civics
    content = re.sub(r'href="course-details\.html[^"]*"([^>]*>\s*Social Science)', r'href="course-details.html?course=social-science-civics"\1', content, flags=re.IGNORECASE)

    # Note: What if the button is further down? "View Details" button.
    # In courses.html and index.html, the structure is:
    # <h3><a href="course-details.html?course=math">Mathematics Mastery</a></h3> ... <a href="course-details.html?course=math" class="btn">View Details</a>
    # We should replace the View Details button link for the respective card too.
    # The safest way is to replace all links inside the <article> card based on the title it contains.
    
    def fix_card(match):
        card = match.group(0)
        # Find which course it is
        if "Mathematics Mastery" in card:
            card = re.sub(r'href="course-details\.html[^"]*"', 'href="course-details.html?course=mathematics-mastery"', card)
        elif "General Science Lab" in card:
            card = re.sub(r'href="course-details\.html[^"]*"', 'href="course-details.html?course=general-science-lab"', card)
        elif "English Language" in card:
            card = re.sub(r'href="course-details\.html[^"]*"', 'href="course-details.html?course=english-language-literature"', card)
        elif "Computer Science" in card:
            card = re.sub(r'href="course-details\.html[^"]*"', 'href="course-details.html?course=computer-science-basics"', card)
        elif "Physics" in card:
            card = re.sub(r'href="course-details\.html[^"]*"', 'href="course-details.html?course=physics-board-exams"', card)
        elif "Numeracy" in card:
            card = re.sub(r'href="course-details\.html[^"]*"', 'href="course-details.html?course=foundation-numeracy"', card)
            # update image too!
            card = re.sub(r'src="assets/images/course-math\.jpg"', 'src="assets/images/course-numeracy.png"', card)
        elif "Chemistry" in card:
            card = re.sub(r'href="course-details\.html[^"]*"', 'href="course-details.html?course=chemistry-concepts"', card)
            card = re.sub(r'src="assets/images/course-science\.jpg"', 'src="assets/images/course-chemistry.png"', card)
        elif "Social Science" in card:
            card = re.sub(r'href="course-details\.html[^"]*"', 'href="course-details.html?course=social-science-civics"', card)
            card = re.sub(r'src="assets/images/course-english\.jpg"', 'src="assets/images/course-social.png"', card)
            
        return card

    content = re.sub(r'<article class="card card-hover course-card.*?</article>', fix_card, content, flags=re.DOTALL | re.IGNORECASE)
    # The home page uses a different class maybe? Let's try matching just <article
    content = re.sub(r'<article[^>]*>.*?</article>', fix_card, content, flags=re.DOTALL | re.IGNORECASE)
    
    if content != original:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated links in {file_path}")

for file in BASE_DIR.rglob("*.html"):
    process_file(file)

