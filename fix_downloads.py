import os
import re
import base64

pdf_b64 = "JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSCj4+Cj4+CiAgL0NvbnRlbnRzIDUgMCBSCj4+CmVuZG9iagoKNCAwIG9iago8PAogIC9UeXBlIC9Gb250CiAgL1N1YnR5cGUgL1R5cGUxCiAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgo+PgplbmRvYmoKCjUgMCBvYmoKPDwgL0xlbmd0aCA0NCA+PgpzdHJlYW0KQlQKNzAgNTAgVEQKL0YxIDEyIFRmCihTYW1wbGUgUERGKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTAgMDAwMDAgbiAKMDAwMDAwMDA2MCAwMDAwMCBuIAowMDAwMDAwMTQ3IDAwMDAwIG4gCjAwMDAwMDAyNDQgMDAwMDAgbiAKMDAwMDAwMDMzNiAwMDAwMCBuIAp0cmFpbGVyCjw8CiAgL1NpemUgNgogIC9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo0MzEKJSVFT0YK"

filepath = r'c:\Users\vv356\Downloads\LearnSphere-Tutoring-HTML-Template\LearnSphere-Tutoring-HTML-Template\student-subject-details.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract all materials arrays
materials = []
for match in re.finditer(r'materials:\s*\[(.*?)\]', content):
    arr_str = match.group(1)
    items = re.findall(r'"([^"]+)"', arr_str)
    materials.extend(items)

out_dir = r'c:\Users\vv356\Downloads\LearnSphere-Tutoring-HTML-Template\LearnSphere-Tutoring-HTML-Template\assets\materials'
os.makedirs(out_dir, exist_ok=True)

for m in set(materials):
    filename = m.lower().replace(' & ', '-').replace(' ', '-') + '.pdf'
    out_path = os.path.join(out_dir, filename)
    with open(out_path, 'wb') as f:
        f.write(base64.b64decode(pdf_b64))
    print(f"Created {filename}")

# Also replace the button with an anchor tag with download attribute
old_js = r"const matHtml = subject.materials.map(m => `<li style=\"padding:.7rem; border:1px solid var(--border); border-radius:var(--r-sm); display:flex; justify-content:space-between; align-items:center;\"><span><i class=\"fa-solid fa-file-pdf text-danger\" style=\"margin-inline-end:.5rem;\"></i> ${m}</span> <button class=\"btn btn-sm btn-outline\">Download</button></li>`).join('');"

new_js = r"""const matHtml = subject.materials.map(m => {
            const filename = m.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-') + '.pdf';
            return `<li style="padding:.7rem; border:1px solid var(--border); border-radius:var(--r-sm); display:flex; justify-content:space-between; align-items:center;"><span><i class="fa-solid fa-file-pdf text-danger" style="margin-inline-end:.5rem;"></i> ${m}</span> <a href="assets/materials/${filename}" download class="btn btn-sm btn-outline" style="text-decoration:none;">Download</a></li>`;
        }).join('');"""

if old_js in content:
    content = content.replace(old_js, new_js)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated JS in student-subject-details.html")
else:
    print("Could not find the old JS string to replace.")

