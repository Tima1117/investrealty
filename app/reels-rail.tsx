"use client";

import Image from "next/image";
import { reels, type Lang } from "./data";

export type ReelsCopy = { eyebrow: string; title: string; lede: string; follow: string; stats: string };

export function ReelsRail({ lang, c, igUrl, ytUrl, tgUrl }: { lang: Lang; c: ReelsCopy; igUrl: string; ytUrl: string; tgUrl: string }) {
  return (
    <section className="reels" id="media">
      <div className="container">
        <div className="section-head">
          <div><p className="eyebrow light">{c.eyebrow}</p><h2 className="section-title light">{c.title}</h2></div>
          <div className="reels-links">
            <p className="section-lede light">{c.lede}</p>
            <div className="reels-btns">
              <a className="btn btn-ghost btn-sm" href={igUrl} target="_blank" rel="noopener noreferrer">Instagram ↗</a>
              <a className="btn btn-ghost btn-sm" href={ytUrl} target="_blank" rel="noopener noreferrer">YouTube ↗</a>
              <a className="btn btn-ghost btn-sm" href={tgUrl} target="_blank" rel="noopener noreferrer">Telegram ↗</a>
            </div>
          </div>
        </div>
      </div>
      <div className="reels-viewport">
        <div className="reels-track">
          {[0, 1].map(copy => (
            <div className="reels-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
              {reels.map((r, i) => (
                <a key={r.src + copy} className="reel" href={igUrl} target="_blank" rel="noopener noreferrer" tabIndex={copy === 1 ? -1 : 0}>
                  <Image src={r.src} alt={copy === 1 ? "" : r.cap[lang]} fill sizes="(max-width: 860px) 58vw, 22vw" style={{ objectFit: "cover" }} />
                  <span className="reel-play" aria-hidden><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg></span>
                  <span className="reel-cap"><i>{String(i + 1).padStart(2, "0")}</i>{r.cap[lang]}</span>
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <p className="reels-stats">{c.stats}</p>
    </section>
  );
}
