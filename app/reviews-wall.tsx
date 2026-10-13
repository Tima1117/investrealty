"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { reviews, type Lang } from "./data";

export type ReviewsCopy = { eyebrow: string; title: string; lede: string; google: string; count: string; verified: string; more: string; less: string };

export function ReviewsWall({ lang, c, placeUrl }: { lang: Lang; c: ReviewsCopy; placeUrl: string }) {
  const [all, setAll] = useState(false);
  const shown = all ? reviews : reviews.slice(0, 6);
  return (
    <section className="reviews" id="reviews">
      <div className="container">
        <div className="section-head">
          <div><p className="eyebrow">{c.eyebrow}</p><h2 className="section-title">{c.title}</h2></div>
          <div className="rev-badge">
            <b>4.8</b>
            <div><span className="rev-badge-stars">★★★★★</span><span className="rev-badge-count">{c.count}</span><a href={placeUrl} target="_blank" rel="noopener noreferrer">{c.google} ↗</a></div>
          </div>
        </div>
        <p className="section-lede rev-lede">{c.lede}</p>
        <motion.div className="rev-grid" layout>
          <AnimatePresence initial={false}>
            {shown.map((r, i) => (
              <motion.article key={r.author} layout className="rev-card" initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} viewport={{ once: true, margin: "-6% 0px" }} transition={{ duration: 0.5, delay: (i % 3) * 0.07, ease: [0.22, 1, 0.36, 1] }}>
                <div className="rev-stars">★★★★★<span>{r.source}</span></div>
                <p>{r.text[lang]}</p>
                <div className="rev-meta">
                  <span className="rev-ava">{r.author.trim().charAt(0).toUpperCase()}</span>
                  <div><b>{r.author}</b><span>{r.date[lang]}</span></div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
        <div className="rev-actions">
          <button className="btn btn-outline" onClick={() => setAll(a => !a)}>{all ? c.less : c.more}</button>
          <p className="rev-foot">{c.verified}</p>
        </div>
      </div>
    </section>
  );
}
