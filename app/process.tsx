"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { steps, type Lang } from "./data";

export type ProcessCopy = { eyebrow: string; title: string; lede: string; facts: [string, string][]; cta: string; photoCap: string };

export function Process({ lang, c, wa }: { lang: Lang; c: ProcessCopy; wa: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 65%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.4 });
  const keyY = useTransform(fill, [0, 1], ["0%", "100%"]);
  return (
    <section className="process" id="process">
      <div className="container proc-grid">
        <div className="proc-side">
          <div className="proc-sticky">
            <p className="eyebrow">{c.eyebrow}</p>
            <h2 className="section-title">{c.title}</h2>
            <p className="section-lede">{c.lede}</p>
            <ul className="proc-facts">
              {c.facts.map(([b, s]) => <li key={s}><b>{b}</b><span>{s}</span></li>)}
            </ul>
            <div className="proc-photo">
              <Image src="/images/keys.webp" alt={c.photoCap} fill sizes="(max-width: 960px) 90vw, 36vw" style={{ objectFit: "cover", objectPosition: "50% 30%" }} />
              <span>{c.photoCap}</span>
            </div>
            <a className="btn btn-wa" href={wa} target="_blank" rel="noopener noreferrer">{c.cta}</a>
          </div>
        </div>
        <div className="proc-line-wrap" ref={ref}>
          <div className="proc-line"><motion.div className="proc-line-fill" style={{ scaleY: fill }} /><motion.div className="proc-key" style={{ top: keyY }} aria-hidden><KeyIcon /></motion.div></div>
          <ol className="proc-steps">
            {steps.map((s, i) => (
              <motion.li key={s.n} className="proc-step" initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-12% 0px" }} transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}>
                <span className="proc-dot"><i>{s.n}</i></span>
                <div className="proc-card">
                  <div className="proc-card-top"><h3>{s.title[lang]}</h3><span className="proc-time">{s.time[lang]}</span></div>
                  <p>{s.text[lang]}</p>
                  {i === steps.length - 1 && <span className="proc-done">✓</span>}
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function KeyIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="8" cy="15" r="5" /><path d="m11.5 11.5 9-9M17 6l3 3M14 9l3 3" /></svg>;
}
