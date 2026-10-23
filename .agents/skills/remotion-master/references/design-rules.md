# Remotion Master — Design Rules & Microstock Standards

Commercial stock footage standards for Adobe Stock, Shutterstock, Pond5, and Getty Images.

---

## 1. Non-Negotiable Stock Footage Technical Rules

1. **Resolution:** Pure 4K UHD (`3840x2160`) standard.
2. **Framerate:** `60 FPS` progressive standard (or `24 FPS` retro film).
3. **Loop Periods:** Exactly `10 seconds` (600 frames @ 60 FPS) or `5 seconds` (300 frames). Must loop mathematically seamlessly ($frame_0 == frame_{end}$).
4. **Pure Keying Backgrounds:**
   - For alpha keying: Solid pure Chroma Key Green `#00FF00` with zero gradient.
   - For Screen/Linear Dodge blend: Solid pure black `#000000`.
   - Never use murky gray or textured backgrounds on keyable stock footage.
5. **100% Trademark-Free:** Zero commercial brand logos, trademarked device silhouettes, or protected icons.

---

## 2. Pacing & Rhythm (Cinetic Beat-Locked Motion)

- **First 15 Frames Rule:** Something decisive MUST happen within the first 15 frames. Never open on static holds.
- **Rhythm Structure:** HIT (fast entrance) ➔ HOLD (15-30 frames living breathing) ➔ ACCENT (wave/pulse) ➔ LOOP.
- **Velocity Matching:** When an element leads into another, match velocity vectors across frames.

---

## 3. Five-Layer Composition Stack

Every master scene should follow this stacking order:
1. `Layer 1 (Bottom)`: Solid background or clean chroma green `#00FF00`
2. `Layer 2`: Ambient background effects (dust, god rays, grid, bokeh)
3. `Layer 3 (Hero)`: Main 3D text / product tag / UI subject
4. `Layer 4`: Foreground accents (sparkles, light glints, lens flares)
5. `Layer 5 (Top)`: Subtle film texture / grain / vignette (if artistic composition)


---

## 4. Permanent Stock Agency Encoding & Export Standards (Vecteezy, Adobe Stock, Shutterstock)

Whenever rendering any motion graphics video (via Remotion, Three.js, WebGL, Canvas, or P5.js), **NEVER** deliver raw browser MediaRecorder files (which introduce VFR, missing moov atoms, and yuv444p/yuvj420p errors).

Always post-process or encode using these exact parameters:
```bash
ffmpeg -y -nostdin -i input.mp4 \
  -c:v libx264 -preset slow -profile:v high -level:v 5.2 \
  -crf 16 -b:v 60M -minrate 45M -maxrate 80M -bufsize 120M \
  -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -r 60 -fps_mode cfr \
  -movflags +faststart \
  -an output.mp4
```

### Pre-Delivery Verification Checklist:
- [x] **Header:** True H.264 MP4 with `moov` atom at front (`-movflags +faststart`).
- [x] **Pixel Format:** 8-bit `yuv420p` (Limited Range, NOT `yuvj420p` or `yuv444p`).
- [x] **Color Space:** `bt709` (Rec.709 SDR standard across all three platforms).
- [x] **Frame Rate:** Constant Frame Rate (CFR) strictly at `60.000 FPS`.
- [x] **Duration:** At least `10.00 seconds` (if input < 6s, seamlessly loop with `-stream_loop`).
- [x] **File Size:** Strictly `> 5 MB` (satisfies Vecteezy and Adobe Stock minimum byte thresholds).
- [x] **Audio:** Completely stripped (`-an`) — no silent or empty audio streams.
