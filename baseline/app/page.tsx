"use client"

import { useState } from "react"

/* ─── data ─────────────────────────────────────────────────────────────── */

const PRODUCTS = [
  { code: "ONE",      name: "BASELINE ONE",      tag: "Daily Foundation",    time: "Morning",      desc: "Four clinically-dosed essentials. Triglyceride omega-3. Magnesium bisglycinate. D3 + K2. The irreducible foundation." },
  { code: "DEEP",     name: "BASELINE DEEP",     tag: "Sleep Protocol",      time: "Evening",      desc: "Glycine 3g. L-theanine. Apigenin. KSM-66. Reduce sleep onset. Increase slow-wave sleep. Fastest feedback loop in longevity." },
  { code: "CLARITY",  name: "BASELINE CLARITY",  tag: "Cognitive Longevity", time: "Morning",      desc: "Lion's Mane dual-extract. Bacopa. Alpha-GPC. Pycnogenol. Not a nootropic — a long-term neural investment." },
  { code: "LONGEVITY",name: "BASELINE LONGEVITY",tag: "Cellular Aging",      time: "Morning",      desc: "NR. Micronized resveratrol. Spermidine. Quercetin. Ubiquinol. NAD+ precursors at the doses used in the studies." },
  { code: "RECOVER",  name: "BASELINE RECOVER",  tag: "Performance",         time: "Post-training",desc: "Creatine monohydrate. HMB. Tart cherry. Type II collagen. Muscle is a longevity organ. Train it accordingly." },
  { code: "BALANCE",  name: "BASELINE BALANCE",  tag: "Hormone Support",     time: "Morning",      desc: "KSM-66 at 600mg — the full clinical dose. Rhodiola. Phosphatidylserine. HPA axis regulation. Precision tier entry." },
]

const TIERS = [
  {
    name: "Foundation", price: "€69",  badge: null,          desc: "The irreducible minimum.",
    features: ["BASELINE ONE · daily essentials","BASELINE PROTEIN · whey isolate","Baseline Score tracking","Monthly protocol check-in"],
    cta: "Start Foundation", featured: false,
  },
  {
    name: "Protocol",   price: "€129", badge: "Most chosen", desc: "Assessment-assigned. Personalized.",
    features: ["Everything in Foundation","2 AI-assigned targeted stacks","Quarterly protocol review","Full data dashboard access"],
    cta: "Build My Protocol", featured: true,
  },
  {
    name: "Precision",  price: "€219", badge: null,          desc: "The full longevity operating system.",
    features: ["Complete curated protocol","Biomarker input & AI analysis","Scientific advisor Q&A","Bi-annual longevity report"],
    cta: "Apply for Precision", featured: false,
  },
]

const TICKER = ["Manufactured in Scandinavia","Clinical doses — no exceptions","No proprietary blends","EFSA-compliant formulations","Built on Proteinbolaget infrastructure","8+ human RCTs per hero ingredient","No white-label, ever"]

/* ─── component ─────────────────────────────────────────────────────────── */

export default function Home() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <>
      {/* Marquee keyframes — scoped to this page */}
      <style>{`
        @keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .ticker { animation: ticker 28s linear infinite; }
        .ticker:hover { animation-play-state: paused; }
      `}</style>

      <main className="bg-[#F5F0E8] text-[#1C1C1E] antialiased">

        {/* ── NAV ──────────────────────────────────────────────────── */}
        <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-[#0E0E0E]/80 backdrop-blur-xl border-b border-white/[0.06]">
          <span className="text-[11px] font-semibold tracking-[0.28em] uppercase text-white">Baseline</span>
          <div className="hidden md:flex items-center gap-9 text-[11px] tracking-[0.16em] uppercase text-white/40">
            {["Protocol","Products","Science","Membership"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>
          <button className="text-[11px] tracking-[0.16em] uppercase bg-white text-[#0E0E0E] px-5 py-2.5 hover:bg-white/90 transition-colors font-medium">
            Start →
          </button>
        </nav>

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section className="relative min-h-screen bg-[#0E0E0E] text-white flex flex-col justify-center overflow-hidden">
          {/* Ambient glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#C8A96E]/[0.06] blur-[120px]" />
            <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-[#8A9E8C]/[0.05] blur-[100px]" />
          </div>

          <div className="relative px-6 md:px-12 pt-28 pb-20 grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto w-full">
            {/* Copy */}
            <div>
              <p className="text-[11px] tracking-[0.32em] uppercase text-[#8A9E8C] mb-8">Scandinavian Longevity Protocol</p>
              <h1 className="font-serif font-light leading-[1.03] tracking-[-0.025em] text-[clamp(3rem,7vw,5.5rem)] mb-8 text-white">
                Know your<br />baseline.<br />
                <span className="text-white/40">Build from there.</span>
              </h1>
              <p className="text-sm text-white/50 max-w-sm leading-relaxed mb-10">
                AI-personalized longevity protocols at clinical doses.
                Manufactured in Scandinavia. Built on science, not hope.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="bg-white text-[#0E0E0E] px-8 py-4 text-[11px] tracking-[0.16em] uppercase hover:bg-white/90 transition-colors font-medium">
                  Take the assessment →
                </button>
                <button className="border border-white/15 px-8 py-4 text-[11px] tracking-[0.16em] uppercase hover:border-white/35 text-white/45 hover:text-white transition-colors">
                  What is Baseline?
                </button>
              </div>
            </div>

            {/* Hero protocol card */}
            <div className="hidden md:block border border-white/[0.09] bg-white/[0.03] p-7 backdrop-blur-sm">
              <div className="flex justify-between items-start mb-5 pb-5 border-b border-white/[0.07]">
                <div>
                  <p className="text-[10px] tracking-[0.22em] uppercase text-white/30 mb-1">Protocol — Anna K., 43</p>
                  <p className="text-[11px] text-white/20">Q2 Review · June 2025</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-3xl text-[#C8A96E] leading-none">74</p>
                  <p className="text-[10px] text-white/25 mt-1 tracking-widest uppercase">Baseline Score</p>
                </div>
              </div>

              {/* Score bar */}
              <div className="mb-6">
                <div className="h-px w-full bg-white/[0.07] relative mb-2">
                  <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#C8A96E]/60 to-[#C8A96E]" style={{width:"74%"}} />
                  <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#C8A96E] border-2 border-[#0E0E0E]" style={{left:"72%"}} />
                </div>
                <div className="flex justify-between">
                  <span className="font-mono text-[10px] text-white/20">0</span>
                  <span className="font-mono text-[10px] text-[#C8A96E]">↑ +12 this quarter</span>
                  <span className="font-mono text-[10px] text-white/20">100</span>
                </div>
              </div>

              {[
                { label: "Morning", dot: "bg-[#C8A96E]", items: ["BASELINE ONE · Foundation","BASELINE LONGEVITY · Cellular","BASELINE CLARITY · Cognitive"] },
                { label: "Evening", dot: "bg-[#8A9E8C]", items: ["BASELINE DEEP · Sleep Protocol"] },
              ].map(group => (
                <div key={group.label} className="mb-4">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-white/25 mb-2">{group.label}</p>
                  {group.items.map(item => (
                    <div key={item} className="flex items-center gap-2.5 py-1.5 border-b border-white/[0.05] last:border-0">
                      <span className={`w-1 h-1 rounded-full flex-shrink-0 ${group.dot}`} />
                      <span className="text-[13px] text-white/55">{item}</span>
                    </div>
                  ))}
                </div>
              ))}

              <div className="grid grid-cols-3 gap-3 pt-5 border-t border-white/[0.07]">
                {[["Sleep","+31%"],["Energy","+18%"],["Focus","+22%"]].map(([l,v]) => (
                  <div key={l} className="text-center">
                    <p className="font-mono text-sm text-[#C8A96E]">{v}</p>
                    <p className="text-[10px] text-white/25 mt-0.5 uppercase tracking-widest">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <div className="w-px h-10 bg-gradient-to-b from-white/0 to-white/20" />
          </div>
        </section>

        {/* ── TICKER ───────────────────────────────────────────────── */}
        <div className="border-b border-[#1C1C1E]/[0.08] py-3.5 overflow-hidden bg-[#F5F0E8]">
          <div className="ticker flex whitespace-nowrap w-max">
            {[...TICKER,...TICKER].map((t, i) => (
              <span key={i} className="text-[11px] tracking-[0.18em] uppercase text-[#1C1C1E]/35 px-8">
                {t} <span className="text-[#C8A96E] mx-4">·</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── PROBLEM ──────────────────────────────────────────────── */}
        <section className="px-6 md:px-12 py-28 max-w-5xl">
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#8A9E8C] mb-8">The Problem</p>
          <h2 className="text-[clamp(1.8rem,4.5vw,3.5rem)] font-serif font-light leading-[1.15] tracking-[-0.01em] text-[#1C1C1E] mb-0">
            Most people are optimizing<br />
            <span className="text-[#1C1C1E]/35">without a baseline.</span><br />
            That&apos;s not optimization.<br />
            <span className="text-[#1C1C1E]/35">That&apos;s guessing.</span>
          </h2>
        </section>

        {/* ── STATS ────────────────────────────────────────────────── */}
        <section className="border-t border-b border-[#1C1C1E]/[0.07] px-6 md:px-12 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6">
            {[
              ["73%", "of Northern Europeans are vitamin D deficient"],
              ["8+",  "human RCTs behind every hero ingredient"],
              ["100%","Scandinavian manufacture — no white label"],
              ["90d", "to a measurable shift in your baseline"],
            ].map(([n, l]) => (
              <div key={n}>
                <p className="font-mono text-[2.4rem] leading-none text-[#C8A96E] mb-3">{n}</p>
                <p className="text-[11px] text-[#1C1C1E]/40 leading-relaxed tracking-wide uppercase">{l}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── METHOD ──────────────────────────────────────────────── */}
        <section id="protocol" className="px-6 md:px-12 py-28">
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#8A9E8C] mb-14">The Method</p>
          <div className="grid md:grid-cols-3 gap-px bg-[#1C1C1E]/[0.08] mb-20">
            {[
              ["01","Measure","Your protocol starts with your data, not our catalog. Five minutes. Twelve questions. A protocol built around your biology."],
              ["02","Build",  "We formulate at the doses used in the studies. Not the doses that protect a margin. Every ingredient justified."],
              ["03","Adjust", "Every 90 days, your protocol evolves. AI-driven reviews. Human-readable insights. The longer you're in the system, the sharper it gets."],
            ].map(([n, title, body]) => (
              <div key={n} className="bg-[#F5F0E8] p-10">
                <p className="font-mono text-[11px] text-[#C8A96E] mb-5">{n}</p>
                <h3 className="text-2xl font-serif font-light mb-4">{title}</h3>
                <p className="text-sm text-[#1C1C1E]/48 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── PRODUCTS ────────────────────────────────────────────── */}
        <section id="products" className="px-6 md:px-12 py-20 border-t border-[#1C1C1E]/[0.07]">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-[#8A9E8C] mb-4">The Protocol</p>
              <h2 className="text-4xl md:text-5xl font-serif font-light">Six products.<br />One ecosystem.</h2>
            </div>
            <button className="hidden md:block text-[11px] tracking-[0.16em] uppercase text-[#1C1C1E]/35 hover:text-[#1C1C1E] transition-colors border-b border-[#1C1C1E]/15 pb-1">View all →</button>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-[#1C1C1E]/10">
            {PRODUCTS.map((p, i) => (
              <div
                key={p.code}
                className={`p-8 transition-all duration-300 cursor-pointer group ${hovered === i ? "bg-[#0E0E0E] text-white" : "bg-[#F5F0E8]"}`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="font-mono text-[11px] text-[#C8A96E]">{p.code}</span>
                  <span className={`text-[10px] tracking-[0.14em] uppercase px-2 py-1 border ${hovered === i ? "border-white/12 text-white/35" : "border-[#1C1C1E]/10 text-[#1C1C1E]/30"}`}>{p.time}</span>
                </div>
                <h3 className="text-[15px] font-medium tracking-tight mb-1.5">{p.name}</h3>
                <p className={`text-[11px] uppercase tracking-widest mb-4 text-[#8A9E8C]`}>{p.tag}</p>
                <p className={`text-sm leading-relaxed ${hovered === i ? "text-white/55" : "text-[#1C1C1E]/42"}`}>{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── AI PROTOCOL ─────────────────────────────────────────── */}
        <section id="science" className="bg-[#0E0E0E] text-white px-6 md:px-12 py-28">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center max-w-6xl mx-auto">
            {/* Copy */}
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-[#8A9E8C] mb-10">AI Personalization</p>
              <h2 className="text-4xl md:text-5xl font-serif font-light leading-tight mb-6">
                Your protocol.<br /><span className="text-white/35">Not a template.</span>
              </h2>
              <p className="text-sm text-white/45 leading-relaxed mb-9 max-w-sm">
                Every recommendation derives from your check-in data, your biomarkers, and 90-day
                response patterns. The longer you&apos;re on protocol, the sharper the intelligence gets.
              </p>
              <div className="space-y-3.5 mb-10">
                {["Assessment-driven product assignment","Weekly Baseline Score updates","Quarterly AI protocol adjustment","Bloodwork integration (optional)"].map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-[#C8A96E] flex-shrink-0" />
                    <span className="text-sm text-white/55">{f}</span>
                  </div>
                ))}
              </div>
              {/* Advisors inline */}
              <div className="pt-8 border-t border-white/[0.07]">
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/25 mb-5">Scientific Advisory</p>
                <div className="flex flex-col gap-4">
                  {[
                    ["EL","Dr. Erik Lindgren","MD, PhD · Karolinska"],
                    ["SB","Prof. Sara Björk","PhD · Uppsala University"],
                    ["MO","Dr. Mikael Ohm","Longevity Research · Gothenburg"],
                  ].map(([init, name, role]) => (
                    <div key={init} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                        <span className="font-mono text-[9px] text-white/30">{init}</span>
                      </div>
                      <div>
                        <p className="text-[13px] text-white/65">{name}</p>
                        <p className="text-[10px] text-white/28 tracking-wide">{role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Full protocol card */}
            <div className="border border-white/[0.09] bg-white/[0.025] p-8">
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-white/[0.07]">
                <div>
                  <p className="text-[10px] tracking-[0.22em] uppercase text-white/30 mb-1">Protocol — Anna K., 43</p>
                  <p className="text-[11px] text-white/20">Q2 2025 · Day 74 of protocol</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-3xl text-[#C8A96E] leading-none">74</p>
                  <p className="text-[10px] text-white/25 mt-1 uppercase tracking-widest">Baseline Score</p>
                </div>
              </div>

              <div className="mb-7">
                <div className="w-full h-px bg-white/[0.07] relative">
                  <div className="absolute inset-y-[-1px] left-0 bg-gradient-to-r from-[#C8A96E]/40 to-[#C8A96E]" style={{width:"74%"}} />
                  <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#C8A96E] border-2 border-[#0E0E0E] shadow-[0_0_8px_rgba(200,169,110,0.5)]" style={{left:"72%"}} />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="font-mono text-[10px] text-white/18">0</span>
                  <span className="font-mono text-[10px] text-[#C8A96E]">↑ +12 this quarter</span>
                  <span className="font-mono text-[10px] text-white/18">100</span>
                </div>
              </div>

              {/* Weekly trend bars */}
              <div className="mb-7">
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/25 mb-3">Sleep quality — 8 weeks</p>
                <div className="flex items-end gap-1 h-10">
                  {[45,52,55,58,61,67,70,74].map((v, i) => (
                    <div key={i} className="flex-1 rounded-sm bg-[#C8A96E]/20 relative overflow-hidden">
                      <div className="absolute bottom-0 inset-x-0 bg-[#C8A96E]/70 rounded-sm transition-all" style={{height:`${v}%`}} />
                    </div>
                  ))}
                </div>
              </div>

              {[
                { label: "Morning", dot: "bg-[#C8A96E]", items: ["BASELINE ONE · Daily Foundation","BASELINE LONGEVITY · Cellular Aging","BASELINE CLARITY · Cognitive"] },
                { label: "Evening", dot: "bg-[#8A9E8C]", items: ["BASELINE DEEP · Sleep Protocol"] },
              ].map(g => (
                <div key={g.label} className="mb-4">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-white/22 mb-2">{g.label}</p>
                  {g.items.map(item => (
                    <div key={item} className="flex items-center gap-2.5 py-1.5 border-b border-white/[0.05] last:border-0">
                      <span className={`w-1 h-1 rounded-full flex-shrink-0 ${g.dot}`} />
                      <span className="text-sm text-white/55">{item}</span>
                    </div>
                  ))}
                </div>
              ))}

              <div className="grid grid-cols-3 gap-3 pt-5 border-t border-white/[0.07]">
                {[["Sleep","+31%"],["Energy","+18%"],["Focus","+22%"]].map(([l,v]) => (
                  <div key={l} className="text-center">
                    <p className="font-mono text-sm text-[#C8A96E]">{v}</p>
                    <p className="text-[10px] text-white/25 mt-0.5 uppercase tracking-widest">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SUBSCRIPTION ────────────────────────────────────────── */}
        <section id="membership" className="px-6 md:px-12 py-28">
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#8A9E8C] mb-6">Membership</p>
          <h2 className="text-4xl md:text-5xl font-serif font-light mb-16">Choose your protocol tier.</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {TIERS.map(t => (
              <div key={t.name} className={`p-8 border transition-all duration-200 ${t.featured ? "border-[#0E0E0E] bg-[#0E0E0E] text-white" : "border-[#1C1C1E]/12 hover:border-[#1C1C1E]/35"}`}>
                {t.badge && <p className="text-[10px] tracking-[0.2em] uppercase text-[#C8A96E] mb-4">{t.badge}</p>}
                <p className={`text-[11px] tracking-[0.2em] uppercase mb-2 text-[#8A9E8C]`}>{t.name}</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-mono text-4xl">{t.price}</span>
                  <span className="text-sm" style={{color: t.featured ? "rgba(245,240,232,0.35)" : "rgba(28,28,30,0.35)"}}>/mo</span>
                </div>
                <p className={`text-sm mb-8 mt-2 ${t.featured ? "text-white/45" : "text-[#1C1C1E]/42"}`}>{t.desc}</p>
                <ul className="space-y-3 mb-10">
                  {t.features.map(f => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="text-[#C8A96E] text-xs mt-0.5 flex-shrink-0">→</span>
                      <span className={`text-xs leading-relaxed ${t.featured ? "text-white/60" : "text-[#1C1C1E]/50"}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3.5 text-[11px] tracking-[0.16em] uppercase transition-all duration-200 ${t.featured ? "bg-white text-[#0E0E0E] hover:bg-white/90" : "border border-[#1C1C1E]/18 hover:bg-[#0E0E0E] hover:text-white hover:border-[#0E0E0E]"}`}>
                  {t.cta}
                </button>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-[#1C1C1E]/28 text-center mt-7 tracking-wide">
            No lock-in. Pause anytime. Cancel in two steps.
          </p>
        </section>

        {/* ── TRUST BAND ──────────────────────────────────────────── */}
        <section className="border-t border-[#1C1C1E]/[0.07] px-6 md:px-12 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {["Manufactured in Scandinavia","Clinical doses — no exceptions","No proprietary blends","EFSA-compliant formulations"].map(t => (
              <p key={t} className="text-[10px] tracking-[0.15em] uppercase text-[#1C1C1E]/30">{t}</p>
            ))}
          </div>
        </section>

        {/* ── FOOTER ──────────────────────────────────────────────── */}
        <footer className="border-t border-[#1C1C1E]/[0.07] px-6 md:px-12 py-9">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <span className="text-[11px] font-semibold tracking-[0.28em] uppercase">Baseline</span>
            <p className="text-[11px] text-[#1C1C1E]/28">A Scandinavian longevity ecosystem. Built on Proteinbolaget infrastructure.</p>
            <p className="text-[11px] text-[#1C1C1E]/28">© 2025 Baseline</p>
          </div>
        </footer>

      </main>
    </>
  )
}
