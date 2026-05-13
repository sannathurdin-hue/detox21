"use client"

import { useEffect, useState } from "react"

const LINKS = ["Protocol", "Products", "Science", "Membership"] as const

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-colors duration-300 border-b ${
        scrolled
          ? "bg-[#0E0E0E]/95 backdrop-blur-xl border-white/[0.06]"
          : "bg-transparent border-transparent"
      }`}
    >
      <a href="#" className="text-[11px] font-semibold tracking-[0.28em] uppercase text-white">
        Baseline
      </a>

      <div className="hidden md:flex items-center gap-9 text-[11px] tracking-[0.16em] uppercase text-white/40">
        {LINKS.map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-white transition-colors">
            {l}
          </a>
        ))}
      </div>

      <button className="text-[11px] tracking-[0.16em] uppercase bg-white text-[#0E0E0E] px-5 py-2.5 hover:bg-white/90 transition-colors font-medium">
        Start →
      </button>
    </nav>
  )
}
