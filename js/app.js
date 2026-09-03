(function () {
  const { company, nav, stats, reasons, categories, products, getCategory, getKind, getProductsByCategory, getProduct, getFeatured, getRelated, getCatalog } = window.MH;
  const app = document.getElementById("app");
  const PAGE_SIZE = 9;
  let keepSearchFocus = false;
  let searchTimer;

  function path() {
    const raw = (location.hash.replace(/^#/, "") || "/").split("?")[0];
    return raw.startsWith("/") ? raw : "/" + raw;
  }

  function parse() {
    const hash = location.hash.replace(/^#/, "") || "/";
    const qIndex = hash.indexOf("?");
    const rawPath = (qIndex >= 0 ? hash.slice(0, qIndex) : hash) || "/";
    const params = new URLSearchParams(qIndex >= 0 ? hash.slice(qIndex + 1) : "");
    const p = rawPath.replace(/\/$/, "") || "/";
    const parts = p.split("/").filter(Boolean);
    const kind = params.get("kind") || "";
    const q = params.get("q") || "";
    const page = Math.max(1, Number(params.get("page")) || 1);
    if (p === "/" || p === "") return { name: "home" };
    if (parts[0] === "categories" && parts[1]) return { name: "category", slug: parts[1], kind, q, page };
    if (parts[0] === "categories") return { name: "categories", slug: "", kind, q, page };
    if (parts[0] === "products" && parts[1]) return { name: "product", slug: parts[1] };
    if (parts[0] === "brochure" && parts[1]) return { name: "brochure", slug: parts[1] };
    if (parts[0] === "enquire") return { name: "enquire", slug: parts[1] || "" };
    if (parts[0] === "about") return { name: "about" };
    if (parts[0] === "contact") return { name: "contact" };
    if (parts[0] === "service") return { name: "service" };
    return { name: "notfound" };
  }

  function go(href) {
    location.hash = href.startsWith("#") ? href : "#" + href;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function catalogHref({ slug = "", kind = "", q = "", page = 1 } = {}) {
    const pathPart = slug ? `/categories/${slug}` : "/categories";
    const params = new URLSearchParams();
    if (kind) params.set("kind", kind);
    if (q) params.set("q", q);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return "#" + pathPart + (qs ? "?" + qs : "");
  }

  function logoMark() {
    return `<svg class="logo-mark" viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#12323d" />
      <path d="M18 34h10v10H18zM36 20h10v24H36z" fill="#e8dcc8" />
      <path d="M18 20h28v8H18z" fill="#2a9d9a" />
    </svg>`;
  }

  function header(active) {
    const links = nav
      .map((item) => {
        const href = item.to === "/" ? "#/" : "#" + item.to;
        const isActive =
          (item.to === "/" && active === "home") ||
          (item.to === "/categories" && (active === "categories" || active === "category" || active === "product")) ||
          (item.to === "/about" && active === "about") ||
          (item.to === "/service" && active === "service") ||
          (item.to === "/contact" && active === "contact");
        return `<a href="${href}" class="${isActive ? "active" : ""}">${item.label}</a>`;
      })
      .join("");

    return `<header class="header">
      <div class="wrap header-inner">
        <a href="#/" class="logo">${logoMark()}<span>
          <span class="logo-word">${company.name}</span>
          <span class="logo-sub">${company.tagline}</span>
        </span></a>
        <nav class="nav" id="primary-nav" aria-label="Primary">
          ${links}
          <a href="#/enquire" class="${active === "enquire" ? "active" : ""}">Enquire</a>
        </nav>
        <div class="header-actions">
          <a class="hide-sm muted" href="${company.phoneHref}">${company.phone}</a>
          <a class="btn btn-primary hide-sm" href="#/enquire">Get Quote</a>
          <button class="menu-toggle" id="menu-toggle" aria-label="Menu" type="button">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>`;
  }

  function footer() {
    const cats = categories
      .map((c) => `<li><a href="#/categories/${c.slug}">${c.emoji} ${c.name}</a></li>`)
      .join("");
    return `<footer class="footer">
      <div class="wrap">
        <div class="footer-grid">
          <div class="footer-brand">
            <strong class="serif" style="font-size:1.5rem;color:#e8dcc8">${company.name}</strong>
            <p>${company.legal}. Hospital-grade surgical and medical equipment for theatres, ICU and speciality clinics across India.</p>
            <a class="btn btn-light" href="#/enquire">Enquire now</a>
          </div>
          <div><h4>Categories</h4><ul>${cats}</ul></div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><a href="#/about">Why MediHelp</a></li>
              <li><a href="#/service">Warranty &amp; service</a></li>
              <li><a href="#/contact">Contact</a></li>
              <li><a href="#/enquire">Get a quote</a></li>
            </ul>
          </div>
          <div>
            <h4>Sales desk</h4>
            <ul>
              <li><a href="${company.phoneHref}">${company.phone}</a></li>
              <li><a href="${company.emailHref}">${company.email}</a></li>
              <li>${company.hours}</li>
              <li>${company.address}</li>
            </ul>
          </div>
        </div>
        <div class="legal">
          <span>© ${new Date().getFullYear()} ${company.legal}. All rights reserved.</span>
          <span>GSTIN ${company.gst} · ISO 13485-aligned processes</span>
        </div>
      </div>
    </footer>`;
  }

  function productCard(p) {
    const cat = getCategory(p.category);
    const kind = getKind(cat, p.kind);
    return `<article class="product-card">
      <a class="product-card-media" href="#/products/${p.slug}"><img src="${p.image}" alt="${p.name}" /></a>
      <div class="body">
        <div class="tag">${kind ? kind.name : cat ? cat.name : ""}</div>
        <h3><a href="#/products/${p.slug}">${p.name}</a></h3>
        <p class="muted">${p.intro.slice(0, 110)}…</p>
        <div class="card-actions">
          <a class="btn btn-ghost" href="#/products/${p.slug}">View</a>
          <button class="btn btn-primary js-enquire" type="button" data-slug="${p.slug}">Send enquiry</button>
        </div>
      </div>
    </article>`;
  }

  function catCard(c, extra) {
    return `<a class="cat-card" href="#/categories/${c.slug}">
      <span class="emoji">${c.emoji}</span>
      <h3>${c.name}</h3>
      <p class="muted">${extra || c.short}</p>
      <span class="more">View machines →</span>
    </a>`;
  }

  function reasonCards() {
    return reasons
      .map(
        (r, i) => `<article class="reason-card">
        <div class="num">0${i + 1}</div>
        <h3>${r.title}</h3>
        <p class="muted">${r.copy}</p>
      </article>`
      )
      .join("");
  }

  function statsBlock() {
    return stats
      .map((s) => `<div><strong>${s.value}</strong><span>${s.label}</span></div>`)
      .join("");
  }

  function enquiryForm(preset, opts = {}) {
    const groups = categories
      .map((c) => {
        const optsHtml = products
          .filter((p) => p.category === c.slug)
          .map((p) => `<option value="${p.slug}" ${p.slug === preset ? "selected" : ""}>${p.name}</option>`)
          .join("");
        return `<optgroup label="${c.name}">${optsHtml}</optgroup>`;
      })
      .join("");
    const a = 2 + Math.floor(Math.random() * 8);
    const b = 2 + Math.floor(Math.random() * 8);
    const captcha = opts.captcha
      ? `<label>Quick check — what is ${a} + ${b}?
          <input name="captcha" inputmode="numeric" autocomplete="off" required>
        </label>
        <input type="hidden" name="captchaExpect" value="${a + b}">`
      : "";
    return `<form class="form enquiry-form">
      <div class="form-row">
        <label>Your name <input name="name" required></label>
        <label>Hospital / clinic <input name="hospital" required></label>
      </div>
      <div class="form-row">
        <label>City <input name="city" required></label>
        <label>Phone <input name="phone" required></label>
      </div>
      <label>Email <input type="email" name="email" required></label>
      <label>Product
        <select name="product">
          <option value="">General catalogue enquiry</option>
          ${groups}
        </select>
      </label>
      <label>I need
        <select name="interest">
          <option value="quote">Product quote</option>
          <option value="installation">Installation / commissioning</option>
          <option value="amc">AMC / CMC</option>
          <option value="training">Clinical training</option>
        </select>
      </label>
      <label>Requirement
        <textarea name="message" placeholder="Quantity, OT type, timeline, AMC interest…"></textarea>
      </label>
      ${captcha}
      <button class="btn btn-primary" type="submit">Send enquiry</button>
    </form>`;
  }

  function pageHero(crumb, title, lead) {
    return `<div class="page-hero"><div class="wrap">
      <p class="crumb">${crumb}</p>
      <h1>${title}</h1>
      ${lead ? `<p style="max-width:52ch;color:rgba(244,239,230,.8)">${lead}</p>` : ""}
    </div></div>`;
  }

  function home() {
    const featured = getFeatured()
      .slice(0, 6)
      .map(productCard)
      .join("");
    const cats = categories.map((c) => catCard(c)).join("");
    const band = categories.map((c) => `<span>${c.emoji} ${c.name}</span>`).join("");
    return `
      <section class="hero" style="padding:0">
        <div class="hero-copy">
          <p class="kicker" style="color:#e8dcc8">${company.legal}</p>
          <h1>Surgical &amp; Medical Equipment</h1>
          <p class="lead">MediHelp outfits neurosurgery, cardiac, dental, orthopaedic and general theatres with machines, accessories and a service desk that answers when the list is on the board.</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#/enquire">Enquire now</a>
            <a class="btn btn-light" href="#/categories">Browse categories</a>
          </div>
        </div>
        <div class="hero-visual">
          <img src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1600&q=80" alt="Surgical team in an operating theatre" />
          <div class="hero-chip"><strong>420+</strong> Hospitals and speciality clinics supplied across India</div>
        </div>
      </section>
      <div class="band"><div class="wrap band-track">${band}</div></div>
      <section>
        <div class="wrap intro-grid">
          <div>
            <p class="kicker">Enterprise introduction</p>
            <h2>A speciality catalogue, not a mixed warehouse.</h2>
            <p class="muted" style="margin-top:14px;font-size:1.05rem">MediHelp is built for biomedical engineers, OT in-charges and procurement teams who need a clear machine, a complete accessory list, and a warranty they can actually call. We commission equipment in your theatre, train the first users, and keep serial numbers on file for parts.</p>
            <p class="muted" style="margin-top:12px">From cranial microscopes to Class B autoclaves, every listing includes specifications, clinical uses, accessories and service terms — the way a hospital RFQ expects them.</p>
            <a class="btn btn-dark" href="#/about" style="margin-top:24px">Why hospitals choose us</a>
          </div>
          <aside class="intro-panel">
            <div>
              <p class="kicker" style="color:#e8dcc8">Since 2007</p>
              <h3>Supply. Install. Stand behind it.</h3>
            </div>
            <div class="stat-row">${statsBlock()}</div>
          </aside>
        </div>
      </section>
      <section style="padding-top:0">
        <div class="wrap">
          <div class="section-head">
            <p class="kicker">Key categories</p>
            <h2>Six theatres. One desk.</h2>
            <p class="muted">Choose a speciality to see machines, or start with a quote if you already know the model family.</p>
          </div>
          <div class="cat-grid">${cats}</div>
        </div>
      </section>
      <section style="background:var(--ivory)">
        <div class="wrap">
          <div class="section-head">
            <p class="kicker">Featured machines</p>
            <h2>Ready for RFQ and site survey.</h2>
          </div>
          <div class="product-grid">${featured}</div>
        </div>
      </section>
      <section>
        <div class="wrap">
          <div class="section-head">
            <p class="kicker">Why choose us</p>
            <h2>Built around the operating list, not the brochure.</h2>
          </div>
          <div class="reason-grid">${reasonCards()}</div>
        </div>
      </section>
      <section style="padding-top:0">
        <div class="wrap">
          <div class="cta-band">
            <div>
              <p class="kicker" style="color:#e8dcc8">Contact / enquiry</p>
              <h2>Need a quote for a theatre or a single machine?</h2>
              <p>Share hospital, city and the model. Sales replies on working days; critical parts are triaged from Gurugram.</p>
            </div>
            <div style="display:grid;gap:10px">
              <a class="btn btn-primary" href="#/enquire">Get Quote</a>
              <a class="btn btn-light" href="${company.phoneHref}">Call ${company.phone}</a>
            </div>
          </div>
        </div>
      </section>`;
  }

  function catalogSidebar(route) {
    const q = route.q || "";
    const groups = categories
      .map((c) => {
        const count = getProductsByCategory(c.slug).length;
        const open = route.slug === c.slug;
        const children = (c.children || [])
          .map((ch) => {
            const n = products.filter((p) => p.kind === ch.slug).length;
            const active = open && route.kind === ch.slug;
            return `<li><a class="${active ? "active" : ""}" href="${catalogHref({ slug: c.slug, kind: ch.slug, q })}">${ch.name} <span>${n}</span></a></li>`;
          })
          .join("");
        return `<div class="cat-group ${open ? "open" : ""}">
          <a class="cat-parent ${open && !route.kind ? "active" : ""}" href="${catalogHref({ slug: c.slug, q })}">${c.emoji} ${c.name} <span>${count}</span></a>
          <ul>${children}</ul>
        </div>`;
      })
      .join("");
    return `<aside class="catalog-side">
      <p class="kicker">Browse</p>
      <h2>Categories</h2>
      <a class="cat-all ${!route.slug ? "active" : ""}" href="${catalogHref({ q })}">All machines <span>${products.length}</span></a>
      ${groups}
    </aside>`;
  }

  function pager(total, page, makeHref) {
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (pages <= 1) return "";
    const items = [];
    if (page > 1) items.push(`<a href="${makeHref(page - 1)}" rel="prev">Previous</a>`);
    for (let i = 1; i <= pages; i++) {
      items.push(`<a class="${i === page ? "active" : ""}" href="${makeHref(i)}">${i}</a>`);
    }
    if (page < pages) items.push(`<a href="${makeHref(page + 1)}" rel="next">Next</a>`);
    return `<nav class="pager" aria-label="Catalogue pages">${items.join("")}</nav>`;
  }

  function catalogPage(route) {
    const category = route.slug ? getCategory(route.slug) : null;
    if (route.slug && !category) return notFound();
    const kindMeta = category && route.kind ? getKind(category, route.kind) : null;
    if (route.kind && category && !kindMeta) return notFound();
    const q = route.q || "";
    const list = getCatalog({ category: route.slug || "", kind: route.kind || "", q });
    const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    const page = Math.min(route.page || 1, pages);
    const slice = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const title = kindMeta ? kindMeta.name : category ? category.name : "Product catalogue";
    const crumb = category
      ? `<a href="#/">Home</a> / <a href="#/categories">Products</a> / ${category.name}${kindMeta ? " / " + kindMeta.name : ""}`
      : `<a href="#/">Home</a> / Products`;
    const lead = kindMeta
      ? `${list.length} machine${list.length === 1 ? "" : "s"} in ${category.name}. Send an enquiry from any card, or open the datasheet.`
      : category
        ? category.intro
        : "Filter by theatre, search a model, or send an enquiry without leaving the catalogue.";
    const empty = `<div class="catalog-empty"><p class="muted">No machines match this filter. <a href="#/categories">Clear filters</a></p></div>`;
    return (
      pageHero(crumb, title, lead) +
      `<section class="catalog-section">
        <div class="wrap catalog">
          ${catalogSidebar(route)}
          <div class="catalog-main">
            <form class="catalog-toolbar" id="catalog-search">
              <label class="sr-only" for="catalog-q">Search catalogue</label>
              <input id="catalog-q" name="q" value="${escapeHtml(q)}" placeholder="Search machines, models, theatres…" />
              <button class="btn btn-dark" type="submit">Search</button>
            </form>
            <p class="catalog-count">${list.length} result${list.length === 1 ? "" : "s"}${q ? ` for “${escapeHtml(q)}”` : ""}</p>
            <div class="product-grid">${slice.length ? slice.map(productCard).join("") : empty}</div>
            ${pager(list.length, page, (n) => catalogHref({ slug: route.slug, kind: route.kind, q, page: n }))}
          </div>
        </div>
      </section>`
    );
  }

  function list(items) {
    return `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
  }

  function productPage(slug) {
    const product = getProduct(slug);
    if (!product) return notFound();
    const category = getCategory(product.category);
    const related = getRelated(product).map(productCard).join("");
    const specs = product.specs
      .map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`)
      .join("");
    return `
      <div class="page-hero" style="padding-bottom:28px">
        <div class="wrap"><p class="crumb"><a href="#/">Home</a> / <a href="#/categories/${category.slug}">${category.name}</a> / ${product.name}</p></div>
      </div>
      <div class="wrap product-layout">
        <div class="product-image"><img src="${product.image}" alt="${product.name}" /></div>
        <div class="product-summary">
          <p class="kicker">${category.name}${getKind(category, product.kind) ? " · " + getKind(category, product.kind).name : ""}</p>
          <h1>${product.name}</h1>
          <p class="muted" style="font-size:1.05rem">${product.intro}</p>
          <p style="margin-top:12px;font-weight:600">Model ${product.model}</p>
          <div class="actions">
            <button class="btn btn-primary js-enquire" type="button" data-slug="${product.slug}">Send enquiry</button>
            <a class="btn btn-ghost" href="#/brochure/${product.slug}">Brochure / PDF</a>
            <a class="btn btn-dark" href="#/service">Warranty &amp; service</a>
          </div>
        </div>
      </div>
      <div class="wrap tabs">
        <article><h2>Key features</h2>${list(product.features)}</article>
        <article><h2>Technical specifications</h2><table class="spec-table"><tbody>${specs}</tbody></table></article>
        <article><h2>Applications / uses</h2>${list(product.applications)}</article>
        <article><h2>Available accessories</h2>${list(product.accessories)}</article>
        <article>
          <h2>Warranty / service</h2>
          <p>${product.warranty}</p>
          <p class="muted" style="margin-top:10px">National service hub in Gurugram. Installation, user orientation and first-case support are quoted with the machine.</p>
        </article>
      </div>
      ${
        related
          ? `<section class="related"><div class="wrap"><div class="section-head"><p class="kicker">In the same theatre</p><h2>Related machines</h2></div><div class="product-grid">${related}</div></div></section>`
          : ""
      }`;
  }

  function aboutPage() {
    return (
      pageHero(
        `<a href="#/">Home</a> / Why MediHelp`,
        "Why hospitals stay with MediHelp",
        "We sell speciality machines the way biomedical and OT teams actually work — complete workcells, documented service, and a named engineer after go-live."
      ) +
      `<section>
        <div class="wrap about-grid">
          <div>
            <p class="kicker">The company</p>
            <h2 style="font-size:2.2rem;margin:10px 0 14px">${company.statement}</h2>
            <p class="muted">${company.legal} supplies surgical and medical equipment to multi-speciality hospitals, teaching institutes and high-volume clinics. Our catalogue is organised by theatre: neurosurgery, cardiovascular, dental, orthopaedic, general surgery, and the monitors, sterilisers and pumps that keep those rooms running.</p>
            <p class="muted" style="margin-top:12px">Headquarters in Mumbai, service hub in Gurugram. GST-compliant invoicing, site surveys before ceiling-mounted lights and C-arms, and AMC / CMC on request.</p>
          </div>
          <div class="intro-panel"><h3>At a glance</h3><div class="stat-row">${statsBlock()}</div></div>
        </div>
      </section>
      <section style="padding-top:0"><div class="wrap reason-grid">${reasonCards()}</div></section>`
    );
  }

  function contactPage() {
    return (
      pageHero(`<a href="#/">Home</a> / Contact`, "Sales, service and the Mumbai desk") +
      `<section><div class="wrap contact-grid">
        <div>
          <article class="info-card" style="margin-bottom:16px">
            <h3>Registered office</h3>
            <p class="muted" style="margin-top:8px">${company.address}</p>
            <p class="muted" style="margin-top:8px">${company.serviceHub}</p>
          </article>
          <article class="info-card" style="margin-bottom:16px">
            <h3>Talk to sales</h3>
            <p style="margin-top:8px"><a href="${company.phoneHref}">${company.phone}</a></p>
            <p><a href="${company.emailHref}">${company.email}</a></p>
            <p class="muted">${company.hours}</p>
          </article>
          <article class="info-card"><h3>GST</h3><p class="muted" style="margin-top:8px">${company.gst}</p></article>
        </div>
        <div><h2 style="margin-bottom:16px">Send a message</h2>${enquiryForm("")}</div>
      </div></section>`
    );
  }

  function enquirePage(slug) {
    const product = slug ? getProduct(slug) : null;
    const lead = product
      ? `You are enquiring about ${product.name} (${product.model}).`
      : "Tell us the hospital, city and machine. We reply with availability, lead time and a formal quote.";
    return (
      pageHero(`<a href="#/">Home</a> / Enquire`, "Get Quote / Enquire Now", lead) +
      `<section><div class="wrap" style="max-width:720px">${enquiryForm(product ? product.slug : "")}</div></section>`
    );
  }

  function servicePage() {
    return (
      pageHero(
        `<a href="#/">Home</a> / Service`,
        "Warranty &amp; service",
        "Serial-number tickets, loaner cover on AMC, and engineers who have stood in the same theatres you run."
      ) +
      `<section><div class="wrap about-grid">
        <article class="info-card"><h3>Standard warranty</h3><p class="muted" style="margin-top:10px">Most consoles carry 12–24 months from commissioning. Optics, X-ray tubes, batteries and cutting accessories follow the terms printed on each product page. Year-one preventive visit is included on featured theatre systems.</p></article>
        <article class="info-card"><h3>AMC / CMC</h3><p class="muted" style="margin-top:10px">Annual and comprehensive maintenance contracts cover labour, listed parts and response windows. Critical ICU and OT assets can be quoted with 48-hour part triage from the Gurugram hub.</p></article>
        <article class="info-card"><h3>Installation</h3><p class="muted" style="margin-top:10px">Ceiling lights, C-arms and anaesthesia workstations include a site survey. We do not energise X-ray systems without the paperwork your biomedical team requires.</p></article>
        <article class="info-card"><h3>How to raise a ticket</h3><p class="muted" style="margin-top:10px">Email ${company.email} with model, serial number and a short fault description, or call ${company.phone}. Keep the commissioning report handy.</p></article>
      </div></section>`
    );
  }

  function brochurePage(slug) {
    const product = getProduct(slug);
    if (!product) return notFound();
    const category = getCategory(product.category);
    const specs = product.specs
      .map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`)
      .join("");
    return `<div class="brochure"><div class="wrap">
      <div class="no-print actions" style="margin-bottom:20px">
        <button class="btn btn-primary" type="button" id="print-btn">Download PDF / Print</button>
        <a class="btn btn-ghost" href="#/products/${product.slug}">Back to product</a>
      </div>
      <article class="brochure-sheet">
        <p class="kicker">${company.name} · ${category.name}</p>
        <h1 style="font-size:2.4rem;margin:8px 0">${product.name}</h1>
        <p>Model ${product.model} · Datasheet</p>
        <p style="margin:16px 0 24px">${product.intro}</p>
        <h2>Key features</h2>${list(product.features)}
        <h2>Technical specifications</h2>
        <table class="spec-table" style="margin-bottom:20px"><tbody>${specs}</tbody></table>
        <h2>Applications</h2>${list(product.applications)}
        <h2>Accessories</h2>${list(product.accessories)}
        <h2>Warranty / service</h2>
        <p>${product.warranty}</p>
        <p style="margin-top:28px;font-size:0.9rem">${company.legal} · ${company.address} · ${company.phone} · ${company.email}</p>
      </article>
    </div></div>`;
  }

  function notFound() {
    return `<section><div class="wrap" style="text-align:center;padding:40px 0">
      <p class="kicker">404</p>
      <h1 style="font-size:2.6rem;margin:12px 0">Page not found</h1>
      <p class="muted">That machine or route is not in the MediHelp catalogue.</p>
      <a class="btn btn-primary" href="#/" style="margin-top:24px">Back to home</a>
    </div></section>`;
  }

  const titles = {
    home: "MediHelp | Surgical & Medical Equipment",
    categories: "Product catalogue | MediHelp",
    about: "Why MediHelp",
    contact: "Contact | MediHelp",
    enquire: "Get Quote | MediHelp",
    service: "Warranty & service | MediHelp",
  };

  function render() {
    const route = parse();
    let main = "";
    if (route.name === "home") main = home();
    else if (route.name === "categories" || route.name === "category") main = catalogPage(route);
    else if (route.name === "product") main = productPage(route.slug);
    else if (route.name === "about") main = aboutPage();
    else if (route.name === "contact") main = contactPage();
    else if (route.name === "enquire") main = enquirePage(route.slug);
    else if (route.name === "service") main = servicePage();
    else if (route.name === "brochure") main = brochurePage(route.slug);
    else main = notFound();

    const product = route.slug ? getProduct(route.slug) : null;
    document.title =
      route.name === "product" && product
        ? `${product.name} | MediHelp`
        : route.name === "category"
          ? `${getCategory(route.slug)?.name || "Category"} | MediHelp`
          : route.name === "categories"
            ? "Product catalogue | MediHelp"
          : route.name === "brochure" && product
            ? `${product.name} brochure | MediHelp`
            : titles[route.name] || "MediHelp";

    app.innerHTML = `${header(route.name)}<main id="main">${main}</main>${footer()}${chrome()}`;
    window.scrollTo(0, keepSearchFocus ? window.scrollY : 0);

    const toggle = document.getElementById("menu-toggle");
    const navEl = document.getElementById("primary-nav");
    if (toggle && navEl) {
      toggle.addEventListener("click", () => navEl.classList.toggle("open"));
    }

    const printBtn = document.getElementById("print-btn");
    if (printBtn) printBtn.addEventListener("click", () => window.print());

    bindEnquiryForm();
    bindCatalogSearch(route);
    bindEnquireButtons();
    bindModal();

    if (keepSearchFocus) {
      const qEl = document.getElementById("catalog-q");
      if (qEl) {
        qEl.focus();
        const len = qEl.value.length;
        qEl.setSelectionRange(len, len);
      }
      keepSearchFocus = false;
    }
  }

  function chrome() {
    return `
      <div class="modal" id="enquire-modal" hidden>
        <div class="modal-backdrop" data-close="1"></div>
        <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="enquire-title">
          <button class="modal-close" type="button" data-close="1" aria-label="Close">×</button>
          <p class="kicker">Sales desk</p>
          <h2 id="enquire-title">Send enquiry</h2>
          <p class="muted" id="enquire-lead">A specialist replies on working days with availability and a formal quote.</p>
          <div id="enquire-form-slot"></div>
        </div>
      </div>
      <div class="dock" aria-label="Quick contact">
        <a class="dock-btn" href="${company.whatsapp}" target="_blank" rel="noopener" title="WhatsApp sales">WhatsApp</a>
        <button class="dock-btn dock-btn-primary js-enquire" type="button" data-slug="" title="Send enquiry">Enquire</button>
      </div>`;
  }

  function bindEnquiryForm(root = document) {
    root.querySelectorAll(".enquiry-form").forEach((form) => {
      if (form.dataset.bound) return;
      form.dataset.bound = "1";
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());
        if (data.captchaExpect && String(data.captcha).trim() !== String(data.captchaExpect)) {
          form.querySelector("[name=captcha]")?.classList.add("invalid");
          return;
        }
        const existing = JSON.parse(localStorage.getItem("medihelp-enquiries") || "[]");
        existing.push({ ...data, at: new Date().toISOString() });
        localStorage.setItem("medihelp-enquiries", JSON.stringify(existing));
        const selected = getProduct(data.product);
        form.outerHTML = `<div class="success">Thank you. A MediHelp specialist will reply within one business day${
          selected ? " about the " + selected.name : ""
        }. For urgent OT commissioning, call ${company.phone}.</div>`;
      });
    });
  }

  function bindCatalogSearch(route) {
    const form = document.getElementById("catalog-search");
    const input = document.getElementById("catalog-q");
    if (!form || !input) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      go(catalogHref({ slug: route.slug, kind: route.kind, q: input.value.trim(), page: 1 }));
    });
    input.addEventListener("input", () => {
      keepSearchFocus = true;
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        go(catalogHref({ slug: route.slug, kind: route.kind, q: input.value.trim(), page: 1 }));
      }, 280);
    });
  }

  function openEnquire(slug) {
    const modal = document.getElementById("enquire-modal");
    const slot = document.getElementById("enquire-form-slot");
    const lead = document.getElementById("enquire-lead");
    if (!modal || !slot) return;
    const product = slug ? getProduct(slug) : null;
    lead.textContent = product
      ? `You are enquiring about ${product.name} (${product.model}).`
      : "Tell us the hospital, city and machine. We reply with availability, lead time and a formal quote.";
    slot.innerHTML = enquiryForm(product ? product.slug : "", { captcha: true });
    modal.hidden = false;
    document.body.classList.add("modal-open");
    bindEnquiryForm(slot);
    slot.querySelector("[name=name]")?.focus();
  }

  function closeEnquire() {
    const modal = document.getElementById("enquire-modal");
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  function bindEnquireButtons() {
    document.querySelectorAll(".js-enquire").forEach((btn) => {
      btn.addEventListener("click", () => openEnquire(btn.getAttribute("data-slug") || ""));
    });
  }

  function bindModal() {
    const modal = document.getElementById("enquire-modal");
    if (!modal) return;
    modal.querySelectorAll("[data-close]").forEach((el) => {
      el.addEventListener("click", closeEnquire);
    });
  }

  window.addEventListener("hashchange", render);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeEnquire();
  });
  if (!location.hash) {
    history.replaceState(null, "", "#/");
  }
  render();
})();
