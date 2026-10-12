"""
Generates a small family of abstract, hand-sketch-style SVG placeholders
for ARTEE's demo content. Deterministic (seeded) so re-running produces
identical output. Purely geometric/abstract — no attempt at photorealistic
figuration, in keeping with the brand's graphite/pencil-study aesthetic.

Palette matches the site's design tokens (see src/app/globals.css):
  paper    #F3F1EA   ink/charcoal  #2B2620   sanguine  #A63D2F
"""
import math
import random

PAPER = "#F3F1EA"
INK = "#2B2620"
SANGUINE = "#A63D2F"
GRAPHITE = "#6B6459"

OUT_DIR = "/home/claude/artee/public/demo"


def bezier_stroke(rng, x_range, y_range, curve=60):
    x0, x1 = x_range
    y0, y1 = y_range
    sx, sy = rng.uniform(x0, x1), rng.uniform(y0, y1)
    ex, ey = rng.uniform(x0, x1), rng.uniform(y0, y1)
    c1x = sx + rng.uniform(-curve, curve)
    c1y = sy + rng.uniform(-curve, curve)
    c2x = ex + rng.uniform(-curve, curve)
    c2y = ey + rng.uniform(-curve, curve)
    return f"M{sx:.1f},{sy:.1f} C{c1x:.1f},{c1y:.1f} {c2x:.1f},{c2y:.1f} {ex:.1f},{ey:.1f}"


def parallel_hatch(rng, x_range, y_range, count, angle_deg, jitter=6):
    """A set of near-parallel straight-ish lines, like pencil hatching,
    evenly spread across the given box (spread happens perpendicular to
    the hatch direction, so the box actually fills regardless of angle)."""
    x0, x1 = x_range
    y0, y1 = y_range
    angle = math.radians(angle_deg)
    dx, dy = math.cos(angle), math.sin(angle)  # direction along each line
    nx, ny = -dy, dx  # perpendicular direction, used to spread the lines
    cx0, cy0 = (x0 + x1) / 2, (y0 + y1) / 2
    diag = math.hypot(x1 - x0, y1 - y0)
    lines = []
    for i in range(count):
        t = (i / max(count - 1, 1)) - 0.5  # -0.5 .. 0.5
        offset = t * diag
        cx = cx0 + nx * offset + rng.uniform(-jitter, jitter)
        cy = cy0 + ny * offset + rng.uniform(-jitter, jitter)
        sx, sy = cx - dx * diag / 2, cy - dy * diag / 2
        ex, ey = cx + dx * diag / 2, cy + dy * diag / 2
        lines.append(f"M{sx:.1f},{sy:.1f} L{ex:.1f},{ey:.1f}")
    return lines


def path_el(d, color, width, opacity):
    return f'<path d="{d}" stroke="{color}" stroke-width="{width:.2f}" stroke-opacity="{opacity:.2f}" fill="none" stroke-linecap="round"/>'


def svg_wrap(w, h, body):
    return (
        f'<svg viewBox="0 0 {w} {h}" xmlns="http://www.w3.org/2000/svg">'
        f'<rect width="{w}" height="{h}" fill="{PAPER}"/>'
        f"{body}"
        f"</svg>"
    )


def style_portrait(rng, w, h, density=1.0, accent=True):
    body = []
    cx, cy = w * 0.5, h * 0.38
    rx, ry = w * 0.24, h * 0.22
    count = int(46 * density)
    for _ in range(count):
        d = bezier_stroke(rng, (cx - rx, cx + rx), (cy - ry, cy + ry), curve=40)
        color = SANGUINE if accent and rng.random() < 0.08 else (INK if rng.random() < 0.7 else GRAPHITE)
        body.append(path_el(d, color, rng.uniform(0.8, 2.4), rng.uniform(0.25, 0.75)))
    # shoulders / neck — a few longer sweeping strokes below the "head"
    for _ in range(int(16 * density)):
        d = bezier_stroke(rng, (w * 0.2, w * 0.8), (h * 0.55, h * 0.92), curve=80)
        body.append(path_el(d, INK, rng.uniform(0.8, 2.0), rng.uniform(0.2, 0.5)))
    return "".join(body)


def style_botanical(rng, w, h):
    body = []
    stem_x = w * 0.5
    body.append(path_el(f"M{stem_x},{h*0.9} C{stem_x-10},{h*0.6} {stem_x+10},{h*0.35} {stem_x},{h*0.1}", INK, 2.2, 0.7))
    for i in range(14):
        t = rng.uniform(0.15, 0.85)
        y = h * 0.9 - t * h * 0.75
        side = 1 if i % 2 == 0 else -1
        length = rng.uniform(60, 140)
        d = f"M{stem_x},{y:.1f} C{stem_x + side*length*0.3:.1f},{y-20:.1f} {stem_x+side*length*0.7:.1f},{y+10:.1f} {stem_x+side*length:.1f},{y+rng.uniform(-15,15):.1f}"
        body.append(path_el(d, GRAPHITE if rng.random() < 0.7 else SANGUINE, rng.uniform(1, 1.8), rng.uniform(0.4, 0.7)))
    return "".join(body)


def style_gesture(rng, w, h):
    body = []
    for _ in range(22):
        d = bezier_stroke(rng, (w * 0.1, w * 0.9), (h * 0.1, h * 0.9), curve=140)
        color = SANGUINE if rng.random() < 0.15 else INK
        body.append(path_el(d, color, rng.uniform(1.2, 3.2), rng.uniform(0.3, 0.65)))
    return "".join(body)


def style_hatch_block(rng, w, h):
    body = []
    bx0, bx1 = w * 0.18, w * 0.82
    by0, by1 = h * 0.2, h * 0.75
    for d in parallel_hatch(rng, (bx0, bx1), (by0, by1), 34, 55):
        body.append(path_el(d, INK, rng.uniform(0.7, 1.4), rng.uniform(0.2, 0.4)))
    for d in parallel_hatch(rng, (bx0, bx1), (by0, by1), 20, -30):
        body.append(path_el(d, GRAPHITE, rng.uniform(0.7, 1.2), rng.uniform(0.15, 0.3)))
    return "".join(body)


def style_architectural(rng, w, h):
    body = []
    vanish_x, vanish_y = w * 0.5, h * 0.42
    for _ in range(26):
        edge = rng.choice(["top", "bottom", "left", "right"])
        if edge == "top":
            x, y = rng.uniform(0, w), 0
        elif edge == "bottom":
            x, y = rng.uniform(0, w), h
        elif edge == "left":
            x, y = 0, rng.uniform(0, h)
        else:
            x, y = w, rng.uniform(0, h)
        d = f"M{x:.1f},{y:.1f} L{vanish_x:.1f},{vanish_y:.1f}"
        body.append(path_el(d, INK, rng.uniform(0.5, 1.1), rng.uniform(0.12, 0.3)))
    for d in parallel_hatch(rng, (w * 0.1, w * 0.9), (h * 0.75, h * 0.75), 6, 0, jitter=0):
        pass
    return "".join(body)


def style_crosshatch(rng, w, h):
    body = []
    for d in parallel_hatch(rng, (0, w), (0, h), 46, 48):
        body.append(path_el(d, INK, rng.uniform(0.6, 1.2), rng.uniform(0.15, 0.35)))
    for d in parallel_hatch(rng, (0, w), (0, h), 46, -48):
        body.append(path_el(d, INK, rng.uniform(0.6, 1.2), rng.uniform(0.15, 0.35)))
    for _ in range(6):
        d = bezier_stroke(rng, (w * 0.2, w * 0.8), (h * 0.2, h * 0.8), curve=60)
        body.append(path_el(d, SANGUINE, rng.uniform(1.4, 2.2), 0.5))
    return "".join(body)


def style_mural(rng, w, h):
    """Bold flat abstract color blocks, evoking a painted wall composition."""
    colors = [SANGUINE, INK, GRAPHITE, PAPER]
    body = []
    for _ in range(6):
        cx, cy = rng.uniform(0, w), rng.uniform(0, h)
        r = rng.uniform(min(w, h) * 0.15, min(w, h) * 0.4)
        pts = []
        n = rng.randint(5, 8)
        for i in range(n):
            a = (i / n) * 2 * math.pi + rng.uniform(-0.2, 0.2)
            rr = r * rng.uniform(0.7, 1.15)
            pts.append(f"{cx + math.cos(a)*rr:.1f},{cy + math.sin(a)*rr:.1f}")
        color = rng.choice(colors)
        opacity = rng.uniform(0.55, 0.9)
        body.append(f'<polygon points="{" ".join(pts)}" fill="{color}" fill-opacity="{opacity:.2f}"/>')
    # a few fine ink strokes on top, like brush/pencil detailing
    for _ in range(10):
        d = bezier_stroke(rng, (0, w), (0, h), curve=100)
        body.append(path_el(d, INK, rng.uniform(1, 2), rng.uniform(0.2, 0.4)))
    return "".join(body)


def write(filename, w, h, body):
    with open(f"{OUT_DIR}/{filename}", "w") as f:
        f.write(svg_wrap(w, h, body))
    print("wrote", filename)


# --- Featured / hero artwork (large portrait) ---------------------------
rng = random.Random(1)
write("hero-featured.svg", 1000, 1250, style_portrait(rng, 1000, 1250, density=1.3))

# --- Portfolio artworks (4:5) --------------------------------------------
rng = random.Random(11)
write("artwork-01-portrait-study.svg", 800, 1000, style_portrait(rng, 800, 1000, density=1.0))

rng = random.Random(12)
write("artwork-02-botanical.svg", 800, 1000, style_botanical(rng, 800, 1000))

rng = random.Random(13)
write("artwork-03-gesture.svg", 800, 1000, style_gesture(rng, 800, 1000))

rng = random.Random(14)
write("artwork-04-still-life.svg", 800, 1000, style_hatch_block(rng, 800, 1000))

rng = random.Random(15)
write("artwork-05-architectural.svg", 800, 1000, style_architectural(rng, 800, 1000))

rng = random.Random(16)
write("artwork-06-crosshatch.svg", 800, 1000, style_crosshatch(rng, 800, 1000))

# --- Wall painting examples (wide) ---------------------------------------
rng = random.Random(21)
write("wall-mural-01.svg", 1400, 900, style_mural(rng, 1400, 900))

rng = random.Random(22)
write("wall-mural-02.svg", 1400, 900, style_mural(rng, 1400, 900))

# --- Artist portrait placeholder (4:5) ------------------------------------
rng = random.Random(31)
write("artist-portrait.svg", 800, 1000, style_portrait(rng, 800, 1000, density=1.4, accent=False))

# --- Process gallery for one demo artwork (3:4), increasing density -------
rng = random.Random(41)
write("process-01-idea.svg", 600, 800, style_portrait(rng, 600, 800, density=0.22))
rng = random.Random(41)
write("process-02-sketch.svg", 600, 800, style_portrait(rng, 600, 800, density=0.55))
rng = random.Random(41)
write("process-03-lineart.svg", 600, 800, style_portrait(rng, 600, 800, density=0.85))
rng = random.Random(41)
write("process-04-final.svg", 600, 800, style_portrait(rng, 600, 800, density=1.35))

print("done")
