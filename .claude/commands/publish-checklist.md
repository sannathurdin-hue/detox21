# /publish-checklist — Pre-Publish Quality Check

Run a structured QA checklist on any marketing output file before it goes live. Catches brand violations, spec failures, and missing elements.

## Trigger

`/publish-checklist [file path]`

Examples:
- `/publish-checklist marketing/content/2026-04-07_gut-health-guide.md`
- `/publish-checklist marketing/social/2026-04-07_instagram_spring-launch.md`
- `/publish-checklist marketing/email/2026-04-07_promo_spring-detox-kit.md`

If no file path is provided, ask: "Which file would you like to check? Please provide the full path."

## Behavior

**Step 1 — Load brand config.**
Read `marketing/brand.md`.

**Step 2 — Read the target file.**
Read the file at the specified path.

**Step 3 — Detect file type.**
Determine type from path segment: `content` | `social` | `email` | `seo`

**Step 4 — Run all applicable checklists.**

**Step 5 — Output the checklist report inline.**

**Step 6 — Offer to fix failures.**
If any items FAIL, ask: "Want me to fix the failing items now?"
If yes, invoke the appropriate specialist agent with the file as input.

---

## Checklists

### Brand Compliance (all file types)
- [ ] Brand name matches `brand.name` exactly (spelling, capitalization)
- [ ] No words from `brand.avoid.words` appear anywhere in the copy
- [ ] No topics from `brand.avoid.topics` are referenced
- [ ] Tone is consistent with `brand.voice.primary_descriptor`
- [ ] POV is consistent with `brand.voice.pov` (we/you/third)

### Content Files (`marketing/content/`)
- [ ] Frontmatter block is present and complete
- [ ] H1 is present
- [ ] H1 differs from meta title
- [ ] At least 3 H2 sections are present
- [ ] Introduction hooks in the first sentence (not "In this article…")
- [ ] Conclusion is present and ends with a CTA
- [ ] CTA text matches `brand.cta.primary_cta`
- [ ] CTA URL matches `brand.cta.primary_url`
- [ ] Meta Suggestion block is present
- [ ] Meta title: 50–60 characters
- [ ] Meta description: 140–160 characters
- [ ] URL slug is present, lowercase, kebab-case, max 5 words
- [ ] No unsubstantiated claims (flagged if `brand.compliance.industry_notes` applies)
- [ ] Required disclaimer present if `brand.compliance.required_disclaimer` is set

### Social Files (`marketing/social/`)
- [ ] All requested platforms have dedicated sections
- [ ] Twitter/X: each individual tweet is ≤280 characters
- [ ] Twitter/X: thread tweets are numbered (1/, 2/, etc.)
- [ ] Twitter/X: hashtag count is 1–3
- [ ] LinkedIn: post does not open with "I'm excited to" or "Thrilled to"
- [ ] LinkedIn: ends with a question or clear engagement prompt
- [ ] LinkedIn: hashtag count is 3–5
- [ ] Instagram: hook is within first 125 characters (before the fold)
- [ ] Instagram: hashtag count is 5–10
- [ ] Instagram: visual concept suggestion is included
- [ ] TikTok (if present): script has [HOOK], [BODY], [CTA] sections labeled
- [ ] CTA present on at least one platform section

### Email Files (`marketing/email/`)
- [ ] Frontmatter is complete (all fields filled)
- [ ] Three subject line variants present (option_a, option_b, option_c)
- [ ] Subject line option_a: ≤50 characters
- [ ] Subject line option_b: ≤50 characters
- [ ] Subject line option_c: ≤50 characters
- [ ] No spam trigger words in any subject line: FREE, ACT NOW, GUARANTEED, CLICK HERE, !!!
- [ ] Preview text is present (45–90 characters)
- [ ] Preview text does not repeat the subject line
- [ ] Hero headline is present (6–10 words)
- [ ] Primary CTA button text matches `brand.cta.primary_cta`
- [ ] CTA URL matches `brand.cta.primary_url`
- [ ] Unsubscribe placeholder is present in footer
- [ ] Required disclaimer present (if `brand.compliance.required_disclaimer` is set)
- [ ] From name is set

---

## Report Format

```
# Pre-Publish Checklist: [filename]
Date: YYYY-MM-DD
File type: [content / social / email / seo]
Brand: [brand.name]

## Result: PASS | WARN | FAIL

## Brand Compliance
[✓] Brand name correct
[✓] No avoided words detected
[✗] FAIL — Tone mismatch: copy uses "synergize" which conflicts with brand.avoid.words
...

## [Type-specific section]
[✓] H1 present
[!] WARN — Meta title is 63 characters (recommended max: 60)
[✗] FAIL — CTA reads "Learn more" but brand.cta.primary_cta is "Start your free trial"
...

## Summary
- [N] checks passed
- [N] warnings (should fix before publishing)
- [N] failures (must fix before publishing)

## Recommended Actions
1. [Most critical fix]
2. [Second fix]
```
