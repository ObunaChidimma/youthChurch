
from pathlib import Path
from PIL import Image, ImageOps

SRC = Path("images")
DST = Path("images-optimized")
DEFAULT_MAX = 1000                 # longest side in pixels for normal photos
BIG = {"crowd2.jpeg": 1600}        # the hero photo can be larger
QUALITY = 78

before = after = 0
for path in SRC.rglob("*"):
    if not path.is_file():
        continue
    out = DST / path.relative_to(SRC)
    out.parent.mkdir(parents=True, exist_ok=True)
    ext = path.suffix.lower()
    if ext not in (".jpg", ".jpeg", ".png") or path.name.lower() == "logo.jpg":
        out.write_bytes(path.read_bytes())
        continue
    img = ImageOps.exif_transpose(Image.open(path))      # fixes sideways phone photos
    img.thumbnail((BIG.get(path.name, DEFAULT_MAX),) * 2)  # shrink, never stretch
    if ext == ".png":
        img.save(out, optimize=True)
    else:
        img.convert("RGB").save(out, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    before += path.stat().st_size
    after += out.stat().st_size
    print(f"{path.name}: {path.stat().st_size // 1024} KB -> {out.stat().st_size // 1024} KB")

print(f"\nTotal: {before // 1024 // 1024} MB -> {after // 1024 // 1024} MB")