"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { services, type Lang } from "./data";

export type ServicesCopy = { eyebrow: string; title: string; lede: string; ask: string; note: string };
const photos = ["agent-show", "kitchen", "keys", "balcony", "city-towers", "city-aerial"];

export function Services({ lang, c, wa }: { lang: Lang; c: ServicesCopy; wa: (text: string) => string }) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  return (
    <section className="services" id="services">
      <div className="container">
        <div className="section-head">
          <div><p className="eyebrow light">{c.eyebrow}</p><h2 className="section-title light">{c.title}</h2></div>
          <p className="section-lede light">{c.lede}</p>
        </div>
        <div className="service-editorial">
          <div className="service-photo" aria-hidden="true">
            {photos.map((photo, i) => <Image key={photo} src={`/images/${photo}.webp`} alt="" fill sizes="(max-width: 760px) 90vw, 45vw" className={i === active ? "selected" : ""} />)}
            <div className="service-photo-caption"><span>INVEST REALTY / BATUMI</span><b key={`${lang}-${active}`}>{services[active].name[lang]}</b><span className="service-photo-index">0{active + 1}<i> / 06</i></span></div>
          </div>
          <div className="service-list">
            {services.map((s, i) => <article key={s.id} className={`service-row${active === i ? " selected" : ""}`}>
              <h3><button id={`service-trigger-${s.id}`} type="button" aria-expanded={active === i} aria-controls={`service-panel-${s.id}`} onClick={() => setActive(i)}><span className="service-number">0{i + 1}</span><span>{s.name[lang]}</span><span className="service-toggle" aria-hidden="true">{active === i ? "−" : "+"}</span></button></h3>
              <div id={`service-panel-${s.id}`} role="region" aria-labelledby={`service-trigger-${s.id}`} hidden={active !== i}>
                {active === i && <motion.div className="service-detail" initial={{ y: reduced ? 0 : 8 }} animate={{ y: 0 }} transition={{ duration: .3 }}>
                  <p>{s.text[lang]}</p>
                  <ul>{s.items.map(it => <li key={it.en}>{it[lang]}</li>)}</ul>
                  <a href={wa(s.name[lang])} target="_blank" rel="noopener noreferrer">{c.ask}<span aria-hidden="true">↗</span></a>
                </motion.div>}
              </div>
            </article>)}
          </div>
        </div>
        <p className="svc-note">{c.note}</p>
      </div>
    </section>
  );
}
