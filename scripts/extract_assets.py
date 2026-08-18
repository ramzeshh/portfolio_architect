"""One-off: extract base64 images/font from the original page into files.

Images inside a project card go to content/projects/<slug>/NN.jpg;
images outside cards (hero, about photo) go to src/assets/site/.
Writes reference/index.stripped.html with src pointing at the files,
and reference/asset-manifest.json with what went where.

Note: the source HTML embeds two @font-face blocks for 'Wremena'
(weight 400 and weight 700), both as data:font/woff. They are written
to distinct files (wremena.woff / wremena-bold.woff) instead of one
shared path, so the weight-700 payload does not silently overwrite the
weight-400 one.
"""
import base64, io, json, os, re

SLUGS = ["zhk-baden", "universitet-v-surgute", "zhk-norilskaya",
         "detskiy-sad-belyy-yar", "zhk-pergamont", "zhk-izhevsk"]
SRC = "reference/index.original.html"
html = io.open(SRC, encoding="utf-8").read()

# Split into segments so each data URI knows which project card it is in.
card_spans = [m.start() for m in re.finditer(r'<div class="project pad"', html)]
about_start = html.index('id="about"')

def owner(pos):
    if pos < (card_spans[0] if card_spans else about_start): return "site"
    if pos >= about_start: return "site"
    idx = max(i for i, s in enumerate(card_spans) if s <= pos)
    return SLUGS[idx]

manifest, counters = [], {}
font_seen = [0]
def repl(m):
    kind, b64 = m.group(1), m.group(2)
    pos = m.start()
    own = owner(pos)
    if kind.startswith("font"):
        font_seen[0] += 1
        path = "src/fonts/wremena.woff" if font_seen[0] == 1 else "src/fonts/wremena-bold.woff"
    else:
        n = counters.get(own, 0) + 1; counters[own] = n
        folder = f"content/projects/{own}" if own != "site" else "src/assets/site"
        path = f"{folder}/{n:02d}.jpg"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        f.write(base64.b64decode(b64))
    manifest.append({"path": path, "bytes": os.path.getsize(path)})
    return path  # replaces the whole data URI in the stripped html

out = re.sub(r'data:(image/jpeg|font/woff);base64,([A-Za-z0-9+/=]+)', repl, html)
io.open("reference/index.stripped.html", "w", encoding="utf-8").write(out)
json.dump(manifest, io.open("reference/asset-manifest.json", "w", encoding="utf-8"),
          ensure_ascii=False, indent=1)
imgs = [m for m in manifest if m["path"].endswith(".jpg")]
print("images:", len(imgs), "font:", len(manifest) - len(imgs))
print("oversize (>3MB):", [m for m in imgs if m["bytes"] > 3_000_000])
