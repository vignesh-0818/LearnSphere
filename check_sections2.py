import re

def analyze_sections(filepath):
    print(f"--- {filepath} ---")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    sections = []
    # Find all <section ...> ... </section>
    # Note: Regex parsing HTML is brittle but good enough for this quick check if there are no nested sections
    matches = re.finditer(r'<section\b.*?</section>', content, flags=re.DOTALL | re.IGNORECASE)
    for m in matches:
        sec = m.group(0)
        h2 = re.search(r'<h2[^>]*>(.*?)</h2>', sec, flags=re.IGNORECASE)
        if h2:
            print(h2.group(1).strip())
        else:
            print("No H2")

analyze_sections("c:/Users/vv356/Downloads/LearnSphere-Tutoring-HTML-Template/LearnSphere-Tutoring-HTML-Template/index.html")
analyze_sections("c:/Users/vv356/Downloads/LearnSphere-Tutoring-HTML-Template/LearnSphere-Tutoring-HTML-Template/home-2.html")
