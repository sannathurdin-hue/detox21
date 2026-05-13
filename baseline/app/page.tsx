"use client"

import { useState } from "react"

/* ─── palette ───────────────────────────────────────────────────────────────
   bg       #F8F5F0   warm natural white
   ink      #131311   warm near-black
   gold     #A8875A   muted Scandinavian gold — used only for data
   sage     #6E8C78   Nordic sage — used only for labels
   dark     #131311   dark sections
   rule     #131311/7 hairline separators
──────────────────────────────────────────────────────────────────────────── */

const PRODUCTS = [
  { n: "01", code: "ONE",       name: "BASELINE ONE",       tag: "Daily Foundation",    time: "Morning",       desc: "Triglyceride omega-3. Magnesium bisglycinate. D3 + K2. Zinc bisglycinate. Four non-negotiables at clinical doses — not the doses that protect a margin." },
  { n: "02", code: "DEEP",      name: "BASELINE DEEP",      tag: "Sleep Protocol",      time: "Evening",       desc: "Glycine 3g. L-theanine. Apigenin. KSM-66 300mg. Four independent sleep mechanisms. The fastest perceived ROI in longevity." },
  { n: "03", code: "CLARITY",   name: "BASELINE CLARITY",   tag: "Cognitive Longevity", time: "Morning",       desc: "Lion's Mane dual-extract. Bacopa monnieri. Alpha-GPC. Pycnogenol. Neural investment over years, not focus for hours." },
  { n: "04", code: "LONGEVITY", name: "BASELINE LONGEVITY", tag: "Cellular Aging",       time: "Morning",       desc: "Nicotinamide riboside. Micronized resveratrol. Spermidine. Quercetin. Ubiquinol. Every ingredient EU-compliant, every dose from the study." },
  { n: "05", code: "RECOVER",   name: "BASELINE RECOVER",   tag: "Performance",          time: "Post-training", desc: "Creatine monohydrate 5g. HMB 3g. Tart cherry. Type II collagen. Muscle is a longevity organ — train it as one." },
  { n: "06", code: "BALANCE",   name: "BASELINE BALANCE",   tag: "Hormone Support",      time: "Morning",       desc: "KSM-66 at 600mg — the full clinical dose. Rhodiola. Phosphatidylserine. HPA axis regulation without therapeutic claims." },
]

const TIERS = [
  {
    name: "Foundation", price: "€69",  badge: null,
    desc: "The irreducible minimum.",
    items: ["BASELINE ONE · daily foundation", "BASELINE PROTEIN · whey isolate", "Baseline Score tracking", "Monthly protocol check-in"],
    cta: "Start Foundation", featured: false,
  },
  {
    name: "Protocol", price: "€129", badge: "Recommended",
    desc: "Assessment-assigned. Personalized.",
    items: ["Everything in Foundation", "2 AI-assigned targeted stacks", "Quarterly protocol review", "Full data dashboard access"],
    cta: "Build My Protocol", featured: true,
  },
  {
    name: "Precision", price: "€219", badge: null,
    desc: "The full longevity operating system.",
    items: ["Complete curated protocol", "Biomarker input & AI analysis", "Scientific advisor Q&A", "Bi-annual longevity report"],
    cta: "Apply for Precision", featured: false,
  },
]

const TREND = [42, 48, 53, 57, 62, 66, 71, 74]

/* ─── page ──────────────────────────────────────────────────────────────── */

export default function Home() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <main className="bg-[#F8F5F0] text-[#131311] antialiased selection:bg-[#131311] selection:text-[#F8F5F0]">

      {/* ── NAVIGATION ───────────────────────────────────────────── */}
      <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-8 md:px-14 py-5 bg-[#F8F5F0]/90 backdrop-blur-md border-b border-[#131311]/[0.06]">
        <span className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#131311]">
          Baseline
        </span>
        <div className="hidden md:flex items-center gap-10 text-[11px] tracking-[0.14em] uppercase text-[#131311]/40">
          {["Protocol", "Products", "Science", "Membership"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-[#131311] transition-colors duration-200">{l}</a>
          ))}
        </div>
        <button className="text-[11px] tracking-[0.18em] uppercase bg-[#131311] text-[#F8F5F0] px-5 py-2.5 hover:bg-[#131311]/80 transition-colors font-medium">
          Start →
        </button>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col justify-end px-8 md:px-14 pt-32 pb-20">
        <div className="max-w-6xl">
          <p className="text-[10px] tracking-[0.38em] uppercase text-[#6E8C78] mb-12">
            Scandinavian Longevity Protocol — Est. 2025
          </p>
          <h1 className="font-serif font-light tracking-[-0.025em] leading-[1.0] text-[#131311] mb-10"
              style={{ fontSize: "clamp(3.8rem, 10vw, 8.5rem)" }}>
            The standard<br />
            for living<br />
            <span className="text-[#131311]/25">longer, better.</span>
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <button className="bg-[#131311] text-[#F8F5F0] px-9 py-4 text-[11px] tracking-[0.18em] uppercase hover:bg-[#131311]/80 transition-colors font-medium">
              Take the assessment →
            </button>
            <span className="text-[11px] text-[#131311]/35 tracking-wide">
              5 minutes. No account required.
            </span>
          </div>
        </div>
      </section>

      {/* ── POSITIONING BAND ────────────────────────────────────── */}
      <section className="border-t border-[#131311]/[0.07] px-8 md:px-14 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            ["73%",  "of Northern Europeans are chronically vitamin D deficient"],
            ["8+",   "human RCTs required before any ingredient enters a protocol"],
            ["100%", "Scandinavian manufacture — vertically owned, no white label"],
            ["90d",  "minimum protocol duration before a meaningful baseline shifts"],
          ].map(([n, l]) => (
            <div key={n}>
              <p className="font-mono text-[2.6rem] leading-none text-[#A8875A] mb-3">{n}</p>
              <p className="text-[11px] text-[#131311]/40 leading-relaxed uppercase tracking-wide">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SCIENTIFIC POSITIONING ──────────────────────────────── */}
      <section id="protocol" className="border-t border-[#131311]/[0.07] px-8 md:px-14 py-28">
        <div className="grid md:grid-cols-2 gap-20 items-start">
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-[#6E8C78] mb-10">The Position</p>
            <h2 className="font-serif font-light leading-[1.1] tracking-[-0.015em] mb-0"
                style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
              Most people are optimizing without a baseline.<br />
              <span className="text-[#131311]/28">That is not optimization.</span><br />
              <span className="text-[#131311]/28">That is guessing.</span>
            </h2>
          </div>
          <div className="md:pt-16 space-y-0 divide-y divide-[#131311]/[0.07]">
            {[
              ["Measure", "Every protocol begins with your data — not our catalog. Twelve questions. Five minutes. A protocol derived from your biology."],
              ["Build",   "We formulate at the doses used in the studies. Every ingredient justified. No proprietary blends. No underdosed filler."],
              ["Adjust",  "Every 90 days, AI reviews your check-in data and adjusts your protocol. The system compounds as your data deepens."],
            ].map(([title, body]) => (
              <div key={title} className="py-7">
                <p className="text-[11px] tracking-[0.22em] uppercase text-[#A8875A] font-mono mb-2">{title}</p>
                <p className="text-sm text-[#131311]/50 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT ECOSYSTEM ───────────────────────────────────── */}
      <section id="products" className="border-t border-[#131311]/[0.07] px-8 md:px-14 py-28">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-[#6E8C78] mb-4">The Ecosystem</p>
            <h2 className="font-serif font-light tracking-[-0.015em]"
                style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
              Six protocols.<br />One system.
            </h2>
          </div>
          <span className="hidden md:block text-[11px] tracking-[0.15em] uppercase text-[#131311]/30 border-b border-[#131311]/15 pb-0.5">
            Full product reference →
          </span>
        </div>

        <div className="divide-y divide-[#131311]/[0.07] border-t border-[#131311]/[0.07]">
          {PRODUCTS.map((p, i) => (
            <div
              key={p.code}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className={`grid md:grid-cols-[3rem_1fr_auto] gap-6 md:gap-12 items-start py-7 cursor-default transition-colors duration-300 ${
                active === i ? "bg-[#131311] text-[#F8F5F0] -mx-8 md:-mx-14 px-8 md:px-14" : ""
              }`}
            >
              <span className={`font-mono text-[11px] pt-0.5 ${active === i ? "text-[#A8875A]" : "text-[#A8875A]"}`}>{p.n}</span>
              <div>
                <div className="flex items-baseline gap-4 mb-1.5">
                  <h3 className="text-[15px] font-medium tracking-tight">{p.name}</h3>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#6E8C78]">{p.tag}</span>
                </div>
                <p className={`text-sm leading-relaxed ${active === i ? "text-[#F8F5F0]/55" : "text-[#131311]/42"}`}>{p.desc}</p>
              </div>
              <span className={`text-[10px] tracking-[0.18em] uppercase mt-0.5 hidden md:block ${active === i ? "text-[#F8F5F0]/30" : "text-[#131311]/25"}`}>
                {p.time}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI PERSONALISATION ──────────────────────────────────── */}
      <section id="science" className="bg-[#131311] text-[#F8F5F0] px-8 md:px-14 py-28">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start max-w-7xl mx-auto">

          {/* Copy */}
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-[#6E8C78] mb-10">AI Personalisation</p>
            <h2 className="font-serif font-light leading-[1.08] tracking-[-0.02em] mb-8"
                style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)" }}>
              Your protocol.<br />
              <span className="text-[#F8F5F0]/25">Not a template.</span>
            </h2>
            <p className="text-sm text-[#F8F5F0]/45 leading-relaxed mb-10 max-w-xs">
              Every recommendation is derived from your check-in data, your biomarkers, and
              90-day response patterns. The longer you are on protocol, the sharper the intelligence.
            </p>

            <div className="space-y-4 mb-12">
              {[
                "Assessment-driven product assignment",
                "Weekly Baseline Score recalculation",
                "Quarterly AI protocol adjustment",
                "Optional bloodwork & wearable integration",
              ].map(f => (
                <div key={f} className="flex items-center gap-3.5">
                  <span className="w-px h-3 bg-[#A8875A] flex-shrink-0" />
                  <span className="text-sm text-[#F8F5F0]/50">{f}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#F8F5F0]/[0.07] pt-8">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#F8F5F0]/22 mb-6">Scientific Advisory</p>
              <div className="space-y-5">
                {[
                  ["EL", "Dr. Erik Lindgren",  "MD, PhD · Karolinska Institute"],
                  ["SB", "Prof. Sara Björk",   "PhD Nutritional Biochemistry · Uppsala"],
                  ["MO", "Dr. Mikael Ohm",     "Longevity Research · University of Gothenburg"],
                ].map(([init, name, role]) => (
                  <div key={init} className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full border border-[#F8F5F0]/10 flex items-center justify-center flex-shrink-0">
                      <span className="font-mono text-[9px] text-[#F8F5F0]/25">{init}</span>
                    </div>
                    <div>
                      <p className="text-[13px] text-[#F8F5F0]/60 leading-tight">{name}</p>
                      <p className="text-[10px] text-[#F8F5F0]/25 tracking-wide mt-0.5">{role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Protocol card */}
          <div className="border border-[#F8F5F0]/[0.08] p-8 md:p-10">
            {/* Header */}
            <div className="flex justify-between items-start pb-6 border-b border-[#F8F5F0]/[0.07] mb-6">
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-[#F8F5F0]/28 mb-1">Protocol — Anna K., 43</p>
                <p className="text-[11px] text-[#F8F5F0]/18">Q2 2025 · Day 74 of protocol</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[2.8rem] leading-none text-[#A8875A]">74</p>
                <p className="text-[10px] text-[#F8F5F0]/25 uppercase tracking-widest mt-1">Baseline Score</p>
              </div>
            </div>

            {/* Score track */}
            <div className="mb-8">
              <div className="relative h-px w-full bg-[#F8F5F0]/[0.07]">
                <div className="absolute inset-y-0 left-0 bg-[#A8875A]/80" style={{ width: "74%" }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#A8875A] border border-[#131311]"
                  style={{ left: "73%" }} />
              </div>
              <div className="flex justify-between mt-2">
                <span className="font-mono text-[10px] text-[#F8F5F0]/15">0</span>
                <span className="font-mono text-[10px] text-[#A8875A]">↑ +12 this quarter</span>
                <span className="font-mono text-[10px] text-[#F8F5F0]/15">100</span>
              </div>
            </div>

            {/* Trend */}
            <div className="mb-8">
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#F8F5F0]/22 mb-3">Sleep quality — 8-week trend</p>
              <div className="flex items-end gap-1.5 h-9">
                {TREND.map((v, i) => (
                  <div key={i} className="flex-1 rounded-[1px] bg-[#F8F5F0]/[0.05] relative overflow-hidden">
                    <div className="absolute bottom-0 inset-x-0 bg-[#A8875A]/60 rounded-[1px]" style={{ height: `${v}%` }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Stack */}
            {[
              { label: "Morning", accent: "bg-[#A8875A]", items: ["BASELINE ONE · Daily Foundation", "BASELINE LONGEVITY · Cellular Aging", "BASELINE CLARITY · Cognitive"] },
              { label: "Evening", accent: "bg-[#6E8C78]", items: ["BASELINE DEEP · Sleep Protocol"] },
            ].map(g => (
              <div key={g.label} className="mb-5">
                <p className="text-[10px] tracking-[0.25em] uppercase text-[#F8F5F0]/20 mb-2.5">{g.label}</p>
                {g.items.map(item => (
                  <div key={item} className="flex items-center gap-3 py-2 border-b border-[#F8F5F0]/[0.05] last:border-0">
                    <span className={`w-1 h-1 rounded-full flex-shrink-0 ${g.accent}`} />
                    <span className="text-[13px] text-[#F8F5F0]/50">{item}</span>
                  </div>
                ))}
              </div>
            ))}

            {/* Outcomes */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#F8F5F0]/[0.07]">
              {[["Sleep", "+31%"], ["Energy", "+18%"], ["Focus", "+22%"]].map(([l, v]) => (
                <div key={l} className="text-center">
                  <p className="font-mono text-[15px] text-[#A8875A]">{v}</p>
                  <p className="text-[10px] text-[#F8F5F0]/22 mt-1 uppercase tracking-widest">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST & MANUFACTURING ───────────────────────────────── */}
      <section className="border-t border-[#131311]/[0.07] px-8 md:px-14 py-24">
        <p className="text-[10px] tracking-[0.35em] uppercase text-[#6E8C78] mb-14">Why trust us</p>
        <div className="grid md:grid-cols-3 gap-px bg-[#131311]/[0.07]">
          {[
            ["We manufacture what we prescribe", "Every BASELINE product is produced in our Scandinavian facility. No third-party white label. No black boxes between formulation and fulfilment."],
            ["We cite our doses, not our claims", "Every ingredient is stated with form, dose, and the study it reflects. We tell you what the evidence says — and where it is silent, we say so."],
            ["We own the supply chain", "From raw ingredient to your door, BASELINE controls quality at every step. This is not a supply chain advantage. It is a trust obligation."],
          ].map(([title, body]) => (
            <div key={title} className="bg-[#F8F5F0] p-10">
              <h3 className="text-base font-medium tracking-tight mb-3 leading-snug">{title}</h3>
              <p className="text-sm text-[#131311]/45 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MEMBERSHIP ──────────────────────────────────────────── */}
      <section id="membership" className="border-t border-[#131311]/[0.07] px-8 md:px-14 py-28">
        <p className="text-[10px] tracking-[0.35em] uppercase text-[#6E8C78] mb-5">Membership</p>
        <h2 className="font-serif font-light tracking-[-0.015em] mb-16"
            style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
          Choose your protocol tier.
        </h2>

        <div className="grid md:grid-cols-3 gap-px bg-[#131311]/[0.07]">
          {TIERS.map(t => (
            <div key={t.name}
              className={`p-9 flex flex-col ${t.featured ? "bg-[#131311] text-[#F8F5F0]" : "bg-[#F8F5F0]"}`}>
              {t.badge && (
                <p className="text-[10px] tracking-[0.25em] uppercase text-[#A8875A] mb-4">{t.badge}</p>
              )}
              <p className="text-[11px] tracking-[0.22em] uppercase text-[#6E8C78] mb-2">{t.name}</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-mono text-[2.8rem] leading-none">{t.price}</span>
                <span className="text-sm" style={{ color: t.featured ? "rgba(248,245,240,0.35)" : "rgba(19,19,17,0.35)" }}>/mo</span>
              </div>
              <p className={`text-sm mt-2 mb-8 ${t.featured ? "text-[#F8F5F0]/45" : "text-[#131311]/42"}`}>{t.desc}</p>
              <ul className="space-y-3 mb-10 flex-1">
                {t.items.map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-[#A8875A] text-[11px] mt-px flex-shrink-0">—</span>
                    <span className={`text-xs leading-relaxed ${t.featured ? "text-[#F8F5F0]/55" : "text-[#131311]/50"}`}>{item}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3.5 text-[11px] tracking-[0.18em] uppercase transition-colors duration-200 ${
                t.featured
                  ? "bg-[#F8F5F0] text-[#131311] hover:bg-[#F8F5F0]/90"
                  : "border border-[#131311]/15 hover:bg-[#131311] hover:text-[#F8F5F0] hover:border-[#131311]"
              }`}>
                {t.cta}
              </button>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-[#131311]/28 text-center mt-7 tracking-wide">
          No annual lock-in. Pause anytime. Cancel in two steps.
        </p>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────── */}
      <section className="border-t border-[#131311]/[0.07] px-8 md:px-14 py-32 text-center">
        <p className="text-[10px] tracking-[0.35em] uppercase text-[#6E8C78] mb-8">Begin</p>
        <h2 className="font-serif font-light tracking-[-0.02em] mb-10 mx-auto"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", maxWidth: "14ch" }}>
          Your longevity protocol starts with five minutes.
        </h2>
        <button className="bg-[#131311] text-[#F8F5F0] px-10 py-4 text-[11px] tracking-[0.18em] uppercase hover:bg-[#131311]/80 transition-colors font-medium">
          Take the assessment →
        </button>
        <p className="text-[11px] text-[#131311]/30 mt-5 tracking-wide">
          Free. No account required. Results in under 5 minutes.
        </p>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t border-[#131311]/[0.07] px-8 md:px-14 py-9">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <span className="text-[11px] font-semibold tracking-[0.3em] uppercase">Baseline</span>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-[11px] text-[#131311]/30 tracking-wide">
            <span>Manufactured in Scandinavia</span>
            <span>All ingredients at clinical doses</span>
            <span>No proprietary blends</span>
            <span>EFSA-compliant</span>
          </div>
          <p className="text-[11px] text-[#131311]/28">© 2025 Baseline</p>
        </div>
      </footer>

    </main>
  )
}
