# -*- coding: utf-8 -*-
# One-off extractor: pulls the legal text out of the legacy Terms page into data/terms.json.
import re, json, io

SRC = r"f:\Web\cyberhype.io\Terms_of_use_of_the_site\index.html"
OUT = r"f:\Web\cyberhype.io\data\terms.json"

with io.open(SRC, "r", encoding="utf-8-sig") as f:
    html = f.read()

sections = re.findall(r'<section class="terms_container"\s+id="([^"]+)">(.*?)</section>', html, re.S)

out = []
for sid, body in sections:
    tm = re.search(r'<h([23]) class="container__title">(.*?)</h[23]>', body, re.S)
    title = re.sub(r'\s+', ' ', tm.group(2)).strip() if tm else ""
    level = tm.group(1) if tm else "3"
    items = []
    for m in re.finditer(r'<p\b[^>]*>(.*?)</p>|<ul\b[^>]*>(.*?)</ul>', body, re.S):
        if m.group(1) is not None:
            items.append({"type": "p", "html": m.group(1).strip()})
        else:
            lis = re.findall(r'<li\b[^>]*>(.*?)</li>', m.group(2), re.S)
            items.append({"type": "ul", "items": [x.strip() for x in lis]})
    out.append({"id": sid, "level": level, "title": title, "items": items})


def rep(s):
    return s.replace("grimdark.ru", "{{site.domain}}")


for s in out:
    s["title"] = rep(s["title"])
    for it in s["items"]:
        if it["type"] == "p":
            it["html"] = rep(it["html"])
        else:
            it["items"] = [rep(x) for x in it["items"]]

with io.open(OUT, "w", encoding="utf-8") as f:
    json.dump({"sections": out}, f, ensure_ascii=False, indent=2)

print("sections:", len(out))
for s in out:
    print(s["id"], "|", s["title"][:45], "| items:", len(s["items"]))
