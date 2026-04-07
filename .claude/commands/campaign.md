# /campaign — Run a Full Multi-Agent Marketing Campaign

Trigger all 4 specialist agents in sequence for a single topic. Produces a complete set of marketing deliverables: SEO brief, cornerstone content, social pack, and promotional email.

## Trigger

`/campaign [topic]`

Examples:
- `/campaign spring detox starter kit launch`
- `/campaign beginner guide to gut health`
- `/campaign black friday promotion`

## Behavior

**Step 1 — Load brand config.**
Read `marketing/brand.md`. If placeholder values are detected, stop and prompt the user to complete the config first.

**Step 2 — Confirm topic.**
If no topic was provided with the command, ask: "What topic or campaign should I run this for?"

**Step 3 — Announce the pipeline.**
Tell the user:
> "Running full campaign pipeline for: **[topic]**. Producing 4 deliverables — this will take a moment."
> "Step 1/4: SEO Foundation..."

**Step 4 — Execute the pipeline sequentially.**

### Step 1 of 4 — SEO Foundation
Invoke the `seo-strategist` agent with:
- Task type: `full-seo-brief`
- Topic: [campaign topic]
- Brand config: [full contents of marketing/brand.md]
- Output path: `marketing/seo/YYYY-MM-DD_full-brief_[slug].md`

Wait for this agent to complete before proceeding.

### Step 2 of 4 — Cornerstone Content
Invoke the `content-writer` agent with:
- Task type: cornerstone article / blog post (adjust to campaign context)
- Topic: [campaign topic]
- Brand config: [full contents of marketing/brand.md]
- SEO context: [full output from seo-strategist — pass the keyword table, meta suggestions, and H2 structure]
- Output path: `marketing/content/YYYY-MM-DD_[slug].md`

Wait for this agent to complete before proceeding.

### Step 3 of 4 — Social Pack
Invoke the `social-media-manager` agent with:
- Platforms: all active platforms found in `brand.urls` (instagram, twitter, linkedin, tiktok)
- Goal: Awareness + Link clicks
- Brand config: [full contents of marketing/brand.md]
- Content to adapt: [full output from content-writer — pass the complete article]
- Output path: `marketing/social/YYYY-MM-DD_multi_[slug].md`

Wait for this agent to complete before proceeding.

### Step 4 of 4 — Promotional Email
Invoke the `email-campaigns` agent with:
- Email type: promotional
- Segment: brand.audience.primary
- Goal: Click-through to the content piece
- Brand config: [full contents of marketing/brand.md]
- Content context: [article title, URL from brand.urls.blog + slug, key points from article]
- Output path: `marketing/email/YYYY-MM-DD_promo_[slug].md`

Wait for this agent to complete.

## Final Output

After all 4 agents complete, present a Campaign Summary:

```
# Campaign Complete: [Topic]

| Deliverable | File | Status |
|-------------|------|--------|
| SEO Brief | marketing/seo/YYYY-MM-DD_full-brief_[slug].md | Done |
| Blog Post | marketing/content/YYYY-MM-DD_[slug].md | Done |
| Social Pack | marketing/social/YYYY-MM-DD_multi_[slug].md | Done |
| Email | marketing/email/YYYY-MM-DD_promo_[slug].md | Done |

**Recommended next steps:**
1. Run `/publish-checklist marketing/content/[slug].md` to QA the blog post
2. Review social posts and adjust timing per platform
3. Load the email into your ESP, choose a subject line variant, and A/B test
```
