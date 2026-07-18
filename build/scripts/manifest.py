#!/usr/bin/env python3
"""Stage 2 — Manifest. Turns an argument tree into build-manifest.json.

The tree comes from the LLM architect (agents/architect.md) as <tree.json>; if none is given, a
pure-structural fallback derives the tree from heading LEVELS alone. Either way this script contains
NO document vocabulary — no heading-word regex, no domain keyword lists. It only knows structure and
data shape. For each node it writes:
  word_floor        — round(FRACTION * mapped source words), never zero, proportional.
  required_component — a domain-neutral SHAPE hint (the develop agent's choice overrides it).

Usage: python3 manifest.py <source-model.json> [<tree.json>] <out/build-manifest.json>
"""
import sys, os, json, re

FRACTION = 0.7          # word_floor = 0.7 * source_words (within the 0.6-0.8 band)
MIN_FLOOR = 45          # even a short span must be developed, not stubbed
GT_FLOOR = 120          # the derived-thesis lede is short by design but never a stub
ROLE_LEVEL = {'domain': 2, 'driver': 3, 'mechanism': 4}

# ── domain-NEUTRAL shape hints: classify a section by what its DATA is, never by its words ──
_PERIOD = re.compile(r'\b(fy\s?\d|q[1-4]\b|20\d\d|19\d\d|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|'
                     r'month|year|quarter|week|day|hour|period|wk\d|yr\d)\b', re.I)
def _num(x):
    try: return float(re.sub(r'[^0-9.\-]', '', str(x)))
    except (ValueError, TypeError): return None

def component_hint(sec):
    """A fallback family from pure shape only. The develop agent's judgment is authoritative."""
    if sec.get('has_code'):
        return {'family': 'code', 'lib': 'shiki'}
    tabs = sec.get('tables') or []
    if not tabs:
        return None
    t = tabs[0]
    if len(t) < 2 or not t[0]:
        return {'family': 'faceted-grid', 'lib': 'tanstack'}
    header, rows = t[0], [r for r in t[1:] if r]
    # headers that are mostly time periods + a numeric body → a series over time
    if len(header) >= 2 and sum(1 for h in header[1:] if _PERIOD.search(str(h))) >= 2:
        return {'family': 'time-series', 'lib': 'recharts'}
    # a 2-column [label, value] table that only decreases → a funnel
    if len(header) == 2 and len(rows) >= 3:
        vals = [_num(r[1]) for r in rows if len(r) > 1]
        if len(vals) == len(rows) and all(v is not None for v in vals) \
                and all(vals[i] >= vals[i + 1] for i in range(len(vals) - 1)):
            return {'family': 'funnel', 'lib': 'recharts'}
    # ≥4 rows whose first column is short proper-noun labels → a set of places (map candidate)
    if len(rows) >= 4 and all(len(str(r[0])) <= 24 and str(r[0])[:1].isupper() for r in rows):
        return {'family': 'map', 'lib': 'svg'}
    return {'family': 'faceted-grid', 'lib': 'tanstack'}

def strip_num(h):
    """Generic leading-number strip for the structural fallback (no document words)."""
    h = re.sub(r'^\d+(?:\.\d+)*\s*[—:.-]?\s*', '', h)
    return h.strip()

def short_lever(text):
    """The Beitar mark is a SHORT lever, never a wash (§3.1). Cap the architect's finding to a
    clause; the full finding is kept as prose (finding_full)."""
    if not text:
        return None
    s = re.split(r'(?<=[.!?])\s', text.strip())[0]
    s = re.sub(r'\s*\[?S-\w+\]?', '', s).strip(' .:—-')
    if len(s) > 72:
        s = s[:68].rsplit(' ', 1)[0] + '…'
    return s or None

def floor(words):
    return max(MIN_FLOOR, round(FRACTION * words))

# ── primary path: consume the LLM architect's tree ──
def build_from_tree(model, tree):
    idx = {s['trace']: s for s in model['sections'] if s.get('trace')}
    title = model['sections'][0]['heading'] if model['sections'] else 'Untitled'
    nodes, roots = {}, []

    nodes['GT'] = {
        'id': 'GT', 'level': 1, 'parent': None, 'path': [title], 'title': title,
        'source_span': {'heading': title, 'trace': [model['sections'][0].get('trace')],
                        'text': model['sections'][0].get('text', '')},
        'source_words': GT_FLOOR, 'word_floor': GT_FLOOR,
        'required_component': {'family': 'network', 'lib': 'svg'}, 'children': [],
    }
    order = {r: 0 for r in ROLE_LEVEL}
    for a in tree['nodes']:
        secs = [idx[t] for t in a.get('source_sections', []) if t in idx]
        text = '\n\n'.join(s['text'] for s in secs)
        tables = [tb for s in secs for tb in (s.get('tables') or [])]
        code = [c for s in secs for c in (s.get('code') or [])]
        words = sum(s.get('span_words', 0) for s in secs)
        pseudo = {'heading': a['title'], 'text': text, 'tables': tables, 'code': code,
                  'has_table': bool(tables), 'has_code': bool(code)}
        nid, role = a['id'], a['role']
        nodes[nid] = {
            'id': nid, 'level': ROLE_LEVEL.get(role, 4), 'parent': a.get('parent') or 'GT',
            'title': a['title'], 'path': [],  # filled after all nodes exist
            'source_span': {'heading': a['title'], 'trace': [s['trace'] for s in secs],
                            'text': text, 'tables': tables, 'code': code},
            'source_words': words, 'word_floor': floor(words),
            'required_component': None if role == 'domain' else component_hint(pseudo),
            'children': [],
        }
        if role == 'domain':
            nodes[nid]['finding'] = short_lever(a.get('finding'))   # short Beitar mark
            nodes[nid]['finding_full'] = a.get('finding')           # full reasoning as prose
            roots.append(nid)
    # wire parent→children + paths
    for nid, n in nodes.items():
        if nid == 'GT':
            continue
        p = n['parent'] if n['parent'] in nodes else 'GT'
        n['parent'] = p
        nodes[p]['children'].append(nid)
    def build_path(nid):
        n = nodes[nid]
        n['path'] = (nodes[n['parent']]['path'] if n['parent'] else []) + [n['title'] if nid != 'GT' else title]
    order_ids = ['GT'] + [n['id'] for lvl in (2, 3, 4) for n in nodes.values() if n['level'] == lvl]
    for nid in order_ids:
        build_path(nid)
    return nodes, roots, tree.get('governing_thought', title), tree.get('connective_label', 'How the parts connect')

# ── fallback path: derive the tree from heading LEVELS alone (no words, no regex on content) ──
def build_structural(model):
    secs = model['sections']
    title = secs[0]['heading'] if secs else 'Untitled'
    nodes = {'GT': {'id': 'GT', 'level': 1, 'parent': None, 'path': [title], 'title': title,
                    'source_span': {'heading': title, 'trace': [secs[0].get('trace')], 'text': secs[0].get('text', '')},
                    'source_words': GT_FLOOR, 'word_floor': GT_FLOOR,
                    'required_component': {'family': 'network', 'lib': 'svg'}, 'children': []}}
    roots = []
    rest = secs[1:]
    dom_lvl = min((s['level'] for s in rest), default=2)
    cur_dom = cur_drv = None
    di = 0
    for s in rest:
        lvl, rel = s['level'], s['level'] - dom_lvl
        sp = {'heading': s['heading'], 'trace': [s['trace']], 'text': s['text'],
              'tables': s['tables'], 'code': s['code']}
        pseudo = {**s, 'has_table': bool(s['tables']), 'has_code': bool(s['code'])}
        if rel <= 0:
            di += 1; nid = f'd{di}'; drv_i = mech_i = 0
            nodes[nid] = {'id': nid, 'level': 2, 'parent': 'GT', 'path': [title, strip_num(s['heading'])],
                          'title': s['heading'], 'source_span': sp, 'source_words': s['span_words'],
                          'word_floor': floor(s['span_words']), 'required_component': None,
                          'children': [], 'finding': None}
            roots.append(nid); cur_dom = nid; cur_drv = None
        elif rel == 1 and cur_dom:
            drv_i += 1; nid = f'{cur_dom}.dr{drv_i}'; mech_i = 0
            nodes[nid] = {'id': nid, 'level': 3, 'parent': cur_dom,
                          'path': nodes[cur_dom]['path'] + [strip_num(s['heading'])], 'title': s['heading'],
                          'source_span': sp, 'source_words': s['span_words'], 'word_floor': floor(s['span_words']),
                          'required_component': component_hint(pseudo), 'children': []}
            nodes[cur_dom]['children'].append(nid); cur_drv = nid
        elif cur_drv:
            mech_i += 1; nid = f'{cur_drv}.m{mech_i}'
            nodes[nid] = {'id': nid, 'level': 4, 'parent': cur_drv,
                          'path': nodes[cur_drv]['path'] + [strip_num(s['heading'])], 'title': s['heading'],
                          'source_span': sp, 'source_words': s['span_words'], 'word_floor': floor(s['span_words']),
                          'required_component': component_hint(pseudo), 'children': []}
            nodes[cur_drv]['children'].append(nid)
    return nodes, roots, title, 'How the parts connect'

def main(model_path, out, tree_path=None):
    model = json.load(open(model_path))
    if tree_path and os.path.exists(tree_path):
        nodes, roots, gt_line, connective = build_from_tree(model, json.load(open(tree_path)))
        mode = 'architect'
    else:
        nodes, roots, gt_line, connective = build_structural(model)
        mode = 'structural-fallback'

    manifest = {
        'meta': {'source': model['source'], 'title': nodes['GT']['title'].split('—')[0].strip(),
                 'kicker': '', 'governing_thought': gt_line, 'connective_label': connective,
                 'substantive_words': model['substantive_words']},
        'nodes': nodes, 'roots': roots,
    }
    os.makedirs(os.path.dirname(out), exist_ok=True)
    json.dump(manifest, open(out, 'w'), indent=2, ensure_ascii=False)

    leaves = [n for n in nodes.values() if not n['children'] and n['level'] > 1]
    comps = [n for n in nodes.values() if n['required_component']]
    print(f'[manifest] mode:{mode} nodes:{len(nodes)} domains:{len(roots)} '
          f'drivers:{sum(1 for n in nodes.values() if n["level"]==3)} '
          f'mechanisms:{sum(1 for n in nodes.values() if n["level"]==4)}')
    print(f'[manifest] required_component hints:{len(comps)} | floor-sum:{sum(n["word_floor"] for n in nodes.values())} '
          f'(source substantive:{model["substantive_words"]})')
    if leaves:
        print(f'[manifest] leaf floors: min:{min(n["word_floor"] for n in leaves)} '
              f'max:{max(n["word_floor"] for n in leaves)}')

if __name__ == '__main__':
    args = sys.argv[1:]
    if len(args) == 3:
        main(args[0], args[2], args[1])   # model, tree, out
    else:
        main(args[0], args[1])            # model, out  (structural fallback)
