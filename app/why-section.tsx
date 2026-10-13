"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useInView, animate } from "framer-motion";
import { WaIcon } from "./hero-city";

export type WhyCopy = {
  eyebrow: string; title: string; lede: string;
  stats: [string, string][];
  chat: { title: string; msgs: { me?: boolean; t: string }[] };
  check: { title: string; items: string[]; foot: string };
  map: { title: string; sub: string; pins: string[] };
  journal: { title: string; sub: string; months: string[] };
  cta: { title: string; text: string; btn: string };
};

function Counter({ value, label, delay }: { value: string; label: string; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  useEffect(() => {
    const el = ref.current; if (!el || !inView) return;
    const num = parseFloat(value.replace(/[^\d.]/g, ""));
    const prefix = value.match(/^[^\d]*/)?.[0] ?? ""; const suffix = value.match(/[^\d.]*$/)?.[0] ?? "";
    const dec = value.includes(".") ? 1 : 0;
    const ctrl = animate(0, num, { duration: 1.6, delay, ease: [0.22, 1, 0.36, 1], onUpdate: v => { el.textContent = `${prefix}${v.toFixed(dec)}${suffix}`; } });
    return () => ctrl.stop();
  }, [inView, value, delay]);
  return <div className="stat"><b><span ref={ref}>0</span></b><span>{label}</span></div>;
}

function Chat({ c }: { c: WhyCopy["chat"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  return (
    <div ref={ref} className="bento chat">
      <div className="bento-title">{c.title}</div>
      <div className="chat-list">
        {c.msgs.map((m, i) => (
          <motion.div key={i} className={`chat-msg${m.me ? " me" : ""}`} initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}} transition={{ duration: 0.4, delay: 0.3 + i * 0.75, ease: [0.22, 1, 0.36, 1] }}>
            {m.t}<i>{`1${i}:0${i * 2}`}</i>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Checklist({ c }: { c: WhyCopy["check"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  return (
    <div ref={ref} className="bento check">
      <div className="bento-title">{c.title}</div>
      <ul className="check-list">
        {c.items.map((it, i) => (
          <motion.li key={it} initial={{ opacity: 0.35 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.4 + i * 0.5 }}>
            <motion.span className="check-box" initial={{ scale: 0.6 }} animate={inView ? { scale: 1, backgroundColor: "#c6390e", borderColor: "#c6390e" } : {}} transition={{ delay: 0.4 + i * 0.5, type: "spring", stiffness: 300, damping: 16 }}>
              <motion.svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><motion.path d="m5 12 5 5L20 7" initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ delay: 0.55 + i * 0.5, duration: 0.35 }} /></motion.svg>
            </motion.span>
            {it}
          </motion.li>
        ))}
      </ul>
      <p className="check-foot">{c.foot}</p>
    </div>
  );
}

const PINS: [number, number][] = [[62, 22], [52, 36], [42, 48], [30, 60], [20, 74]];

function MapTile({ c }: { c: WhyCopy["map"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  return (
    <div ref={ref} className="bento map">
      <div className="bento-title">{c.title}<small>{c.sub}</small></div>
      <svg className="map-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs><linearGradient id="sea" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#163a4a" /><stop offset="1" stopColor="#0c1e28" /></linearGradient></defs>
        <rect width="100" height="100" fill="url(#sea)" />
        <motion.path d="M100 0 L72 0 C64 10 60 26 50 36 C42 44 36 50 32 60 C27 72 22 82 8 100 L100 100 Z" fill="#2a2320" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.8 }} />
        <motion.path d="M72 0 C64 10 60 26 50 36 C42 44 36 50 32 60 C27 72 22 82 8 100" fill="none" stroke="#f4dead" strokeOpacity="0.5" strokeWidth="0.8" initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 1.6, ease: "easeInOut" }} />
        <path d="M78 14 C70 30 66 44 56 56 C48 66 44 76 36 92" fill="none" stroke="#5a4a40" strokeWidth="0.6" strokeDasharray="1.5 1.5" />
        {PINS.map(([x, y], i) => (
          <g key={i}>
            <motion.circle cx={x} cy={y} r="3.2" fill="#c6390e" fillOpacity="0.28" initial={{ scale: 0 }} animate={inView ? { scale: [0.6, 1.6, 1] } : {}} transition={{ delay: 0.9 + i * 0.3, duration: 1.4, repeat: Infinity, repeatDelay: 2.4 }} style={{ transformOrigin: `${x}px ${y}px` }} />
            <motion.circle cx={x} cy={y} r="1.5" fill="#c6390e" stroke="#f4dead" strokeWidth="0.6" initial={{ scale: 0, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : {}} transition={{ delay: 0.9 + i * 0.3, type: "spring", stiffness: 300, damping: 14 }} style={{ transformOrigin: `${x}px ${y}px` }} />
          </g>
        ))}
      </svg>
      <ul className="map-pins">{c.pins.map((p, i) => <motion.li key={p} initial={{ opacity: 0, x: -8 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 1 + i * 0.3 }}>{p}</motion.li>)}</ul>
    </div>
  );
}

function JournalTile({ c }: { c: WhyCopy["journal"] }) {
  const [i, setI] = useState(0);
  useEffect(() => { const id = window.setInterval(() => setI(k => (k + 1) % c.months.length), 2600); return () => window.clearInterval(id); }, [c.months.length]);
  return (
    <div className="bento journal">
      <div className="bento-title">{c.title}<small>{c.sub}</small></div>
      <div className="jr-stack" aria-hidden>
        {[2, 1, 0].map(k => {
          const m = c.months[(i + k) % c.months.length];
          return <motion.div key={m + k} className="jr-card" style={{ "--k": k } as CSSProperties} initial={{ y: 30, opacity: 0 }} animate={{ y: k * -10, opacity: 1 - k * 0.3, scale: 1 - k * 0.06 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}><b>{m}</b><span>Invest Realty · Batumi</span></motion.div>;
        })}
      </div>
    </div>
  );
}

export function WhySection({ c, wa }: { c: WhyCopy; wa: string }) {
  return (
    <section className="why" id="why">
      <div className="container">
        <div className="section-head">
          <div><p className="eyebrow light">{c.eyebrow}</p><h2 className="section-title light">{c.title}</h2></div>
          <p className="section-lede light">{c.lede}</p>
        </div>
        <div className="bento-grid">
          <div className="bento stats-tile">
            <div className="stats">{c.stats.map(([v, l], i) => <Counter key={l} value={v} label={l} delay={i * 0.12} />)}</div>
          </div>
          <Chat c={c.chat} />
          <MapTile c={c.map} />
          <Checklist c={c.check} />
          <JournalTile c={c.journal} />
          <div className="bento cta-tile">
            <h3>{c.cta.title}</h3>
            <p>{c.cta.text}</p>
            <a className="btn btn-dark" href={wa} target="_blank" rel="noopener noreferrer"><WaIcon />{c.cta.btn}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
