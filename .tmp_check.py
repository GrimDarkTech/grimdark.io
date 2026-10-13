# -*- coding: utf-8 -*-
import re, os, io, glob, json

ROOT = r"f:\Web\cyberhype.io"
pages = [
    ("index.html", ""),
    ("More_information/index.html", "../"),
    ("Tariff/index.html", "../"),
    ("Terms_of_use_of_the_site/index.html", "../"),
]

problems = []


def check_ref(label, base_dir, ref, kind):
    if not ref:
        return
    if re.match(r'^(https?:|mailto:|tel:|#|data:|javascript:)', ref):
        return
    if '{{' in ref or '}}' in ref:
        return
    ref = ref.split('#')[0].split('?')[0]
    if not ref:
        return
    target = os.path.normpath(os.path.join(base_dir, ref))
    if not os.path.exists(target):
        problems.append("%s [%s] -> %s" % (label, kind, ref))


for page, root in pages:
    full = os.path.join(ROOT, page)
    html = io.open(full, encoding='utf-8').read()
    html = html.replace('{{root}}', root)
    base = os.path.dirname(full)
    for m in re.finditer(r'(?:src|href)\s*=\s*"([^"]*)"', html):
        check_ref(page, base, m.group(1), 'html')
    for m in re.finditer(r'url\(\s*["\']?([^"\')]+)["\']?\s*\)', html):
        check_ref(page, base, m.group(1), 'inline-css')

for css in glob.glob(os.path.join(ROOT, '**', '*.css'), recursive=True):
    content = io.open(css, encoding='utf-8').read()
    base = os.path.dirname(css)
    rel = os.path.relpath(css, ROOT)
    for m in re.finditer(r'url\(\s*["\']?([^"\')]+)["\']?\s*\)', content):
        check_ref(rel, base, m.group(1), 'css')

print("=== ASSET LINK CHECK ===")
print("problems:", len(problems))
for p in problems:
    print(" -", p)

print("=== JSON VALIDATION ===")
for jf in sorted(glob.glob(os.path.join(ROOT, 'data', '*.json'))):
    try:
        data = json.load(io.open(jf, encoding='utf-8'))
        print(" ok:", os.path.basename(jf), "->", type(data).__name__,
              ("keys=" + ",".join(list(data.keys()))) if isinstance(data, dict) else ("len=" + str(len(data))))
    except Exception as e:
        print(" FAIL:", os.path.basename(jf), e)

print("=== STALE REFS (should be none) ===")
for pat in ['js/script.js', '../fonts/', '../images/', 'More_information/js', 'Tariff/js']:
    hits = []
    for f in glob.glob(os.path.join(ROOT, '**', '*.*'), recursive=True):
        if f.endswith(('.html', '.css', '.js', '.json')):
            try:
                c = io.open(f, encoding='utf-8').read()
            except Exception:
                continue
            if pat in c and 'data' not in f:
                hits.append(os.path.relpath(f, ROOT))
    print(" ", pat, "->", hits if hits else "none")
