"use client";

import { useRef, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { services, type Lang, type Service } from "./data";

export type ServicesCopy = { eyebrow: string; title: string; lede: string; ask: string; note: string };

const ICONS: Record<Service["icon"], string[]> = {
  search: ["M9 9h30v30H9z", "M9 21h30M21 9v30", "M33 33l9 9", "M16 15h3v3h-3zM28 15h3v3h-3zM16 27h3v3h-3zM28 27h3v3h-3z"],
  sell: ["M6 40h36", "M10 40V18l14-10 14 10v22", "M20 40V28h8v12", "M30 8h8v8"],
  deal: ["M10 8h22l8 8v26H10z", "M32 8v8h8", "M16 24h16M16 30h16M16 36h10", "M18 18l2 2 4-4"],
  remote: ["M24 4a20 20 0 1 0 0 40 20 20 0 0 0 0-40z", "M4 24h40M24 4c6 6 6 34 0 40M24 4c-6 6-6 34 0 40", "M9 13c8 4 22 4 30 0M9 35c8-4 22-4 30 0"],
  commerce: ["M6 20l18-12 18 12", "M10 20v22h28V20", "M18 42V30h12v12", "M6 42h36", "M20 24h8"],
  invest: ["M6 40h36", "M10 34l9-10 7 6 12-14", "M30 16h8v8", "M10 40V10"],
};

export function Services({ lang, c, wa }: { lang: Lang; c: ServicesCopy; wa: (text: string) => string }) {
  const grid = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    grid.current?.querySelectorAll<HTMLElement>(".svc").forEach(card => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--x", `${e.clientX - r.left}px`);
      card.style.setProperty("--y", `${e.clientY - r.top}px`);
      const rx = ((e.clientY - r.top) / r.height - 0.5) * -4, ry = ((e.clientX - r.left) / r.width - 0.5) * 5;
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      card.style.setProperty("--rx", inside ? `${rx}deg` : "0deg");
      card.style.setProperty("--ry", inside ? `${ry}deg` : "0deg");
    });
  };
  const onLeave = () => grid.current?.querySelectorAll<HTMLElement>(".svc").forEach(card => { card.style.setProperty("--rx", "0deg"); card.style.setProperty("--ry", "0deg"); });
  return (
    <section className="services" id="services">
      <div className="container">
        <div className="section-head">
          <div><p className="eyebrow light">{c.eyebrow}</p><h2 className="section-title light">{c.title}</h2></div>
          <p className="section-lede light">{c.lede}</p>
        </div>
        <div className="svc-grid" ref={grid} onMouseMove={onMove} onMouseLeave={onLeave}>
          {services.map((s, i) => (
            <motion.article key={s.id} className="svc" initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-8% 0px" }} transition={{ duration: 0.55, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }} style={{ "--i": i } as CSSProperties}>
              <div className="svc-top">
                <span className="svc-ico">
                  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {ICONS[s.icon].map((d, k) => (
                      <motion.path key={k} d={d} initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true, margin: "-8% 0px" }} transition={{ duration: 1.1, delay: 0.2 + k * 0.22 + (i % 3) * 0.08, ease: "easeInOut" }} />
                    ))}
                  </svg>
                </span>
                <span className="svc-n">0{i + 1}</span>
              </div>
              <h3>{s.name[lang]}</h3>
              <p className="svc-text">{s.text[lang]}</p>
              <ul className="svc-items">{s.items.map(it => <li key={it.en}>{it[lang]}</li>)}</ul>
              <a className="svc-book" href={wa(s.name[lang])} target="_blank" rel="noopener noreferrer">{c.ask} →</a>
            </motion.article>
          ))}
        </div>
        <p className="svc-note">{c.note}</p>
      </div>
    </section>
  );
}
