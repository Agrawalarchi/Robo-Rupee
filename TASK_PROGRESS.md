# Project Tasks Progress

## Status: Completed ✅

### 1. TAM/SAM/SOM Slide Redesign
- [x] Conventional L-shaped coordinate system on desktop (thin Y-axis, baseline X-axis, dashed reference gridlines).
- [x] Balanced bar widths (24px each, pair 54px) originating from baseline.
- [x] Numbers count up dynamically as bars rise smoothly.
- [x] Mobile view (<600px):
  - Retained same bar chart without enclosing box.
  - Sized orbits properly (44px–55px range).
  - Placed smaller orbits on the left (44px) and larger orbits on the right (55px), naturally complementing the bar height progression.
  - Smooth continuous floating sine motion.

### 2. Meet The Team Slide Updates
- [x] **Heading Font Size Increased**: Enriched `.team-slide__heading` on laptop screens (`>600px`) to bold, impactful `clamp(48px, min(6.8vw, 11dvh), 96px)`.
- [x] **Eyebrow Font Size Increased**: Increased font size of **"The people behind the vision"** on laptop screens to `clamp(13px, 1.25vw, 16px)` with wider letter spacing (`0.22em`) and enhanced dash length (`34px`).
- [x] **Left Padding Added**: Added `padding-left: clamp(24px, 4.5vw, 64px)` to `.team-slide__intro` when left-aligned on laptop/desktop.
- [x] **Member Name Box Glowing Outline**: Updated `.team-bubble--identity` with the glowing violet/blue neon border outline (`border: 1.5px solid rgba(132, 100, 255, 0.85)`), luminous outer glow (`box-shadow: 0 0 20px rgba(120, 95, 255, 0.35)`), inner glow, and deep dark glassmorphic background matching the reference screenshot.

### 3. Problem & Solution Slide Updates
- [x] **Why It Matters Cards Bottom Shading & Shadow**: Refined to a minimal, soft, barely-there bottom ambient shadow (`0 14px 28px -6px rgba(75, 145, 255, 0.14)` / `0.22` for active) without any harsh border lines, keeping it subtle and natural.
- [x] **Solution Slide Heading Update**: Changed heading in [SolutionSlide.jsx](file:///c:/Users/archi/OneDrive/Desktop/Robo_Rupee/src/components/SolutionSlide.jsx) to **"How we solve it."** (`How we <span>solve it.</span>`).
- [x] **Heading Word Spacing**: Added `word-spacing: 0.18em` and refined letter-spacing on both `.problem-slide__heading` ("Why it matters.") and `.solution-slide__heading` ("How we solve it.") in [problem.css](file:///c:/Users/archi/OneDrive/Desktop/Robo_Rupee/src/styles/problem.css) and [slide-heading.css](file:///c:/Users/archi/OneDrive/Desktop/Robo_Rupee/src/styles/slide-heading.css).
