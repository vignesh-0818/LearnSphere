from bs4 import BeautifulSoup

def print_sections(filepath):
    print(f"--- {filepath} ---")
    with open(filepath, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f, "html.parser")
        
    for idx, sec in enumerate(soup.find_all('section')):
        heading = sec.find(['h2', 'h1', 'h3'])
        text = heading.text.strip() if heading else "No heading"
        print(f"Section {idx}: {text}")

print_sections("c:/Users/vv356/Downloads/LearnSphere-Tutoring-HTML-Template/LearnSphere-Tutoring-HTML-Template/index.html")
print_sections("c:/Users/vv356/Downloads/LearnSphere-Tutoring-HTML-Template/LearnSphere-Tutoring-HTML-Template/home-2.html")
