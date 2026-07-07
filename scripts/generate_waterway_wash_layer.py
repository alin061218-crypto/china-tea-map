from __future__ import annotations

import json
import math
import random
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps

from generate_mountain_layers_by_geography import HEIGHT, WIDTH, project


OUT = Path("client/src/assets/generated")
CHINA_JSON = Path("client/src/assets/china.json")
SEED = 20260707
MASK_SCALE = 4


RIVERS = [
    {
        "id": "yangtze",
        "path": [
            (92, 33.5), (95, 32), (98, 30.5), (101, 29),
            (104, 29), (106.5, 30.5), (109, 31),
            (111, 30.5), (113, 30), (114.5, 31),
            (116, 30.5), (117.5, 32), (119, 32),
            (120, 31.5), (121.5, 31.5),
        ],
        "width": 2.8,
        "weight": 1.0,
    },
    {
        "id": "yellow",
        "path": [
            (96, 35), (99, 35.5), (102, 36),
            (104, 37), (106, 37.5), (107.5, 38),
            (109, 37.5), (110.5, 37), (111.5, 36),
            (113, 35), (115, 35), (117, 34.5),
            (118.5, 34), (119, 37.5),
        ],
        "width": 2.4,
        "weight": 0.82,
    },
    {
        "id": "pearl",
        "path": [
            (104, 24.5), (106, 24), (108, 23.8),
            (109.5, 23.5), (111, 23), (112.5, 22.8),
            (113.5, 22.5), (114, 22.2),
        ],
        "width": 2.0,
        "weight": 0.56,
    },
    {
        "id": "huaihe",
        "path": [(113, 32.5), (115, 33), (117, 33.2), (119, 33.5), (120, 33)],
        "width": 1.5,
        "weight": 0.38,
    },
    {
        "id": "songhua",
        "path": [(124, 44.5), (126, 45), (128, 46), (130, 47.5), (132, 48), (134, 48)],
        "width": 1.6,
        "weight": 0.42,
    },
]


def rgba(hex_color: str, alpha: int) -> tuple[int, int, int, int]:
    hex_color = hex_color.lstrip("#")
    return (
        int(hex_color[0:2], 16),
        int(hex_color[2:4], 16),
        int(hex_color[4:6], 16),
        max(0, min(255, alpha)),
    )


def iter_geo_rings(geometry: dict):
    if geometry["type"] == "Polygon":
        yield from geometry["coordinates"]
    elif geometry["type"] == "MultiPolygon":
        for polygon in geometry["coordinates"]:
            yield from polygon


def china_mask(expand: int = 80, blur: int = 30) -> Image.Image:
    with CHINA_JSON.open(encoding="utf-8") as file:
        data = json.load(file)

    small_size = (WIDTH // MASK_SCALE, HEIGHT // MASK_SCALE)
    raw = Image.new("L", small_size, 0)
    draw = ImageDraw.Draw(raw)

    for feature in data["features"]:
        for ring in iter_geo_rings(feature["geometry"]):
            points = []
            for lon, lat in ring:
                x, y = project((float(lon), float(lat)))
                points.append((x / MASK_SCALE, y / MASK_SCALE))
            if len(points) >= 3:
                draw.polygon(points, fill=255)

    if expand:
        size = max(3, (expand // MASK_SCALE) // 8 * 2 + 1)
        for _ in range(2):
            raw = raw.filter(ImageFilter.MaxFilter(size))
    if blur:
        raw = raw.filter(ImageFilter.GaussianBlur(max(1, blur // MASK_SCALE)))
    return raw.resize((WIDTH, HEIGHT), Image.Resampling.BICUBIC)


def mountain_alpha_mask() -> Image.Image:
    alpha = Image.new("L", (WIDTH, HEIGHT), 0)
    for name in [
        "map-mountains-layer-1-farthest.png",
        "map-mountains-layer-2-mid-far.png",
        "map-mountains-layer-3-mid-near.png",
        "map-mountains-layer-4-near-gold.png",
    ]:
        layer = Image.open(OUT / name).convert("RGBA").getchannel("A")
        alpha = ImageChops.lighter(alpha, layer)
    return alpha.filter(ImageFilter.GaussianBlur(24))


def resample(points: list[tuple[float, float]], step: float = 30) -> list[tuple[float, float]]:
    out = [points[0]]
    for start, end in zip(points, points[1:]):
        dx = end[0] - start[0]
        dy = end[1] - start[1]
        distance = max(1, math.hypot(dx, dy))
        count = max(2, int(distance / step))
        for i in range(1, count + 1):
            t = i / count
            out.append((start[0] + dx * t, start[1] + dy * t))
    return out


def organic_points(points: list[tuple[float, float]], rng: random.Random, wobble: float) -> list[tuple[float, float]]:
    out = []
    for index, (x, y) in enumerate(points):
        if index == 0 or index == len(points) - 1:
            out.append((x, y))
            continue
        dx = points[index + 1][0] - points[index - 1][0]
        dy = points[index + 1][1] - points[index - 1][1]
        distance = max(1, math.hypot(dx, dy))
        nx, ny = -dy / distance, dx / distance
        pulse = math.sin(index * 0.72 + rng.uniform(-0.18, 0.18))
        out.append((x + nx * pulse * rng.uniform(wobble * 0.35, wobble), y + ny * pulse * rng.uniform(wobble * 0.35, wobble)))
    return out


def draw_broken_polyline(
    draw: ImageDraw.ImageDraw,
    points: list[tuple[float, float]],
    fill: tuple[int, int, int, int],
    width: int,
    rng: random.Random,
    keep: float,
    min_run: int = 3,
) -> None:
    run: list[tuple[float, float]] = []
    cool_down = 0
    for point in points:
        if cool_down > 0:
            cool_down -= 1
            if len(run) >= min_run:
                draw.line(run, fill=fill, width=width, joint="curve")
            run = []
            continue
        if rng.random() < keep:
            run.append(point)
            continue
        if len(run) >= min_run:
            draw.line(run, fill=fill, width=width, joint="curve")
        run = []
        cool_down = rng.randint(0, 2)
    if len(run) >= min_run:
        draw.line(run, fill=fill, width=width, joint="curve")


def draw_river(layer: Image.Image, river: dict, rng: random.Random) -> None:
    projected = [project(point) for point in river["path"]]
    points = organic_points(resample(projected, 34), rng, 24 * river["weight"])
    base_width = int(56 * river["width"] * (0.72 + river["weight"] * 0.28))

    valley = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    valley_draw = ImageDraw.Draw(valley, "RGBA")
    for _ in range(8):
        jittered = [(x + rng.uniform(-base_width * 0.22, base_width * 0.22), y + rng.uniform(-base_width * 0.16, base_width * 0.16)) for x, y in points]
        draw_broken_polyline(
            valley_draw,
            jittered,
            rgba(rng.choice(["#aaa3aa", "#9d98a2", "#b7ada8", "#928c96"]), rng.randint(18, 34)),
            max(28, int(base_width * rng.uniform(0.68, 1.12))),
            rng,
            keep=rng.uniform(0.34, 0.58),
            min_run=3,
        )

    # The visible artifact should read as damp paper / valley air, not a river line.
    for x, y in points[:: max(3, int(8 - river["weight"] * 2))]:
        rx = base_width * rng.uniform(0.55, 1.85)
        ry = base_width * rng.uniform(0.2, 0.72)
        dx = rng.uniform(-base_width * 0.35, base_width * 0.35)
        dy = rng.uniform(-base_width * 0.28, base_width * 0.28)
        valley_draw.ellipse(
            (x + dx - rx, y + dy - ry, x + dx + rx, y + dy + ry),
            fill=rgba(rng.choice(["#b8b0b3", "#a8a1aa", "#c7bbb0", "#958f99"]), rng.randint(12, 26)),
        )

    valley = valley.filter(ImageFilter.GaussianBlur(max(18, int(base_width * 0.22))))
    layer.alpha_composite(valley)

    channel = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    channel_draw = ImageDraw.Draw(channel, "RGBA")
    for _ in range(4):
        jittered = [(x + rng.uniform(-base_width * 0.08, base_width * 0.08), y + rng.uniform(-base_width * 0.06, base_width * 0.06)) for x, y in points]
        draw_broken_polyline(
            channel_draw,
            jittered,
            rgba(rng.choice(["#766f7b", "#6e6874", "#827985", "#8b8079"]), rng.randint(20, 38)),
            max(16, int(base_width * rng.uniform(0.15, 0.24))),
            rng,
            keep=rng.uniform(0.42, 0.62),
            min_run=4,
        )

    for x, y in points[:: max(5, int(10 - river["weight"] * 3))]:
        if rng.random() > 0.74:
            continue
        rx = base_width * rng.uniform(0.18, 0.42)
        ry = base_width * rng.uniform(0.08, 0.2)
        channel_draw.ellipse(
            (x - rx, y - ry, x + rx, y + ry),
            fill=rgba(rng.choice(["#736c78", "#81777d", "#6c6872"]), rng.randint(12, 24)),
        )
    channel = channel.filter(ImageFilter.GaussianBlur(max(4, int(base_width * 0.038))))
    layer.alpha_composite(channel)


def draw_blank_basin_washes(layer: Image.Image, rng: random.Random) -> None:
    # Broad, non-linear damp patches for the central/eastern blank areas.
    basins = [
        ((105.5, 33.0), (113.5, 31.4), 1.0),
        ((112.0, 35.4), (119.0, 34.4), 0.72),
        ((118.0, 30.6), (122.0, 31.2), 0.56),
        ((123.0, 45.0), (132.0, 47.2), 0.46),
        ((106.0, 24.2), (114.0, 22.7), 0.42),
    ]
    wash = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(wash, "RGBA")
    for start, end, weight in basins:
        p0 = project(start)
        p1 = project(end)
        points = organic_points(resample([p0, p1], 46), rng, 34 * weight)
        width = int(210 * weight)
        for _ in range(5):
            jittered = [(x + rng.uniform(-width * 0.45, width * 0.45), y + rng.uniform(-width * 0.32, width * 0.32)) for x, y in points]
            draw_broken_polyline(
                draw,
                jittered,
                rgba(rng.choice(["#b8b0b3", "#aaa4aa", "#c7bbb0", "#9b949d"]), rng.randint(13, 26)),
                max(40, int(width * rng.uniform(0.55, 1.05))),
                rng,
                keep=rng.uniform(0.22, 0.42),
                min_run=2,
            )
        for x, y in points[::3]:
            rx = width * rng.uniform(0.55, 1.45)
            ry = width * rng.uniform(0.18, 0.58)
            draw.ellipse((x - rx, y - ry, x + rx, y + ry), fill=rgba(rng.choice(["#bdb5b7", "#aea7ad", "#d0c5b7"]), rng.randint(8, 18)))
    wash = wash.filter(ImageFilter.GaussianBlur(38))
    layer.alpha_composite(wash)


def texture_alpha(image: Image.Image, strength: float = 0.52) -> Image.Image:
    alpha = image.getchannel("A")
    noise = Image.effect_noise((WIDTH, HEIGHT), 42).convert("L")
    noise = ImageOps.autocontrast(noise).point(lambda value: int(132 + value * 123 / 255))
    textured = ImageChops.multiply(alpha, noise)
    return Image.blend(alpha, textured, strength)


def attenuate(image: Image.Image) -> Image.Image:
    country = china_mask()
    mountains = mountain_alpha_mask()
    alpha = texture_alpha(image)

    mountain_data = mountains.load()
    alpha_data = alpha.load()
    country_data = country.load()
    for y in range(0, HEIGHT, 1):
        for x in range(0, WIDTH, 1):
            mountain = mountain_data[x, y] / 255
            land = country_data[x, y] / 255
            # Rivers should tuck under dense mountains and become clearer in blank basins.
            factor = land * (0.34 + 0.66 * (1 - mountain))
            alpha_data[x, y] = int(alpha_data[x, y] * factor)

    alpha = alpha.point(lambda value: min(255, int(value * 1.58)))
    image.putalpha(alpha.filter(ImageFilter.GaussianBlur(0.45)))
    return image


def make_preview(waterways: Image.Image) -> None:
    paper = Image.new("RGBA", (WIDTH, HEIGHT), (240, 232, 220, 255))
    for name in [
        "map-mountains-layer-1-farthest.png",
        "map-mountains-layer-2-mid-far.png",
        "map-mountains-layer-3-mid-near.png",
    ]:
        paper.alpha_composite(Image.open(OUT / name).convert("RGBA"))
    paper.alpha_composite(waterways)
    paper.alpha_composite(Image.open(OUT / "map-mountains-layer-4-near-gold.png").convert("RGBA"))
    for path, image in [
        (OUT / "map-waterways-wash-preview-on-paper.png", paper),
        (OUT / "map-waterways-wash-preview-on-paper-small.png", paper.resize((1820, 1365), Image.Resampling.LANCZOS)),
    ]:
        try:
            image.save(path)
        except OSError:
            temp_path = path.with_name(f"{path.stem}-latest{path.suffix}")
            image.save(temp_path)


def main() -> None:
    rng = random.Random(SEED)
    layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    for river in RIVERS:
        draw_river(layer, river, rng)
    draw_blank_basin_washes(layer, rng)
    layer = attenuate(layer)
    layer.save(OUT / "map-waterways-wash.png")
    make_preview(layer)
    print("wrote map-waterways-wash.png")


if __name__ == "__main__":
    main()
