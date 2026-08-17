import re
from pathlib import Path

BASE_DIR = Path(r"c:\Users\vv356\Downloads\LearnSphere-Tutoring-HTML-Template\LearnSphere-Tutoring-HTML-Template")
tutors_file = BASE_DIR / "tutors.html"
about_file = BASE_DIR / "about.html"

with open(tutors_file, 'r', encoding='utf-8') as f:
    content = f.read()
    
with open(about_file, 'r', encoding='utf-8') as f:
    about_content = f.read()

# Extract header and footer from about_content
header_part = about_content.split('<main id="main">')[0] + '<main id="main">\n'
footer_part = '\n</main>' + about_content.split('</main>')[1]

tutors = {
    'Amelia Hart': 'tutor-amelia-hart.html',
    'Daniel Okafor': 'tutor-daniel-okafor.html',
    'Sofia Marino': 'tutor-sofia-marino.html',
    'Ethan Blake': 'tutor-ethan-blake.html'
}

matches = re.finditer(r'<article\b[^>]*>.*?</article>', content, flags=re.DOTALL)

def extract_data(article_html):
    name = re.search(r'<h3>(.*?)</h3>', article_html).group(1).strip()
    subject = re.search(r'<span class="badge">(.*?)</span>', article_html).group(1).strip()
    img_src = re.search(r'<img[^>]*src="([^"]*)"', article_html).group(1).strip()
    desc = re.search(r'<p class="clamp-3">(.*?)</p>', article_html, flags=re.DOTALL).group(1).strip()
    
    # Extract meta tags
    metas = re.findall(r'<li class="meta">.*?</li>', article_html)
    # metas[0] = qualification, metas[1] = experience, metas[2] = classes
    q = re.sub(r'<[^>]+>', '', metas[0]).strip() if len(metas) > 0 else ''
    e = re.sub(r'<[^>]+>', '', metas[1]).strip() if len(metas) > 1 else ''
    c = re.sub(r'<[^>]+>', '', metas[2]).strip() if len(metas) > 2 else ''
    
    return {
        'name': name,
        'subject': subject,
        'image': img_src,
        'desc': desc,
        'qual': q,
        'exp': e,
        'cls': c
    }

for m in matches:
    article = m.group(0)
    for t_name, filename in tutors.items():
        if f"<h3>{t_name}</h3>" in article:
            data = extract_data(article)
            
            page_content = f"""<section class="hero page-hero">
  <div class="container">
    <div class="hero-inner">
      <h1>Tutor Profile</h1>
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li><a href="index.html">Home</a></li>
          <li><a href="tutors.html">Tutors</a></li>
          <li aria-current="page">{data['name']}</li>
        </ol>
      </nav>
    </div>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="grid g-2" style="align-items: center; gap: 4rem;">
      <div style="border-radius: var(--r-xl); overflow: hidden;">
        <img src="{data['image']}" alt="{data['name']}" style="width: 100%; height: auto; display: block; object-fit: cover; aspect-ratio: 1/1;">
      </div>
      <div>
        <h2 style="margin-top: 0; font-size: 2.5rem; margin-bottom: .5rem;">{data['name']}</h2>
        <span class="badge" style="background: var(--primary); color: #fff; border: none; font-size: 1rem; padding: .4rem .8rem;">{data['subject']}</span>
        
        <ul class="meta-row" style="list-style:none; padding:0; margin: 1.5rem 0; display: flex; flex-direction: column; gap: 1rem;">
          <li class="meta" style="font-size: 1.1rem;"><i class="fa-solid fa-graduation-cap" style="color: var(--primary); width: 24px;"></i> <strong>Qualification:</strong> {data['qual']}</li>
          <li class="meta" style="font-size: 1.1rem;"><i class="fa-regular fa-clock" style="color: var(--primary); width: 24px;"></i> <strong>Experience:</strong> {data['exp']}</li>
          <li class="meta" style="font-size: 1.1rem;"><i class="fa-solid fa-users" style="color: var(--primary); width: 24px;"></i> <strong>Teaches:</strong> {data['cls']}</li>
        </ul>
        
        <div style="height: 1px; background: var(--border); margin: 2rem 0;"></div>
        
        <h3 style="margin-bottom: 1rem;">About {data['name']}</h3>
        <p style="font-size: 1.15rem; line-height: 1.7; color: var(--text-2);">{data['desc']}</p>
        
        <div style="margin-top: 2.5rem;">
          <a class="btn btn-primary btn-lg" href="contact.html"><i class="fa-regular fa-calendar-check" aria-hidden="true"></i>Book an Assessment</a>
        </div>
      </div>
    </div>
  </div>
</section>"""
            
            full_html = header_part + page_content + footer_part
            
            # Update title
            full_html = re.sub(r'<title>.*?</title>', f'<title>{data["name"]} | LearnSphere Tutoring Centre</title>', full_html)
            
            with open(BASE_DIR / filename, 'w', encoding='utf-8') as f:
                f.write(full_html)
            print(f"Created {filename}")

