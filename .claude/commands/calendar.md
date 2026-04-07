# /calendar — Generate a 4-Week Content Calendar

Build a structured content calendar across all active channels, balanced according to the brand's content pillar ratios.

## Trigger

- `/calendar` — generates a calendar for the current and next 3 weeks
- `/calendar May 2026` — generates a calendar for the specified month
- `/calendar Q3` — generates a calendar for the specified quarter

## Behavior

**Step 1 — Load brand config.**
Read `marketing/brand.md`. Extract:
- `brand.pillars` — for content mix ratios
- `brand.urls` — to identify active platforms (skip any blank/placeholder handles)
- `brand.audience.primary` — for audience-appropriate timing recommendations

**Step 2 — Gather context (if not provided).**
Ask the user:
- Target period (if not specified in the command)?
- Any upcoming product launches, events, or campaigns to plan around?
- Should certain weeks be heavier on promotion (e.g. launch week)?

**Step 3 — Generate the calendar.**
Apply the content pillar ratios from `brand.pillars` across the period.

Recommended posting frequency by platform (adjust to brand's active handles):
- Instagram: 4–5x per week
- LinkedIn: 3–4x per week
- Twitter/X: 5–7x per week (if active)
- TikTok: 3–5x per week (if active)
- Email: 1–2x per week (newsletter + promotional)
- Blog: 1–2x per week

**Step 4 — Save the calendar.**
Write the calendar to: `marketing/content/YYYY-MM-DD_calendar_[period-slug].md`

Example: `marketing/content/2026-04-07_calendar_may-2026.md`

**Step 5 — Offer to produce content.**
After presenting the calendar, ask:
> "Want me to produce content for any of these entries now? I can run a single post, a full campaign, or everything for a specific week."

## Calendar Output Format

```markdown
---
calendar_period: [Month Year or Q1 2026 etc.]
date_generated: YYYY-MM-DD
brand: [brand.name]
active_platforms: [list from brand.urls]
pillar_ratios: [from brand.pillars — e.g. Education 40% / Community 30% / Promotion 30%]
status: draft
---

# Content Calendar: [Period]

## Week 1 — [Date range]

| Date | Day | Platform | Pillar | Topic / Hook | Format | Assigned Agent | Status |
|------|-----|----------|--------|--------------|--------|----------------|--------|
| Apr 7 | Mon | Instagram | Education | "3 signs your gut needs a reset" | Single image + caption | social-media-manager | Pending |
| Apr 7 | Mon | Email | Promotion | April newsletter — spring launch | Newsletter | email-campaigns | Pending |
| Apr 8 | Tue | LinkedIn | Education | Why most detoxes fail (and what works) | Long-form post | social-media-manager | Pending |
| Apr 9 | Wed | Blog | Education | Complete guide to 21-day gut reset | Article | content-writer | Pending |
| Apr 9 | Wed | Instagram | Community | Customer story: [theme] | Carousel | social-media-manager | Pending |
| Apr 10 | Thu | Twitter/X | Promotion | Product launch thread | Thread | social-media-manager | Pending |
| Apr 11 | Fri | Instagram | Promotion | Weekend offer | Story + caption | social-media-manager | Pending |

## Week 2 — [Date range]

[Same table structure...]

## Week 3 — [Date range]

[Same table structure...]

## Week 4 — [Date range]

[Same table structure...]

---

## Pillar Distribution Check

| Pillar | Target % | Actual % | Entries |
|--------|---------|---------|---------|
| [Pillar 1] | [40%] | [X%] | [N] |
| [Pillar 2] | [30%] | [X%] | [N] |
| [Pillar 3] | [30%] | [X%] | [N] |

[Note any imbalance and suggestion to rebalance]

## Campaign Highlights This Period
- [Any launch, event, or promo week callout]
```
