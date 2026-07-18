#!/usr/bin/env python3
"""Prep for Stage 3 — emit the shared bible + one input record per driver.

The bible is the source's spine (verbatim front matter + a figure sheet) so N parallel agents
stay coherent without seeing each other's output. Each driver record carries that driver's and
its mechanisms' verbatim source spans + their manifest floors + required components — one agent's
whole ambition. Writes .work/bible.md and .work/drivers/<id>.json.

Usage: python3 prepare.py <source-model.json> <build-manifest.json> <workdir>
"""
import sys, os, json

def main(model_path, manifest_path, work):
    model = json.load(open(model_path))
    man = json.load(open(manifest_path))
    secs = {s['heading']: s for s in model['sections']}

    # bible = title + the front-matter sections (answer / SCQA / spine / how-to-read), verbatim
    front = []
    for s in model['sections']:
        if s['heading'].startswith('Domain '):
            break
        if s['level'] in (1, 2, 3) and s['text'].strip():
            front.append(f"## {s['heading']}\n\n{s['text']}")
    bible = (f"# BIBLE — {man['meta']['title']}\n\n"
             f"GOVERNING THOUGHT: {man['meta']['governing_thought']}\n\n"
             f"The six domains (roots), in order: "
             + ', '.join(man['nodes'][r]['path'][-1] for r in man['roots']) + "\n\n"
             + "Use these figures and this framing consistently. Do not invent numbers; every\n"
             + "figure you state must come from a node's source span and cite its S-NNN trace.\n\n"
             + "\n\n".join(front))
    os.makedirs(work, exist_ok=True)
    open(os.path.join(work, 'bible.md'), 'w').write(bible)

    # one record per driver: the driver + its mechanisms, each with span text + floor + component
    ddir = os.path.join(work, 'drivers'); os.makedirs(ddir, exist_ok=True)
    drivers = [n for n in man['nodes'].values() if n['level'] == 3]
    for d in drivers:
        mechs = [man['nodes'][mid] for mid in d['children']]
        def rec(n):
            sp = n['source_span']
            return {'id': n['id'], 'title': n['title'], 'path': n['path'],
                    'trace': sp['trace'][0] if sp.get('trace') else None,
                    'word_floor': n['word_floor'], 'source_words': n['source_words'],
                    'required_component': n['required_component'],
                    'source_text': sp.get('text', ''),
                    'has_table': bool(sp.get('tables')), 'has_code': bool(sp.get('code'))}
        out = {'driver': rec(d), 'domain': man['nodes'][d['parent']]['path'][-1],
               'mechanisms': [rec(m) for m in mechs]}
        json.dump(out, open(os.path.join(ddir, d['id'] + '.json'), 'w'), indent=2, ensure_ascii=False)
    print(f'[prepare] bible + {len(drivers)} driver records -> {work}')

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2], sys.argv[3])
