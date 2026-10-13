# -*- coding: utf-8 -*-
import os, io, glob

d = os.environ.get('TEMP')
files = ['dom_index.html', 'dom_More_information_index.html',
         'dom_Tariff_index.html', 'dom_Terms_of_use_of_the_site_index.html']
markers = {
    'dom_index.html': ['Особенности продукта', 'Гримдарк', 'Почему РСМА?', 'RSMA',
                       '3D-модели', 'Документация', 'Подробнее', '© 2022-2023'],
    'dom_More_information_index.html': ['3D-модели', 'ускоряет опыты', 'Комбинирование',
                                        '<li>', 'gallery_adaption'],
    'dom_Tariff_index.html': ['Характеристики', '85 000 руб', '148 750 руб', 'Покупка',
                              'Заявка на приобретение', 'Отправить'],
    'dom_Terms_of_use_of_the_site_index.html': ['Правила пользования сайтом', 'grimdark.ru',
                                                '1.1.', 'Администратор сайта'],
}

for f in files:
    path = os.path.join(d, f)
    if not os.path.exists(path):
        print(f, '-> MISSING FILE')
        continue
    c = io.open(path, encoding='utf-8', errors='replace').read()
    ok = []
    bad = []
    for m in markers[f]:
        (ok if m in c else bad).append(m)
    print('===', f, 'len=', len(c), 'tokens=', c.count('{{'))
    print('   OK  :', ', '.join(ok) if ok else '-')
    print('   MISS:', ', '.join(bad) if bad else '-')
