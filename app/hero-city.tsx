"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useScroll, useMotionValueEvent, useReducedMotion, useInView } from "framer-motion";

export type CityCopy = {
  eyebrow: string; top: string; lines: string[]; lede: string; cta: string; cta2: string; rating: string; hint: string;
  badges: [string, string][];
  callouts: { t: string; s: string }[];
};

type Tower = { x: number; z: number; w: number; d: number; h: number; crown?: number; delay: number };

const TOWERS: Tower[] = [
  { x: 0.3, z: 0.2, w: 1.5, d: 1.5, h: 13, crown: 1.8, delay: 0 },
  { x: -3.9, z: 0.6, w: 1.3, d: 1.3, h: 10.5, crown: 1.2, delay: 0.1 },
  { x: 2.6, z: -1.6, w: 1.4, d: 1.4, h: 9, delay: 0.3 },
  { x: -6.2, z: -1.5, w: 1.6, d: 1.6, h: 7.5, delay: 0.25 },
  { x: 6.8, z: -0.8, w: 1.3, d: 1.3, h: 8.2, crown: 0.9, delay: 0.2 },
  { x: -1.6, z: -2.4, w: 2.0, d: 1.5, h: 6.2, delay: 0.4 },
  { x: 4.6, z: 0.9, w: 1.8, d: 1.3, h: 5.6, delay: 0.5 },
  { x: -8.4, z: 1.2, w: 1.2, d: 1.2, h: 4.4, delay: 0.6 },
  { x: 8.9, z: 1.4, w: 1.2, d: 1.2, h: 4.8, delay: 0.55 },
  { x: -2.2, z: -5.2, w: 1.7, d: 1.7, h: 8.6, delay: 0.7 },
  { x: 3.1, z: -5.0, w: 1.5, d: 1.5, h: 7.0, delay: 0.75 },
];

const FLOOR = 0.36;
const WARM = ["#ffd89a", "#ffc46b", "#ffe3b3", "#ffb45c", "#fff1d6"].map(c => new THREE.Color(c));
const DARK = new THREE.Color("#141a27");
const tmpColor = new THREE.Color();

function easeOut(t: number) { return 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3); }
function smooth(t: number) { const x = Math.min(Math.max(t, 0), 1); return x * x * (3 - 2 * x); }

/** One tower: a glass body, an optional crown and an instanced grid of windows on all four faces. */
function TowerMesh({ t, started, reduced, lit, flick }: { t: Tower; started: React.MutableRefObject<number>; reduced: boolean; lit: React.MutableRefObject<number>; flick: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const inst = useRef<THREE.InstancedMesh>(null);
  const { count, matrices, thresholds, warmIdx } = useMemo(() => {
    const dummy = new THREE.Object3D();
    const mats: THREE.Matrix4[] = []; const thr: number[] = []; const widx: number[] = [];
    const rows = Math.floor(t.h / FLOOR) - 1;
    let seed = Math.abs((t.x * 73 + t.z * 31 + t.h * 7) | 0) + 11;
    const rnd = () => { seed = ((seed * 9301 + 49297) % 233280 + 233280) % 233280; return seed / 233280; };
    const faces: [number, number, number, number][] = [[0, 0, 1, t.w], [0, 0, -1, t.w], [1, 0, 0, t.d], [-1, 0, 0, t.d]];
    for (const [nx, , nz, len] of faces) {
      const cols = Math.max(2, Math.floor(len / 0.34));
      for (let r = 1; r <= rows; r++) for (let c = 0; c < cols; c++) {
        const along = (c + 0.5) / cols - 0.5;
        const y = r * FLOOR + 0.1;
        if (nz !== 0) { dummy.position.set(t.x + along * len * 0.86, y, t.z + nz * (t.d / 2 + 0.012)); dummy.rotation.set(0, nz > 0 ? 0 : Math.PI, 0); }
        else { dummy.position.set(t.x + nx * (t.w / 2 + 0.012), y, t.z + along * len * 0.86); dummy.rotation.set(0, nx > 0 ? Math.PI / 2 : -Math.PI / 2, 0); }
        dummy.updateMatrix(); mats.push(dummy.matrix.clone());
        thr.push(rnd()); widx.push(Math.floor(rnd() * WARM.length));
      }
    }
    return { count: mats.length, matrices: mats, thresholds: thr, warmIdx: widx };
  }, [t]);
  useEffect(() => {
    const m = inst.current; if (!m) return;
    matrices.forEach((mat, i) => m.setMatrixAt(i, mat));
    for (let i = 0; i < count; i++) m.setColorAt(i, DARK);
    m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [matrices, count]);
  const lastLit = useRef(-1);
  useFrame(state => {
    const g = group.current; const m = inst.current; if (!g || !m) return;
    const el = reduced ? 10 : Math.max(0, state.clock.elapsedTime - started.current - t.delay);
    const rise = easeOut(el / 1.5);
    g.position.y = -t.h * (1 - rise) - (rise < 1 ? 0.3 : 0);
    const q = Math.round((lit.current + flick.current * 0.01) * 80) / 80;
    if (q !== lastLit.current) {
      lastLit.current = q;
      for (let i = 0; i < count; i++) {
        const on = thresholds[i] < q;
        if (on) { tmpColor.copy(WARM[warmIdx[i]]); if (thresholds[i] > q - 0.03) tmpColor.multiplyScalar(0.6); m.setColorAt(i, tmpColor); }
        else m.setColorAt(i, DARK);
      }
      if (m.instanceColor) m.instanceColor.needsUpdate = true;
    }
  });
  return (
    <group ref={group}>
      <mesh position={[t.x, t.h / 2, t.z]} castShadow>
        <boxGeometry args={[t.w, t.h, t.d]} />
        <meshPhysicalMaterial color="#1b2130" metalness={0.6} roughness={0.32} clearcoat={0.55} clearcoatRoughness={0.3} envMapIntensity={1.1} />
      </mesh>
      <mesh position={[t.x, t.h + 0.05, t.z]}>
        <boxGeometry args={[t.w + 0.06, 0.1, t.d + 0.06]} />
        <meshStandardMaterial color="#2c3140" roughness={0.6} metalness={0.3} />
      </mesh>
      {t.crown && (
        <group>
          <mesh position={[t.x, t.h + t.crown / 2, t.z]}>
            <boxGeometry args={[t.w * 0.5, t.crown, t.d * 0.5]} />
            <meshPhysicalMaterial color="#232a3a" metalness={0.7} roughness={0.25} clearcoat={0.6} />
          </mesh>
          <mesh position={[t.x, t.h + t.crown + 0.6, t.z]}>
            <cylinderGeometry args={[0.02, 0.05, 1.2, 6]} />
            <meshBasicMaterial color="#ffb15c" toneMapped={false} />
          </mesh>
        </group>
      )}
      <instancedMesh ref={inst} args={[undefined, undefined, count]}>
        <planeGeometry args={[0.2, 0.19]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

function Promenade() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const n = 26;
  useEffect(() => {
    const m = ref.current; if (!m) return;
    const d = new THREE.Object3D();
    for (let i = 0; i < n; i++) { d.position.set(-11 + i * (22 / (n - 1)), 0.42, 4.9); d.updateMatrix(); m.setMatrixAt(i, d.matrix); }
    m.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, n]}>
      <sphereGeometry args={[0.045, 8, 8]} />
      <meshBasicMaterial color="#ffd27a" toneMapped={false} />
    </instancedMesh>
  );
}

function Scene({ p, mobile, reduced, onReady }: { p: React.MutableRefObject<number>; mobile: boolean; reduced: boolean; onReady: () => void }) {
  const { camera } = useThree();
  const started = useRef(-1);
  const lit = useRef(0.12);
  const flick = useRef(0);
  const sun = useRef<THREE.DirectionalLight>(null);
  const rim = useRef<THREE.SpotLight>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const look = useMemo(() => new THREE.Vector3(), []);
  const towers = useMemo(() => (mobile ? TOWERS.slice(0, 7) : TOWERS), [mobile]);
  useEffect(() => {
    const h = (e: PointerEvent) => { pointer.current = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 }; };
    window.addEventListener("pointermove", h, { passive: true });
    return () => window.removeEventListener("pointermove", h);
  }, []);
  useFrame(state => {
    if (started.current < 0) { started.current = state.clock.elapsedTime; onReady(); }
    const pp = reduced ? 0.35 : p.current;
    const tt = state.clock.elapsedTime;
    lit.current = 0.12 + 0.8 * smooth(pp);
    flick.current = reduced ? 0 : Math.sin(tt * 0.9) + Math.sin(tt * 2.3);
    const ang = (mobile ? 0.02 : 0.16) - pp * 1.05;
    const rad = mobile ? 37 - pp * 6 : 34 - pp * 6;
    const hgt = (mobile ? 2.4 : 2.6) + pp * (mobile ? 14 : 14);
    const mx = reduced ? 0 : pointer.current.x, my = reduced ? 0 : pointer.current.y;
    const idle = reduced ? 0 : Math.sin(tt * 0.35) * 0.03;
    const a = ang + idle + mx * 0.05;
    camera.position.set(Math.sin(a) * rad, hgt + my * 0.35, Math.cos(a) * rad);
    look.set(mobile ? 0 : -6.5 + pp * 2.5, (mobile ? 2.4 : 5.3) + pp * 0.6 - my * 0.3, -1.4);
    camera.lookAt(look);
    if (sun.current) sun.current.intensity = 2.6 * (1 - smooth(pp) * 0.88);
    if (rim.current) rim.current.intensity = 60 + smooth(pp) * 120;
  });
  return (
    <>
      <ambientLight intensity={0.22} color="#ffe4c4" />
      <directionalLight ref={sun} position={[-14, 5, -8]} intensity={2.6} color="#ffb074" />
      <spotLight ref={rim} position={[10, 14, 12]} angle={0.6} penumbra={1} intensity={60} color="#ff7a3d" />
      <pointLight position={[0, 1.2, 6]} intensity={12} color="#ffcf8a" distance={14} decay={2} />
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={1.4} form="rect" position={[0, 14, -4]} scale={[20, 6, 1]} rotation-x={Math.PI / 2} color="#ffd9b8" />
        <Lightformer intensity={2.2} form="rect" position={[-12, 5, -6]} scale={[6, 8, 1]} rotation-y={Math.PI / 2} color="#ff9a5c" />
        <Lightformer intensity={0.8} form="rect" position={[12, 4, 6]} scale={[4, 10, 1]} rotation-y={-Math.PI / 2} color="#7fa3d6" />
        <Lightformer intensity={0.6} form="ring" position={[0, 2, 16]} scale={6} color="#ffb98a" />
      </Environment>
      <group>
        {towers.map(t => <TowerMesh key={`${t.x}-${t.z}`} t={t} started={started} reduced={reduced} lit={lit} flick={flick} />)}
        <mesh position={[0, 0.17, -1.4]}>
          <boxGeometry args={[23, 0.34, 13.6]} />
          <meshStandardMaterial color="#17120f" roughness={0.92} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0.36, 4.9]}>
          <boxGeometry args={[23, 0.04, 0.9]} />
          <meshStandardMaterial color="#3a2a21" roughness={0.9} />
        </mesh>
        <Promenade />
        <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
          <planeGeometry args={[120, 120]} />
          {mobile ? (
            <meshStandardMaterial color="#0d151c" roughness={0.18} metalness={0.7} envMapIntensity={1.2} />
          ) : (
            <MeshReflectorMaterial blur={[260, 90]} resolution={512} mixBlur={0.9} mixStrength={2.2} roughness={0.75} depthScale={0.6} minDepthThreshold={0.6} maxDepthThreshold={1.3} color="#0c141b" metalness={0.55} mirror={0.55} />
          )}
        </mesh>
      </group>
    </>
  );
}

export function HeroCity({ c, wa }: { c: CityCopy; wa: string }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const visible = useInView(ref);
  const p = useRef(0);
  const [pState, setP] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", v => { p.current = v; setP(Math.round(v * 100) / 100); });
  const [mobile, setMobile] = useState(false);
  const [gl, setGl] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion() ?? false;
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const cv = document.createElement("canvas");
    let ok = false;
    try { ok = !!(cv.getContext("webgl2") || cv.getContext("webgl")); } catch { ok = false; }
    setGl(ok);
    const mq = window.matchMedia("(max-width: 860px)");
    const upd = () => setMobile(mq.matches);
    upd(); mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, []);
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setIdx(i => (i + 1) % c.lines.length), 4200);
    return () => window.clearInterval(id);
  }, [c.lines.length, reduced]);

  const callout = pState < 0.08 ? -1 : pState < 0.38 ? 0 : pState < 0.66 ? 1 : 2;

  return (
    <section ref={ref} className="chero" id="top" style={{ "--p": pState } as CSSProperties}>
      <div className="chero-stage">
        <div className="chero-sky" aria-hidden><div className="chero-sky-night" /><div className="chero-stars" /><div className="chero-sun" /></div>
        <div className={`chero-canvas${ready ? " is-ready" : ""}`} aria-hidden>
          {gl && (
            <Canvas frameloop={visible ? "always" : "demand"} dpr={[1, mobile ? 1 : 1.5]} camera={{ fov: mobile ? 50 : 38, position: [0, 2, 18], near: 0.5, far: 140 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }} style={{ pointerEvents: "none" }}>
              <Scene p={p} mobile={mobile} reduced={reduced} onReady={() => setReady(true)} />
            </Canvas>
          )}
        </div>
        {gl === false && <div className="chero-fallback" />}
        <div className="chero-haze" aria-hidden /><div className="chero-shade" aria-hidden />
        <div className="chero-copy">
          <p className="eyebrow light">{c.eyebrow}</p>
          <h1 className="chero-title">
            <span className="chero-top">{c.top}</span>
            <span key={idx} className="chero-line">{c.lines[idx]}</span>
          </h1>
          <p className="chero-lede">{c.lede}</p>
          <p className="chero-rating"><span>★★★★★</span>{c.rating}</p>
          <div className="chero-actions">
            <a className="btn btn-wa" href={wa} target="_blank" rel="noopener noreferrer"><WaIcon />{c.cta}</a>
            <a className="btn btn-ghost" href="#listings">{c.cta2}</a>
          </div>
          <ul className="chero-badges">{c.badges.map(([b, s]) => <li key={s}><b>{b}</b><span>{s}</span></li>)}</ul>
        </div>
        <div className="chero-callouts">
          {c.callouts.map((k, i) => (
            <div key={k.t} className={`chero-callout${callout === i ? " on" : ""}`} style={{ "--i": i } as CSSProperties}>
              <i /><b>{k.t}</b><span>{k.s}</span>
            </div>
          ))}
        </div>
        <div className="chero-hint"><span>{c.hint}</span><span className="chero-hint-dot">↓</span></div>
      </div>
    </section>
  );
}

export function WaIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3c.2-.6.2-1.1.2-1.3l-.6-.3z" /></svg>;
}
