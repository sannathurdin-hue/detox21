# Brand Configuration

> Fill out every field before using the Marketing OS.
> The Marketing OS Orchestrator reads this file at the start of every session.
> Replace all placeholder values in [brackets] with your actual brand details.

---

## Identity

brand:
  name: "[Your brand name]"
  tagline: "[One-line brand tagline]"
  founded: "[Year]"
  category: "[Industry / niche, e.g. 'health & wellness', 'B2B SaaS', 'fashion']"
  description: >
    [2-3 sentence description of what your brand does and why it exists.
    This is used as context in all agent outputs. Be specific about your
    unique value proposition and the problem you solve.]

---

## Voice & Tone

voice:
  primary_descriptor: "[One phrase describing overall voice, e.g. 'warm and authoritative']"
  tone_words:
    - "[e.g. grounded]"
    - "[e.g. honest]"
    - "[e.g. empowering]"
    - "[e.g. clear]"
  reading_level: "[e.g. conversational / professional / academic]"
  pov: "[First person plural (we/our) | Second person (you/your) | Third person]"

avoid:
  words:
    - "[Word or phrase to never use, e.g. 'hustle']"
    - "[Word or phrase, e.g. 'guru']"
    - "[Word or phrase, e.g. 'synergy']"
  topics:
    - "[Topic to never reference, e.g. competitor brand names]"
    - "[Topic, e.g. unqualified medical claims]"

---

## Audience

audience:
  primary:
    description: "[Who is your main customer? e.g. 'Women 28-45 interested in natural health']"
    pain_points:
      - "[Pain point 1]"
      - "[Pain point 2]"
      - "[Pain point 3]"
    goals:
      - "[What they want to achieve, e.g. 'Feel energized without stimulants']"
      - "[Goal 2]"
  secondary:
    description: "[Secondary audience if applicable, or write 'None']"

---

## Offers & CTAs

offers:
  primary: "[Main product or service name]"
  secondary: "[Secondary offer if applicable, or leave blank]"

cta:
  primary_cta: "[Default CTA text, e.g. 'Start your free trial' or 'Shop now']"
  primary_url: "[Full URL for primary CTA, e.g. https://yoursite.com/start]"
  lead_magnet: "[Free resource name if applicable, e.g. '21-Day Detox Guide PDF']"
  lead_magnet_url: "[URL for lead magnet, or leave blank]"

---

## Digital Presence

urls:
  website: "[https://yourwebsite.com]"
  blog: "[https://yourwebsite.com/blog — or leave blank]"
  instagram: "[@handle — or leave blank]"
  twitter: "[@handle — or leave blank]"
  linkedin: "[Company page URL — or leave blank]"
  tiktok: "[@handle — or leave blank]"
  email_from: "[hello@yourwebsite.com]"

---

## Visual Identity
(Used by agents for design notes in social and email outputs)

visual:
  primary_color: "[Hex code, e.g. #3a5c45]"
  secondary_color: "[Hex code, e.g. #fafafa]"
  font_primary: "[Heading font, e.g. Cormorant Garamond]"
  font_body: "[Body font, e.g. Inter]"
  image_style: "[e.g. 'minimal, natural light, muted earth tones']"
  logo_usage_note: "[Any notes for agents, e.g. 'Always use dark logo on light backgrounds']"

---

## Content Pillars
(Used by /calendar to balance content mix across platforms)

pillars:
  - name: "[Pillar 1 name, e.g. 'Education']"
    description: "[Topics this covers, e.g. 'How-tos, guides, ingredient explainers']"
    content_ratio: "[e.g. 40%]"
  - name: "[Pillar 2 name, e.g. 'Community']"
    description: "[Topics, e.g. 'Customer stories, UGC, behind-the-scenes']"
    content_ratio: "[e.g. 30%]"
  - name: "[Pillar 3 name, e.g. 'Promotion']"
    description: "[Topics, e.g. 'Product launches, offers, CTAs']"
    content_ratio: "[e.g. 30%]"

---

## Compliance & Disclaimers

compliance:
  industry_notes: "[Regulatory context, e.g. 'Health claims must include: Results may vary']"
  required_disclaimer: "[Default footer disclaimer, or leave blank]"
  jurisdiction: "[Country / region for legal context, e.g. 'Sweden / EU']"
