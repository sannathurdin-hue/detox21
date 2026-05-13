"use client"

import { useState } from "react"

const PRODUCTS = [
  {
    code: "ONE",
    name: "BASELINE ONE",
    tag: "Daily Foundation",
    desc: "Four clinically-dosed essentials. Triglyceride omega-3. Magnesium bisglycinate. D3 + K2. The non-negotiable foundation every protocol starts with.",
    time: "Morning",
  },
  {
    code: "DEEP",
    name: "BASELINE DEEP",
    tag: "Sleep Protocol",
    desc: "Glycine. L-theanine. Apigenin. KSM-66. Reduce sleep onset latency. Increase slow-wave sleep. The fastest feedback loop in longevity.",
    time: "Evening",
  },
  {
    code: "CLARITY",
    name: "BASELINE CLARITY",
    tag: "Cognitive Longevity",
    desc: "Lion's Mane dual-extract. Bacopa. Alpha-GPC. Pycnogenol. Not a nootropic — a long-term neural investment.",
    time: "Morning",
  },
  {
    code: "LONGEVITY",
    name: "BASELINE LONGEVITY",
    tag: "Cellular Aging",
    desc: "NR. Trans-resveratrol. Spermidine. Quercetin. Ubiquinol. NAD+ precursors at clinical doses. Our most science-forward product.",
    time: "Morning",
  },
  {
    code: "RECOVER",
    name: "BASELINE RECOVER",
    tag: "Performance",
    desc: "Creatine monohydrate. HMB. Tart cherry. Type II collagen. Muscle is a longevity organ. Train it accordingly.",
    time: "Post-training",
  },
  {
    code: "BALANCE",
    name: "BASELINE BALANCE",
    tag: "Hormone Support",
    desc: "Ashwagandha KSM-66 at 600mg. Rhodiola. Phosphatidylserine. HPA axis regulation. The precision tier entry point.",
    time: "Morning",
  },
]

const TIERS = [
  {
    name: "Foundation",
    price: "€69",
    desc: "The irreducible minimum.",
    features: [
      "BASELINE ONE · daily essentials",
      "BASELINE PROTEIN · whey isolate",
      "Baseline Score tracking",
      "Monthly protocol check-in",
    ],
    cta: "Start Foundation",
    featured: false,
  },
  {
    name: "Protocol",
    price: "€129",
    desc: "Assessment-assigned. Personalized.",
    features: [
      "Everything in Foundation",
      "2 AI-assigned targeted stacks",
      "Quarterly protocol review",
      "Full data dashboard access",
    ],
    cta: "Build My Protocol",
    featured: true,
  },
  {
    name: "Precision",
    price: "€219",
    desc: "The full longevity operating system.",
    features: [
      "Complete curated protocol",
      "Biomarker input & AI analysis",
      "Scientific advisor Q&A",
      "Bi-annual longevity report",
    ],
    cta: "Apply for Precision",
    featured: false,
  },
]

const ADVISORS = [
  {
    name: "Dr. Erik Lindgren",
    role: "MD, PhD · Karolinska Institute",
    quote: "Clinical dose integrity is non-negotiable.",
    initials: "EL",
  },
  {
    name: "Prof. Sara Björk",
    role: "PhD Nutritional Biochemistry · Uppsala",
    quote: "Form quality is the variable most brands ignore.",
    initials: "SB",
  },
  {
    name: "Dr. Mikael Ohm",
    role: "Longevity Researcher · Gothenburg",
    quote: "Longevity is compounding. Start with the baseline.",
    initials: "MO",
  },
]

export default function Home() {
  const [activeProduct, setActiveProduct] = useState<number | null>(null)

  return (
    <main className="bg-[#F5F0E8] text-[#1C1C1E] antialiased overflow-x-hidden">

      {/* ── NAV ──────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-[#F5F0E8]/90 backdrop-blur-md border-b border-[#1C1C1E]/[0.07]">
        <span className="text-xs font-semibold tracking-[0.25em] uppercase">Baseline</span>
        <div className="hidden md:flex items-center gap-10 text-[11px] tracking-[0.15em] uppercase text-[#1C1C1E]/50">
          <a href="#protocol" className="hover:text-[#1C1C1E] transition-colors">Protocol</a>
          <a href="#products" className="hover:text-[#1C1C1E] transition-colors">Products</a>
          <a href="#science" className="hover:text-[#1C1C1E] transition-colors">Science</a>
          <a href="#membership" className="hover:text-[#1C1C1E] transition-colors">Membership</a>
        </div>
        <button className="text-[11px] tracking-[0.15em] uppercase bg-[#1C1C1E] text-[#F5F0E8] px-5 py-2.5 hover:bg-[#1C1C1E]/80 transition-colors">
          Start →
        </button>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 pt-24 pb-16">
        <div className="max-w-4xl">
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#8A9E8C] mb-10">
            Scandinavian Longevity Protocol
          </p>
          <h1 className="text-[clamp(2.8rem,8vw,6.5rem)] font-serif font-light leading-[1.04] tracking-[-0.02em] mb-8">
            Know your baseline.<br />Build from there.
          </h1>
          <p className="text-base text-[#1C1C1E]/55 max-w-md leading-relaxed mb-12">
            AI-personalized longevity protocols. Clinical doses.
            Manufactured in Scandinavia. Built on science, not hope.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="bg-[#1C1C1E] text-[#F5F0E8] px-8 py-4 text-[11px] tracking-[0.15em] uppercase hover:bg-[#1C1C1E]/80 transition-colors">
              Take the assessment →
            </button>
            <button className="border border-[#1C1C1E]/20 px-8 py-4 text-[11px] tracking-[0.15em] uppercase hover:border-[#1C1C1E]/50 text-[#1C1C1E]/55 hover:text-[#1C1C1E] transition-colors">
              What is Baseline?
            </button>
          </div>
        </div>
        <div className="mt-20 flex items-center gap-3 text-[#1C1C1E]/25">
          <div className="w-16 h-px bg-[#1C1C1E]/15" />
          <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────── */}
      <section className="border-t border-b border-[#1C1C1E]/[0.07] px-6 md:px-12 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6">
          {[
            { n: "73%", label: "of Northern Europeans are vitamin D deficient" },
            { n: "8+", label: "human RCTs behind every hero ingredient we use" },
            { n: "100%", label: "Scandinavian manufacture — no white label" },
            { n: "90d", label: "to a measurable shift in your baseline" },
          ].map((s) => (
            <div key={s.n}>
              <p className="font-mono text-[2.5rem] leading-none text-[#C8A96E] mb-3">{s.n}</p>
              <p className="text-[11px] text-[#1C1C1E]/45 leading-relaxed tracking-wide uppercase">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── METHOD ──────────────────────────────────────────────── */}
      <section id="protocol" className="px-6 md:px-12 py-28">
        <p className="text-[11px] tracking-[0.3em] uppercase text-[#8A9E8C] mb-14">The Method</p>
        <div className="grid md:grid-cols-3 gap-16 mb-20">
          {[
            {
              n: "01",
              title: "Measure",
              body: "Your protocol starts with your data, not our catalog. Five minutes. Twelve questions. A protocol built around your biology — not a bestseller list.",
            },
            {
              n: "02",
              title: "Build",
              body: "We formulate based on what the science actually says — at the doses used in the studies. Not the doses that protect a margin. Every ingredient justified.",
            },
            {
              n: "03",
              title: "Adjust",
              body: "Every 90 days, your protocol evolves with your progress. AI-driven reviews. Human-readable insights. The longer you're in the system, the sharper it gets.",
            },
          ].map((m) => (
            <div key={m.n}>
              <p className="font-mono text-xs text-[#C8A96E] mb-5">{m.n}</p>
              <h3 className="text-2xl font-serif font-light mb-4">{m.title}</h3>
              <p className="text-sm text-[#1C1C1E]/50 leading-relaxed">{m.body}</p>
            </div>
          ))}
        </div>
        <div className="border-l-2 border-[#C8A96E] pl-8 max-w-2xl">
          <p className="text-xl md:text-2xl font-serif font-light leading-relaxed text-[#1C1C1E]/70 italic">
            &ldquo;Most people are optimizing without a baseline. That&apos;s not optimization. That&apos;s guessing.&rdquo;
          </p>
        </div>
      </section>

      {/* ── PRODUCTS ────────────────────────────────────────────── */}
      <section id="products" className="px-6 md:px-12 py-20 border-t border-[#1C1C1E]/[0.07]">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#8A9E8C] mb-4">The Protocol</p>
            <h2 className="text-4xl md:text-5xl font-serif font-light">
              Six products.<br />One ecosystem.
            </h2>
          </div>
          <button className="hidden md:block text-[11px] tracking-[0.15em] uppercase text-[#1C1C1E]/40 hover:text-[#1C1C1E] transition-colors border-b border-[#1C1C1E]/20 pb-1">
            View all →
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-px bg-[#1C1C1E]/10">
          {PRODUCTS.map((p, i) => (
            <div
              key={p.code}
              className={`p-8 transition-all duration-300 cursor-pointer ${
                activeProduct === i
                  ? "bg-[#1C1C1E] text-[#F5F0E8]"
                  : "bg-[#F5F0E8] hover:bg-[#1C1C1E]/[0.03]"
              }`}
              onMouseEnter={() => setActiveProduct(i)}
              onMouseLeave={() => setActiveProduct(null)}
            >
              <div className="flex items-start justify-between mb-7">
                <span className="font-mono text-[11px] text-[#C8A96E]">{p.code}</span>
                <span
                  className={`text-[10px] tracking-[0.15em] uppercase px-2 py-1 border ${
                    activeProduct === i
                      ? "border-[#F5F0E8]/15 text-[#F5F0E8]/40"
                      : "border-[#1C1C1E]/10 text-[#1C1C1E]/35"
                  }`}
                >
                  {p.time}
                </span>
              </div>
              <h3 className="text-base font-medium tracking-tight mb-1.5">{p.name}</h3>
              <p className="text-[11px] uppercase tracking-widest text-[#8A9E8C] mb-4">{p.tag}</p>
              <p className={`text-sm leading-relaxed ${activeProduct === i ? "text-[#F5F0E8]/60" : "text-[#1C1C1E]/45"}`}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI PROTOCOL ─────────────────────────────────────────── */}
      <section className="bg-[#1C1C1E] text-[#F5F0E8] px-6 md:px-12 py-28">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center max-w-6xl">
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#8A9E8C] mb-10">AI Personalization</p>
            <h2 className="text-4xl md:text-5xl font-serif font-light leading-tight mb-6">
              Your protocol.<br />Not a template.
            </h2>
            <p className="text-sm text-[#F5F0E8]/50 leading-relaxed mb-8 max-w-sm">
              Every recommendation derives from your check-in data, your biomarkers, and 90-day
              response patterns. The longer you&apos;re on protocol, the sharper the intelligence gets.
            </p>
            <div className="space-y-3 mb-10">
              {[
                "Assessment-driven product assignment",
                "Weekly Baseline Score updates",
                "Quarterly protocol adjustment",
                "Bloodwork integration (optional)",
              ].map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-[#C8A96E] flex-shrink-0" />
                  <span className="text-sm text-[#F5F0E8]/60">{f}</span>
                </div>
              ))}
            </div>
            <button className="border border-[#F5F0E8]/20 px-6 py-3 text-[11px] tracking-[0.15em] uppercase hover:bg-[#F5F0E8]/[0.06] transition-colors">
              Take the assessment →
            </button>
          </div>

          {/* Protocol Card */}
          <div className="border border-[#F5F0E8]/10 p-7 md:p-9">
            <div className="flex items-start justify-between mb-6 pb-6 border-b border-[#F5F0E8]/[0.08]">
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#F5F0E8]/35 mb-1">Protocol — Anna K., 43</p>
                <p className="text-[11px] text-[#F5F0E8]/25">Q2 Review · June 2025</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-3xl text-[#C8A96E] leading-none">74</p>
                <p className="text-[10px] text-[#F5F0E8]/30 mt-1 tracking-wide uppercase">Baseline Score</p>
              </div>
            </div>

            {/* Score bar */}
            <div className="mb-7">
              <div className="w-full h-px bg-[#F5F0E8]/[0.08] relative">
                <div className="absolute top-0 left-0 h-px bg-[#C8A96E]" style={{ width: "74%" }} />
                <div
                  className="absolute -top-1 w-2 h-2 rounded-full bg-[#C8A96E] border-2 border-[#1C1C1E]"
                  style={{ left: "72%" }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="font-mono text-[10px] text-[#F5F0E8]/20">0</span>
                <span className="font-mono text-[10px] text-[#C8A96E]">+12 this quarter ↑</span>
                <span className="font-mono text-[10px] text-[#F5F0E8]/20">100</span>
              </div>
            </div>

            <div className="mb-5">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#F5F0E8]/25 mb-3">Morning</p>
              {["BASELINE ONE · Daily Foundation", "BASELINE LONGEVITY · Cellular Aging", "BASELINE CLARITY · Cognitive"].map((item) => (
                <div key={item} className="flex items-center gap-3 py-2 border-b border-[#F5F0E8]/[0.05] last:border-0">
                  <span className="w-1 h-1 rounded-full bg-[#C8A96E] flex-shrink-0" />
                  <span className="text-sm text-[#F5F0E8]/65">{item}</span>
                </div>
              ))}
            </div>

            <div className="mb-7">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#F5F0E8]/25 mb-3">Evening</p>
              <div className="flex items-center gap-3 py-2">
                <span className="w-1 h-1 rounded-full bg-[#8A9E8C] flex-shrink-0" />
                <span className="text-sm text-[#F5F0E8]/65">BASELINE DEEP · Sleep Protocol</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#F5F0E8]/[0.08]">
              {[
                { label: "Sleep", val: "+31%" },
                { label: "Energy", val: "+18%" },
                { label: "Focus", val: "+22%" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-mono text-base text-[#C8A96E]">{stat.val}</p>
                  <p className="text-[10px] text-[#F5F0E8]/30 mt-1 tracking-widest uppercase">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ADVISORS ─────────────────────────────────────────────── */}
      <section id="science" className="px-6 md:px-12 py-24 border-b border-[#1C1C1E]/[0.07]">
        <p className="text-[11px] tracking-[0.3em] uppercase text-[#8A9E8C] mb-14">Scientific Advisory</p>
        <div className="grid md:grid-cols-3 gap-12">
          {ADVISORS.map((a) => (
            <div key={a.name}>
              <div className="w-12 h-12 rounded-full bg-[#1C1C1E]/[0.07] mb-5 flex items-center justify-center">
                <span className="text-[11px] font-mono text-[#1C1C1E]/35">{a.initials}</span>
              </div>
              <h4 className="text-base font-medium mb-1">{a.name}</h4>
              <p className="text-[11px] text-[#8A9E8C] tracking-wide uppercase mb-4">{a.role}</p>
              <p className="text-sm text-[#1C1C1E]/50 italic leading-relaxed">&ldquo;{a.quote}&rdquo;</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TIERS ────────────────────────────────────────────────── */}
      <section id="membership" className="px-6 md:px-12 py-28">
        <p className="text-[11px] tracking-[0.3em] uppercase text-[#8A9E8C] mb-6">Membership</p>
        <h2 className="text-4xl md:text-5xl font-serif font-light mb-16">Choose your protocol tier.</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`p-8 border transition-all duration-200 ${
                t.featured
                  ? "border-[#1C1C1E] bg-[#1C1C1E] text-[#F5F0E8]"
                  : "border-[#1C1C1E]/15 hover:border-[#1C1C1E]/40"
              }`}
            >
              {t.featured && (
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#C8A96E] mb-4">Most chosen</p>
              )}
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#8A9E8C] mb-2">{t.name}</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-mono text-4xl">{t.price}</span>
                <span
                  className="text-sm"
                  style={{ color: t.featured ? "rgba(245,240,232,0.4)" : "rgba(28,28,30,0.4)" }}
                >
                  /mo
                </span>
              </div>
              <p className={`text-sm mb-8 mt-2 ${t.featured ? "text-[#F5F0E8]/50" : "text-[#1C1C1E]/45"}`}>
                {t.desc}
              </p>
              <ul className="space-y-3 mb-10">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="text-[#C8A96E] text-xs mt-0.5 flex-shrink-0">→</span>
                    <span className={`text-xs leading-relaxed ${t.featured ? "text-[#F5F0E8]/65" : "text-[#1C1C1E]/55"}`}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3.5 text-[11px] tracking-[0.15em] uppercase transition-colors ${
                  t.featured
                    ? "bg-[#F5F0E8] text-[#1C1C1E] hover:bg-[#F5F0E8]/90"
                    : "border border-[#1C1C1E]/20 hover:border-[#1C1C1E] hover:bg-[#1C1C1E] hover:text-[#F5F0E8]"
                }`}
              >
                {t.cta}
              </button>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-[#1C1C1E]/30 text-center mt-8 tracking-wide">
          No lock-in. Pause anytime. Cancel in two steps.
        </p>
      </section>

      {/* ── TRUST BAND ──────────────────────────────────────────── */}
      <section className="border-t border-[#1C1C1E]/[0.07] px-6 md:px-12 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            "Manufactured in Scandinavia",
            "All ingredients at clinical doses",
            "No proprietary blends",
            "EFSA-compliant formulations",
          ].map((t) => (
            <p key={t} className="text-[10px] tracking-[0.15em] uppercase text-[#1C1C1E]/35">{t}</p>
          ))}
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t border-[#1C1C1E]/[0.07] px-6 md:px-12 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase">Baseline</span>
          <p className="text-[11px] text-[#1C1C1E]/30">
            A Scandinavian longevity ecosystem. Built on Proteinbolaget infrastructure.
          </p>
          <p className="text-[11px] text-[#1C1C1E]/30">© 2025 Baseline</p>
        </div>
      </footer>

    </main>
  )
}
