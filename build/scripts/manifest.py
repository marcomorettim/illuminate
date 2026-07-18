#!/usr/bin/env python3
"""Stages 1-2 — Decompose & manifest. source-model.json -> build-manifest.json.

Walks the ingested sections into the argument tree the laws require:
  GT (L1) -> domain (L2) -> driver (L3) -> mechanism (L4).
Every leaf maps to exactly one node with a known parent (this IS the drill-down tree).
For each node it writes the manifest record with the two load-bearing fields:
  word_floor        — a per-node minimum = round(FRACTION * source_words), never zero, proportional.
  required_component — the component family this node must render, from its own evidence surface.

Completeness stops being a mid-pass decision: it is a number in this file, written before any prose.

Usage: python3 manifest.py <source-model.json> <out/build-manifest.json>
"""
import sys, os, json, re

FRACTION = 0.7          # word_floor = 0.7 * source_words (within the 0.6-0.8 band)
MIN_FLOOR = 45          # even a short span must be developed, not stubbed

def kw(text, *words):
    t = text.lower()
    return any(w in t for w in words)

def component_for(sec):
    """The section's hero visual, chosen by INTENT (heading) first, generic artifacts last."""
    head = sec['heading'].lower()
    blob = (sec['heading'] + ' ' + sec['text'][:300]).lower()
    # 1) strong specific structural signals — win over everything
    if 'two-sided' in blob and 'funnel' in blob: return {'family': 'two-sided-funnel', 'lib': 'recharts'}
    if 'waterfall' in blob or ('bridge' in blob and '→' in sec['text'][:400]): return {'family': 'waterfall', 'lib': 'recharts'}
    # 2) heading-semantic families — WIN even when the span also has a table or code
    if (' map' in head or head.startswith('map') or
            kw(head, 'fleet', 'geograph', 'zones', 'siting', 'supply chain', 'supply-chain',
               'charging network', 'footprint', 'catchment', 'territor')):
        return {'family': 'map', 'lib': 'svg'}
    if (kw(head, 'sankey', 'data flow', 'data-flow', 'water balance') or
            (kw(head, 'flow', 'flows') and kw(head, 'data', 'water', 'energy', 'material', 'fund'))):
        return {'family': 'sankey', 'lib': 'svg'}
    if kw(head, 'timeline', 'incident', 'time-series', 'load curve', 'utilization', 'utilisation',
          'trajectory', 'curve', 'retention', 'cohort', 'seasonal', 'over time', 'ramp'):
        return {'family': 'time-series', 'lib': 'recharts'}
    if kw(head, 'scenario', 'bull', 'bear', 'base case', 'tree'):
        return {'family': 'scenario-tree', 'lib': 'svg'}
    if kw(head, 'funnel', 'drop-off', 'conversion'):
        return {'family': 'funnel', 'lib': 'recharts'}
    if kw(blob, 'push notification', 'lock screen', 'in-app', 'sms', 'mockup', 'notification',
          'statement', 'app screen', 'the offer', 'job-offer', 'card mock'):
        return {'family': 'mockup', 'lib': 'html'}
    if kw(head, 'kpi', 'headline metrics', 'scorecard'):
        return {'family': 'kpi-summary', 'lib': 'html'}
    # 3) generic fallbacks — LAST resort, only when nothing semantic matched
    if sec['has_code']:  return {'family': 'code', 'lib': 'shiki'}
    if sec['has_table']: return {'family': 'faceted-grid', 'lib': 'tanstack'}
    return None

def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')[:40]

def dnum(heading):
    m = re.match(r'Domain (\d+)', heading)
    return int(m.group(1)) if m else None

def main(model_path, out):
    model = json.load(open(model_path))
    secs = model['sections']
    nodes, roots = {}, []
    order = 0

    # GT: title + the front-matter "answer / SCQA / spine" sections (everything before Domain 1)
    title = next((s['heading'] for s in secs if s['level'] == 1), 'Untitled')
    subtitle = next((s['heading'] for s in secs if s['level'] == 3), '')
    gt_secs, i = [], 0
    while i < len(secs) and dnum(secs[i]['heading']) is None:
        if secs[i]['level'] in (2, 3) and secs[i]['span_words'] > 0:
            gt_secs.append(secs[i])
        i += 1
    answer = next((s for s in gt_secs if kw(s['heading'], 'answer')), None)
    # the GT lede shown is the "answer" span, so its floor is proportional to THAT span
    gt_words = answer['span_words'] if answer else sum(s['span_words'] for s in gt_secs)
    gt_line = (answer['text'].split('.')[0] + '.') if answer else title
    nodes['GT'] = {
        'id': 'GT', 'level': 1, 'parent': None, 'path': [title], 'title': title,
        'source_span': {'heading': title, 'trace': [s['trace'] for s in gt_secs]},
        'source_words': gt_words, 'word_floor': max(MIN_FLOOR, round(FRACTION * gt_words)),
        'required_component': {'family': 'network', 'lib': 'visx'}, 'children': [],
    }

    # domains -> drivers -> mechanisms
    cur_domain = cur_driver = None
    for s in secs:
        lvl, h = s['level'], s['heading']
        if lvl == 2 and dnum(h) is not None:
            did = f'D{dnum(h)}'
            name = re.sub(r'^Domain \d+\s*[—-]\s*', '', h).split(':')[0].strip()
            nodes[did] = {
                'id': did, 'level': 2, 'parent': 'GT', 'path': [title, name], 'title': h,
                'source_span': {'heading': h, 'trace': [s['trace']]},
                'source_words': s['span_words'], 'word_floor': max(MIN_FLOOR, round(FRACTION * s['span_words'])),
                'required_component': None, 'children': [], 'finding': None,
            }
            roots.append(did); cur_domain = did; cur_driver = None; order = 0
        elif lvl in (2, 3) and kw(h, "what's true", 'what counts') and cur_domain:
            # the domain's synthesis section — its finding, not a 5th driver (source levels vary).
            # The full text is developed as prose; the Beitar MARK is a short lever (never a wash, §3.1).
            full = s['text']
            low = full.lower()
            tail = full[low.rindex('what counts') + 11:] if 'what counts' in low else full
            lever = ''
            for x in re.split(r'(?<=[.!?])\s', tail):
                x = re.sub(r'\s*\[?S-\w+\]?', '', x).strip(' .:—-')
                x = re.sub(r'^(is that|is|that|the)\s+', '', x, flags=re.I).strip()
                if len(x) > 12:
                    lever = x[0].upper() + x[1:]; break
            if len(lever) > 64:
                lever = lever[:60].rsplit(' ', 1)[0] + '…'
            nodes[cur_domain]['finding'] = lever or None
            nodes[cur_domain]['finding_full'] = full[:600]
        elif lvl == 3 and cur_domain:
            order += 1
            drid = f'{cur_domain}.d{order}'
            comp = component_for(s)
            nodes[drid] = {
                'id': drid, 'level': 3, 'parent': cur_domain,
                'path': nodes[cur_domain]['path'] + [re.sub(r'^Driver \d+\s*[—-]\s*', '', h)], 'title': h,
                'source_span': {'heading': h, 'trace': [s['trace']]},
                'source_words': s['span_words'], 'word_floor': max(MIN_FLOOR, round(FRACTION * s['span_words'])),
                'required_component': comp, 'children': [], 'mech_n': 0,
            }
            nodes[cur_domain]['children'].append(drid); cur_driver = drid
        elif lvl == 4 and cur_driver:
            nodes[cur_driver]['mech_n'] += 1
            mid = f'{cur_driver}.m{nodes[cur_driver]["mech_n"]}'
            nodes[mid] = {
                'id': mid, 'level': 4, 'parent': cur_driver,
                'path': nodes[cur_driver]['path'] + [re.sub(r'^Mechanism [\d.]+\s*[—-]\s*', '', h)], 'title': h,
                'source_span': {'heading': h, 'trace': [s['trace']],
                                'text': s['text'], 'tables': s['tables'], 'code': s['code']},
                'source_words': s['span_words'], 'word_floor': max(MIN_FLOOR, round(FRACTION * s['span_words'])),
                'required_component': component_for(s), 'children': [],
            }
            nodes[cur_driver]['children'].append(mid)

    # attach the verbatim source text to drivers/domains too (agents need it; keep it out of GT to stay lean)
    heading_to_sec = {s['heading']: s for s in secs}
    for n in nodes.values():
        if n['level'] in (2, 3):
            sec = heading_to_sec.get(n['title'])
            if sec:
                n['source_span']['text'] = sec['text']
                n['source_span']['tables'] = sec['tables']
                n['source_span']['code'] = sec['code']

    # dedup: a driver drops a bespoke component that one of its own mechanisms already owns
    # (e.g. "The energy-transition scenario" driver vs its scenario mechanism — the mechanism owns it)
    for n in nodes.values():
        if n['level'] == 3 and n['required_component'] and n['required_component']['family'] not in ('code', 'faceted-grid'):
            fam = n['required_component']['family']
            if any(nodes[c]['required_component'] and nodes[c]['required_component']['family'] == fam for c in n['children']):
                n['required_component'] = None

    manifest = {
        'meta': {'source': model['source'], 'title': title.split('—')[0].strip(),
                 'kicker': subtitle, 'governing_thought': gt_line,
                 'substantive_words': model['substantive_words']},
        'nodes': nodes, 'roots': roots,
    }
    os.makedirs(os.path.dirname(out), exist_ok=True)
    json.dump(manifest, open(out, 'w'), indent=2, ensure_ascii=False)

    leaves = [n for n in nodes.values() if n['level'] == 4]
    comps = [n for n in nodes.values() if n['required_component']]
    print(f'[manifest] nodes:{len(nodes)} domains:{len(roots)} drivers:{sum(1 for n in nodes.values() if n["level"]==3)} '
          f'mechanisms:{len(leaves)}')
    print(f'[manifest] required_component nodes:{len(comps)} | floor-sum:{sum(n["word_floor"] for n in nodes.values())} '
          f'(source substantive:{model["substantive_words"]})')
    print(f'[manifest] leaf floors: min:{min(n["word_floor"] for n in leaves)} '
          f'max:{max(n["word_floor"] for n in leaves)} (never zero: {all(n["word_floor"]>0 for n in nodes.values())})')

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
