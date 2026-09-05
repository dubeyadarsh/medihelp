(function () {
  const { company, nav, stats, reasons, categories, products, setups, testimonials, partners, certifications, community, posts, getCategory, getKind, getProductsByCategory, getProduct, getFeatured, getRelated, getCatalog, getPost } = window.MH;
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
    if (parts[0] === "csr") return { name: "csr" };
    if (parts[0] === "investors") return { name: "investors" };
    if (parts[0] === "blog" && parts[1]) return { name: "post", slug: parts[1] };
    if (parts[0] === "blog") return { name: "blog" };
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
      <rect width="64" height="64" rx="10" fill="#12323d" />
      <path d="M18 44V20h8l6 14 6-14h8v24h-7V32l-7 12h-0.5L24 32v12H18z" fill="#e8dcc8" />
      <path d="M14 18l6-8 4 5" fill="none" stroke="#c0564a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }

  function iconPhone() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z"/></svg>`;
  }
  function iconPin() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 119.5 9 2.5 2.5 0 0112 11.5z"/></svg>`;
  }
  function iconMail() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5L4 8V6l8 5 8-5z"/></svg>`;
  }
  function iconClock() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm1 11H7v-2h4V6h2z"/></svg>`;
  }

  function header(active) {
    const productMenu = categories
      .map((c) => `<a href="#/categories/${c.slug}">${c.emoji} ${c.name}</a>`)
      .join("");
    const serviceMenu = setups.map((s) => `<a href="#${s.to}">${s.title}</a>`).join("");

    const links = nav
      .map((item) => {
        const href = item.to === "/" ? "#/" : "#" + item.to;
        const isActive =
          (item.to === "/" && active === "home") ||
          (item.to === "/categories" && (active === "categories" || active === "category" || active === "product")) ||
          (item.to === "/about" && (active === "about" || active === "csr" || active === "investors")) ||
          (item.to === "/service" && active === "service") ||
          (item.to === "/contact" && (active === "contact" || active === "enquire")) ||
          (item.to === "/blog" && (active === "blog" || active === "post"));
        if (item.mega === "products") {
          return `<div class="nav-drop">
            <a href="${href}" class="${isActive ? "active" : ""}">${item.label}</a>
            <div class="nav-panel">${productMenu}<a href="#/categories">View full catalogue</a></div>
          </div>`;
        }
        if (item.mega === "services") {
          return `<div class="nav-drop">
            <a href="${href}" class="${isActive ? "active" : ""}">${item.label}</a>
            <div class="nav-panel">${serviceMenu}</div>
          </div>`;
        }
        if (item.children) {
          const kids = item.children.map((ch) => `<a href="#${ch.to}">${ch.label}</a>`).join("");
          return `<div class="nav-drop">
            <a href="${href}" class="${isActive ? "active" : ""}">${item.label}</a>
            <div class="nav-panel">${kids}</div>
          </div>`;
        }
        return `<a href="${href}" class="${isActive ? "active" : ""}">${item.label}</a>`;
      })
      .join("");

    return `<div class="topbar">
      <div class="wrap topbar-inner">
        <a class="topbar-item" href="${company.phoneHref}">${iconPhone()}<span>${company.phone}, ${company.phoneAlt}</span></a>
        <span class="topbar-item">${iconPin()}<span>India-${company.city.replace(" ", "-")}</span></span>
        <a class="topbar-item" href="${company.emailHref}">${iconMail()}<span>${company.email}</span></a>
        <span class="topbar-item">${iconClock()}<span>${company.hours}</span></span>
      </div>
    </div>
    <header class="header">
      <div class="wrap header-inner">
        <a href="#/" class="logo">${logoMark()}<span>
          <span class="logo-word">${company.short}</span>
          <span class="logo-sub">${company.legal}</span>
        </span></a>
        <nav class="nav" id="primary-nav" aria-label="Primary">${links}</nav>
        <div class="header-actions">
          <a class="btn btn-quote hide-sm" href="#/enquire">Get a Quote →</a>
          <button class="menu-toggle" id="menu-toggle" aria-label="Menu" type="button">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>`;
  }

  function footer() {
    const serviceLinks = setups.map((s) => `<li><a href="#${s.to}">${s.title}</a></li>`).join("");
    return `<footer class="footer">
      <div class="wrap">
        <div class="footer-grid">
          <div class="footer-brand">
            <strong class="serif" style="font-size:1.5rem;color:#e8dcc8">${company.legal}</strong>
            <p>Hospital-grade surgical and medical equipment for theatres, ICU and speciality clinics across India.</p>
            <p class="cert-note">ISO 13485-aligned QMS · GST-compliant invoicing</p>
          </div>
          <div>
            <h4>Quick link</h4>
            <ul>
              <li><a href="#/categories">Products</a></li>
              <li><a href="#/about">Company profile</a></li>
              <li><a href="#/investors">Investor relation</a></li>
              <li><a href="#/csr">CSR</a></li>
              <li><a href="#/blog">Blog posts</a></li>
            </ul>
          </div>
          <div>
            <h4>Services</h4>
            <ul>${serviceLinks}</ul>
          </div>
          <div>
            <h4>Our contacts</h4>
            <ul>
              <li>${company.address}</li>
              <li><a href="${company.phoneHref}">${company.phone} / ${company.phoneAlt}</a></li>
              <li>${company.hours}</li>
              <li><a href="${company.emailHref}">${company.email}</a></li>
            </ul>
          </div>
        </div>
        <div class="legal">
          <span>© ${new Date().getFullYear()} ${company.legal}. All rights reserved.</span>
          <span><a href="#/contact">T &amp; C</a> · <a href="#/contact">Privacy</a> · GSTIN ${company.gst}</span>
        </div>
        <div class="cert-row">${certifications.map((c) => `<span>${c}</span>`).join("")}</div>
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
        <div class="card-actions card-links">
          <a href="#/products/${p.slug}">View Details →</a>
          <button class="js-enquire" type="button" data-slug="${p.slug}" data-mode="quote">Get Quote →</button>
        </div>
      </div>
    </article>`;
  }

  function photoCard({ href, image, label, title, blurb, more }) {
    const inner = `
      <div class="photo-media"><img src="${image}" alt="" /></div>
      <div class="photo-body">
        ${label ? `<span class="setup-label">${label}</span>` : ""}
        <h3>${title}</h3>
        <p class="muted">${blurb}</p>
        ${more === "" ? "" : `<span class="more">${more || "Know more →"}</span>`}
      </div>`;
    return href ? `<a class="setup-card photo-card" href="${href}">${inner}</a>` : `<article class="setup-card photo-card">${inner}</article>`;
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
          <option value="quote" ${opts.interest === "quote" ? "selected" : ""}>Product quote</option>
          <option value="enquiry" ${opts.interest === "enquiry" ? "selected" : ""}>Quick enquiry</option>
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

  function homeProducts(catSlug) {
    const list = catSlug ? getProductsByCategory(catSlug) : getFeatured();
    return list.slice(0, 8).map(productCard).join("");
  }

  function home() {
    const tabs = [`<button type="button" class="home-tab active" data-tab="">Featured</button>`]
      .concat(categories.map((c) => `<button type="button" class="home-tab" data-tab="${c.slug}">${c.name.split(" / ")[0]}</button>`))
      .join("");
    const setupCards = setups
      .map((s) => photoCard({ href: "#" + s.to, image: s.image, label: s.label, title: s.title, blurb: s.blurb }))
      .join("");
    const quotes = testimonials
      .map((t) => {
        const initials = t.name.replace(/^Dr\.?\s*/i, "").split(/\s+/).map((w) => w[0]).join("").slice(0, 2);
        return `<blockquote class="quote-card">
          <p>“${t.quote}”</p>
          <footer>
            <span class="quote-avatar" aria-hidden="true">${initials}</span>
            <span><strong>${t.name}</strong><span class="muted">${t.role}</span></span>
          </footer>
        </blockquote>`;
      })
      .join("");
    const partnerRow = partners.map((p) => `<span class="partner-chip">${p}</span>`).join("");
    const communityCards = community
      .map((c) => photoCard({ href: "#/csr", image: c.image, title: c.title, blurb: c.copy, more: "Read more →" }))
      .join("");
    return `
      <section class="hero hero-banner">
        <div class="hero-bg">
          <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=2000&q=80" alt="Clinical theatre" />
        </div>
        <div class="hero-copy">
          <p class="hero-kicker">Excellence in healthcare support</p>
          <h1>Setting benchmarks<br /><span>in healthcare since ${company.since}</span></h1>
        </div>
      </section>
      <section>
        <div class="wrap intro-grid">
          <div>
            <p class="kicker">Excellence in healthcare support</p>
            <h2>${stats[0].value} years of experience</h2>
            <p class="muted" style="margin-top:14px;font-size:1.05rem">${company.legal} manufactures, imports and commissions surgical and medical equipment for Indian hospitals. We work with biomedical engineers, OT in-charges and procurement teams who need a named machine, a complete accessory list, and a warranty they can call.</p>
            <p class="muted" style="margin-top:12px">From cranial microscopes to Class B autoclaves, every listing includes specifications, clinical uses, accessories and service terms — the way a hospital RFQ expects them.</p>
            <a class="btn btn-dark" href="#/about" style="margin-top:24px">Company profile</a>
          </div>
          <aside class="intro-panel">
            <div>
              <p class="kicker" style="color:#e8dcc8">Since ${company.since}</p>
              <h3>Supply. Install. Stand behind it.</h3>
            </div>
            <div class="stat-row">${statsBlock()}</div>
          </aside>
        </div>
      </section>
      <section class="home-products" style="background:var(--white);padding-top:72px">
        <div class="wrap">
          <div class="section-head section-head-center">
            <h2>Making <em>healthcare</em> safer</h2>
          </div>
          <div class="home-tabs" role="tablist" aria-label="Product groups">${tabs}</div>
          <div class="product-grid" id="home-products">${homeProducts("")}</div>
        </div>
      </section>
      <section>
        <div class="wrap">
          <div class="section-head section-head-center">
            <p class="kicker">Our services</p>
            <h2>Turnkey clinical setups</h2>
          </div>
          <div class="setup-grid">${setupCards}</div>
        </div>
      </section>
      <section style="background:var(--ivory)">
        <div class="wrap">
          <div class="section-head section-head-center">
            <p class="kicker">Corporate social responsibility</p>
            <h2>Healthcare beyond the invoice</h2>
          </div>
          <div class="setup-grid csr-grid">${communityCards}</div>
        </div>
      </section>
      <section>
        <div class="wrap">
          <div class="section-head section-head-center">
            <p class="kicker">What our clients say</p>
            <h2>About us</h2>
          </div>
          <div class="quote-grid">${quotes}</div>
        </div>
      </section>
      <section class="partner-section">
        <div class="wrap">
          <p class="kicker">Your trusted clinical partner</p>
          <h2 class="partner-title">Associate partners</h2>
          <div class="partner-row">${partnerRow}</div>
        </div>
      </section>
      <section class="cta-band">
        <div class="wrap">
          <p class="kicker" style="color:var(--sand)">Quality healthcare products</p>
          <h2>Advanced medical equipment for better patient outcomes</h2>
          <a class="btn btn-light" href="#/categories">Explore products</a>
        </div>
      </section>
      <section style="background:var(--ivory)">
        <div class="wrap home-contact">
          <div>
            <p class="kicker">Get in touch with us</p>
            <h2>Questions on a model or a full theatre list?</h2>
            <p class="muted" style="margin:12px 0 18px">Our team replies within 24 hours on working days.</p>
            <p><strong>Phone:</strong> <a href="${company.phoneHref}">${company.phone}</a>, ${company.phoneAlt}<br /><strong>Email:</strong> <a href="${company.emailHref}">${company.email}</a></p>
            <p class="muted" style="margin-top:10px">${company.address}</p>
          </div>
          <div>${enquiryForm("", { captcha: true, interest: "enquiry" })}</div>
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
            <button class="btn btn-primary js-enquire" type="button" data-slug="${product.slug}" data-mode="quote">Get quote</button>
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
        `<a href="#/">Home</a> / About us`,
        "Company profile",
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
    const setupCards = setups
      .map((s) => photoCard({ href: "#" + s.to, image: s.image, label: s.label, title: s.title, blurb: s.blurb }))
      .join("");
    return (
      pageHero(
        `<a href="#/">Home</a> / Our services`,
        "Turnkey clinical setups",
        "Specify a theatre, ICU bay or dental clinic as a commissioned workcell — machines, accessories, site survey and a named engineer after go-live."
      ) +
      `<section><div class="wrap"><div class="setup-grid">${setupCards}</div></div></section>
      <section style="padding-top:0"><div class="wrap about-grid">
        <article class="info-card"><h3>Standard warranty</h3><p class="muted" style="margin-top:10px">Most consoles carry 12–24 months from commissioning. Optics, X-ray tubes, batteries and cutting accessories follow the terms printed on each product page.</p></article>
        <article class="info-card"><h3>AMC / CMC</h3><p class="muted" style="margin-top:10px">Annual and comprehensive maintenance contracts cover labour, listed parts and response windows. Critical OT assets can be quoted with 48-hour part triage from the Gurugram hub.</p></article>
        <article class="info-card"><h3>Installation</h3><p class="muted" style="margin-top:10px">Ceiling lights, C-arms and anaesthesia workstations include a site survey. We do not energise X-ray systems without the paperwork your biomedical team requires.</p></article>
        <article class="info-card"><h3>How to raise a ticket</h3><p class="muted" style="margin-top:10px">Email ${company.email} with model, serial number and a short fault description, or call ${company.phone}.</p></article>
      </div></section>`
    );
  }

  function csrPage() {
    const cards = community
      .map((c) => photoCard({ image: c.image, title: c.title, blurb: c.copy, more: "" }))
      .join("");
    return (
      pageHero(
        `<a href="#/">Home</a> / CSR`,
        "Corporate social responsibility",
        "Community work sits beside the catalogue — kits, training days and equipment that keeps a public theatre running."
      ) +
      `<section><div class="wrap"><div class="setup-grid csr-grid">${cards}</div>
        <p class="muted" style="margin-top:28px;max-width:62ch">We do not treat CSR as a brochure page. District hospitals that asked for sterile kits received them; biomedical teams that asked for C-arm safety days got a named trainer. If your trust has a similar request, write to ${company.email}.</p>
      </div></section>`
    );
  }

  function investorsPage() {
    return (
      pageHero(
        `<a href="#/">Home</a> / Investor relation`,
        "Investor relation",
        `${company.legal} is an unlisted company. This page is a public snapshot for partners, lenders and institutional buyers — not a stock exchange filing.`
      ) +
      `<section><div class="wrap about-grid">
        <article class="info-card"><h3>Legal name</h3><p class="muted" style="margin-top:10px">${company.legal}<br />Registered office: ${company.address}<br />GSTIN ${company.gst}</p></article>
        <article class="info-card"><h3>At a glance</h3><p class="muted" style="margin-top:10px">Incorporated ${company.since}. National service hub in Gurugram. Catalogue organised by theatre speciality rather than a generic warehouse dump.</p></article>
        <article class="info-card"><h3>Governance</h3><p class="muted" style="margin-top:10px">ISO 13485-aligned quality system, GST-compliant invoicing, and serial-number service tickets. Annual highlights are shared with institutional partners on request.</p></article>
        <article class="info-card"><h3>Write to us</h3><p class="muted" style="margin-top:10px">Investor and partnership queries: <a href="${company.emailHref}">${company.email}</a></p></article>
      </div></section>`
    );
  }

  function blogPage() {
    const cards = posts
      .map(
        (p) => `<a class="setup-card photo-card" href="#/blog/${p.slug}">
          <div class="photo-media"><img src="${p.image}" alt="" /></div>
          <div class="photo-body">
            <span class="setup-label">${p.date}</span>
            <h3>${p.title}</h3>
            <p class="muted">${p.excerpt}</p>
            <span class="more">Read article →</span>
          </div>
        </a>`
      )
      .join("");
    return (
      pageHero(`<a href="#/">Home</a> / Blog`, "Blog posts", "Notes from OT commissioning, RFQs and service contracts — written for biomedical and procurement teams.") +
      `<section><div class="wrap"><div class="setup-grid">${cards}</div></div></section>`
    );
  }

  function postPage(slug) {
    const post = getPost(slug);
    if (!post) return notFound();
    const body = post.body.map((p) => `<p class="muted" style="margin-top:14px;font-size:1.05rem;max-width:66ch">${p}</p>`).join("");
    return (
      pageHero(`<a href="#/">Home</a> / <a href="#/blog">Blog</a> / Article`, post.title, post.date) +
      `<section><div class="wrap" style="max-width:820px">
        <img src="${post.image}" alt="" style="width:100%;height:360px;object-fit:cover;border-radius:18px" />
        ${body}
        <p style="margin-top:28px"><a class="btn btn-dark" href="#/enquire">Talk to sales</a></p>
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
      <p class="muted">That machine or route is not in the ${company.name} catalogue.</p>
      <a class="btn btn-primary" href="#/" style="margin-top:24px">Back to home</a>
    </div></section>`;
  }

  const titles = {
    home: "Aarogya Surgical | Surgical & Medical Equipment",
    categories: "Products | Aarogya Surgical",
    about: "Company profile | Aarogya Surgical",
    contact: "Contact | Aarogya Surgical",
    enquire: "Get a Quote | Aarogya Surgical",
    service: "Our services | Aarogya Surgical",
    csr: "CSR | Aarogya Surgical",
    investors: "Investor relation | Aarogya Surgical",
    blog: "Blog posts | Aarogya Surgical",
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
    else if (route.name === "csr") main = csrPage();
    else if (route.name === "investors") main = investorsPage();
    else if (route.name === "blog") main = blogPage();
    else if (route.name === "post") main = postPage(route.slug);
    else if (route.name === "brochure") main = brochurePage(route.slug);
    else main = notFound();

    const product = route.slug ? getProduct(route.slug) : null;
    document.title =
      route.name === "product" && product
        ? `${product.name} | Aarogya Surgical`
        : route.name === "category"
          ? `${getCategory(route.slug)?.name || "Category"} | Aarogya Surgical`
          : route.name === "categories"
            ? "Products | Aarogya Surgical"
            : route.name === "brochure" && product
            ? `${product.name} brochure | Aarogya Surgical`
            : route.name === "post" && getPost(route.slug)
              ? `${getPost(route.slug).title} | Aarogya Surgical`
            : titles[route.name] || "Aarogya Surgical";

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
    bindHomeTabs();
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
        <a class="dock-icon dock-wa" href="${company.whatsapp}" target="_blank" rel="noopener" title="Chat on WhatsApp">${iconWhatsapp()}<span>WhatsApp</span></a>
        <button class="dock-icon dock-ask js-enquire" type="button" data-slug="" data-mode="enquiry" title="Quick enquiry">${iconAsk()}<span>Enquiry</span></button>
        <button class="dock-icon dock-quote js-enquire" type="button" data-slug="" data-mode="quote" title="Get a quote">${iconFile()}<span>Quote</span></button>
      </div>`;
  }

  function iconWhatsapp() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.76-1.66-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.79h-.01a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37A9.86 9.86 0 012.16 11.9C2.16 6.45 6.6 2.01 12.05 2.01a9.82 9.82 0 016.99 2.9 9.83 9.83 0 012.89 6.99c0 5.45-4.44 9.89-9.88 9.89zm8.41-18.3A11.82 11.82 0 0012.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.59 5.94L0 24l6.3-1.65a11.88 11.88 0 005.74 1.46h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.17-3.48-8.42z"/></svg>`;
  }

  function iconAsk() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20zm.1 15.2a1.1 1.1 0 110-2.2 1.1 1.1 0 010 2.2zm1.5-4.6c-.66.38-1 .7-1 1.5h-1.2c0-1.3.7-1.9 1.35-2.28.58-.34.95-.56.95-1.07 0-.62-.5-1.05-1.25-1.05-.8 0-1.3.4-1.55 1.05l-1.15-.5c.4-1.15 1.4-1.9 2.8-1.9 1.65 0 2.7.95 2.7 2.25 0 .95-.5 1.5-1.65 2.1z"/></svg>`;
  }

  function iconFile() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zm0 2.5L18.5 9H14zM8 12h8v1.5H8zm0 3h8v1.5H8z"/></svg>`;
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
        const existing = JSON.parse(localStorage.getItem("asil-enquiries") || "[]");
        existing.push({ ...data, at: new Date().toISOString() });
        localStorage.setItem("asil-enquiries", JSON.stringify(existing));
        const selected = getProduct(data.product);
        form.outerHTML = `<div class="success">Thank you. An Aarogya Surgical specialist will reply within one business day${
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

  function openEnquire(slug, mode = "enquiry") {
    const modal = document.getElementById("enquire-modal");
    const slot = document.getElementById("enquire-form-slot");
    const lead = document.getElementById("enquire-lead");
    const title = document.getElementById("enquire-title");
    if (!modal || !slot) return;
    const product = slug ? getProduct(slug) : null;
    const isQuote = mode === "quote";
    if (title) title.textContent = isQuote ? "Get a quote" : "Quick enquiry";
    lead.textContent = product
      ? `You are asking about ${product.name} (${product.model}).`
      : isQuote
        ? "Share hospital, city and the machine. We reply with availability, lead time and a formal quote."
        : "Have a question? Sales replies on working days.";
    slot.innerHTML = enquiryForm(product ? product.slug : "", { captcha: true, interest: isQuote ? "quote" : "enquiry" });
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

  function bindHomeTabs() {
    const tabs = document.querySelectorAll(".home-tab");
    const grid = document.getElementById("home-products");
    if (!tabs.length || !grid) return;
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        grid.innerHTML = homeProducts(tab.getAttribute("data-tab") || "");
      });
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
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".js-enquire");
    if (!btn) return;
    e.preventDefault();
    openEnquire(btn.getAttribute("data-slug") || "", btn.getAttribute("data-mode") || "enquiry");
  });
  if (!location.hash) {
    history.replaceState(null, "", "#/");
  }
  render();
})();
