# -*- coding: utf-8 -*-
import os, io

c = io.open(os.path.join(os.environ['TEMP'], 'dom_index.html'), encoding='utf-8', errors='replace').read()

for needle in ['Почему', '2026', 'why', 'about_rsma']:
    i = c.find(needle)
    print('--- find', repr(needle), 'at', i)
    if i != -1:
        print(repr(c[max(0, i - 120):i + 160]))
