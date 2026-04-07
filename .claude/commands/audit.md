# /audit — Marketing Content Audit

Review all existing marketing output files for brand consistency, SEO health, and platform compliance. Surfaces issues before content goes live.

## Trigger

- `/audit` — audits all files in `marketing/`
- `/audit content` — audits only `marketing/content/`
- `/audit social` — audits only `marketing/social/`
- `/audit seo` — audits only `marketing/seo/`
- `/audit email` — audits only `marketing/email/`

## Behavior

**Step 1 — Load brand config.**
Read `marketing/brand.md` to load brand standards. This is the benchmark for all checks.

**Step 2 — Discover files.**
Use Glob to find all `.md` files in the target directory (excluding `.gitkeep` and `brand.md` itself).

**Step 3 — Audit each file.**
For each file found, read it and run the relevant checklist below.

**Step 4 — Save the report.**
Write the full audit report to: `marketing/seo/YYYY-MM-DD_audit-report.md`

**Step 5 — Present summary.**
Show the user a brief inline summary of totals (pass / warn / fail) and the top 3 priority fixes.

## Audit Checklists

### All Files (universal checks)
- [ ] No words from `brand.avoid.words` appear in the copy
- [ ] No topics from `brand.avoid.topics` are referenced
- [ ] Tone appears consistent with `brand.voice.primary_descriptor`
- [ ] Brand name spelled correctly (matches `brand.name` exactly)
- [ ] `brand.compliance.required_disclaimer` present where applicable

### Content Files (`marketing/content/`)
- [ ] Frontmatter present and complete (title, date, audience, status)
- [ ] H1 is present and distinct from meta title
- [ ] At least 3 H2 sections present
- [ ] Meta Suggestion block present (meta title, meta description, slug)
- [ ] Meta title is 50–60 characters
- [ ] Meta description is 140–160 characters
- [ ] CTA present in conclusion and matches `brand.cta.primary_cta`
- [ ] Introduction hooks in the first sentence

### Social Files (`marketing/social/`)
- [ ] Platform sections clearly labeled
- [ ] Twitter/X: no tweet exceeds 280 characters
- [ ] LinkedIn: no spam opener ("I'm excited to announce", "Thrilled to share")
- [ ] Instagram: hook appears before the "more" fold (~125 chars)
- [ ] Hashtag counts within platform limits (X: 1–3, LinkedIn: 3–5, Instagram: 5–10)
- [ ] Visual concept suggestion included

### Email Files (`marketing/email/`)
- [ ] Frontmatter complete (email_type, subject_lines, preview_text, segment, goal)
- [ ] Three subject line variants present (option_a, option_b, option_c)
- [ ] Each subject line ≤50 characters
- [ ] Preview text present (45–90 chars)
- [ ] No spam trigger words in subject lines (FREE, ACT NOW, GUARANTEED, !!!)
- [ ] Unsubscribe placeholder present in footer
- [ ] Required disclaimer present

## Report Output Format

```markdown
# Content Audit Report
Date: YYYY-MM-DD
Brand: [brand.name]
Files Reviewed: [N]
Directory: [audited path]

## Summary
- [N] files passed all checks
- [N] files have warnings (minor issues)
- [N] files need revision (failing checks)

## Priority Fixes
1. [Most critical issue + file name]
2. [Second most critical issue]
3. [Third most critical issue]

---

## File Results

### [filename]
**Type**: [content / social / email / seo]
**Status**: PASS | WARN | FAIL

Issues:
- [Specific problem with exact quote from the file if applicable]
- [Second issue]

Recommended fix:
[Brief, actionable instruction]

---

### [next filename]
...
```

## After the Audit

Offer to fix any FAIL or WARN items:
> "Found [N] issues. Want me to fix any of these now? I can route each one to the appropriate specialist agent."
