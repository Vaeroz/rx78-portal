import React, { useEffect, useRef } from "react";
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
  const main = useRef<HTMLElement>(null);
  const previousPath = useRef(location.pathname);
  useEffect(() => {
    document.title = `RX-78 Portal — ${location.pathname === "/" ? "Collection Archive" : location.pathname.startsWith("/kit") ? "Kit Record" : "Archive Index"}`;
    if (previousPath.current !== location.pathname) main.current?.focus();
    previousPath.current = location.pathname;
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <>
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
          <NavLink to="/" end>
            Overview
          </NavLink>
          <NavLink to="/archive">
            Kit archive{" "}
            <span>{records.length.toString().padStart(2, "0")}</span>
          </NavLink>
          <NavLink to="/about">About the archive</NavLink>
        </nav>
        <span className="online">
          <i /> SYSTEM ONLINE
        </span>
      </header>
      <main id="main-content" ref={main} tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/kit/:id" element={<Detail />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer>
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
      </footer>
    </>
  );
}
function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <Eyebrow>
            <span className="tiny-square" /> E.F.S.F. COLLECTION DATABASE{" "}
            <span className="dim">/ 001</span>
          </Eyebrow>
          <h1>
            One mobile suit.
            <br />
            Generations of
            <br />
            <em>engineering.</em>
          </h1>
          <p>
            A field guide to the RX-78-2. Explore the molds, releases, and
            variations that tell the story of an icon.
          </p>
          <div className="hero-actions">
            <Link className="button primary" to="/archive">
              Explore the archive <ArrowRight size={18} />
            </Link>
            <Link className="text-link" to="/about">
              Read archive notes <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="hero-meta">
            <span>
              <i /> ARCHIVE ACTIVE
            </span>
            <span>SUBJECT: RX-78-2 GUNDAM</span>
          </div>
        </div>
        <div className="hero-art">
          <div className="art-top">
            <span>TECHNICAL REFERENCE / RX-78-2</span>
            <span>FIG. 001</span>
          </div>
          <Schematic />
          <span className="vertical-label">
            PROJECT V · MOBILE SUIT DEVELOPMENT
          </span>
          <div className="art-bottom">
            <span>
              <i /> ORIGINAL SCHEMATIC
            </span>
            <span>NOT TO SCALE</span>
          </div>
        </div>
      </section>
      <section className="stats" aria-label="Archive summary">
        <div>
          <strong>04</strong>
          <span>GRADES INDEXED</span>
        </div>
        <div>
          <strong>{releases.length.toString().padStart(2, "0")}</strong>
          <span>MOLD / RELEASE VERSIONS</span>
        </div>
        <div>
          <strong>{records.length.toString().padStart(2, "0")}</strong>
          <span>DEMO KIT RECORDS</span>
        </div>
        <div>
          <Shield size={24} />
          <span>
            ONE ICON.
            <br />
            EVERY PERSPECTIVE.
          </span>
        </div>
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <Eyebrow>01 / BROWSE BY CLASSIFICATION</Eyebrow>
            <h2>Find your grade.</h2>
          </div>
          <span className="mono muted">FOUR SCALES OF POSSIBILITY</span>
        </div>
        <div className="grade-grid">
          {grades.map((g, i) => (
            <Link
              className="grade-card"
              key={g.id}
              to={`/archive?grade=${g.id}`}
            >
              <div className="grade-top">
                <span className="mono">CLASS / 0{i + 1}</span>
                <ArrowUpRight size={19} />
              </div>
              <div className="grade-name">
                {g.id.toUpperCase()}
                <span>{g.scale}</span>
              </div>
              <h3>{g.name}</h3>
              <p>{g.description}</p>
              <div className="grade-bottom">
                {records.filter((k) => k.grade.id === g.id).length} RECORDS{" "}
                <ArrowRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="section featured">
        <div className="section-heading">
          <div>
            <Eyebrow>02 / FROM THE DATABASE</Eyebrow>
            <h2>Engineering, evolved.</h2>
          </div>
          <Link className="text-link" to="/archive">
            View all records <ArrowRight size={17} />
          </Link>
        </div>
        <div className="kit-grid">
          {["rg-2-standard", "mg-3-standard", "pg-unleashed-standard"].map(
            (id) => (
              <KitCard key={id} kit={records.find((k) => k.id === id)!} />
            ),
          )}
        </div>
      </section>
      <div className="notice">
        <span className="caution">△</span>
        <div>
          <strong>A living archive. An honest starting point.</strong>
          <p>
            This is a demonstration collection, not a verified product catalog.
            Dates are provisional; variant studies are fictional. All
            illustrations are original placeholders.
          </p>
        </div>
        <Link to="/about">
          DATA NOTES <ArrowUpRight size={16} />
        </Link>
      </div>
    </>
  );
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
