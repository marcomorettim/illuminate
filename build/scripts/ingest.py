#!/usr/bin/env python3
"""Stage 0 — Ingest. docx -> source-model.json. PRESERVE, do not compress.

Walks the document body in order, tracking the heading path, and captures under each
heading the verbatim substantive spans (prose, tables, code) until the next heading.
Every leaf span gets an S-NNN trace id. Emits the complete structured model; the
acceptance test downstream is: sum(span_words) ~= the source's substantive word count.

Usage: python3 ingest.py <source.docx> <out/source-model.json>
"""
import sys, os, json, zipfile, xml.etree.ElementTree as ET

W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
def q(tag): return f'{{{W}}}{tag}'

def para_text(p):
    return ''.join(t.text or '' for t in p.iter(q('t')))

def para_style(p):
    ppr = p.find(q('pPr'))
    if ppr is None: return None
    ps = ppr.find(q('pStyle'))
    return ps.get(q('val')) if ps is not None else None

def table_rows(tbl):
    rows = []
    for tr in tbl.findall(q('tr')):
        cells = [''.join(t.text or '' for t in tc.iter(q('t'))) for tc in tr.findall(q('tc'))]
        rows.append(cells)
    return rows

def main(src, out):
    z = zipfile.ZipFile(src)
    root = ET.fromstring(z.read('word/document.xml').decode('utf-8'))
    body = root.find(q('body'))

    sections, trace_n = [], 0
    cur = None  # the open section
    def new_section(level, heading):
        nonlocal cur, trace_n
        trace_n += 1
        cur = {'trace': f'S-{trace_n:03d}', 'level': level, 'heading': heading.strip(),
               'text': '', 'code': [], 'tables': []}
        sections.append(cur)

    for el in body:
        tag = el.tag
        if tag == q('p'):
            style = para_style(el) or ''
            txt = para_text(el)
            if style.startswith('Heading'):
                new_section(int(style[-1]), txt)
            elif style == 'Title':
                new_section(1, txt)
            elif cur is not None:
                if style == 'SourceCode':
                    if cur['code'] and cur['code'][-1]['_open']:
                        cur['code'][-1]['lines'].append(txt)
                    else:
                        cur['code'].append({'_open': True, 'lines': [txt]})
                else:
                    if txt.strip():
                        cur['text'] += ('\n\n' if cur['text'] else '') + txt.strip()
                    # a blank/non-code para closes an open code block
                    for c in cur['code']:
                        c['_open'] = False
        elif tag == q('tbl') and cur is not None:
            cur['tables'].append(table_rows(el))
            for c in cur['code']:
                c['_open'] = False

    # finalize code blocks + word counts
    total = 0
    for s in sections:
        s['code'] = ['\n'.join(c['lines']) for c in s['code'] if any(l.strip() for l in c['lines'])]
        s['span_words'] = len(s['text'].split())
        total += s['span_words']
        s['has_code'] = len(s['code']) > 0
        s['has_table'] = len(s['tables']) > 0

    model = {'source': os.path.basename(src), 'substantive_words': total,
             'section_count': len(sections), 'sections': sections}
    os.makedirs(os.path.dirname(out), exist_ok=True)
    json.dump(model, open(out, 'w'), indent=2, ensure_ascii=False)
    print(f'[ingest] sections:{len(sections)} substantive_words:{total} '
          f'tables:{sum(s["has_table"] for s in sections)} code:{sum(s["has_code"] for s in sections)} -> {out}')

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
