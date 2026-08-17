import os
import glob

# Files to update
student_files = glob.glob('student-*.html')
customer_files = glob.glob('customer-*.html')
all_files = student_files + customer_files

for filepath in all_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # For student files:
    target_student = """<a href="student-settings.html">Settings</a>
                <hr style="margin: 0.5rem 0; border: none; border-top: 1px solid var(--border);">
                <a href="#" data-action="logout" class="text-danger">Logout</a>"""
    
    replacement_student = """<a href="student-settings.html">Settings</a>
                <hr style="margin: 0.5rem 0; border: none; border-top: 1px solid var(--border);">
                <a href="index.html">Back to Website</a>
                <a href="#" data-action="logout" class="text-danger">Logout</a>"""

    # For customer files:
    target_customer = """<a href="student-settings.html" style="padding:1rem; color:var(--text); text-decoration:none; display:block; border-bottom:1px solid var(--border);">Settings</a>
                <a href="index.html" style="padding:1rem; color:var(--text); text-decoration:none; display:block; border-bottom:1px solid var(--border);">Back to Website</a>
                <a href="#" data-action="logout" style="padding:1rem; color:var(--danger); text-decoration:none; display:block;">Logout</a>"""

    # Let's verify if customer files have "Back to Website" already, the user prompt says:
    # "Add a new menu item called 'Back to Website'"
    # The user might have not noticed that it was already in `customer-settings.html` or they are only referring to the student dashboard.
    # Actually, in `customer-dashboard.html` it already exists! But wait, does it exist in ALL `customer-*.html`?
    # I'll just check if `Back to Website` is missing, and if so add it. But for customer it's already there!
    # Let me just focus on student files as they don't have it.

    if target_student in content:
        new_content = content.replace(target_student, replacement_student)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
    else:
        # Maybe customer files don't need update, but let's see if customer files lack it.
        target_customer_missing = """<a href="student-settings.html" style="padding:1rem; color:var(--text); text-decoration:none; display:block; border-bottom:1px solid var(--border);">Settings</a>
                <a href="#" data-action="logout" style="padding:1rem; color:var(--danger); text-decoration:none; display:block;">Logout</a>"""
        replacement_customer_missing = """<a href="student-settings.html" style="padding:1rem; color:var(--text); text-decoration:none; display:block; border-bottom:1px solid var(--border);">Settings</a>
                <a href="index.html" style="padding:1rem; color:var(--text); text-decoration:none; display:block; border-bottom:1px solid var(--border);">Back to Website</a>
                <a href="#" data-action="logout" style="padding:1rem; color:var(--danger); text-decoration:none; display:block;">Logout</a>"""
        
        if target_customer_missing in content:
            new_content = content.replace(target_customer_missing, replacement_customer_missing)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath}")
