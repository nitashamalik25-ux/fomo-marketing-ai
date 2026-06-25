# Meta Ads — Lead Gen Campaign Creatives

PNG ad graphics for FOMO.ai's Meta (Facebook/Instagram) lead-gen campaign,
rendered from the Claude Design handoff bundle.

## Creatives (`creatives/`)

All exported at exact platform spec dimensions.

| File | Size | Ratio | Funnel | Concept |
|---|---|---|---|---|
| `01_A_ai-answer-mockup_TOF.png` | 1080×1350 | 4:5 | TOF | "When buyers ask AI, be the name it says." AI answer mockup |
| `02_B_growth-proof_BOF.png` | 1080×1350 | 4:5 | BOF | "Sales & leads, without paid ads." Growth dashboard, +312% |
| `03_C_sweet-spot_MOF.png` | 1080×1350 | 4:5 | MOF | "Agency depth. SaaS price." Pricing comparison |
| `04_D_testimonial-card_BOF.png` | 1080×1350 | 4:5 | BOF | "Proof, not promises." Customer testimonial |
| `05_E_ymyl-trust_BOF.png` | 1080×1080 | 1:1 | BOF | "In health & finance, AI only cites who it trusts." YMYL |
| `06_R_ai-shift_Reel.png` | 1080×1920 | 9:16 | Reel | "Be the name AI says." (static frame of the motion reel) |
| `07_R_offer_Reel.png` | 1080×1920 | 9:16 | Reel | "Leads without paid ads." Offer reel (static frame) |

`TOF/MOF/BOF` = top/middle/bottom of funnel.

## Notes

- **Image slots** (avatar photos, customer logos) render as empty placeholders.
  These are meant to be filled with real photos/logos before launch. Drop them
  into the slots in Claude Design, or composite them onto the PNGs.
- The two **reels** are animated in the design (typing cursor, CTA pulse,
  progress bar, glow). The PNGs capture a single representative frame. For the
  live animated assets, export video from the source.
- Typography is **Space Grotesk + IBM Plex Sans** as authored in the design
  bundle (note: this differs from the Poppins in `BRAND.md`; the design file is
  the source of truth for these specific creatives).

## Source & re-rendering (`design-source/`)

The full Claude Design bundle. To re-render the PNGs after edits:

```bash
cd design-source
NODE_PATH="$(npm root -g)" node render.js ../creatives
```

`render.js` builds a standalone page from `Designed Ads Sample.dc.html` (skipping
the Claude Design React runtime), loads the fonts and `image-slot.js`, and
screenshots each `.ad` element at its native dimensions with headless Chromium.
