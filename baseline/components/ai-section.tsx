const FEATURES = [
  "Assessment-driven product assignment",
  "Weekly Baseline Score updates",
  "Quarterly AI protocol adjustment",
  "Bloodwork integration (optional)",
]

const ADVISORS = [
  ["EL", "Dr. Erik Lindgren", "MD, PhD · Karolinska"],
  ["SB", "Prof. Sara Björk",  "PhD · Uppsala University"],
  ["MO", "Dr. Mikael Ohm",    "Longevity Research · Gothenburg"],
] as const

const SLEEP_TREND = [45, 52, 55, 58, 61, 67, 70, 74]

const STACK = [
  { label: "Morning", dot: "bg-[#C8A96E]", items: ["BASELINE ONE · Daily Foundation", "BASELINE LONGEVITY · Cellular Aging", "BASELINE CLARITY · Cognitive"] },
  { label: "Evening", dot: "bg-[#8A9E8C]", items: ["BASELINE DEEP · Sleep Protocol"] },
]

const METRICS = [["Sleep", "+31%"], ["Energy", "+18%"], ["Focus", "+22%"]] as const

export default function AiSection() {
  return (
    <section id="science" className="bg-[#0E0E0E] text-white px-6 md:px-12 py-28">
      <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center max-w-6xl mx-auto">

        {/* ── Copy + advisors ────────────────────────────────────── */}
        <div>
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#8A9E8C] mb-10">AI Personalization</p>
          <h2 className="text-4xl md:text-5xl font-serif font-light leading-tight mb-6">
            Your protocol.<br />
            <span className="text-white/35">Not a template.</span>
          </h2>
          <p className="text-sm text-white/45 leading-relaxed mb-9 max-w-sm">
            Every recommendation derives from your check-in data, your biomarkers, and 90-day
            response patterns. The longer you&apos;re on protocol, the sharper the intelligence gets.
          </p>

          <div className="space-y-3.5 mb-10">
            {FEATURES.map(f => (
              <div key={f} className="flex items-center gap-3">
                <span className="w-1 h-1 rounded-full bg-[#C8A96E] flex-shrink-0" />
                <span className="text-sm text-white/55">{f}</span>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/[0.07]">
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/25 mb-5">Scientific Advisory</p>
            <div className="flex flex-col gap-4">
              {ADVISORS.map(([init, name, role]) => (
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

        {/* ── Protocol card ──────────────────────────────────────── */}
        <div className="border border-white/[0.09] bg-white/[0.025] p-8">

          {/* Card header */}
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

          {/* Score bar */}
          <div className="mb-7">
            <div className="w-full h-px bg-white/[0.07] relative">
              <div className="absolute inset-y-[-1px] left-0 bg-gradient-to-r from-[#C8A96E]/40 to-[#C8A96E]" style={{ width: "74%" }} />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#C8A96E] border-2 border-[#0E0E0E] shadow-[0_0_8px_rgba(200,169,110,0.5)]"
                style={{ left: "72%" }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="font-mono text-[10px] text-white/[0.18]">0</span>
              <span className="font-mono text-[10px] text-[#C8A96E]">↑ +12 this quarter</span>
              <span className="font-mono text-[10px] text-white/[0.18]">100</span>
            </div>
          </div>

          {/* Trend bars */}
          <div className="mb-7">
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/25 mb-3">Sleep quality — 8 weeks</p>
            <div className="flex items-end gap-1 h-10">
              {SLEEP_TREND.map((v, i) => (
                <div key={i} className="flex-1 rounded-sm bg-[#C8A96E]/20 relative overflow-hidden">
                  <div className="absolute bottom-0 inset-x-0 bg-[#C8A96E]/70 rounded-sm" style={{ height: `${v}%` }} />
                </div>
              ))}
            </div>
          </div>

          {/* Protocol stack */}
          {STACK.map(g => (
            <div key={g.label} className="mb-4">
              <p className="text-[10px] tracking-[0.2em] uppercase text-white/[0.22] mb-2">{g.label}</p>
              {g.items.map(item => (
                <div key={item} className="flex items-center gap-2.5 py-1.5 border-b border-white/[0.05] last:border-0">
                  <span className={`w-1 h-1 rounded-full flex-shrink-0 ${g.dot}`} />
                  <span className="text-sm text-white/55">{item}</span>
                </div>
              ))}
            </div>
          ))}

          {/* Outcome metrics */}
          <div className="grid grid-cols-3 gap-3 pt-5 border-t border-white/[0.07]">
            {METRICS.map(([l, v]) => (
              <div key={l} className="text-center">
                <p className="font-mono text-sm text-[#C8A96E]">{v}</p>
                <p className="text-[10px] text-white/25 mt-0.5 uppercase tracking-widest">{l}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
