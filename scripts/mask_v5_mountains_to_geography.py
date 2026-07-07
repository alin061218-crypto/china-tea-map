from __future__ import annotations

import json
import math
import random
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps

from generate_mountain_layers_by_geography import ATLAS_BOUNDS, HEIGHT, MOUNTAIN_RANGES, WIDTH, project


OUT = Path("client/src/assets/generated")
CHINA_JSON = Path("client/src/assets/china.json")
SEED = 20260707
MASK_SCALE = 4


LAYER_SOURCES = [
    ("map-mountains-layer-1-farthest-v5.png", "map-mountains-layer-1-farthest-v9.png", 1, 330, 110, 0.2),
    ("map-mountains-layer-2-mid-far-v5.png", "map-mountains-layer-2-mid-far-v9.png", 2, 280, 86, 0.12),
    ("map-mountains-layer-3-mid-near-v5.png", "map-mountains-layer-3-mid-near-v9.png", 3, 220, 56, 0.04),
    ("map-mountains-layer-4-near-gold-v5.png", "map-mountains-layer-4-near-gold-v9.png", 4, 180, 38, 0.02),
]


def resample(points: list[tuple[float, float]], max_dist: float = 44) -> list[tuple[float, float]]:
    out = [points[0]]
    for start, end in zip(points, points[1:]):
        dx = end[0] - start[0]
        dy = end[1] - start[1]
        distance = max(1, math.hypot(dx, dy))
        steps = max(1, int(distance / max_dist))
        for i in range(1, steps + 1):
            t = i / steps
            out.append((start[0] + dx * t, start[1] + dy * t))
    return out


def projected_range_points(points: tuple[tuple[float, float], ...], rng: random.Random) -> list[tuple[float, float]]:
    raw = [project(point) for point in points]
    sampled = resample(raw, 38)
    out = []
    for index, (x, y) in enumerate(sampled):
        wobble = math.sin(index * 0.77 + rng.uniform(-0.08, 0.08)) * rng.uniform(8, 24)
        if 0 < index < len(sampled) - 1:
            dx = sampled[index + 1][0] - sampled[index - 1][0]
            dy = sampled[index + 1][1] - sampled[index - 1][1]
            distance = max(1, math.hypot(dx, dy))
            nx, ny = -dy / distance, dx / distance
            out.append((x + nx * wobble, y + ny * wobble))
        else:
            out.append((x, y))
    return out


def iter_geo_rings(geometry: dict):
    if geometry["type"] == "Polygon":
        yield from geometry["coordinates"]
    elif geometry["type"] == "MultiPolygon":
        for polygon in geometry["coordinates"]:
            yield from polygon


_CHINA_MASK_CACHE: Image.Image | None = None


def project_small(point: tuple[float, float]) -> tuple[float, float]:
    x, y = project(point)
    return x / MASK_SCALE, y / MASK_SCALE


def china_soft_mask(expand: int = 230, blur: int = 72) -> Image.Image:
    global _CHINA_MASK_CACHE
    if _CHINA_MASK_CACHE is not None:
        return _CHINA_MASK_CACHE

    with CHINA_JSON.open(encoding="utf-8") as file:
        data = json.load(file)
    small_size = (WIDTH // MASK_SCALE, HEIGHT // MASK_SCALE)
    land = Image.new("L", small_size, 0)
    draw = ImageDraw.Draw(land)
    for feature in data["features"]:
        for ring in iter_geo_rings(feature["geometry"]):
            points = [project_small((float(lon), float(lat))) for lon, lat in ring]
            if len(points) >= 3:
                draw.polygon(points, fill=255)
    size = max(3, (expand // MASK_SCALE) // 8 * 2 + 1)
    for _ in range(3):
        land = land.filter(ImageFilter.MaxFilter(size))
    land = land.filter(ImageFilter.GaussianBlur(max(1, blur // MASK_SCALE)))
    _CHINA_MASK_CACHE = land.resize((WIDTH, HEIGHT), Image.Resampling.BICUBIC)
    return _CHINA_MASK_CACHE


def mountain_area_mask(layer_index: int, width_scale: int, blur: int, ambient: float, rng: random.Random) -> Image.Image:
    small_size = (WIDTH // MASK_SCALE, HEIGHT // MASK_SCALE)
    mask = Image.new("L", small_size, int(255 * ambient))
    ink = Image.new("L", small_size, 0)
    draw = ImageDraw.Draw(ink)
    for mountain in MOUNTAIN_RANGES:
        if layer_index not in mountain.layers:
            continue
        points = [(x / MASK_SCALE, y / MASK_SCALE) for x, y in projected_range_points(mountain.points, rng)]
        band_width = int(width_scale * mountain.weight * (1.25 if layer_index <= 2 else 1.0) / MASK_SCALE)
        band_width = max(36, band_width)
        draw.line(points, fill=210, width=band_width, joint="curve")

        for x, y in points[:: max(2, int(7 - layer_index))]:
            rx = band_width * rng.uniform(0.45, 1.15)
            ry = band_width * rng.uniform(0.22, 0.62)
            dx = rng.uniform(-band_width * 0.45, band_width * 0.45)
            dy = rng.uniform(-band_width * 0.32, band_width * 0.32)
            draw.ellipse((x + dx - rx, y + dy - ry, x + dx + rx, y + dy + ry), fill=rng.randint(120, 230))

    ink = ink.filter(ImageFilter.GaussianBlur(max(1, blur // MASK_SCALE)))
    noise = Image.effect_noise(small_size, 58).convert("L")
    noise = ImageOps.autocontrast(noise).point(lambda value: int(150 + value * 105 / 255))
    ink = ImageChops.multiply(ink, noise)
    country = china_soft_mask().resize(small_size, Image.Resampling.BICUBIC)
    ink = ImageChops.multiply(ink, country)
    result = Image.composite(Image.new("L", small_size, 255), mask, ink)
    return result.resize((WIDTH, HEIGHT), Image.Resampling.BICUBIC)


def apply_mask(src_name: str, out_name: str, layer_index: int, width_scale: int, blur: int, ambient: float, rng: random.Random) -> Image.Image:
    src = Image.open(OUT / src_name).convert("RGBA")
    mask = mountain_area_mask(layer_index, width_scale, blur, ambient, rng)
    alpha = ImageChops.multiply(src.getchannel("A"), mask)
    src.putalpha(alpha)
    src.save(OUT / out_name)
    final_name = out_name.replace("-v9", "")
    src.save(OUT / final_name)
    return src


def make_preview(layers: list[Image.Image]) -> None:
    paper = Image.new("RGBA", (WIDTH, HEIGHT), (240, 232, 220, 255))
    noise = Image.effect_noise((WIDTH, HEIGHT), 28).convert("L")
    tint = ImageOps.colorize(noise, "#e7ded2", "#f5eee4").convert("RGBA")
    preview = Image.blend(paper, tint, 0.24)
    for layer in layers:
        preview.alpha_composite(layer)
    preview.save(OUT / "map-mountains-layer-1-2-3-4-stack-preview-on-paper-v9.png")
    preview.save(OUT / "map-mountains-layer-1-2-3-4-stack-preview-on-paper.png")
    small = preview.resize((1820, 1365), Image.Resampling.LANCZOS)
    small.save(OUT / "map-mountains-layer-1-2-3-4-stack-preview-on-paper-v9-small.png")
    small.save(OUT / "map-mountains-layer-1-2-3-4-stack-preview-on-paper-small.png")


def make_debug_overlay() -> None:
    preview = Image.open(OUT / "map-mountains-layer-1-2-3-4-stack-preview-on-paper-v9.png").convert("RGBA")
    with CHINA_JSON.open(encoding="utf-8") as file:
        data = json.load(file)
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for feature in data["features"]:
        for ring in iter_geo_rings(feature["geometry"]):
            points = [project((float(lon), float(lat))) for lon, lat in ring]
            if len(points) > 1:
                draw.line(points + [points[0]], fill=(178, 48, 42, 210), width=5)
    result = Image.alpha_composite(preview, overlay)
    result.save(OUT / "debug-mountains-v5-art-geographic-v9-overlay.png")
    result.resize((1820, 1365), Image.Resampling.LANCZOS).save(
        OUT / "debug-mountains-v5-art-geographic-v9-overlay-small.png"
    )


def main() -> None:
    rng = random.Random(SEED)
    layers = [apply_mask(*settings, rng) for settings in LAYER_SOURCES]
    make_preview(layers)
    make_debug_overlay()
    print("wrote v9 geographic v5-art mountain layers")


if __name__ == "__main__":
    main()
