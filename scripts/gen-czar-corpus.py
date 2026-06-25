#!/usr/bin/env python3
# Regenerate lib/czarCorpus.js from the markdown corpus (the editable source of truth).
import json, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
txt = (root / 'digital-czar-knowledge-corpus.md').read_text()
out = ('// AUTO-GENERATED from digital-czar-knowledge-corpus.md — do not edit by hand.\n'
       '// Regenerate: python3 scripts/gen-czar-corpus.py\n'
       'export const CZAR_CORPUS = ' + json.dumps(txt) + ';\n')
(root / 'lib' / 'czarCorpus.js').write_text(out)
print('regenerated lib/czarCorpus.js')
