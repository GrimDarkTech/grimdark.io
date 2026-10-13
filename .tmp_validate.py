# -*- coding: utf-8 -*-
# Validates that every {{site.*}}/{{page.*}} token and every data-repeat/data-if/data-html
# path actually resolves in the JSON data. Also checks loop variable names (data-as).
import re, os, io, json

ROOT = r"f:\Web\cyberhype.io"
pages = [
    ("index.html", "home"),
    ("More_information/index.html", "about"),
    ("Tariff/index.html", "tariffs"),
    ("Terms_of_use_of_the_site/index.html", "terms"),
]

def load(name):
    return json.load(io.open(os.path.join(ROOT, 'data', name), encoding='utf-8'))

def resolve(data, path):
    cur = data
    for part in path.split('.'):
        if isinstance(cur, list):
            if not part.isdigit() or int(part) >= len(cur):
                return (False, None)
            cur = cur[int(part)]
        elif isinstance(cur, dict):
            if part not in cur:
                return (False, None)
            cur = cur[part]
        else:
            return (False, None)
    return (True, cur)

problems = []

for page, key in pages:
    html = io.open(os.path.join(ROOT, page), encoding='utf-8').read()
    ctx = {'site': load('site.json'), 'page': load(key + '.json')}

    loop_vars = set(re.findall(r'data-as="([^"]+)"', html))
    loop_vars.add('root')

    # 1) tokens
    for m in re.finditer(r'\{\{\s*([\w.]+)\s*\}\}', html):
        path = m.group(1)
        root_var = path.split('.')[0]
        if root_var in ('site', 'page'):
            ok, _ = resolve(ctx[root_var], path.split('.', 1)[1] if '.' in path else '')
            if not ok:
                problems.append("%s: token {{%s}} not found" % (page, path))
        elif root_var not in loop_vars:
            problems.append("%s: token {{%s}} uses unknown variable" % (page, path))

    # 2) data-repeat / data-html / data-if
    for attr in ('data-repeat', 'data-html'):
        for m in re.finditer(attr + r'="([^"]+)"', html):
            path = m.group(1).strip()
            root_var = path.split('.')[0]
            if root_var in ('site', 'page'):
                ok, _ = resolve(ctx[root_var], path.split('.', 1)[1] if '.' in path else '')
                if not ok:
                    problems.append("%s: %s=\"%s\" not found" % (page, attr, path))
            elif root_var not in loop_vars:
                problems.append("%s: %s=\"%s\" unknown variable" % (page, attr, path))

    for m in re.finditer(r'data-if="([^"]+)"', html):
        expr = m.group(1)
        for ident in re.findall(r'[A-Za-z_][\w.]*', expr):
            root_var = ident.split('.')[0]
            if root_var in ('site', 'page'):
                ok, _ = resolve(ctx[root_var], ident.split('.', 1)[1] if '.' in ident else '')
                if not ok:
                    problems.append("%s: data-if \"%s\" path %s not found" % (page, expr, ident))
            elif root_var not in loop_vars:
                problems.append("%s: data-if \"%s\" unknown variable %s" % (page, expr, root_var))

print("=== TEMPLATE / DATA CONTRACT ===")
print("problems:", len(problems))
for p in problems:
    print(" -", p)

# 3) sanity: counts
print("=== COUNTS ===")
print("site.nav:", len(load('site.json')['nav']))
print("site.socials:", len(load('site.json')['socials']))
print("home features:", len(load('home.json')['features']['items']))
print("home tariff rows:", len(load('home.json')['tariff']['rows']))
print("about sections:", len(load('about.json')['sections']))
print("gallery images:", len(load('about.json')['gallery']['images']))
print("tariff tiers:", [t['id'] + '=' + str(len(t['rows'])) for t in load('tariffs.json')['tiers']])
print("terms sections:", len(load('terms.json')['sections']))
