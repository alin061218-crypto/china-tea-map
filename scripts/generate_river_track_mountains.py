from __future__ import annotations

import json
import math
import random
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps

from generate_mountain_layers_by_geography import HEIGHT, WIDTH, project, textured_alpha


OUT = Path("client/src/assets/generated")
CHINA_JSON = Path("client/src/assets/china.json")
SEED = 20260707
MASK_SCALE = 4


TRACKS = [
    ((93.0, 33.2), (96.0, 31.8), (99.5, 30.5), (103.0, 29.5), (106.0, 30.0), (109.0, 30.7), (112.0, 30.3), (115.0, 30.8), (118.0, 31.6), (121.0, 31.4)),
    ((96.0, 35.1), (100.0, 35.8), (104.0, 36.8), (108.0, 37.6), (111.0, 36.4), (114.0, 35.2), (117.0, 34.5), (119.0, 36.7)),
    ((104.5, 24.5), (107.0, 24.0), (109.5, 23.5), (112.0, 22.9), (114.0, 22.4)),
    ((113.0, 32.4), (115.2, 32.8), (117.5, 33.0), (120.0, 33.0)),
    ((124.0, 44.6), (126.5, 45.3), (129.0, 46.5), (132.0, 47.8), (134.0, 48.0)),
]

SOURCE_SHIFTS = {
    0: ((700, -40, 0.68), (1040, 120, 0.46), (-240, -260, 0.34)),
    1: ((520, -310, 0.62), (890, -170, 0.45), (-120, -520, 0.32)),
    2: ((-160, -210, 0.5), (420, -360, 0.38)),
    3: ((-360, -230, 0.46), (260, -360, 0.38)),
    4: ((-560, -620, 0.42), (-900, -430, 0.32)),
}


def iter_geo_rings(geometry: dict):
    if geometry["type"] == "Polygon":
        yield from geometry["coordinates"]
    elif geometry["type"] == "MultiPolygon":
        for polygon in geometry["coordinates"]:
            yield from polygon


def china_soft_mask(expand: int = 88, blur: int = 38) -> Image.Image:
    with CHINA_JSON.open(encoding="utf-8") as file:
        data = json.load(file)
    small_size = (WIDTH // MASK_SCALE, HEIGHT // MASK_SCALE)
    land = Image.new("L", small_size, 0)
    draw = ImageDraw.Draw(land)
    for feature in data["features"]:
        for ring in iter_geo_rings(feature["geometry"]):
            pts = []
            for lon, lat in ring:
                x, y = project((float(lon), float(lat)))
                pts.append((x / MASK_SCALE, y / MASK_SCALE))
            if len(pts) >= 3:
                draw.polygon(pts, fill=255)
    size = max(3, (expand // MASK_SCALE) // 8 * 2 + 1)
    for _ in range(2):
        land = land.filter(ImageFilter.MaxFilter(size))
    land = land.filter(ImageFilter.GaussianBlur(max(1, blur // MASK_SCALE)))
    return land.resize((WIDTH, HEIGHT), Image.Resampling.BICUBIC)


def resample(points: list[tuple[float, float]], step: float = 96) -> list[tuple[float, float]]:
    out = [points[0]]
    for start, end in zip(points, points[1:]):
        dx = end[0] - start[0]
        dy = end[1] - start[1]
        distance = max(1, math.hypot(dx, dy))
        count = max(1, int(distance / step))
        for i in range(1, count + 1):
            t = i / count
            out.append((start[0] + dx * t, start[1] + dy * t))
    return out


def track_frame(points: list[tuple[float, float]], index: int) -> tuple[float, float, float, float]:
    prev_point = points[max(0, index - 1)]
    next_point = points[min(len(points) - 1, index + 1)]
    dx = next_point[0] - prev_point[0]
    dy = next_point[1] - prev_point[1]
    distance = max(1, math.hypot(dx, dy))
    tx, ty = dx / distance, dy / distance
    return tx, ty, -ty, tx


def load_mountain_source() -> Image.Image:
    source = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    for name, scale in [
        ("map-mountains-layer-2-mid-far.png", 0.9),
        ("map-mountains-layer-3-mid-near.png", 1.08),
        ("map-mountains-layer-4-near-gold.png", 0.46),
    ]:
        layer = Image.open(OUT / name).convert("RGBA")
        alpha = layer.getchannel("A").point(lambda value, s=scale: min(255, int(value * s)))
        layer.putalpha(alpha)
        source.alpha_composite(layer)
    return source


def shifted_source(source: Image.Image, dx: int, dy: int) -> Image.Image:
    return source.transform(
        (WIDTH, HEIGHT),
        Image.Transform.AFFINE,
        (1, 0, -dx, 0, 1, -dy),
        resample=Image.Resampling.BICUBIC,
    )


def draw_broken_corridor(mask: Image.Image, sampled: list[tuple[float, float]], rng: random.Random, track_index: int) -> None:
    draw = ImageDraw.Draw(mask)
    density = 0.86 if track_index < 2 else 0.68
    for side_offset in (-180, -102, -34, 52, 132, 210):
        if rng.random() > density:
            continue
        points = []
        for index, (x, y) in enumerate(sampled):
            _tx, _ty, nx, ny = track_frame(sampled, index)
            drift = side_offset + math.sin(index * 0.7 + track_index) * rng.uniform(18, 44)
            points.append((
                x + nx * drift + rng.uniform(-46, 46),
                y + ny * drift + rng.uniform(-34, 34),
            ))
        start = rng.randint(0, max(0, len(points) // 5))
        end = len(points) - rng.randint(0, max(0, len(points) // 5))
        draw.line(
            points[start:end],
            fill=rng.randint(48, 94),
            width=rng.randint(124, 230) if track_index < 2 else rng.randint(96, 174),
            joint="curve",
        )

    for index, (x, y) in enumerate(sampled):
        if rng.random() > (0.74 if track_index < 2 else 0.5):
            continue
        _tx, _ty, nx, ny = track_frame(sampled, index)
        for _ in range(rng.randint(2, 5) if track_index < 2 else rng.randint(1, 3)):
            shift = rng.choice([-1, 1]) * rng.uniform(54, 225)
            cx = x + nx * shift + rng.uniform(-72, 72)
            cy = y + ny * shift + rng.uniform(-54, 54)
            rx = rng.uniform(74, 190)
            ry = rng.uniform(34, 104)
            draw.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=rng.randint(72, 136))


def make_track_mask(track_index: int, rng: random.Random) -> Image.Image:
    sampled = resample([project(point) for point in TRACKS[track_index]], 86)
    mask = Image.new("L", (WIDTH, HEIGHT), 0)
    draw_broken_corridor(mask, sampled, rng, track_index)
    mask = mask.filter(ImageFilter.GaussianBlur(24 if track_index < 2 else 18))
    mask = textured_alpha(mask, 0.46)
    mask = ImageOps.autocontrast(mask, cutoff=0)
    mask = mask.point(lambda value: min(255, int(value * (0.94 if track_index < 2 else 0.78))))
    return mask


def composite_masked(layer: Image.Image, source: Image.Image, mask: Image.Image, opacity: float) -> None:
    piece = source.copy()
    alpha = ImageChops.multiply(piece.getchannel("A"), mask)
    alpha = alpha.point(lambda value: min(255, int(value * opacity)))
    piece.putalpha(alpha)
    layer.alpha_composite(piece)


def make_layer() -> Image.Image:
    rng = random.Random(SEED)
    source = load_mountain_source()
    layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    for track_index in range(len(TRACKS)):
        mask = make_track_mask(track_index, rng)
        for dx, dy, opacity in SOURCE_SHIFTS[track_index]:
            composite_masked(layer, shifted_source(source, dx, dy), mask, opacity)

    alpha = layer.getchannel("A").filter(ImageFilter.GaussianBlur(0.8))
    alpha = textured_alpha(alpha, 0.32)
    alpha = ImageChops.multiply(alpha, china_soft_mask())
    alpha = alpha.point(lambda value: min(255, int(value * 1.46)))
    layer.putalpha(alpha)
    return layer


def make_preview(layer: Image.Image) -> None:
    paper = Image.new("RGBA", (WIDTH, HEIGHT), (240, 232, 220, 255))
    for name in [
        "map-mountains-layer-1-farthest.png",
        "map-mountains-layer-2-mid-far.png",
        "map-mountains-layer-3-mid-near.png",
    ]:
        paper.alpha_composite(Image.open(OUT / name).convert("RGBA"))
    paper.alpha_composite(layer)
    paper.alpha_composite(Image.open(OUT / "map-mountains-layer-4-near-gold.png").convert("RGBA"))
    paper.save(OUT / "map-river-track-mountains-preview-on-paper.png")
    paper.resize((1820, 1365), Image.Resampling.LANCZOS).save(
        OUT / "map-river-track-mountains-preview-on-paper-small.png"
    )


def main() -> None:
    layer = make_layer()
    layer.save(OUT / "map-river-track-mountains.png")
    make_preview(layer)
    print("wrote map-river-track-mountains.png")


if __name__ == "__main__":
    main()
