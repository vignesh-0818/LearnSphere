import re

def remove_section_by_h2(filepath, h2_text_substring):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the section containing the given text
    pattern = r'<section\b[^>]*>.*?<h2[^>]*>.*?{}.*?</h2>.*?</section>'.format(re.escape(h2_text_substring))
    
    new_content = re.sub(pattern, '', content, flags=re.DOTALL | re.IGNORECASE)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Removed section with '{h2_text_substring}' from {filepath}")
    else:
        print(f"Section '{h2_text_substring}' not found in {filepath}")

remove_section_by_h2("c:/Users/vv356/Downloads/LearnSphere-Tutoring-HTML-Template/LearnSphere-Tutoring-HTML-Template/index.html", "Teachers your child will actually enjoy")
remove_section_by_h2("c:/Users/vv356/Downloads/LearnSphere-Tutoring-HTML-Template/LearnSphere-Tutoring-HTML-Template/home-2.html", "Board-year programmes")
remove_section_by_h2("c:/Users/vv356/Downloads/LearnSphere-Tutoring-HTML-Template/LearnSphere-Tutoring-HTML-Template/home-2.html", "Meet the teaching team")

