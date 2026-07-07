from __future__ import annotations

import json
import math
import random
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps


WIDTH = 4096
HEIGHT = 3072
SEED = 20260707
OUT = Path("client/src/assets/generated")
CHINA_JSON = Path("client/src/assets/china.json")
ATLAS_BOUNDS = {"minLon": 55, "maxLon": 150, "minLat": 0, "maxLat": 60}


@dataclass(frozen=True)
class RangeSpec:
    name: str
    points: tuple[tuple[float, float], ...]
    weight: float
    temperature: str
    layers: tuple[int, ...]
    width: int


MOUNTAIN_RANGES: tuple[RangeSpec, ...] = (
    RangeSpec("Tianshan", ((74.5, 43.2), (80, 43.8), (86, 43.4), (93, 43.2), (96, 42.3)), 0.92, "cool", (1, 3, 4), 150),
    RangeSpec("Altai", ((86, 48.4), (89, 48.9), (92.5, 48.1), (96, 47.2)), 0.58, "cool", (1, 3), 112),
    RangeSpec("PamirKarakoram", ((73.5, 37.4), (76.5, 37.0), (79.5, 36.3), (82, 35.4)), 0.9, "warm", (1, 2, 4), 154),
    RangeSpec("Kunlun", ((75.5, 36.0), (82, 36.2), (88.5, 36.0), (94, 35.5), (99, 35.0)), 0.95, "cool", (1, 3, 4), 172),
    RangeSpec("Himalaya", ((78, 31.0), (83.5, 30.2), (88.5, 29.3), (93, 29.0), (97, 28.5)), 1.0, "warm", (1, 2, 4), 178),
    RangeSpec("GangdiseNyainqentanglha", ((80, 32.2), (86, 31.7), (91.5, 31.0), (96, 30.3)), 0.78, "cool", (2, 3), 128),
    RangeSpec("Qilian", ((94, 39.2), (98, 38.5), (101.5, 37.7), (104, 36.9)), 0.82, "warm", (1, 2, 4), 128),
    RangeSpec("HelanLiupan", ((105.6, 39.2), (106.2, 37.7), (106.4, 36.1), (106.2, 35.1)), 0.48, "warm", (2, 4), 86),
    RangeSpec("Hengduan", ((98.5, 33.2), (99.3, 31.2), (100, 29.2), (100.4, 27.2), (100.7, 25.2)), 0.92, "cool", (1, 3, 4), 144),
    RangeSpec("DaxueQionglai", ((101.5, 32.5), (102.8, 31.1), (103.5, 29.8), (103.6, 28.6)), 0.72, "cool", (2, 3, 4), 118),
    RangeSpec("YunnanGuizhou", ((99.8, 25.8), (103.2, 25.2), (106.4, 26.0), (109, 26.4)), 0.64, "warm", (1, 2, 4), 120),
    RangeSpec("Qinling", ((104.5, 34.0), (108, 33.8), (111.2, 33.7), (113.2, 33.5)), 0.74, "cool", (2, 3, 4), 112),
    RangeSpec("Daba", ((106.2, 32.1), (109, 31.8), (111.8, 31.4)), 0.58, "warm", (2, 4), 96),
    RangeSpec("Taihang", ((113.5, 40.2), (113.5, 38.7), (113.6, 37.1), (113.2, 35.6)), 0.66, "cool", (2, 3, 4), 96),
    RangeSpec("Lvliang", ((110.2, 38.8), (111, 37.3), (111.2, 35.6)), 0.45, "warm", (2, 4), 82),
    RangeSpec("Yanshan", ((115.2, 41.0), (118, 40.8), (120.8, 40.6)), 0.44, "cool", (1, 3), 84),
    RangeSpec("Yinshan", ((106.5, 41.2), (111, 41.3), (115.8, 41.0)), 0.42, "cool", (1, 3), 92),
    RangeSpec("GreaterKhingan", ((119.2, 50.5), (120.8, 48.4), (122.1, 46.1), (123.5, 44.2)), 0.64, "cool", (1, 3), 112),
    RangeSpec("LesserKhingan", ((126, 49.2), (128.2, 48.2), (130.2, 47.1)), 0.42, "cool", (1, 3), 82),
    RangeSpec("Changbai", ((125.2, 42.9), (127.2, 42.3), (129.4, 41.6)), 0.56, "cool", (2, 3, 4), 92),
    RangeSpec("Dabie", ((113.5, 31.8), (115.5, 31.4), (117.2, 31.0)), 0.42, "cool", (2, 3), 76),
    RangeSpec("WulingXuefeng", ((108.2, 29.2), (110.2, 28.1), (112.2, 27.0)), 0.54, "warm", (2, 4), 92),
    RangeSpec("Nanling", ((109.5, 25.4), (112.5, 25.0), (115.7, 24.8)), 0.56, "warm", (1, 2, 4), 92),
    RangeSpec("Wuyi", ((116.9, 28.5), (117.7, 27.1), (118.4, 25.5), (119, 24.5)), 0.54, "warm", (2, 3, 4), 84),
    RangeSpec("SoutheastCoast", ((120, 30.2), (120.3, 28.2), (120.1, 26.0), (119.4, 24.2)), 0.34, "warm", (2, 4), 62),
    RangeSpec("TaiwanCentral", ((121.0, 25.2), (120.8, 23.6), (120.9, 22.2)), 0.62, "cool", (2, 3, 4), 74),
    RangeSpec("Hainan", ((108.9, 19.2), (109.5, 18.7), (110.2, 18.9)), 0.32, "warm", (2, 4), 54),
)


PALE = ["#e8ddd8", "#d8d0cc", "#d4cbd0", "#c9c1c5"]
WARM = ["#d8b9aa", "#d4c4b5", "#c8b0a0", "#c4a18f", "#b68b78"]
COOL = ["#b8aeba", "#aaa2b2", "#9f95a8", "#878399", "#746f83"]
GOLD = ["#f4d0bd", "#e9c7b3", "#d9ad9a"]


def rgba(hex_color: str, alpha: int) -> tuple[int, int, int, int]:
    hex_color = hex_color.lstrip("#")
    return (
        int(hex_color[0:2], 16),
        int(hex_color[2:4], 16),
        int(hex_color[4:6], 16),
        max(0, min(255, alpha)),
    )


def project(point: tuple[float, float]) -> tuple[float, float]:
    lon, lat = point
    x = (lon - ATLAS_BOUNDS["minLon"]) / (ATLAS_BOUNDS["maxLon"] - ATLAS_BOUNDS["minLon"]) * WIDTH
    y = (ATLAS_BOUNDS["maxLat"] - lat) / (ATLAS_BOUNDS["maxLat"] - ATLAS_BOUNDS["minLat"]) * HEIGHT
    return x, y


def interpolate(points: tuple[tuple[float, float], ...], rng: random.Random, step: float = 22) -> list[tuple[float, float]]:
    projected = [project(point) for point in points]
    out = [projected[0]]
    for start, end in zip(projected, projected[1:]):
        dx, dy = end[0] - start[0], end[1] - start[1]
        distance = max(1, math.hypot(dx, dy))
        count = max(2, int(distance / step))
        nx, ny = -dy / distance, dx / distance
        for i in range(1, count + 1):
            t = i / count
            wobble = math.sin(t * math.pi * 2.2 + rng.uniform(-0.2, 0.2)) * rng.uniform(4, 14)
            out.append((start[0] + dx * t + nx * wobble, start[1] + dy * t + ny * wobble))
    return out


def china_mask(expand: int, blur: int, floor: int = 0) -> Image.Image:
    with CHINA_JSON.open(encoding="utf-8") as file:
        data = json.load(file)
    land = Image.new("L", (WIDTH, HEIGHT), floor)
    raw = Image.new("L", (WIDTH, HEIGHT), 0)
    draw = ImageDraw.Draw(raw)

    for feature in data["features"]:
        geometry = feature["geometry"]
        polygons = geometry["coordinates"] if geometry["type"] == "MultiPolygon" else [geometry["coordinates"]]
        for polygon in polygons:
            for ring in polygon:
                pts = [project((float(lon), float(lat))) for lon, lat in ring]
                if len(pts) >= 3:
                    draw.polygon(pts, fill=255)

    if expand:
        size = max(3, expand // 24 * 2 + 1)
        for _ in range(max(1, expand // 52)):
            raw = raw.filter(ImageFilter.MaxFilter(size))
    if blur:
        raw = raw.filter(ImageFilter.GaussianBlur(blur))
    return Image.composite(Image.new("L", (WIDTH, HEIGHT), 255), land, raw)


def textured_alpha(alpha: Image.Image, strength: float) -> Image.Image:
    noise = Image.effect_noise((WIDTH, HEIGHT), 44).convert("L")
    noise = ImageOps.autocontrast(noise).point(lambda p: int(165 + p * 90 / 255))
    textured = ImageChops.multiply(alpha, noise)
    return Image.blend(alpha, textured, strength)


def draw_range_wash(
    layer: Image.Image,
    points: list[tuple[float, float]],
    palette: list[str],
    rng: random.Random,
    width: int,
    alpha: tuple[int, int],
    blur: float,
) -> None:
    wash = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(wash, "RGBA")
    for pass_index in range(4):
        jittered = [
            (x + rng.uniform(-width * 0.24, width * 0.24), y + rng.uniform(-width * 0.18, width * 0.18))
            for x, y in points
        ]
        draw.line(
            jittered,
            fill=rgba(rng.choice(palette), rng.randint(*alpha)),
            width=max(5, int(width * (0.48 - pass_index * 0.055))),
            joint="curve",
        )
    for x, y in points[:: max(2, int(9 - width / 40))]:
        rx = width * rng.uniform(0.28, 0.82)
        ry = width * rng.uniform(0.12, 0.38)
        draw.ellipse((x - rx, y - ry, x + rx, y + ry), fill=rgba(rng.choice(palette), rng.randint(alpha[0], alpha[1])))
    wash = wash.filter(ImageFilter.GaussianBlur(blur))
    wash.putalpha(textured_alpha(wash.getchannel("A"), 0.72))
    layer.alpha_composite(wash)


def draw_ridges(
    layer: Image.Image,
    points: list[tuple[float, float]],
    palette: list[str],
    rng: random.Random,
    width: int,
    alpha: tuple[int, int],
    density: float,
) -> None:
    ridge = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(ridge, "RGBA")
    for _ in range(max(2, int(4 * density))):
        jittered = [(x + rng.uniform(-5, 5), y + rng.uniform(-6, 6)) for x, y in points]
        draw.line(
            jittered,
            fill=rgba(rng.choice(palette), rng.randint(*alpha)),
            width=max(1, int(width * rng.uniform(0.014, 0.032))),
            joint="curve",
        )

    stride = max(5, int(15 - density * 6))
    for i in range(2, len(points) - 3, stride):
        if rng.random() > 0.58 * density:
            continue
        x, y = points[i]
        dx = points[i + 2][0] - points[i - 2][0]
        dy = points[i + 2][1] - points[i - 2][1]
        dist = max(1, math.hypot(dx, dy))
        nx, ny = -dy / dist, dx / dist
        branch_count = rng.randint(2, 4)
        for branch in range(branch_count):
            side = 1 if rng.random() > 0.46 else -1
            length = width * rng.uniform(0.18, 0.44) * (1 - branch * 0.1)
            sx = x + rng.uniform(-width * 0.08, width * 0.08)
            sy = y + rng.uniform(-width * 0.05, width * 0.12)
            end = (sx + nx * side * length + dx / dist * length * 0.16, sy + ny * side * length + dy / dist * length * 0.16)
            mid = ((sx + end[0]) / 2 + rng.uniform(-6, 6), (sy + end[1]) / 2 + rng.uniform(-5, 5))
            draw.line(
                [(sx, sy), mid, end],
                fill=rgba(rng.choice(palette), rng.randint(max(8, alpha[0] - 14), alpha[1])),
                width=max(1, int(width * 0.012 * density)),
                joint="curve",
            )

    ridge = ridge.filter(ImageFilter.GaussianBlur(max(0.25, 1.4 - density)))
    layer.alpha_composite(ridge)


def draw_peak_clusters(
    layer: Image.Image,
    points: list[tuple[float, float]],
    palette: list[str],
    rng: random.Random,
    width: int,
    alpha: tuple[int, int],
    density: float,
    blur: float,
) -> None:
    clusters = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(clusters, "RGBA")
    stride = max(3, int(12 - density * 6))
    for i in range(2, len(points) - 3, stride):
        if rng.random() > density:
            continue
        x, y = points[i]
        dx = points[i + 2][0] - points[i - 2][0]
        dy = points[i + 2][1] - points[i - 2][1]
        dist = max(1, math.hypot(dx, dy))
        nx, ny = -dy / dist, dx / dist
        for _ in range(rng.randint(2, 5)):
            side = rng.choice([-1, 1])
            cx = x + nx * side * rng.uniform(width * 0.05, width * 0.36) + rng.uniform(-width * 0.18, width * 0.18)
            cy = y + ny * side * rng.uniform(width * 0.05, width * 0.36) + rng.uniform(-width * 0.12, width * 0.12)
            peak_h = width * rng.uniform(0.12, 0.38)
            peak_w = width * rng.uniform(0.08, 0.24)
            color = rgba(rng.choice(palette), rng.randint(*alpha))
            ridge_color = rgba(rng.choice(palette), rng.randint(max(10, alpha[0] - 10), alpha[1]))
            peak = [
                (cx - peak_w, cy + peak_h * 0.42),
                (cx - peak_w * 0.18, cy - peak_h),
                (cx + peak_w, cy + peak_h * 0.36),
            ]
            draw.polygon(peak, fill=color)
            draw.line([peak[0], peak[1], peak[2]], fill=ridge_color, width=max(1, int(width * 0.008)))
            for k in range(rng.randint(1, 3)):
                yy = cy - peak_h * rng.uniform(0.08, 0.42) + k * peak_h * 0.16
                draw.arc(
                    (cx - peak_w * 0.9, yy - peak_h * 0.18, cx + peak_w * 0.9, yy + peak_h * 0.2),
                    start=rng.randint(195, 230),
                    end=rng.randint(315, 350),
                    fill=ridge_color,
                    width=1,
                )
    clusters = clusters.filter(ImageFilter.GaussianBlur(blur))
    clusters.putalpha(textured_alpha(clusters.getchannel("A"), 0.64))
    layer.alpha_composite(clusters)


def draw_gold(layer: Image.Image, points: list[tuple[float, float]], rng: random.Random, width: int, density: float) -> None:
    draw = ImageDraw.Draw(layer, "RGBA")
    i = 0
    while i < len(points) - 6:
        if rng.random() < density:
            span = rng.randint(4, 10)
            segment = [(x + rng.uniform(-3, 3), y + rng.uniform(-3, 3)) for x, y in points[i : i + span]]
            draw.line(segment, fill=rgba(rng.choice(GOLD), rng.randint(42, 78)), width=1, joint="curve")
            i += span + rng.randint(5, 12)
        else:
            i += rng.randint(3, 8)


def make_layer(layer_index: int, rng: random.Random) -> Image.Image:
    layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    for mountain in MOUNTAIN_RANGES:
        if layer_index not in mountain.layers:
            continue
        points = interpolate(mountain.points, rng, step=24 if layer_index < 4 else 18)
        base_width = int(mountain.width * mountain.weight)
        if layer_index == 1:
            palette = PALE
            draw_range_wash(layer, points, palette, rng, int(base_width * 1.28), (14, 36), 24)
            draw_peak_clusters(layer, points, palette, rng, int(base_width * 0.85), (8, 22), 0.26, 16)
            draw_ridges(layer, points, palette, rng, base_width, (8, 22), 0.35)
        elif layer_index == 2:
            palette = WARM if mountain.temperature == "warm" else PALE + WARM[:2]
            draw_range_wash(layer, points, palette, rng, base_width, (30, 72), 15)
            draw_peak_clusters(layer, points, palette, rng, int(base_width * 0.92), (18, 52), 0.42, 9)
            draw_ridges(layer, points, palette, rng, base_width, (22, 48), 0.55)
        elif layer_index == 3:
            palette = COOL
            draw_range_wash(layer, points, palette, rng, int(base_width * 0.86), (34, 82), 8)
            draw_peak_clusters(layer, points, palette, rng, int(base_width * 0.82), (26, 72), 0.56, 4.8)
            draw_ridges(layer, points, palette, rng, base_width, (42, 84), 0.78)
            if mountain.weight > 0.58:
                draw_gold(layer, points, rng, base_width, 0.035)
        elif layer_index == 4:
            palette = COOL[-3:] + WARM[-3:]
            draw_range_wash(layer, points, palette, rng, int(base_width * 0.72), (45, 112), 4)
            draw_peak_clusters(layer, points, palette, rng, int(base_width * 0.74), (34, 104), 0.68, 2.8)
            draw_ridges(layer, points, palette, rng, base_width, (55, 112), 1.0)
            if mountain.weight > 0.42:
                draw_gold(layer, points, rng, base_width, 0.105)

    mask_settings = {
        1: (300, 95, 6),
        2: (230, 70, 2),
        3: (160, 42, 0),
        4: (120, 28, 0),
    }
    expand, blur, floor = mask_settings[layer_index]
    mask = china_mask(expand, blur, floor)
    alpha = ImageChops.multiply(layer.getchannel("A"), mask)
    layer.putalpha(alpha)
    return layer


def paper_base() -> Image.Image:
    paper = Image.new("RGBA", (WIDTH, HEIGHT), (240, 232, 220, 255))
    noise = Image.effect_noise((WIDTH, HEIGHT), 26).convert("L")
    tint = ImageOps.colorize(noise, "#e7ded2", "#f5eee4").convert("RGBA")
    return Image.blend(paper, tint, 0.22)


def draw_debug_overlay(preview: Image.Image) -> None:
    with CHINA_JSON.open(encoding="utf-8") as file:
        data = json.load(file)
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for feature in data["features"]:
        geometry = feature["geometry"]
        polygons = geometry["coordinates"] if geometry["type"] == "MultiPolygon" else [geometry["coordinates"]]
        for polygon in polygons:
            for ring in polygon:
                pts = [project((float(lon), float(lat))) for lon, lat in ring]
                if len(pts) > 1:
                    draw.line(pts + [pts[0]], fill=(178, 48, 42, 210), width=5)
    result = Image.alpha_composite(preview, overlay)
    result.save(OUT / "debug-mountains-geographic-v8-overlay.png")
    result.resize((1820, 1365), Image.Resampling.LANCZOS).save(OUT / "debug-mountains-geographic-v8-overlay-small.png")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    rng = random.Random(SEED)
    names = [
        "map-mountains-layer-1-farthest",
        "map-mountains-layer-2-mid-far",
        "map-mountains-layer-3-mid-near",
        "map-mountains-layer-4-near-gold",
    ]
    layers: list[Image.Image] = []
    for index, name in enumerate(names, start=1):
        layer = make_layer(index, rng)
        layer.save(OUT / f"{name}-v8.png")
        layer.save(OUT / f"{name}.png")
        layers.append(layer)
        print(f"wrote {name}")

    preview = paper_base()
    for layer in layers:
        preview.alpha_composite(layer)
    preview.save(OUT / "map-mountains-layer-1-2-3-4-stack-preview-on-paper-v8.png")
    preview.save(OUT / "map-mountains-layer-1-2-3-4-stack-preview-on-paper.png")
    small = preview.resize((1820, 1365), Image.Resampling.LANCZOS)
    small.save(OUT / "map-mountains-layer-1-2-3-4-stack-preview-on-paper-v8-small.png")
    small.save(OUT / "map-mountains-layer-1-2-3-4-stack-preview-on-paper-small.png")
    draw_debug_overlay(preview)
    print("wrote v8 preview")


if __name__ == "__main__":
    main()
