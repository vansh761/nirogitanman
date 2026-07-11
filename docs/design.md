# Design System — Niro Ayurveda

## Philosophy
The subject is Ayurveda: balance, breath (prana), and natural rhythm, delivered
through a modern health-tech product. The design should feel like a funded
clinical-wellness startup — calm, precise, and alive — not a stock "spa"
brochure and not a generic AI-cream-and-serif template.

**Signature element — The Breath Ring.** The hero's centerpiece is a set of
concentric SVG rings that slowly expand and contract on a ~4.5s cycle,
literally miming an inhale/exhale. Stat cards and doctor/AI cards orbit and
dock around it with soft glass panels. This replaces the generic
"illustration + gradient blob + big number" hero with something that embodies
the subject directly.

## Color tokens
| Name    | Hex      | Use |
|---------|----------|-----|
| Canvas  | `#FBFBF7` | Page background (warm ivory, not stark white) |
| Forest  | `#0B3B2E` | Primary text, nav, dark surfaces |
| Emerald | `#128A5D` | Primary brand / links / active states |
| Mint    | `#A9E8C8` | Accent fills, highlight chips, success |
| Sky     | `#4E8FBF` | Secondary accent — calm, clinical trust |
| Saffron | `#E8823C` | CTA buttons only — warm, appetite-for-action |

Dark mode inverts Canvas → `#08130F`, keeps Emerald/Mint/Saffron, raises
surface panels to `#0F231C` with 6–10% white overlays for glass cards.

## Typography
- **Display — Space Grotesk**: headlines, section titles, stat numbers.
  Geometric, slightly technical — signals "product," not "brochure."
- **Body — Inter**: paragraphs, form fields, long-form content. Best-in-class
  legibility at small sizes.
- **Utility — Poppins**: nav links, buttons, eyebrows/labels, badges. Rounder
  and friendlier, used sparingly so it doesn't compete with Space Grotesk.

Scale: eyebrow 13px/uppercase/tracked, body 16–18px, h2 32–40px, h1 48–72px
(clamp for responsive), stat numbers 40–56px.

## Layout
- Max content width 1200px, generous 96–140px vertical rhythm between
  sections on desktop, collapsing to 56–72px on mobile.
- Cards: 20–24px radius, 1px hairline border in Forest at 8% opacity, soft
  layered shadow (never a hard drop shadow).
- Glassmorphism reserved for hero-adjacent floating cards only — not applied
  everywhere, so it stays a signature rather than wallpaper.

## Motion
- One orchestrated hero sequence on load (rings breathe, cards drift in),
  everything else is restrained: fade+8px rise on scroll reveal, 150–200ms
  hover transitions, no scattered confetti-style micro-animation.
- Respects `prefers-reduced-motion`: breathing ring and scroll reveals
  degrade to a static state.

## Accessibility & responsiveness
- All interactive elements keyboard-reachable with visible focus rings
  (2px Emerald offset).
- Text contrast checked against Canvas/Forest (AA minimum).
- Layouts tested at 375px, 768px, 1024px, 1440px breakpoints.

## Dark mode
- Implemented via `next-themes` class strategy (`dark:` variants throughout),
  toggle in navbar, persisted in localStorage on the client.
