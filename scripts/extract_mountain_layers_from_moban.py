from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps


WIDTH = 4096
HEIGHT = 3072
SRC = Path("reference/moban.png")
OUT = Path("client/src/assets/generated")


def clamp01(a: np.ndarray) -> np.ndarray:
    return np.clip(a, 0.0, 1.0)


def smooth_l(mask: np.ndarray, radius: float) -> np.ndarray:
    im = Image.fromarray(np.uint8(clamp01(mask) * 255), "L").filter(ImageFilter.GaussianBlur(radius))
    return np.asarray(im, dtype=np.float32) / 255.0


def feathered_pause_mask(size: tuple[int, int]) -> Image.Image:
    w, h = size
    sx = w / 764
    sy = h / 764
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    # Covers the translucent triangular pause/play control embedded in the reference.
    poly = [
        (326 * sx, 282 * sy),
        (326 * sx, 462 * sy),
        (494 * sx, 372 * sy),
    ]
    draw.polygon(poly, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(max(6, int(w * 0.014))))
    return mask


def repair_pause_overlay(src: Image.Image) -> Image.Image:
    src = src.convert("RGBA")
    mask = feathered_pause_mask(src.size)
    soft_context = src.filter(ImageFilter.GaussianBlur(34))
    wider = src.filter(ImageFilter.GaussianBlur(76))
    fill = Image.blend(soft_context, wider, 0.38)
    repaired = src.copy()
    repaired.paste(fill, (0, 0), mask)
    return repaired


def rgba(hex_color: str) -> tuple[int, int, int]:
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i : i + 2], 16) for i in (0, 2, 4))


def colorize(mask: np.ndarray, palette: list[str], source: np.ndarray | None = None) -> Image.Image:
    mask = clamp01(mask)
    h, w = mask.shape
    colors = np.array([rgba(c) for c in palette], dtype=np.float32)
    if source is None:
        t = smooth_l(mask, 18)
    else:
        lum = source @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
        t = clamp01((235 - lum) / 64)
    idx_f = clamp01(t) * (len(colors) - 1)
    lo = np.floor(idx_f).astype(np.int32)
    hi = np.clip(lo + 1, 0, len(colors) - 1)
    frac = idx_f[..., None] - lo[..., None]
    rgb = colors[lo] * (1 - frac) + colors[hi] * frac
    out = np.zeros((h, w, 4), dtype=np.uint8)
    out[..., :3] = np.uint8(np.clip(rgb, 0, 255))
    out[..., 3] = np.uint8(np.clip(mask * 255, 0, 255))
    return Image.fromarray(out, "RGBA")


def add_source_texture(layer: Image.Image, strength: float) -> Image.Image:
    alpha = layer.getchannel("A")
    noise = Image.effect_noise(layer.size, 34).convert("L")
    noise = ImageOps.autocontrast(noise).point(lambda p: int(185 + p * 70 / 255))
    next_alpha = ImageChops.multiply(alpha, noise)
    if strength < 1:
        next_alpha = Image.blend(alpha, next_alpha, strength)
    layer = layer.copy()
    layer.putalpha(next_alpha)
    return layer


def clean_alpha(layer: Image.Image, cutoff: int) -> Image.Image:
    arr = np.asarray(layer, dtype=np.float32).copy()
    alpha = arr[..., 3]
    alpha = np.clip((alpha - cutoff) * 255.0 / max(1, 255 - cutoff), 0, 255)
    arr[..., 3] = alpha
    return Image.fromarray(np.uint8(np.clip(arr, 0, 255)), "RGBA")


def edge_fade(mask: np.ndarray) -> np.ndarray:
    fade = Image.new("L", (WIDTH, HEIGHT), 0)
    draw = ImageDraw.Draw(fade)
    draw.rounded_rectangle((160, 110, WIDTH - 160, HEIGHT - 105), radius=230, fill=255)
    fade = fade.filter(ImageFilter.GaussianBlur(150))
    return mask * (np.asarray(fade, dtype=np.float32) / 255.0)


def make_gold(source: np.ndarray, structure: np.ndarray) -> Image.Image:
    lum = source @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    small = Image.fromarray(np.uint8(lum), "L")
    high = np.asarray(ImageOps.autocontrast(ImageChops.difference(small, small.filter(ImageFilter.GaussianBlur(2.2)))), dtype=np.float32) / 255.0
    warm = clamp01((source[..., 0] - source[..., 2] + 8) / 58)
    gold_mask = clamp01((high - 0.17) * 2.7) * smooth_l(structure, 2.5) * (0.35 + 0.65 * warm)

    # Keep the gold broken and sparse, like matte ink highlights rather than vector outlines.
    grain = np.asarray(Image.effect_noise((WIDTH, HEIGHT), 88).convert("L"), dtype=np.float32) / 255.0
    broken = (grain > 0.52).astype(np.float32)
    gold_mask = smooth_l(gold_mask * broken, 0.55) * 0.42
    return colorize(gold_mask, ["#d9ad9a", "#e9c7b3", "#f4d0bd"], source)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    repaired = repair_pause_overlay(Image.open(SRC))
    # The app renders these assets with preserveAspectRatio="none" against the atlas
    # rectangle, so this extraction intentionally fills the same 4:3 artboard.
    src = repaired.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)
    src.save(OUT / "moban-repaired-atlas-v4.png")

    rgb = np.asarray(src.convert("RGB"), dtype=np.float32)
    lum = rgb @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    maxc = rgb.max(axis=2)
    minc = rgb.min(axis=2)
    sat = maxc - minc

    blur = np.asarray(src.convert("L").filter(ImageFilter.GaussianBlur(13)), dtype=np.float32)
    detail = np.abs(lum - blur) / 36.0

    border = np.concatenate(
        [
            rgb[:80].reshape(-1, 3),
            rgb[-80:].reshape(-1, 3),
            rgb[:, :80].reshape(-1, 3),
            rgb[:, -80:].reshape(-1, 3),
        ],
        axis=0,
    )
    paper = np.median(border, axis=0)
    color_dist = np.sqrt(((rgb - paper) ** 2).sum(axis=2)) / 72.0
    darkness = (246 - lum) / 70.0
    mountain = clamp01(color_dist * 0.95 + darkness * 0.82 + detail * 0.9 - 0.36)

    # Remove the embedded control from all extracted alpha, even after repair.
    pause = np.asarray(feathered_pause_mask((WIDTH, HEIGHT)), dtype=np.float32) / 255.0
    mountain *= 1 - pause * 0.92

    warm = clamp01((rgb[..., 0] - rgb[..., 2] + 34) / 76.0)
    cool = clamp01((rgb[..., 2] - rgb[..., 0] + sat * 0.22 + 18) / 72.0)
    strong = clamp01(darkness * 0.95 + detail * 1.75 - 0.46)
    soft_mass = smooth_l(mountain, 18)

    l1 = edge_fade(smooth_l(mountain * (1 - strong * 0.42), 19) * 0.72)
    l2 = edge_fade(smooth_l(mountain * (0.34 + warm * 0.66) * (1 - strong * 0.16), 10) * 0.92)
    l3 = edge_fade(smooth_l(mountain * (0.25 + cool * 0.75) * (0.5 + detail), 5.0) * 0.98)
    l4 = edge_fade(smooth_l(mountain * (strong * 1.05 + soft_mass * 0.2), 2.4) * 1.0)

    layers = [
        (
            "map-mountains-layer-1-farthest-v5.png",
            l1,
            ["#e8ddd8", "#d8d0cc", "#d4cbd0", "#c9c1c5"],
            0.55,
            18,
        ),
        (
            "map-mountains-layer-2-mid-far-v5.png",
            l2,
            ["#d4c4b5", "#d8b9aa", "#c8b0a0", "#c4a18f"],
            0.68,
            22,
        ),
        (
            "map-mountains-layer-3-mid-near-v5.png",
            l3,
            ["#b8aeba", "#aaa2b2", "#9f95a8", "#878399"],
            0.82,
            8,
        ),
        (
            "map-mountains-layer-4-near-gold-v5.png",
            l4,
            ["#b68b78", "#9a897c", "#8f8798", "#706b80"],
            0.9,
            14,
        ),
    ]

    rendered: list[Image.Image] = []
    for name, mask, palette, texture, cutoff in layers:
        layer = colorize(mask, palette, rgb)
        layer = add_source_texture(layer, texture)
        if name.endswith("layer-3-mid-near-v5.png"):
            layer.alpha_composite(make_gold(rgb, mask * 0.22))
        if name.endswith("layer-4-near-gold-v5.png"):
            layer.alpha_composite(make_gold(rgb, mask))
        layer = clean_alpha(layer, cutoff)
        layer.save(OUT / name)
        rendered.append(layer)
        print(f"wrote {OUT / name}")

    paper = Image.new("RGBA", (WIDTH, HEIGHT), (240, 232, 220, 255))
    paper_noise = Image.effect_noise((WIDTH, HEIGHT), 28).convert("L")
    paper_tint = ImageOps.colorize(paper_noise, "#e7ded2", "#f5eee4").convert("RGBA")
    preview = Image.blend(paper, paper_tint, 0.24)
    for layer in rendered:
        preview.alpha_composite(layer)
    preview.save(OUT / "map-mountains-layer-1-2-3-4-stack-preview-on-paper-v5.png")
    preview.resize((1820, 1365), Image.Resampling.LANCZOS).save(
        OUT / "map-mountains-layer-1-2-3-4-stack-preview-on-paper-v5-small.png"
    )
    print("wrote v5 preview")


if __name__ == "__main__":
    main()
