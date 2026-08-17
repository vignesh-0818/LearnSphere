import glob
import re

html_files = glob.glob("student-*.html")

style_regex = re.compile(r'<style>\.dropdown-menu\.is-active \{ display: flex !important; \}</style>\s*<style>.*?profile-dropdown-menu.*?</style>', re.DOTALL)

old_dropdown_regex = re.compile(
    r'<div class="dropdown-wrapper session-dropdown-wrapper" style="position:relative;">\s*<button type="button" style="background:none;border:none;padding:0;cursor:pointer;display:flex;align-items:center;gap:\.5rem;font-family:inherit;" id="session-user-toggle" data-user-toggle>.*?</button>\s*<div class="profile-dropdown-menu" id="session-user-dropdown" data-user-dropdown>.*?</div>\s*</div>',
    re.DOTALL
)

new_dropdown_html = """<div class="dropdown-wrapper session-dropdown-wrapper" style="position:relative;">
            <button class="profile-trigger" type="button" aria-haspopup="true" aria-expanded="false" id="session-user-toggle" data-user-toggle>
                <img class="avatar avatar-sm" src="assets/images/tutor-4.jpg" alt="Profile" style="width:36px;height:36px;border-radius:50%;object-fit:cover;">
                <span style="font-weight:600;color:var(--text);" data-user-name>Aarav Mehta</span>
                <i class="fa-solid fa-chevron-down" style="font-size:12px;color:var(--text-2);"></i>
            </button>
            <div class="profile-dropdown-menu" id="session-user-dropdown" data-user-dropdown>
                <a href="student-dashboard.html">Dashboard</a>
                <a href="student-subjects.html">My Subjects</a>
                <a href="student-schedule.html">Class Schedule</a>
                <a href="student-attendance.html">Attendance</a>
                <a href="student-materials.html">Study Materials</a>
                <a href="student-tests.html">Upcoming Tests</a>
                <a href="student-results.html">Results</a>
                <a href="student-profile.html">Profile</a>
                <a href="student-settings.html">Settings</a>
                <hr style="margin: 0.5rem 0; border: none; border-top: 1px solid var(--border);">
                <a href="#" data-action="logout" class="text-danger">Logout</a>
            </div>
        </div>"""

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove old inline styles
    content = style_regex.sub('', content)
    
    # Replace old dropdown HTML
    content = old_dropdown_regex.sub(new_dropdown_html, content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filepath}")
