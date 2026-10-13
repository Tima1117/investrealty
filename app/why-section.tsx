"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useInView, animate, useReducedMotion } from "framer-motion";
import Image from "next/image";
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
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (reduced) { el.textContent = value; return; }
    if (!inView) return;
    const num = parseFloat(value.replace(/[^\d.]/g, ""));
    const prefix = value.match(/^[^\d]*/)?.[0] ?? ""; const suffix = value.match(/[^\d.]*$/)?.[0] ?? "";
    const dec = value.includes(".") ? 1 : 0;
    const ctrl = animate(0, num, { duration: 1.6, delay, ease: [0.22, 1, 0.36, 1], onUpdate: v => { el.textContent = `${prefix}${v.toFixed(dec)}${suffix}`; } });
    return () => ctrl.stop();
  }, [inView, value, delay, reduced]);
  return <div className="stat"><b><span ref={ref}>{value}</span></b><span>{label}</span></div>;
}

function Chat({ c }: { c: WhyCopy["chat"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const observed = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = useReducedMotion();
  const inView = observed || reduced;
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
  const observed = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = useReducedMotion();
  const inView = observed || reduced;
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

const districtPhotos = [
  {
    "src": "/images/district-makhinjauri.webp",
    "author": "Krzysztof Ziarnek, Kenraiz",
    "source": "https://commons.wikimedia.org/wiki/File:Makhinjauri_Beach_kz1.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    "src": "/images/district-new-boulevard.webp",
    "author": "w0zny",
    "source": "https://commons.wikimedia.org/wiki/File:Batumi,_Lech_and_Maria_Kaczynski_St._Batumi_blv.,_Georgia_Bebop_Drone_2015-08-26T170204%2B0000_36F032.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  {
    "src": "/images/district-old-town.webp",
    "author": "Aleksey Muhranoff",
    "source": "https://commons.wikimedia.org/wiki/File:Batumi._Piazza_Square.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  {
    "src": "/images/district-rustaveli.webp",
    "author": "Андрей Романенко",
    "source": "https://commons.wikimedia.org/wiki/File:Rustaveli_Avenue_in_Batumi.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    "src": "/images/district-gonio.webp",
    "author": "Sigara Icelmez",
    "source": "https://commons.wikimedia.org/wiki/File:Gonio,_Batumi,_Georgia.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  }
];

function MapTile({ c, wa, ask }: { c: WhyCopy["map"]; wa: string; ask: string }) {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(0);
  const [loaded, setLoaded] = useState<boolean[]>([]);
  useEffect(() => { if (loaded[active]) setShown(active); }, [active, loaded]);
  const url = new URL(wa);
  url.searchParams.set("text", `${url.searchParams.get("text") ?? ""} — ${c.pins[active]}`);
  return (
    <div className="bento district">
      {districtPhotos.map((photo, i) => <Image key={photo.src} className={`district-photo${shown === i ? " selected" : ""}`} src={photo.src} alt={c.pins[i]} aria-hidden={shown !== i} fill sizes="(max-width: 760px) 90vw, 50vw" onLoad={() => setLoaded(prev => { if (prev[i]) return prev; const next = [...prev]; next[i] = true; return next; })} />)}
      <div className="district-shade" />
      <div className="bento-title">{c.title}<small>{c.sub}</small></div>
      <div className="district-content" aria-busy={!loaded[active]}>
        <span className="district-index">0{active + 1} / 05</span>
        <h3 key={c.pins[active]}>{c.pins[active]}</h3>
        <div className="district-options" role="group" aria-label={c.title}>{c.pins.map((p, i) => <button key={i} type="button" aria-pressed={active === i} onClick={() => setActive(i)}>{p}</button>)}</div>
        <a className="district-cta" href={url.toString()} target="_blank" rel="noopener noreferrer">{ask}<span aria-hidden="true">↗</span></a>
        <div className="district-credit"><a href={districtPhotos[shown].source} target="_blank" rel="noopener noreferrer">© {districtPhotos[shown].author}</a><span> · </span><a href={districtPhotos[shown].licenseUrl} target="_blank" rel="noopener noreferrer">{districtPhotos[shown].license}</a></div>
      </div>
    </div>
  );
}

function JournalTile({ c }: { c: WhyCopy["journal"] }) {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => { if (reduced) return; const id = window.setInterval(() => setI(k => (k + 1) % c.months.length), 2600); return () => window.clearInterval(id); }, [c.months.length, reduced]);
  return (
    <div className="bento journal">
      <div className="bento-title">{c.title}<small>{c.sub}</small></div>
      <div className="jr-stack" aria-hidden>
        {[2, 1, 0].map(k => {
          const m = c.months[(i + k) % c.months.length];
          return <motion.div key={m + k} className="jr-card" style={{ "--k": k } as CSSProperties} initial={{ y: 30, opacity: 0 }} animate={{ y: k * -10, opacity: 1 - k * 0.3, scale: 1 - k * 0.06 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>{k === 0 && <><b>{m}</b><span>Invest Realty · Batumi</span></>}</motion.div>;
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
          <MapTile c={c.map} wa={wa} ask={c.cta.btn} />
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
