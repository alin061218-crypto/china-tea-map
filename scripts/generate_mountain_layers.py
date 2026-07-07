from __future__ import annotations

import math
import random
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps


WIDTH = 4096
HEIGHT = 3072
OUT = Path("client/src/assets/generated")
SEED = 20260707


@dataclass(frozen=True)
class Chain:
    x0: float
    y0: float
    x1: float
    y1: float
    amp: float
    width: float
    waves: float
    groups: int
    jitter: float = 0.35


def rgba(hex_color: str, alpha: int) -> tuple[int, int, int, int]:
    hex_color = hex_color.lstrip("#")
    return (
        int(hex_color[0:2], 16),
        int(hex_color[2:4], 16),
        int(hex_color[4:6], 16),
        alpha,
    )


def mix(a: str, b: str, t: float, alpha: int) -> tuple[int, int, int, int]:
    ca = rgba(a, alpha)
    cb = rgba(b, alpha)
    return tuple(round(ca[i] * (1 - t) + cb[i] * t) for i in range(3)) + (alpha,)


def chain_points(chain: Chain, rng: random.Random) -> list[tuple[float, float]]:
    pts: list[tuple[float, float]] = []
    for i in range(chain.groups):
        t = i / max(1, chain.groups - 1)
        x = chain.x0 * (1 - t) + chain.x1 * t
        y = chain.y0 * (1 - t) + chain.y1 * t
        y += math.sin(t * math.tau * chain.waves + rng.uniform(-0.25, 0.25)) * chain.amp
        y += math.sin(t * math.tau * (chain.waves * 0.45 + 0.7)) * chain.amp * 0.45
        x += rng.uniform(-chain.width, chain.width) * chain.jitter
        y += rng.uniform(-chain.width, chain.width) * chain.jitter
        pts.append((x, y))
    return pts


def resample(points: list[tuple[float, float]], max_dist: float = 42) -> list[tuple[float, float]]:
    out = [points[0]]
    for a, b in zip(points, points[1:]):
        dx, dy = b[0] - a[0], b[1] - a[1]
        dist = max(1, math.hypot(dx, dy))
        steps = max(1, int(dist / max_dist))
        for i in range(1, steps + 1):
            t = i / steps
            out.append((a[0] + dx * t, a[1] + dy * t))
    return out


def draw_wash(
    layer: Image.Image,
    points: list[tuple[float, float]],
    palette: list[str],
    alpha: tuple[int, int],
    width: float,
    blur: float,
    rng: random.Random,
) -> None:
    wash = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(wash, "RGBA")
    pts = resample(points)

    for pass_idx in range(5):
        local = []
        for x, y in pts:
            local.append(
                (
                    x + rng.uniform(-width * 0.25, width * 0.25),
                    y + rng.uniform(-width * 0.18, width * 0.18),
                )
            )
        color = rgba(rng.choice(palette), rng.randint(alpha[0], alpha[1]))
        draw.line(local, fill=color, width=max(10, int(width * (1.2 - pass_idx * 0.12))), joint="curve")

    for x, y in pts[::2]:
        rx = width * rng.uniform(0.45, 1.2)
        ry = width * rng.uniform(0.18, 0.55)
        color = rgba(rng.choice(palette), rng.randint(max(5, alpha[0] - 12), alpha[1]))
        draw.ellipse((x - rx, y - ry, x + rx, y + ry), fill=color)

    wash = wash.filter(ImageFilter.GaussianBlur(blur))

    alpha_channel = wash.getchannel("A")
    noise = Image.effect_noise((WIDTH, HEIGHT), 54).convert("L")
    noise = ImageOps.autocontrast(noise).point(lambda p: 150 + p * 105 // 255)
    noise = ImageChops.multiply(alpha_channel, noise)
    wash.putalpha(noise)
    layer.alpha_composite(wash)


def draw_ridges(
    layer: Image.Image,
    points: list[tuple[float, float]],
    palette: list[str],
    alpha: tuple[int, int],
    width: float,
    rng: random.Random,
    detail: float,
) -> None:
    draw = ImageDraw.Draw(layer, "RGBA")
    pts = resample(points, max_dist=30)

    for _ in range(int(3 + detail * 5)):
        shifted = [
            (
                x + rng.uniform(-width * 0.08, width * 0.08),
                y + rng.uniform(-width * 0.15, width * 0.15),
            )
            for x, y in pts
        ]
        draw.line(
            shifted,
            fill=rgba(rng.choice(palette), rng.randint(alpha[0], alpha[1])),
            width=max(1, int(width * rng.uniform(0.018, 0.045) * detail)),
            joint="curve",
        )

    stride = max(4, int(13 - detail * 6))
    for i in range(3, len(pts) - 3, stride):
        if rng.random() > 0.72 * detail:
            continue
        x, y = pts[i]
        dx = pts[i + 2][0] - pts[i - 2][0]
        dy = pts[i + 2][1] - pts[i - 2][1]
        d = max(1, math.hypot(dx, dy))
        nx, ny = -dy / d, dx / d
        side = 1 if ny > 0 else -1
        for k in range(rng.randint(2, 5)):
            length = width * rng.uniform(0.18, 0.48) * (1 - k * 0.08)
            sx = x + nx * side * width * rng.uniform(-0.08, 0.08)
            sy = y + abs(ny) * width * rng.uniform(0.02, 0.18) + k * width * 0.09
            line = [
                (sx - length * 0.45, sy + rng.uniform(-4, 4)),
                (sx - length * 0.12, sy + length * 0.16 + rng.uniform(-4, 4)),
                (sx + length * 0.26, sy + length * 0.06 + rng.uniform(-4, 4)),
                (sx + length * 0.52, sy + length * 0.18 + rng.uniform(-4, 4)),
            ]
            draw.line(
                line,
                fill=rgba(rng.choice(palette), rng.randint(max(8, alpha[0] - 14), alpha[1])),
                width=max(1, int(width * 0.018 * detail)),
                joint="curve",
            )


def draw_gold(
    layer: Image.Image,
    points: list[tuple[float, float]],
    density: float,
    rng: random.Random,
) -> None:
    draw = ImageDraw.Draw(layer, "RGBA")
    pts = resample(points, max_dist=24)
    golds = ["#f4d0bd", "#e9c7b3", "#d9ad9a"]
    i = 0
    while i < len(pts) - 5:
        if rng.random() < density:
            span = rng.randint(4, 11)
            segment = [
                (x + rng.uniform(-3, 3), y + rng.uniform(-3, 3))
                for x, y in pts[i : min(len(pts), i + span)]
            ]
            draw.line(
                segment,
                fill=rgba(rng.choice(golds), rng.randint(46, 88)),
                width=rng.choice([1, 1, 2]),
                joint="curve",
            )
            i += span + rng.randint(3, 9)
        else:
            i += rng.randint(2, 7)


def mist_erase(layer: Image.Image, rng: random.Random, strength: int) -> None:
    mask = Image.new("L", (WIDTH, HEIGHT), 0)
    draw = ImageDraw.Draw(mask)
    for _ in range(strength):
        x = rng.randint(-400, WIDTH + 200)
        y = rng.randint(300, HEIGHT - 350)
        rx = rng.randint(260, 900)
        ry = rng.randint(50, 180)
        draw.ellipse((x - rx, y - ry, x + rx, y + ry), fill=rng.randint(24, 92))
    mask = mask.filter(ImageFilter.GaussianBlur(54))
    a = layer.getchannel("A")
    a = ImageChops.subtract(a, mask)
    layer.putalpha(a)


def edge_fade(layer: Image.Image) -> None:
    mask = Image.new("L", (WIDTH, HEIGHT), 255)
    draw = ImageDraw.Draw(mask)
    draw.rectangle((0, 0, WIDTH, HEIGHT), fill=0)
    margin_x, margin_y = 260, 210
    draw.rounded_rectangle(
        (margin_x, margin_y, WIDTH - margin_x, HEIGHT - margin_y),
        radius=320,
        fill=255,
    )
    mask = mask.filter(ImageFilter.GaussianBlur(220))
    layer.putalpha(ImageChops.multiply(layer.getchannel("A"), mask))


LAYER_SPECS = [
    {
        "name": "map-mountains-layer-1-farthest-v2.png",
        "palette": ["#d8d0cc", "#e8ddd8", "#ddd5d6", "#e4d9d4"],
        "stroke": ["#cec5c6", "#d7ced0"],
        "alpha": (22, 54),
        "stroke_alpha": (14, 34),
        "blur": 36,
        "detail": 0.35,
        "gold": 0.0,
        "mist": 18,
        "chains": [
            Chain(260, 1420, 1800, 980, 120, 170, 1.4, 16),
            Chain(180, 2220, 1540, 2420, 96, 150, 1.8, 15),
            Chain(2320, 860, 3900, 760, 105, 150, 1.6, 15),
            Chain(2850, 1860, 3980, 1500, 88, 130, 1.5, 12),
            Chain(760, 620, 2360, 680, 92, 135, 1.9, 15),
        ],
    },
    {
        "name": "map-mountains-layer-2-mid-far-v2.png",
        "palette": ["#d4c4b5", "#c8b0a0", "#d8b9aa", "#c4a18f"],
        "stroke": ["#b99686", "#c7a998", "#d2b4a6"],
        "alpha": (42, 84),
        "stroke_alpha": (28, 56),
        "blur": 24,
        "detail": 0.55,
        "gold": 0.0,
        "mist": 14,
        "chains": [
            Chain(520, 1910, 1900, 1790, 120, 160, 1.7, 16),
            Chain(980, 2330, 2540, 2290, 110, 150, 1.8, 16),
            Chain(1720, 1460, 2760, 1620, 78, 120, 1.3, 11),
            Chain(2550, 2070, 3480, 2290, 90, 115, 1.8, 11),
            Chain(300, 1110, 1110, 1380, 78, 110, 1.2, 10),
        ],
    },
    {
        "name": "map-mountains-layer-3-mid-near-v2.png",
        "palette": ["#b8aeba", "#9f95a8", "#878399", "#aaa2b2"],
        "stroke": ["#837d91", "#92899e", "#ada4b3"],
        "alpha": (62, 116),
        "stroke_alpha": (44, 86),
        "blur": 12,
        "detail": 0.78,
        "gold": 0.08,
        "mist": 10,
        "chains": [
            Chain(620, 1560, 1840, 1960, 140, 150, 1.7, 15),
            Chain(1010, 1090, 2370, 1330, 96, 125, 1.9, 14),
            Chain(1750, 1850, 3090, 1770, 84, 120, 1.5, 13),
            Chain(2880, 900, 3760, 1160, 84, 105, 1.7, 10),
            Chain(2080, 2460, 3180, 2600, 72, 96, 1.5, 11),
        ],
    },
    {
        "name": "map-mountains-layer-4-near-gold-v2.png",
        "palette": ["#8f8798", "#9a897c", "#b68b78", "#807988", "#a77f72"],
        "stroke": ["#706b80", "#7f7067", "#a17468", "#8a7280"],
        "alpha": (78, 138),
        "stroke_alpha": (58, 112),
        "blur": 5,
        "detail": 1.0,
        "gold": 0.18,
        "mist": 8,
        "chains": [
            Chain(500, 2170, 1780, 2540, 122, 150, 1.8, 16),
            Chain(650, 1300, 1600, 1520, 102, 130, 1.5, 12),
            Chain(1300, 1730, 2260, 2020, 96, 120, 1.7, 12),
            Chain(260, 940, 980, 1080, 78, 105, 1.2, 9),
            Chain(2290, 2260, 3260, 2390, 78, 100, 1.7, 10),
        ],
    },
]


def generate_layer(spec: dict, rng: random.Random) -> Image.Image:
    layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    for chain in spec["chains"]:
        points = chain_points(chain, rng)
        draw_wash(layer, points, spec["palette"], spec["alpha"], chain.width, spec["blur"], rng)
        draw_ridges(layer, points, spec["stroke"], spec["stroke_alpha"], chain.width, rng, spec["detail"])
        if spec["gold"]:
            draw_gold(layer, points, spec["gold"], rng)
    mist_erase(layer, rng, spec["mist"])
    edge_fade(layer)
    return layer


def paper_base(rng: random.Random) -> Image.Image:
    base = Image.new("RGBA", (WIDTH, HEIGHT), rgba("#efe8dc", 255))
    noise = Image.effect_noise((WIDTH, HEIGHT), 34).convert("L")
    noise = ImageOps.colorize(noise, "#e9dfd3", "#f5efe6").convert("RGBA")
    base = Image.blend(base, noise, 0.22)
    wash = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(wash, "RGBA")
    for color in ["#d9c6d0", "#e5cfc7", "#dcd2c8"]:
        for _ in range(6):
            x = rng.randint(-200, WIDTH + 200)
            y = rng.randint(-200, HEIGHT + 200)
            rx = rng.randint(360, 1160)
            ry = rng.randint(240, 820)
            draw.ellipse((x - rx, y - ry, x + rx, y + ry), fill=rgba(color, rng.randint(10, 24)))
    wash = wash.filter(ImageFilter.GaussianBlur(120))
    base.alpha_composite(wash)
    return base


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    rng = random.Random(SEED)
    layers = []
    for spec in LAYER_SPECS:
        layer = generate_layer(spec, rng)
        path = OUT / spec["name"]
        layer.save(path)
        layers.append(layer)
        print(f"wrote {path}")

    preview = paper_base(rng)
    for layer in layers:
        preview.alpha_composite(layer)
    preview_path = OUT / "map-mountains-layer-1-2-3-4-stack-preview-on-paper-v2.png"
    preview.save(preview_path)
    small = preview.resize((1820, 1365), Image.Resampling.LANCZOS)
    small.save(OUT / "map-mountains-layer-1-2-3-4-stack-preview-on-paper-v2-small.png")
    print(f"wrote {preview_path}")


if __name__ == "__main__":
    main()
