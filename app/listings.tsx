"use client";

import Image from "next/image";
import { useMemo, useState, type CSSProperties } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { listings, usd, type Lang, type Listing } from "./data";

export type ListingsCopy = {
  eyebrow: string; title: string; lede: string;
  tabs: { all: string; studio: string; flat: string; premium: string; land: string };
  area: string; ask: string; more: string; less: string; photo: string; note: string; sort: string; sortAsc: string; sortDesc: string; count: (n: number) => string;
};

type Cat = "all" | Listing["cat"];

export function Listings({ lang, c, wa, onPhoto }: { lang: Lang; c: ListingsCopy; wa: (text: string) => string; onPhoto: (src: string) => void }) {
  const [cat, setCat] = useState<Cat>("all");
  const [asc, setAsc] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const items = useMemo(() => {
    const f = listings.filter(l => cat === "all" || l.cat === cat);
    return f.sort((a, b) => (asc ? a.price - b.price : b.price - a.price));
  }, [cat, asc]);
  const tabs: Cat[] = ["all", "studio", "flat", "premium", "land"];
  return (
    <section className="listings" id="listings">
      <div className="container">
        <div className="section-head">
          <div><p className="eyebrow">{c.eyebrow}</p><h2 className="section-title">{c.title}</h2></div>
          <p className="section-lede">{c.lede}</p>
        </div>
        <div className="lst-bar">
          <div className="tabs" role="tablist">
            {tabs.map(k => (
              <button key={k} role="tab" aria-selected={cat === k} className={cat === k ? "active" : ""} onClick={() => setCat(k)}>
                {c.tabs[k]}<i>{k === "all" ? listings.length : listings.filter(l => l.cat === k).length}</i>
              </button>
            ))}
          </div>
          <button className="lst-sort" onClick={() => setAsc(a => !a)} aria-label={c.sort}>{asc ? c.sortAsc : c.sortDesc} <span aria-hidden>{asc ? "↑" : "↓"}</span></button>
        </div>
        <LayoutGroup>
          <motion.div className="lst-grid" layout>
            <AnimatePresence mode="popLayout">
              {items.map((l, i) => {
                const isOpen = open === l.id;
                return (
                  <motion.article key={l.id} layout className={`lst${isOpen ? " open" : ""}`} initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.45, delay: Math.min(i, 8) * 0.04, ease: [0.22, 1, 0.36, 1] }} style={{ "--i": i } as CSSProperties}>
                    <button type="button" className="lst-photo" onClick={() => onPhoto(l.photo)} aria-label={`${c.photo}: ${l.complex}`}>
                      <Image src={l.photo} alt={`${l.type[lang]} · ${l.complex}`} fill sizes="(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 30vw" style={{ objectFit: "cover" }} />
                      <span className="lst-tags">{l.tags.map(tg => <em key={tg.en}>{tg[lang]}</em>)}</span>
                      <span className="lst-price">{usd(l.price, lang)}</span>
                    </button>
                    <div className="lst-body">
                      <div className="lst-top">
                        <h3>{l.type[lang]} · {l.complex}</h3>
                        <span className="lst-addr">{l.address[lang]}</span>
                      </div>
                      <ul className="lst-chips">
                        {l.area && <li>{l.area.toLocaleString(lang === "en" ? "en-US" : "ru-RU")} {c.area}</li>}
                        {l.area && l.cat !== "land" && <li>{usd(Math.round(l.price / l.area), lang)}/{c.area}</li>}
                        {!l.area && <li>{l.tags[0][lang]}</li>}
                      </ul>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.p className="lst-blurb" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>{l.blurb[lang]}</motion.p>
                        )}
                      </AnimatePresence>
                      <div className="lst-foot">
                        <a className="btn btn-wa btn-sm" href={wa(`${l.type[lang]} · ${l.complex} · ${usd(l.price, lang)}`)} target="_blank" rel="noopener noreferrer">{c.ask}</a>
                        <button type="button" className="lst-more" onClick={() => setOpen(isOpen ? null : l.id)} aria-expanded={isOpen}>{isOpen ? c.less : c.more} <span aria-hidden>{isOpen ? "−" : "+"}</span></button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
        <p className="lst-note">{c.count(items.length)} · {c.note}</p>
      </div>
    </section>
  );
}
