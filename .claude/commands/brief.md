# /brief — Generate a Marketing Creative Brief

Generate a structured creative brief for any marketing initiative. Use this before assigning work to specialist agents to align on objectives, audience, and deliverables.

## Trigger

User runs `/brief` optionally followed by a topic:
- `/brief` — starts an interactive intake
- `/brief summer launch campaign` — uses the provided topic as a starting point

## Behavior

**Step 1 — Load brand config.**
Read `marketing/brand.md`. If it contains placeholder values, stop and prompt the user to complete it first.

**Step 2 — Intake (ask if not already provided).**
Ask the user for any of these that are missing:
- What is the campaign or content topic?
- What is the primary goal? (Awareness / Leads / Sales / Retention / Engagement)
- Which format(s) or platform(s)? (blog post, social pack, email, full campaign, etc.)
- Which audience segment? (primary or secondary from brand config)
- Target publish date or deadline?
- Any specific constraints, mandatories, or things to avoid beyond the brand config?

**Step 3 — Generate the brief.**
Produce a Creative Brief document and save it to:
`marketing/content/YYYY-MM-DD_brief_[slug].md`

**Step 4 — Offer to execute.**
After saving, ask the user:
> "Brief saved. Ready to produce all deliverables? I can run the full campaign pipeline now."

If yes, invoke the full multi-agent campaign flow (SEO → Content → Social → Email).

## Brief Output Format

```markdown
---
brief_title: [Campaign Name]
date: YYYY-MM-DD
brand: [brand.name]
status: approved
---

# Creative Brief: [Campaign Name]

## Objective
[Single sentence — what success looks like for this initiative]

## Background
[1–2 sentences of context: why now, what triggered this, what opportunity we're capturing]

## Target Audience
[Pulled from brand config + any segment specifics provided by the user]

## Key Message
[One sentence — the single most important thing the audience should take away]

## Supporting Messages
- [Point 1]
- [Point 2]
- [Point 3]

## Deliverables

| Format | Platform | Quantity | Assigned Agent |
|--------|----------|----------|----------------|
| [e.g. Blog post] | [Website] | 1 | content-writer |
| [e.g. Social pack] | [Instagram + LinkedIn] | 1 | social-media-manager |
| [e.g. Email] | [Newsletter list] | 1 | email-campaigns |

## Mandatories
- CTA: [from brand config or specified by user]
- Tone: [from brand.voice]
- Avoid: [from brand.avoid]
- Compliance: [from brand.compliance if applicable]

## Success Metrics
[How this will be measured: views, opens, clicks, leads, conversions]

## Timeline
Publish date / deadline: [date provided by user]
```
