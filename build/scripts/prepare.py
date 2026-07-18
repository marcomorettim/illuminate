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

    # bible = the derived governing thought + the domain list + the source's own front matter (the
    # title section's text), verbatim. No document-word assumptions — structure comes from the manifest.
    front_text = man['nodes']['GT']['source_span'].get('text', '')
    bible = (f"# BIBLE — {man['meta']['title']}\n\n"
             f"GOVERNING THOUGHT (the derived thesis): {man['meta']['governing_thought']}\n\n"
             f"The {len(man['roots'])} domains (roots), in order: "
             + ', '.join(man['nodes'][r]['path'][-1] for r in man['roots']) + "\n\n"
             + "Use this framing consistently. Do not invent numbers; every figure you state must come\n"
             + "from a node's source span and cite its S-NNN trace.\n\n"
             + f"## Source front matter\n\n{front_text}")
    os.makedirs(work, exist_ok=True)
    open(os.path.join(work, 'bible.md'), 'w').write(bible)

    def rec(n):
        sp = n['source_span']
        return {'id': n['id'], 'title': n['title'], 'path': n['path'],
                'trace': sp['trace'][0] if sp.get('trace') else None,
                'word_floor': n['word_floor'], 'source_words': n['source_words'],
                'required_component': n['required_component'],
                'source_text': sp.get('text', ''),
                'has_table': bool(sp.get('tables')), 'has_code': bool(sp.get('code'))}

    # One record per DOMAIN (the dispatch unit): the domain lede + every descendant node (drivers,
    # and mechanisms if the source is 3-level), each with its verbatim span + floor + component.
    # Emitted in the existing driver/mechanisms schema (domain→driver slot, descendants→mechanisms
    # slot) so the serializer needs no change. One agent develops a whole Section.
    ddir = os.path.join(work, 'drivers'); os.makedirs(ddir, exist_ok=True)
    for did in man['roots']:
        d = man['nodes'][did]
        desc = [n for nid, n in man['nodes'].items()
                if n['level'] > 2 and (nid == did or nid.startswith(did + '.'))]
        desc.sort(key=lambda n: (n['level'], n['id']))
        out = {'driver': rec(d), 'domain': d['path'][-1], 'mechanisms': [rec(n) for n in desc]}
        json.dump(out, open(os.path.join(ddir, did + '.json'), 'w'), indent=2, ensure_ascii=False)
    print(f'[prepare] bible + {len(man["roots"])} domain records -> {work}')

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2], sys.argv[3])
