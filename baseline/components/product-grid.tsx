"use client"

import { useState } from "react"

const PRODUCTS = [
  {
    code: "ONE",
    name: "BASELINE ONE",
    tag: "Daily Foundation",
    time: "Morning",
    desc: "Four clinically-dosed essentials. Triglyceride omega-3. Magnesium bisglycinate. D3 + K2. The irreducible foundation.",
  },
  {
    code: "DEEP",
    name: "BASELINE DEEP",
    tag: "Sleep Protocol",
    time: "Evening",
    desc: "Glycine 3g. L-theanine. Apigenin. KSM-66. Reduce sleep onset. Increase slow-wave sleep. Fastest feedback loop in longevity.",
  },
  {
    code: "CLARITY",
    name: "BASELINE CLARITY",
    tag: "Cognitive Longevity",
    time: "Morning",
    desc: "Lion's Mane dual-extract. Bacopa. Alpha-GPC. Pycnogenol. Not a nootropic — a long-term neural investment.",
  },
  {
    code: "LONGEVITY",
    name: "BASELINE LONGEVITY",
    tag: "Cellular Aging",
    time: "Morning",
    desc: "NR. Micronized resveratrol. Spermidine. Quercetin. Ubiquinol. NAD+ precursors at the doses used in the studies.",
  },
  {
    code: "RECOVER",
    name: "BASELINE RECOVER",
    tag: "Performance",
    time: "Post-training",
    desc: "Creatine monohydrate. HMB. Tart cherry. Type II collagen. Muscle is a longevity organ. Train it accordingly.",
  },
  {
    code: "BALANCE",
    name: "BASELINE BALANCE",
    tag: "Hormone Support",
    time: "Morning",
    desc: "KSM-66 at 600mg — the full clinical dose. Rhodiola. Phosphatidylserine. HPA axis regulation. Precision tier entry.",
  },
]

export default function ProductGrid() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section id="products" className="px-6 md:px-12 py-20 border-t border-[#1C1C1E]/[0.07]">
      {/* Header */}
      <div className="flex items-end justify-between mb-14">
        <div>
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#8A9E8C] mb-4">The Protocol</p>
          <h2 className="text-4xl md:text-5xl font-serif font-light">
            Six products.<br />One ecosystem.
          </h2>
        </div>
        <button className="hidden md:block text-[11px] tracking-[0.16em] uppercase text-[#1C1C1E]/35 hover:text-[#1C1C1E] transition-colors border-b border-[#1C1C1E]/15 pb-1">
          View all →
        </button>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-3 gap-px bg-[#1C1C1E]/10">
        {PRODUCTS.map((p, i) => (
          <div
            key={p.code}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className={`p-8 transition-all duration-300 cursor-pointer ${
              hovered === i ? "bg-[#0E0E0E] text-white" : "bg-[#F5F0E8]"
            }`}
          >
            <div className="flex items-start justify-between mb-6">
              <span className="font-mono text-[11px] text-[#C8A96E]">{p.code}</span>
              <span
                className={`text-[10px] tracking-[0.14em] uppercase px-2 py-1 border ${
                  hovered === i
                    ? "border-white/[0.12] text-white/35"
                    : "border-[#1C1C1E]/10 text-[#1C1C1E]/30"
                }`}
              >
                {p.time}
              </span>
            </div>

            <h3 className="text-[15px] font-medium tracking-tight mb-1.5">{p.name}</h3>
            <p className="text-[11px] uppercase tracking-widest text-[#8A9E8C] mb-4">{p.tag}</p>
            <p
              className={`text-sm leading-relaxed ${
                hovered === i ? "text-white/55" : "text-[#1C1C1E]/42"
              }`}
            >
              {p.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
