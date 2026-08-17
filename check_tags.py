import re

def check_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    print(f"--- {filepath} ---")
    sections = len(re.findall(r'<section\b', content))
    end_sections = len(re.findall(r'</section>', content))
    print(f"Sections: {sections}, End Sections: {end_sections}")

check_file("c:/Users/vv356/Downloads/LearnSphere-Tutoring-HTML-Template/LearnSphere-Tutoring-HTML-Template/index.html")
check_file("c:/Users/vv356/Downloads/LearnSphere-Tutoring-HTML-Template/LearnSphere-Tutoring-HTML-Template/home-2.html")
