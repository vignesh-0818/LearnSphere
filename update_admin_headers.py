import os
import re
import glob

target_dir = r"c:\Users\vv356\Downloads\LearnSphere-Tutoring-HTML-Template\LearnSphere-Tutoring-HTML-Template"
admin_files = glob.glob(os.path.join(target_dir, "admin-*.html"))
admin_files = [f for f in admin_files if "login" not in f and "register" not in f]

replacement = """<div class="dash-tools">
        <form class="searchbar" data-dash-search>
          <label class="sr-only" for="dash-search">Search</label>
          <button type="submit" style="background:none;border:none;padding:0;position:absolute;inset-inline-start:1rem;top:50%;transform:translateY(-50%);cursor:pointer;color:var(--text-3);"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i></button>
          <input class="input" id="dash-search" type="search" placeholder="Search" style="padding-inline-start:2.5rem;">
        </form>
        <button class="icon-btn theme-toggle" type="button" data-theme-toggle aria-label="Switch theme"><i class="fa-solid fa-sun icon-sun" aria-hidden="true"></i><i class="fa-solid fa-moon icon-moon" aria-hidden="true"></i></button>
        <button class="icon-btn lang-btn" type="button" data-dir-toggle aria-label="Switch layout direction"><i class="fa-solid fa-language" aria-hidden="true"></i><span data-dir-label>RTL</span></button>
        <button class="icon-btn" type="button" aria-label="Notifications"><i class="fa-regular fa-bell" aria-hidden="true"></i></button>
        <div style="display:flex; align-items:center; gap:0.5rem;">
            <img class="avatar avatar-sm" src="assets/images/tutor-1.jpg" alt="Profile" style="width:36px;height:36px;border-radius:50%;object-fit:cover;">
            <span class="user-name" data-user-name style="font-weight:600; font-size:14px; color:var(--text);">System Admin</span>
        </div>
      </div>
    </header>"""

for filepath in admin_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # The previous script broke dash-tools by adding style="" to everything including closing tags.
    # The end of the block is always </header>
    pattern = re.compile(r'<div class="dash-tools"[^>]*>.*?</header>', re.DOTALL)
    
    if pattern.search(content):
        new_content = pattern.sub(replacement, content)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed {os.path.basename(filepath)}")
    else:
        print(f"No match found in {os.path.basename(filepath)}")
