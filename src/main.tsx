import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  HashRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Search,
  SlidersHorizontal,
  Layers,
  Crosshair,
  Shield,
  ChevronRight,
} from "lucide-react";
import {
  grades,
  releases,
  records,
  queryRecords,
  type RecordKit,
} from "./data";
import "./style.css";
import "./rx78-theme.css";
import "./orbital.css";
const image = (path: string) => `${import.meta.env.BASE_URL}${path}`;
function Schematic({ className = "" }: { className?: string }) {
  return (
    <img
      className={className}
      src={image("schematic.svg")}
      alt="Original geometric mobile-suit study. Schematic placeholder, not a product photograph."
    />
  );
}
function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}
function App() {
  const location = useLocation();
  const [entered, setEntered] = useState(false);
  const [activating, setActivating] = useState(false);
  const [holoBooting, setHoloBooting] = useState(false);
  useEffect(() => {
    if (!holoBooting) return;
    const timer = window.setTimeout(() => setHoloBooting(false), 1700);
    return () => window.clearTimeout(timer);
  }, [holoBooting]);
  const main = useRef<HTMLElement>(null);
  const previousPath = useRef(location.pathname);
  useEffect(() => {
    document.title = `RX-78 Portal — ${location.pathname === "/" ? "Collection Archive" : location.pathname.startsWith("/kit") ? "Kit Record" : "Archive Index"}`;
    if (previousPath.current !== location.pathname) main.current?.focus();
    previousPath.current = location.pathname;
    window.scrollTo(0, 0);
  }, [location.pathname]);
  useEffect(() => {
    if (entered) main.current?.focus();
  }, [entered]);
  if (location.pathname === "/" && !entered) {
    return <><BustBackdrop active={activating} entered={false} /><ArchiveEntry onStart={() => setActivating(true)} onEnter={() => { setHoloBooting(true); setEntered(true); }} /></>;
  }
  return (
    <>
      <div className={`archive-shell ${entered ? "is-revealed" : ""} ${location.pathname === "/" ? "orbital-shell" : ""} ${holoBooting ? "holo-booting" : ""}`}>
      {holoBooting && <div className="holo-boot-overlay" aria-hidden="true"><span>HOLOGRAPHIC LINK // SYNCHRONIZING</span></div>}
      <a
        className="skip"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          main.current?.focus();
        }}
      >
        Skip to content
      </a>
      <header>
        <Link className="brand" to="/">
          <span className="brand-icon">
            <Crosshair size={25} />
          </span>
          <span>
            RX-78<span className="brand-light"> PORTAL</span>
            <small>EARTH FEDERATION // ARCHIVE DIVISION</small>
          </span>
        </Link>
        <nav aria-label="Primary">
          <NavLink to="/archive">
            All Kits
          </NavLink>
          <NavLink to="/evolution">Evolution</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
        <span className="online">
          <i /> SYSTEM ONLINE
        </span>
      </header>
      <main id="main-content" ref={main} tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/evolution" element={<Evolution />} />
          <Route path="/kit/:id" element={<Detail />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {location.pathname !== "/" && <footer>
        <Link to="/" className="footer-brand">
          ⊕ RX-78 PORTAL
        </Link>
        <span>INDEPENDENT FAN ARCHIVE · DEMO DATA</span>
        <Link to="/about">
          Archive notes <ArrowUpRight size={13} />
        </Link>
        <span className="footer-end">
          END OF TRANSMISSION <i />
        </span>
      </footer>}
      </div>
    </>
  );
}
function BustBackdrop({ active, entered }: { active: boolean; entered: boolean }) {
  return <div className={`bust-backdrop ${active ? "is-active" : ""} ${entered ? "is-dimmed" : ""}`} aria-hidden="true">
    <svg viewBox="0 0 657 900" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="eye-edge-feather" x="-30%" y="-70%" width="160%" height="240%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="0.65" />
        </filter>
        <mask id="bust-eye-lenses" maskUnits="userSpaceOnUse" x="295" y="125" width="45" height="20">
          <g fill="white" filter="url(#eye-edge-feather)">
            <path d="M301 131 L312 134 L305 137 L302 135 Z" />
            <path d="M324 134 L334 132 L331 137 L328 138 Z" />
          </g>
        </mask>
      </defs>
      <image href={image("rx78-shoulders-refined.png")} width="657" height="900" />
      <g className="bust-eyes">
        <image className="eye-lens-light" href={image("rx78-shoulders-refined.png")} width="657" height="900" mask="url(#bust-eye-lenses)" />
      </g>
      <g className="vent-smoke cheek-smoke">{[0,1].map(side =>
        [0,1,2,3,4].map(slot => <g key={`${side}-${slot}`} transform={`translate(${side ? [349,348,347,346,345][slot] : [282,283,284,285,286][slot]}, ${(side ? [138,145,152,159,166] : [132,139,146,153,160])[slot]}) scale(.7)`}>
          <ellipse className="vent-source" cx={side ? 3 : -3} cy="0" rx="5" ry="3" />
          {Array.from({length: 6}, (_, i) => <ellipse key={i} cx="0" cy="0" rx="5" ry="3" style={{
            "--smoke-x": `${(side ? 1 : -1) * (50 + (i % 3) * 13)}px`,
            "--smoke-y": `${-9 + (i % 3) * 8}px`,
            animationDelay: `${.65 + slot * .045 + i * .13}s`,
          } as React.CSSProperties} />)}
        </g>)
      )}</g>
      <g className="vent-smoke chest-smoke">{[0,1].map(side => [0,1,2].map(slot =>
        <g key={`${side}-${slot}`} transform={`translate(${side ? 381 : 296}, ${(side ? 225 : 215) + slot * 7}) scale(.9)`}>
          <ellipse className="vent-source" cx="0" cy="2" rx="12" ry="3" />
          {Array.from({length: 8}, (_, i) => <ellipse key={i} cx={(i % 3 - 1) * 6} cy="0" rx="7" ry="3" style={{
            "--smoke-x": `${(side ? 1 : -1) * (10 + i % 3 * 7)}px`,
            "--smoke-y": `${22 + i % 3 * 8}px`,
            animationDelay: `${.85 + slot * .06 + i * .1}s`,
          } as React.CSSProperties} />)}
        </g>
      ))}</g>
    </svg>
    <div className="bust-shade" />
  </div>;
}
function ArchiveEntry({ onStart, onEnter }: { onStart: () => void; onEnter: () => void }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!loading) return;
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 400 : 3600;
    const started = Date.now();
    const timer = window.setInterval(() => {
      setProgress(Math.min(100, Math.round((Date.now() - started) / (duration / 100))));
    }, 40);
    const finish = window.setTimeout(onEnter, duration);
    return () => { window.clearInterval(timer); window.clearTimeout(finish); };
  }, [loading, onEnter]);
  const status = progress < 25 ? "Optical sensors online" : progress < 70 ? "Venting cooling system" : "Archive ready. Opening terminal";
  return (
    <main className={`archive-entry cinematic-entry ${loading ? "is-activating" : ""}`} aria-labelledby="entry-title">
      <div className="entry-top"><span>EARTH FEDERATION SPACE FORCE</span><span><i /> SECURE ARCHIVE TERMINAL</span></div>
      <div className="entry-center">
        <div className={`entry-emblem ${loading ? "is-loading" : ""}`} aria-hidden="true"><Crosshair strokeWidth={1} /><span>78</span></div>
        <Eyebrow>PROJECT V / COLLECTION DATABASE</Eyebrow>
        <h1 id="entry-title">RX-78<span>PORTAL</span></h1>
        <p className="entry-description">One mobile suit. Every generation.<br />Enter the engineering archive.</p>
        <div className="entry-access">
          {loading ? <div className="entry-loading">
            <div className="entry-load-label"><span role="status" aria-live="polite">{status}</span><span aria-hidden="true">{progress.toString().padStart(3, "0")}%</span></div>
            <div className="entry-progress" role="progressbar" aria-label="Opening archive" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><span style={{width: `${progress}%`}} /></div>
          </div> : <button className="entry-button" onClick={() => { setLoading(true); onStart(); }}>ACCESS ARCHIVE <ArrowRight size={19} /></button>}
        </div>
        <div className="entry-classification">HG / RG / MG / PG <span>GRADE → VERSION → VARIANT</span></div>
      </div>
      <div className="entry-bottom"><span>RX-78-2 / UNIVERSAL CENTURY 0079</span><span>INDEPENDENT FAN ARCHIVE · DEMO DATA</span><span>TERMINAL 001 <i /></span></div>
    </main>
  );
}
function Home() {
  const [active, setActive] = useState<string | null>(null);
  const [angle, setAngle] = useState(0);
  const [dragging, setDragging] = useState(false);
  const surface = useRef<HTMLElement>(null);
  const gesture = useRef({ down: false, x: 0, distance: 0, time: 0 });
  const velocity = useRef(0);
  const suppressClick = useRef(false);
  useEffect(() => {
    const el = surface.current;
    if (!el) return;
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = (e.deltaY + e.deltaX) * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1);
      setAngle(a => a + delta * .0012);
      velocity.current = Math.max(-.004, Math.min(.004, velocity.current + delta * .000012));
    };
    el.addEventListener('wheel', wheel, { passive: false });
    return () => el.removeEventListener('wheel', wheel);
  }, []);
  useEffect(() => {
    if (dragging) return;
    let frame = 0, last = 0;
    const tick = (now: number) => {
      if (last) {
        const dt = Math.min(now - last, 50);
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) velocity.current = 0;
        const decay = Math.exp(-dt / 550);
        const travel = velocity.current * 550 * (1 - decay);
        velocity.current *= decay;
        if (Math.abs(velocity.current) < .000015) velocity.current = 0;
        const idle = !reduced && !active ? .00009 * dt : 0;
        if (travel || idle) setAngle(a => a + travel + idle);
      }
      last = now; frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [dragging, active]);
  const positions = grades.map((_, i) => {
    const phase = angle - 2.35 + i * (Math.PI * 2 / grades.length);
    const depth = Math.sin(phase);
    const perspective = 1 / (1 - depth * .16);
    return {
      x: 50 + Math.cos(phase) * 34 * perspective,
      y: 50 + depth * 26 * perspective,
      depth,
      scale: .82 + (depth + 1) * .14,
      opacity: .42 + (depth + 1) * .29,
      tilt: -Math.cos(phase) * 13,
    };
  });
  return <section ref={surface} data-active-grade={active || undefined} className={`orbital-home moving-orbit ${active ? "has-active" : ""}`} aria-labelledby="orbital-title"
    onPointerDown={e => { if (e.button !== 0 || (e.target as HTMLElement).closest('button')) return; velocity.current = 0; gesture.current = { down: true, x: e.clientX, distance: 0, time: performance.now() }; suppressClick.current = false; setDragging(true); }}
    onPointerMove={e => { const g = gesture.current; if (!g.down) return; const now = performance.now(); const dt = Math.max(8, now - g.time); const dx = e.clientX - g.x; g.x = e.clientX; g.time = now; g.distance += Math.abs(dx); if (g.distance > 6) { suppressClick.current = true; e.currentTarget.setPointerCapture(e.pointerId); setAngle(a => a - dx * .008); velocity.current = Math.max(-.006, Math.min(.006, velocity.current * .25 + (-dx * .008 / dt) * .75)); } }}
    onPointerUp={() => { if (performance.now() - gesture.current.time > 100) velocity.current = 0; gesture.current.down = false; setDragging(false); }}
    onPointerCancel={() => { velocity.current = 0; gesture.current.down = false; setDragging(false); }}
    onClickCapture={e => { if (suppressClick.current) { e.preventDefault(); e.stopPropagation(); suppressClick.current = false; } }}
    onKeyDown={e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); setAngle(a => a + (e.key === 'ArrowRight' ? .2 : -.2)); } }}>
    <div className="orbital-caption"><Eyebrow>E.F.S.F. / COLLECTION SELECT</Eyebrow><h1 id="orbital-title">Select your grade<span>.</span></h1><p>One icon. Four ways to explore.</p></div>
    <span className="orbital-coordinate" aria-hidden="true">RX-78-2 / U.C. 0079<br />COLLECTION INTERFACE — 01</span>
    <svg className="orbit-lines" viewBox="0 0 1200 700" preserveAspectRatio="none" aria-hidden="true">
      <ellipse className="orbit-ring" cx="600" cy="350" rx="425" ry="200" />
      <ellipse className="orbit-ring inner-ring" cx="600" cy="350" rx="350" ry="265" />
      <ellipse className="orbit-sweep" cx="600" cy="350" rx="425" ry="200" />
      {positions.map((pos, i) => <g key={grades[i].id} className={active === grades[i].id ? "orbit-connection is-lit" : "orbit-connection"}>
<path d={'M' + pos.x * 12 + ' ' + pos.y * 7 + ' L' + (600 + (pos.x * 12 - 600) * .87) + ' ' + (350 + (pos.y * 7 - 350) * .87)}/>
<circle className="ring-segment" cx={pos.x * 12} cy={pos.y * 7} r="14"/>
</g>)}<path className="orbit-ticks" d="M600 72v12 M600 616v12 M167 350h15 M1018 350h15 M590 350h20 M600 340v20" />
    </svg>
    <img className="orbital-silhouette" src={image("rx78-hologram.svg")} alt="Flat blue RX-78-2 silhouette carrying a rifle and shield, with its recognizable V-fin." />
    <nav className="grade-orbit" aria-label="Choose a kit grade">
      {grades.map((grade, i) => <Link key={grade.id} className={`grade-node node-${grade.id}`} style={{ left: positions[i].x + '%', top: positions[i].y + '%', zIndex: positions[i].depth > 0 ? 10 + Math.round(positions[i].depth * 10) : 1, opacity: active === grade.id ? 1 : positions[i].opacity, '--orbit-scale': positions[i].scale, '--orbit-tilt': positions[i].tilt + 'deg' } as React.CSSProperties} draggable={false} to={`/archive?grade=${grade.id}`} onMouseEnter={() => setActive(grade.id)} onMouseLeave={() => setActive(null)} onFocus={() => setActive(grade.id)} onBlur={() => setActive(null)}>
        <span className="node-index">COLLECTION / 0{i + 1}<ArrowUpRight size={16}/></span>
        <span className="node-grade">{grade.id.toUpperCase()}<span>{grade.scale}</span></span>
        <span className="node-name">{grade.name}</span>
        <span className="node-action">ACCESS COLLECTION <ArrowRight size={13}/></span>
      </Link>)}
    </nav>
    <div className="orbit-controls"><button type="button" aria-label="Rotate left" onClick={() => setAngle(a => a - .35)}>←</button><span>SCROLL / DRAG TO ROTATE</span><button type="button" aria-label="Rotate right" onClick={() => setAngle(a => a + .35)}>→</button></div>
    <div className="orbital-bottom"><span><i/>ARCHIVE ONLINE</span><span>GRADE → MOLD / RELEASE VERSION → VARIANT</span><span>DEMO / UNVERIFIED CATALOG</span></div>
  </section>;
}
function Evolution() {
  return <section className="section about"><Breadcrumb items={[{label:"Evolution"}]}/><Eyebrow>ENGINEERING GENERATIONS</Eyebrow><h1>The evolution index.</h1><p className="intro">Browse the sample engineering generations in chronological order. Years are provisional demo data.</p><div className="evolution-list">{[...releases].sort((a,b) => a.year-b.year).map(release => <Link className="evolution-row" key={release.id} to={`/archive?grade=${release.gradeId}&version=${release.id}`}><span>{release.year}*</span><strong>{release.name}</strong><span>{release.gradeId.toUpperCase()} / {release.type}</span><ArrowUpRight size={17}/></Link>)}</div></section>;
}
function KitCard({ kit: k }: { kit: RecordKit }) {
  return (
    <Link className="kit-card" to={`/kit/${k.id}`}>
      <div className={`kit-art ${k.type !== "Standard" ? "alternate" : ""}`}>
        <span className="badge">
          {k.grade.id.toUpperCase()} <span> {k.grade.scale}</span>
        </span>
        <span className="art-id">{k.release.id.toUpperCase()}</span>
        <img src={image(k.image)} alt={k.alt} loading="lazy" />
        <span className="schematic-label">ILLUSTRATIVE SCHEMATIC</span>
      </div>
      <div className="kit-copy">
        <div className="kit-sub">
          <span>{k.release.name}</span>
          <span>{k.releaseYear ? `${k.releaseYear}*` : "UNDATED"}</span>
        </div>
        <h3>
          {k.name}
          <ArrowUpRight size={18} />
        </h3>
        <div className="kit-tags">
          <span>{k.type}</span>
          <span className="demo">DEMO / UNVERIFIED</span>
        </div>
      </div>
    </Link>
  );
}
function Archive() {
  const [params, setParams] = useSearchParams();
  const filters = {
    q: params.get("q") || "",
    grade: params.get("grade") || "",
    version: params.get("version") || "",
    type: params.get("type") || "",
    sort: params.get("sort") || "newest",
  };
  const results = queryRecords(filters);
  function update(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key === "grade") next.delete("version");
    setParams(next, { replace: true });
  }
  const grade = grades.find((g) => g.id === filters.grade);
  return (
    <section className="section archive-page">
      <Breadcrumb items={[{ label: "Archive" }]} />
      <Eyebrow>COLLECTION DATABASE / INDEX</Eyebrow>
      <div className="page-title">
        <h1>
          {grade ? grade.name : "The kit archive"}
          <span>.</span>
        </h1>
        <span className="mono online">
          <i /> {records.length} RECORDS INDEXED
        </span>
      </div>
      <p className="intro">
        Trace an icon through its engineering generations. Find a grade, explore
        a version, discover its variants.
      </p>
      <div className="archive-layout">
        <aside className="filters">
          <div className="filter-heading">
            <SlidersHorizontal size={16} /> REFINE DATABASE
          </div>
          <label>
            SEARCH ARCHIVE
            <div className="search-box">
              <Search size={17} />
              <input
                type="search"
                placeholder="Name, grade, version…"
                value={filters.q}
                onChange={(e) => update("q", e.target.value)}
              />
            </div>
          </label>
          <label>
            GRADE
            <select
              value={filters.grade}
              onChange={(e) => update("grade", e.target.value)}
            >
              <option value="">All grades</option>
              {grades.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.id.toUpperCase()} — {g.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            MOLD / RELEASE VERSION
            <select
              value={filters.version}
              onChange={(e) => update("version", e.target.value)}
            >
              <option value="">All versions</option>
              {releases
                .filter((r) => !filters.grade || r.gradeId === filters.grade)
                .map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
            </select>
          </label>
          <label>
            VARIANT TYPE
            <select
              value={filters.type}
              onChange={(e) => update("type", e.target.value)}
            >
              <option value="">All variant types</option>
              {Array.from(new Set(records.map((k) => k.type))).map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <button className="reset" onClick={() => setParams({})}>
            ↺ Reset all filters
          </button>
          <div className="filter-note">
            <span className="caution">△ DATA ADVISORY</span>
            <p>
              Demo records only. A year marked * is provisional. Variant studies
              are fictional.
            </p>
          </div>
        </aside>
        <div>
          <div className="results-bar">
            <span role="status" aria-live="polite">
              <strong>{results.length.toString().padStart(2, "0")}</strong>{" "}
              records found
            </span>
            <label>
              Sort by{" "}
              <select
                value={filters.sort}
                onChange={(e) => update("sort", e.target.value)}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="name">Name A–Z</option>
              </select>
            </label>
          </div>
          {results.length ? (
            <div className="kit-grid archive-grid">
              {results.map((k) => (
                <KitCard key={k.id} kit={k} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <Search size={32} />
              <h2>No matching transmissions.</h2>
              <p>Try a broader search or reset your filters.</p>
              <button className="button primary" onClick={() => setParams({})}>
                Reset filters <ArrowRight size={17} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link to="/">Overview</Link>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <ChevronRight size={12} />
          {item.to ? (
            <Link to={item.to}>{item.label}</Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
function Detail() {
  const { id } = useParams();
  const k = records.find((k) => k.id === id);
  if (!k) return <NotFound />;
  const related = records.filter(
    (v) => v.releaseId === k.releaseId && v.id !== k.id,
  );
  return (
    <section className="section detail-page">
      <Breadcrumb
        items={[
          { label: "Archive", to: "/archive" },
          {
            label: k.grade.id.toUpperCase(),
            to: `/archive?grade=${k.grade.id}`,
          },
          { label: k.release.name, to: `/archive?version=${k.releaseId}` },
          { label: k.name },
        ]}
      />
      <div className="detail-layout">
        <div
          className={`detail-art ${k.type !== "Standard" ? "alternate" : ""}`}
        >
          <div className="art-top">
            <span>SUBJECT / {k.grade.id.toUpperCase()}</span>
            <span>SCHEMATIC ONLY</span>
          </div>
          <img src={image(k.image)} alt={k.alt} />
          <div className="art-bottom">
            ORIGINAL PLACEHOLDER · NOT PRODUCT ACCURATE
          </div>
        </div>
        <div className="detail-copy">
          <Eyebrow>ARCHIVE RECORD / {k.id}</Eyebrow>
          <h1>{k.name}</h1>
          <p className="detail-version">
            {k.release.name} <span> / {k.grade.scale}</span>
          </p>
          <div className="kit-tags">
            <span>{k.type}</span>
            <span className="demo">DEMO / UNVERIFIED</span>
          </div>
          <p>{k.notes}</p>
          <h2 className="spec-title">
            Technical record <Layers size={17} />
          </h2>
          <dl>
            <div>
              <dt>Grade</dt>
              <dd>
                <Link to={`/archive?grade=${k.grade.id}`}>
                  {k.grade.name} ↗
                </Link>
              </dd>
            </div>
            <div>
              <dt>Mold / release version</dt>
              <dd>
                <Link to={`/archive?version=${k.releaseId}`}>
                  {k.release.name} ↗
                </Link>
              </dd>
            </div>
            <div>
              <dt>Version classification</dt>
              <dd>{k.release.type}</dd>
            </div>
            <div>
              <dt>Scale</dt>
              <dd>{k.grade.scale}</dd>
            </div>
            <div>
              <dt>Release</dt>
              <dd>
                {k.releaseDate || k.releaseYear || "Not established"}
                {k.releaseYear && " · provisional"}
              </dd>
            </div>
            <div>
              <dt>Manufacturer</dt>
              <dd>{k.manufacturer}</dd>
            </div>
            <div>
              <dt>Product identifier</dt>
              <dd>
                {k.productId ? (
                  <a href={k.productId.source}>{k.productId.value}</a>
                ) : (
                  "Not verified / omitted"
                )}
              </dd>
            </div>
            <div>
              <dt>Variant type</dt>
              <dd>{k.type}</dd>
            </div>
          </dl>
          <Link
            className="button"
            to={`/archive?grade=${k.grade.id}&version=${k.releaseId}`}
          >
            Return to this version <ArrowRight size={17} />
          </Link>
        </div>
      </div>
      <div className="detail-note">
        <Eyebrow>MOLD / VERSION NOTES</Eyebrow>
        <p>
          {k.release.notes} All catalog facts in this sample require independent
          verification.{" "}
          {k.sources?.map((s) => (
            <a key={s.url} href={s.url}>
              {s.label}
            </a>
          )) || "No primary sources attached to this demo record."}
        </p>
      </div>
      <div className="section-heading">
        <div>
          <Eyebrow>CONNECTED RECORDS</Eyebrow>
          <h2>Same engineering. Another expression.</h2>
        </div>
      </div>
      <div className="kit-grid">
        {related.map((r) => (
          <KitCard key={r.id} kit={r} />
        ))}
      </div>
      <div className="related-versions">
        <h3>Other {k.grade.name} versions</h3>
        {releases
          .filter((r) => r.gradeId === k.grade.id && r.id !== k.releaseId)
          .map((r) => (
            <Link className="button" key={r.id} to={`/archive?version=${r.id}`}>
              {r.name}
              <ArrowRight size={16} />
            </Link>
          ))}
      </div>
    </section>
  );
}
function About() {
  return (
    <section className="section about">
      <Breadcrumb items={[{ label: "Archive notes" }]} />
      <Eyebrow>DOCUMENTATION / 001</Eyebrow>
      <h1>
        An archive built
        <br />
        for the details.
      </h1>
      <p className="intro">
        RX-78 Portal is an independent fan-made interface for exploring the
        RX-78-2 model-kit family.
      </p>
      <h2>Read the hierarchy</h2>
      <div className="hierarchy">
        GRADE <ChevronRight /> MOLD / RELEASE VERSION <ChevronRight /> VARIANT
      </div>
      <p>
        A grade describes a product line. A mold or release version represents
        an engineering generation. A variant changes a finish, color, or
        distribution context without being treated as a new mold.
      </p>
      <h2>Demonstration data, clearly marked</h2>
      <p>
        The archive contains eight representative versions and sixteen demo
        records. Standard kit records use provisional release years and
        unverified manufacturer attribution. Every nonstandard variant is a
        fictional study, not a retail product claim. Product identifiers and
        primary sources are intentionally omitted until verified.
      </p>
      <h2>Original visual references</h2>
      <p>
        The geometric mobile-suit drawing was created for this project. It is a
        schematic placeholder, not a product photo, exact technical drawing, or
        representation of the listed kit’s parts or colors.
      </p>
      <h2>Independent and unaffiliated</h2>
      <p>
        This project is not affiliated with or endorsed by Bandai, Bandai
        Spirits, or the owners of Gundam. Names identify the subject of the
        archive. No purchases, accounts, tracking, or external services are
        required.
      </p>
      <Link to="/archive" className="button primary">
        Open the archive <ArrowRight size={17} />
      </Link>
    </section>
  );
}
function NotFound() {
  return (
    <section className="section empty">
      <Eyebrow>404 / RECORD NOT FOUND</Eyebrow>
      <h1>Signal lost.</h1>
      <p>This archive address does not match an available record.</p>
      <Link className="button primary" to="/archive">
        Return to archive <ArrowRight size={17} />
      </Link>
    </section>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);






