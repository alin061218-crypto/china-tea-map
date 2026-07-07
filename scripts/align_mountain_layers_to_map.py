from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


WIDTH = 4096
HEIGHT = 3072
ASSET_DIR = Path("client/src/assets/generated")
CHINA_JSON = Path("client/src/assets/china.json")
ATLAS_BOUNDS = {"minLon": 55, "maxLon": 150, "minLat": 0, "maxLat": 60}


LAYER_SETTINGS = [
    ("map-mountains-layer-1-farthest.png", "map-mountains-layer-1-farthest-v6.png", 330, 110, 0.28),
    ("map-mountains-layer-2-mid-far.png", "map-mountains-layer-2-mid-far-v6.png", 250, 82, 0.18),
    ("map-mountains-layer-3-mid-near.png", "map-mountains-layer-3-mid-near-v6.png", 170, 56, 0.1),
    ("map-mountains-layer-4-near-gold.png", "map-mountains-layer-4-near-gold-v6.png", 120, 34, 0.04),
]


def project(point: list[float]) -> tuple[float, float]:
    lon, lat = point
    x = (lon - ATLAS_BOUNDS["minLon"]) / (ATLAS_BOUNDS["maxLon"] - ATLAS_BOUNDS["minLon"]) * WIDTH
    y = (ATLAS_BOUNDS["maxLat"] - lat) / (ATLAS_BOUNDS["maxLat"] - ATLAS_BOUNDS["minLat"]) * HEIGHT
    return x, y


def iter_rings(geometry: dict):
    if geometry["type"] == "Polygon":
        yield from geometry["coordinates"]
    elif geometry["type"] == "MultiPolygon":
        for polygon in geometry["coordinates"]:
            yield from polygon


def make_china_mask(expand: int, blur: int, ambient: float) -> Image.Image:
    with CHINA_JSON.open(encoding="utf-8") as f:
        data = json.load(f)

    mask = Image.new("L", (WIDTH, HEIGHT), int(255 * ambient))
    land = Image.new("L", (WIDTH, HEIGHT), 0)
    draw = ImageDraw.Draw(land)
    for feature in data["features"]:
        for ring in iter_rings(feature["geometry"]):
            points = [project(point) for point in ring]
            if len(points) >= 3:
                draw.polygon(points, fill=255)

    if expand > 0:
        # MaxFilter approximates a cartographic buffer without adding geometry deps.
        radius = max(3, expand // 18 * 2 + 1)
        for _ in range(max(1, expand // 42)):
            land = land.filter(ImageFilter.MaxFilter(radius))
    if blur > 0:
        land = land.filter(ImageFilter.GaussianBlur(blur))

    mask = Image.composite(Image.new("L", (WIDTH, HEIGHT), 255), mask, land)
    return mask


def apply_alignment(src_name: str, out_name: str, expand: int, blur: int, ambient: float) -> Image.Image:
    layer = Image.open(ASSET_DIR / src_name).convert("RGBA")
    mask = make_china_mask(expand, blur, ambient)
    alpha = layer.getchannel("A")
    alpha = Image.composite(alpha, Image.new("L", (WIDTH, HEIGHT), 0), mask)
    layer.putalpha(alpha)
    layer.save(ASSET_DIR / out_name)
    return layer


def paper_preview(layers: list[Image.Image]) -> None:
    paper = Image.new("RGBA", (WIDTH, HEIGHT), (240, 232, 220, 255))
    for layer in layers:
        paper.alpha_composite(layer)
    paper.save(ASSET_DIR / "map-mountains-layer-1-2-3-4-stack-preview-on-paper-v6.png")
    paper.resize((1820, 1365), Image.Resampling.LANCZOS).save(
        ASSET_DIR / "map-mountains-layer-1-2-3-4-stack-preview-on-paper-v6-small.png"
    )


def debug_overlay() -> None:
    preview = Image.open(ASSET_DIR / "map-mountains-layer-1-2-3-4-stack-preview-on-paper-v6.png").convert("RGBA")
    with CHINA_JSON.open(encoding="utf-8") as f:
        data = json.load(f)
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for feature in data["features"]:
        for ring in iter_rings(feature["geometry"]):
            points = [project(point) for point in ring]
            if len(points) > 1:
                draw.line(points + [points[0]], fill=(180, 45, 40, 210), width=5)
    result = Image.alpha_composite(preview, overlay)
    result.save(ASSET_DIR / "debug-mountains-map-aligned-v6-overlay.png")
    result.resize((1820, 1365), Image.Resampling.LANCZOS).save(
        ASSET_DIR / "debug-mountains-map-aligned-v6-overlay-small.png"
    )


def main() -> None:
    layers = [apply_alignment(*settings) for settings in LAYER_SETTINGS]
    paper_preview(layers)
    debug_overlay()
    for _, out_name, *_ in LAYER_SETTINGS:
        print(f"wrote {ASSET_DIR / out_name}")
    print("wrote v6 preview and debug overlay")


if __name__ == "__main__":
    main()
