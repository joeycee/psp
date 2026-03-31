const { company, services, products, surfkitItems, reviews, stockists, nav } = require("./siteData");
const { stars, escapeHtml, buildFlashMarkup, linkButton, cardLink } = require("./siteUtils");

function renderRecaptcha(siteKey) {
  if (!siteKey) {
    return "";
  }

  return `
    <div class="recaptcha-block">
      <input type="hidden" name="g-recaptcha-response" value="" data-recaptcha-token />
      <p class="form-note">Protected by reCAPTCHA to help reduce spam and automated submissions.</p>
    </div>
  `;
}

function renderLightboxImage({ src, alt, buttonClass = "", imageClass = "" }) {
  const buttonClasses = ["lightbox-trigger", buttonClass].filter(Boolean).join(" ");
  const imageClasses = imageClass || "";

  return `
    <button class="${buttonClasses}" type="button" data-lightbox-trigger data-lightbox-src="${escapeHtml(src)}" data-lightbox-alt="${escapeHtml(alt)}" aria-label="View larger image of ${escapeHtml(alt)}">
      <img class="${imageClasses}" src="${src}" alt="${escapeHtml(alt)}" />
    </button>
  `;
}

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  :root {
    --bg: #080a0c;
    --bg-alt: #0c0f12;
    --surface: #111419;
    --surface-raised: #161b21;
    --surface-high: #1c2229;
    --line: rgba(255,255,255,0.06);
    --line-strong: rgba(255,255,255,0.1);
    --accent: #c1121f;
    --accent-dim: #8b0000;
    --accent-glow: rgba(193, 18, 31, 0.22);
    --accent-text: #ff4d5a;
    --text: #e8eaed;
    --text-soft: #f2f4f7;
    --text-muted: #dfe3e8;
    --gold: #c8a84b;
    --max: 1200px;
    --font-display: 'Rajdhani', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  body {
    color: var(--text);
    background: var(--bg);
    font-family: var(--font-body);
    font-size: 1rem;
    line-height: 1.6;
    overflow-x: hidden;
  }

  /* Engineering grid overlay */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background-image:
      linear-gradient(rgba(193,18,31,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(193,18,31,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  /* Ambient glow */
  body::after {
    content: '';
    position: fixed;
    top: -20%;
    left: -10%;
    width: 60%;
    height: 60%;
    background: radial-gradient(ellipse, rgba(139,0,0,0.08) 0%, transparent 65%);
    pointer-events: none;
    z-index: 0;
  }

  a { color: inherit; text-decoration: none; }
  img { display: block; max-width: 100%; }

  .lightbox-trigger {
    padding: 0;
    margin: 0;
    width: 100%;
    border: none;
    background: transparent;
    color: inherit;
    cursor: zoom-in;
    font: inherit;
  }

  .lightbox-trigger img {
    width: 100%;
  }

  .shell {
    position: relative;
    z-index: 1;
    width: min(var(--max), calc(100% - 48px));
    margin: 0 auto;
  }

  .flash {
    margin-top: 18px;
    padding: 16px 18px;
    border: 1px solid var(--line-strong);
    border-left: 3px solid var(--accent);
    background: rgba(17,20,25,0.92);
    border-radius: 4px;
  }

  .flash strong {
    display: block;
    font-family: var(--font-display);
    font-size: 0.92rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .flash p {
    margin-top: 6px;
    color: var(--text-soft);
    font-size: 0.92rem;
    line-height: 1.6;
  }

  .flash-success { border-left-color: #2e9e68; }
  .flash-error { border-left-color: var(--accent); }

  /* ── HEADER ── */
  .site-header {
    position: sticky;
    top: 0;
    z-index: 100;
    border-bottom: 1px solid var(--line);
    background: rgba(8,10,12,0.88);
    backdrop-filter: blur(20px) saturate(1.4);
  }

  .site-header::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(193,18,31,0.5) 30%, rgba(193,18,31,0.5) 70%, transparent);
  }

  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    height: 72px;
  }

  .brand img { width: 160px; height: auto; }

  .nav-toggle {
    display: none;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    padding: 0;
    background: rgba(255,255,255,0.02);
    border: 1px solid var(--line-strong);
    border-radius: 4px;
    color: var(--text);
    cursor: pointer;
    transition: border-color 200ms, background 200ms;
  }

  .nav-toggle:hover {
    border-color: rgba(193,18,31,0.45);
    background: rgba(193,18,31,0.08);
  }

  .nav-toggle-bars,
  .nav-toggle-bars::before,
  .nav-toggle-bars::after {
    display: block;
    width: 18px;
    height: 2px;
    background: currentColor;
    transition: transform 200ms ease, opacity 200ms ease;
    content: '';
  }

  .nav-toggle-bars {
    position: relative;
  }

  .nav-toggle-bars::before {
    position: absolute;
    top: -6px;
    left: 0;
  }

  .nav-toggle-bars::after {
    position: absolute;
    top: 6px;
    left: 0;
  }

  .nav-toggle[aria-expanded="true"] .nav-toggle-bars {
    background: transparent;
  }

  .nav-toggle[aria-expanded="true"] .nav-toggle-bars::before {
    transform: translateY(6px) rotate(45deg);
  }

  .nav-toggle[aria-expanded="true"] .nav-toggle-bars::after {
    transform: translateY(-6px) rotate(-45deg);
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 4px;
    font-family: var(--font-display);
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .nav-links a {
    padding: 6px 14px;
    color: var(--text-soft);
    position: relative;
    transition: color 200ms;
  }

  .nav-links a::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 4px;
    background: rgba(193,18,31,0.08);
    opacity: 0;
    transition: opacity 200ms;
  }

  .nav-links a:hover { color: var(--text); }
  .nav-links a:hover::before { opacity: 1; }

  .nav-links a[aria-current="page"] {
    color: var(--accent-text);
  }

  .nav-links a[aria-current="page"]::after {
    content: '';
    position: absolute;
    left: 14px; right: 14px; bottom: -1px;
    height: 2px;
    background: var(--accent);
    box-shadow: 0 0 8px var(--accent);
  }

  .nav-cta {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 22px;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 0.9rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text);
    background: var(--accent);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 3px;
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
    transition: background 200ms, box-shadow 200ms;
    box-shadow: 0 0 20px rgba(193,18,31,0.3);
  }

  .nav-cta:hover {
    background: #d91b2a;
    box-shadow: 0 0 32px rgba(193,18,31,0.5);
  }

  /* ── BUTTONS ── */
  .button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 26px;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 0.92rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border-radius: 3px;
    transition: all 200ms;
    cursor: pointer;
    border: none;
  }

  .button-primary {
    color: #fff;
    background: var(--accent);
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
    box-shadow: 0 0 24px rgba(193,18,31,0.35);
  }

  .button-primary:hover {
    background: #d91b2a;
    box-shadow: 0 0 40px rgba(193,18,31,0.55);
    transform: translateY(-1px);
  }

  .button-secondary {
    color: var(--text-soft);
    background: transparent;
    border: 1px solid var(--line-strong);
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
  }

  .button-secondary:hover {
    color: var(--text);
    border-color: rgba(193,18,31,0.5);
    background: rgba(193,18,31,0.06);
    transform: translateY(-1px);
  }

  /* ── HERO ── */
  .hero {
    position: relative;
    padding: 0;
    min-height: 620px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    overflow: hidden;
  }

  .hero-copy-wrap {
    position: relative;
    z-index: 2;
    padding: 60px 48px 60px 0;
    display: flex;
    align-items: center;
  }

  .hero-copy-inner {
    max-width: 580px;
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    font-family: var(--font-display);
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--accent-text);
  }

  .eyebrow::before {
    content: '';
    width: 24px;
    height: 2px;
    background: var(--accent);
    box-shadow: 0 0 6px var(--accent);
    flex-shrink: 0;
  }

  .eyebrow-label {
    padding: 3px 10px;
    background: rgba(193,18,31,0.12);
    border: 1px solid rgba(193,18,31,0.25);
    border-radius: 2px;
  }

  h1 {
    font-family: var(--font-display);
    font-size: clamp(2.8rem, 5.5vw, 5rem);
    font-weight: 700;
    line-height: 0.95;
    letter-spacing: -0.02em;
    color: var(--text);
  }

  h1 em {
    font-style: normal;
    color: var(--accent-text);
  }

  h2 {
    font-family: var(--font-display);
    font-size: clamp(1.8rem, 3vw, 2.8rem);
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.01em;
  }

  h3 {
    font-family: var(--font-display);
    font-size: 1.4rem;
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: 0.01em;
  }

  .hero-lead {
    margin-top: 20px;
    color: var(--text-soft);
    font-size: 1.05rem;
    line-height: 1.75;
    max-width: 520px;
  }

  .hero-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 32px;
  }

  .hero-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    margin-top: 44px;
    border: 1px solid var(--line);
    border-radius: 4px;
    overflow: hidden;
    background: var(--line);
  }

  .hero-stat {
    padding: 18px 20px;
    background: var(--surface);
    position: relative;
  }

  .hero-stat::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(193,18,31,0.5), transparent);
  }

  .hero-stat-value {
    font-family: var(--font-display);
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--text);
    line-height: 1;
  }

  .hero-stat-label {
    margin-top: 5px;
    font-size: 0.78rem;
    color: var(--text);
    font-family: var(--font-display);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .hero-media-wrap {
    position: relative;
    overflow: hidden;
  }

  .hero-media-wrap::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 2;
    background:
      linear-gradient(to right, var(--bg) 0%, transparent 25%),
      linear-gradient(to top, var(--bg) 0%, transparent 20%),
      linear-gradient(135deg, rgba(193,18,31,0.15) 0%, transparent 50%);
  }

  .hero-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    filter: grayscale(30%) contrast(1.05);
  }

  .hero-badge {
    position: absolute;
    z-index: 3;
    bottom: 32px;
    right: 32px;
    padding: 20px 24px;
    background: rgba(12,15,18,0.92);
    border: 1px solid var(--line-strong);
    border-radius: 4px;
    max-width: 260px;
    border-left: 3px solid var(--accent);
  }

  .hero-badge strong {
    display: block;
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: var(--text);
  }

  .hero-badge p {
    margin-top: 6px;
    font-size: 0.88rem;
    color: var(--text-soft);
    line-height: 1.5;
  }

  /* ── SECTIONS ── */
  main { padding-bottom: 80px; }

  .section {
    padding: 72px 0 0;
  }

  .section-head {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    align-items: end;
    margin-bottom: 40px;
    padding-bottom: 32px;
    border-bottom: 1px solid var(--line);
    position: relative;
  }

  .section-head::before {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 80px;
    height: 2px;
    background: var(--accent);
    box-shadow: 0 0 8px var(--accent);
  }

  .section-head p {
    color: var(--text-soft);
    line-height: 1.7;
  }

  .section-num {
    font-family: var(--font-display);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--accent-text);
    margin-bottom: 10px;
  }

  /* ── PANELS ── */
  .panel {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 4px;
    padding: 32px;
    position: relative;
    overflow: hidden;
  }

  .panel::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--line-strong), transparent);
  }

  /* Corner accent */
  .panel::after {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 40px; height: 40px;
    background: linear-gradient(135deg, rgba(193,18,31,0.15) 0%, transparent 60%);
    border-bottom-left-radius: 4px;
  }

  .panel-accent {
    border-left: 3px solid var(--accent);
  }

  .image-panel {
    padding: 0;
    overflow: hidden;
    min-height: 340px;
  }

  .image-panel img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    filter: grayscale(20%) contrast(1.05);
    transition: transform 500ms ease, filter 500ms;
  }

  .image-panel:hover img {
    transform: scale(1.03);
    filter: grayscale(0%) contrast(1.08);
  }

  .image-lightbox {
    height: 100%;
  }

  .image-caption {
    position: absolute;
    left: 16px; right: 16px; bottom: 16px;
    padding: 16px 20px;
    background: rgba(8,10,12,0.88);
    border: 1px solid var(--line-strong);
    border-left: 3px solid var(--accent);
    border-radius: 3px;
  }

  .image-caption strong {
    display: block;
    font-family: var(--font-display);
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  .image-caption p {
    margin-top: 4px;
    font-size: 0.85rem;
    color: var(--text-soft);
    line-height: 1.5;
  }

  /* ── CARDS ── */
  .cards-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2px; }
  .cards-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
  .carousel {
    position: relative;
  }

  .carousel-track {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(280px, 34%);
    gap: 16px;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    padding: 4px 2px 18px;
    scroll-snap-type: x proximity;
    scrollbar-width: thin;
    scrollbar-color: rgba(193,18,31,0.45) rgba(255,255,255,0.05);
  }

  .carousel-track::-webkit-scrollbar {
    height: 10px;
  }

  .carousel-track::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.04);
    border-radius: 999px;
  }

  .carousel-track::-webkit-scrollbar-thumb {
    background: linear-gradient(90deg, var(--accent-dim), var(--accent));
    border-radius: 999px;
  }

  .carousel-track > * {
    scroll-snap-align: start;
  }

  .carousel-hint {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 14px;
    font-family: var(--font-display);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .card-link {
    display: grid;
    grid-template-rows: 200px auto;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 4px;
    overflow: hidden;
    transition: border-color 250ms, transform 250ms;
    position: relative;
  }

  .card-link:hover {
    border-color: rgba(193,18,31,0.4);
    transform: translateY(-3px);
    z-index: 1;
    box-shadow: 0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(193,18,31,0.15);
  }

  .card-media { position: relative; overflow: hidden; }
  .card-media img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 500ms ease;
    filter: grayscale(20%);
  }
  .card-link:hover .card-media img { transform: scale(1.06); filter: grayscale(0%); }

  .card-media-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 40%, rgba(8,10,12,0.8) 100%);
  }

  .card-copy {
    padding: 24px;
    display: flex;
    flex-direction: column;
  }

  .card-eyebrow {
    font-family: var(--font-display);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--accent-text);
    margin-bottom: 8px;
  }

  .card-copy h3 {
    font-size: 1.5rem;
    letter-spacing: 0.01em;
  }

  .card-copy p {
    margin-top: 10px;
    color: var(--text-soft);
    font-size: 0.92rem;
    line-height: 1.65;
    flex: 1;
  }

  .card-cta {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 20px;
    font-family: var(--font-display);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-soft);
    transition: color 200ms, gap 200ms;
  }

  .card-link:hover .card-cta {
    color: var(--accent-text);
    gap: 10px;
  }

  /* ── SPLITS ── */
  .split, .detail-grid, .contact-grid, .feature-grid {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 2px;
  }

  /* ── LISTS ── */
  .key-list, .bullet-list, .contact-list, .location-list {
    list-style: none;
    margin-top: 20px;
  }

  .key-list li, .contact-list li {
    padding: 14px 0;
    border-bottom: 1px solid var(--line);
    color: var(--text-soft);
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .key-list li strong, .contact-list li strong {
    display: block;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 0.78rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 3px;
  }

  .bullet-list li {
    padding: 10px 0;
    padding-left: 20px;
    border-bottom: 1px solid var(--line);
    color: var(--text-soft);
    font-size: 0.95rem;
    position: relative;
  }

  .bullet-list li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 19px;
    width: 6px;
    height: 2px;
    background: var(--accent);
  }

  .location-list li {
    padding: 7px 0;
    border-bottom: 1px solid var(--line);
    color: var(--text-soft);
    font-size: 0.9rem;
    padding-left: 14px;
    position: relative;
  }

  .location-list li::before {
    content: '›';
    position: absolute;
    left: 0;
    color: var(--accent-text);
  }

  /* ── REVIEWS ── */
  .review-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2px; }

  .review {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 4px;
    padding: 28px;
    position: relative;
    transition: border-color 250ms, transform 250ms;
  }

  .review::before {
    content: '"';
    position: absolute;
    top: 16px; right: 24px;
    font-family: Georgia, serif;
    font-size: 5rem;
    line-height: 1;
    color: rgba(193,18,31,0.1);
    pointer-events: none;
  }

  .review:hover {
    border-color: rgba(193,18,31,0.35);
    transform: translateY(-2px);
  }

  .review-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .review-top strong {
    font-family: var(--font-display);
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: 0.03em;
  }

  .review-role {
    margin-top: 3px;
    font-size: 0.82rem;
    color: var(--text-muted);
    font-family: var(--font-display);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .stars {
    color: var(--accent);
    font-size: 0.85rem;
    letter-spacing: 0.1em;
  }

  .review p {
    margin-top: 18px;
    color: var(--text-soft);
    font-size: 0.95rem;
    line-height: 1.75;
    font-style: italic;
  }

  /* ── BADGE ── */
  .badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    font-family: var(--font-display);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--accent-text);
    background: rgba(193,18,31,0.1);
    border: 1px solid rgba(193,18,31,0.2);
    border-radius: 2px;
  }

  /* ── BODY COPY ── */
  .body-copy p {
    color: var(--text-soft);
    line-height: 1.8;
    margin-top: 16px;
  }

  .body-copy p:first-child { margin-top: 0; }

  .lede {
    font-size: 1.05rem;
    color: var(--text-soft);
    line-height: 1.75;
    border-left: 3px solid var(--accent);
    padding-left: 16px;
    margin-bottom: 20px;
  }

  /* ── SUBNAV ── */
  .subnav {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 20px;
  }

  .subnav a {
    padding: 8px 18px;
    font-family: var(--font-display);
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-soft);
    border: 1px solid var(--line-strong);
    border-radius: 2px;
    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
    transition: color 200ms, border-color 200ms, background 200ms;
  }

  .subnav a:hover {
    color: var(--accent-text);
    border-color: rgba(193,18,31,0.4);
    background: rgba(193,18,31,0.06);
  }

  /* ── CONTACT ── */
  .contact-card {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 4px;
    padding: 32px;
    position: relative;
  }

  .contact-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 2px;
    background: linear-gradient(90deg, var(--accent) 0%, transparent 60%);
  }

  .contact-card h3 {
    font-size: 1.3rem;
    margin-bottom: 4px;
  }

  .contact-highlights {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
  }

  .contact-highlight {
    padding: 24px;
  }

  .contact-label {
    display: block;
    margin-bottom: 10px;
    font-family: var(--font-display);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--accent-text);
  }

  .contact-highlight strong {
    display: block;
    font-family: var(--font-display);
    font-size: 1.3rem;
    line-height: 1;
  }

  .contact-highlight p {
    margin-top: 10px;
    color: var(--text-soft);
    font-size: 0.92rem;
    line-height: 1.6;
  }

  .contact-main {
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: 18px;
    align-items: start;
  }

  .contact-primary-card {
    background:
      linear-gradient(180deg, rgba(193,18,31,0.1), rgba(193,18,31,0.02) 22%, rgba(255,255,255,0.01) 100%),
      var(--surface-raised);
    border-color: rgba(193,18,31,0.22);
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.38);
  }

  .contact-primary-card::before {
    height: 3px;
    background: linear-gradient(90deg, rgba(255,255,255,0.1) 0%, var(--accent) 22%, transparent 72%);
  }

  .contact-support-copy {
    color: var(--text-soft);
    font-size: 0.96rem;
    line-height: 1.7;
    margin-top: 10px;
  }

  .contact-stack {
    margin-top: 16px;
    color: var(--text-soft);
    font-size: 0.95rem;
    line-height: 1.7;
  }

  .contact-stack div + div { margin-top: 10px; }

  .contact-form {
    display: grid;
    gap: 10px;
    margin-top: 20px;
  }

  .field-group {
    display: grid;
    gap: 8px;
  }

  .field-group label {
    font-family: var(--font-display);
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text);
  }

  .hp-field {
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }

  .contact-form .button {
    width: 100%;
    justify-content: center;
    margin-top: 8px;
    padding-top: 14px;
    padding-bottom: 14px;
    font-size: 0.96rem;
  }

  .contact-form input,
  .contact-form textarea,
  .contact-form select {
    width: 100%;
    border: 1px solid var(--line-strong);
    border-radius: 3px;
    padding: 12px 16px;
    font: inherit;
    font-size: 0.95rem;
    background: rgba(255,255,255,0.02);
    color: var(--text);
    transition: border-color 200ms, box-shadow 200ms;
  }

  .contact-form input::placeholder,
  .contact-form textarea::placeholder { color: var(--text-muted); }

  .contact-form input:focus,
  .contact-form textarea:focus {
    outline: none;
    border-color: rgba(193,18,31,0.5);
    box-shadow: 0 0 0 3px rgba(193,18,31,0.08);
  }

  .contact-form textarea { min-height: 130px; resize: vertical; }

  .recaptcha-block {
    margin-top: 4px;
  }

  .form-note {
    margin-top: 8px;
    color: var(--text-muted);
    font-size: 0.82rem;
    line-height: 1.5;
  }

  .trust-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }

  .trust-card {
    padding: 28px;
  }

  .trust-card p {
    color: var(--text-soft);
    line-height: 1.7;
  }

  /* ── MINI CARDS ── */
  .product-gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }

  .mini-card {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 4px;
    overflow: hidden;
    transition: border-color 250ms, transform 250ms;
  }

  .mini-card:hover {
    border-color: rgba(193,18,31,0.35);
    transform: translateY(-2px);
  }

  .mini-card img {
    width: 100%; height: 180px;
    object-fit: cover;
    filter: grayscale(20%);
    transition: transform 400ms, filter 400ms;
  }

  .mini-card:hover img { transform: scale(1.05); filter: grayscale(0%); }

  .mini-copy { padding: 16px 18px; }

  .mini-copy h3 {
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: var(--text);
  }

  .mini-copy p {
    margin-top: 6px;
    font-size: 0.83rem;
    color: var(--text-muted);
  }

  .image-modal {
    position: fixed;
    inset: 0;
    z-index: 250;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(5, 8, 10, 0.9);
  }

  .image-modal.is-open {
    display: flex;
  }

  .image-modal-backdrop {
    position: absolute;
    inset: 0;
    border: none;
    background: transparent;
    cursor: zoom-out;
  }

  .image-modal-dialog {
    position: relative;
    z-index: 1;
    width: min(1100px, 100%);
    max-height: calc(100vh - 48px);
    padding: 14px;
    background: rgba(10, 14, 18, 0.96);
    border: 1px solid var(--line-strong);
    border-radius: 6px;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
  }

  .image-modal-close {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 40px;
    height: 40px;
    border: 1px solid var(--line-strong);
    border-radius: 4px;
    background: rgba(255,255,255,0.04);
    color: var(--text);
    cursor: pointer;
    font-size: 1.4rem;
    line-height: 1;
  }

  .image-modal-close:hover {
    border-color: rgba(193,18,31,0.45);
    background: rgba(193,18,31,0.08);
  }

  .image-modal img {
    width: 100%;
    max-height: calc(100vh - 120px);
    object-fit: contain;
  }

  .image-modal-caption {
    margin-top: 10px;
    color: var(--text-soft);
    font-size: 0.92rem;
    line-height: 1.5;
    text-align: center;
  }

  /* ── STOCKIST ── */
  .stockist {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 4px;
    padding: 28px;
    transition: border-color 250ms;
  }

  .stockist:hover { border-color: rgba(193,18,31,0.35); }

  .stockist h3 {
    font-family: var(--font-display);
    font-size: 1.6rem;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  .stockist p {
    margin-top: 10px;
    color: var(--text-soft);
    font-size: 0.92rem;
    line-height: 1.65;
  }

  /* ── FOOTER ── */
  .site-footer {
    position: relative;
    padding: 52px 0;
    border-top: 1px solid var(--line);
    margin-top: 80px;
    overflow: hidden;
  }

  .site-footer::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(193,18,31,0.4) 30%, rgba(193,18,31,0.4) 70%, transparent);
  }

  .footer-grid {
    display: grid;
    grid-template-columns: 1.4fr 0.8fr 0.8fr;
    gap: 48px;
  }

  .footer-grid p, .footer-grid a {
    color: var(--text-soft);
    font-size: 0.92rem;
    line-height: 1.7;
  }

  .footer-label {
    display: block;
    font-family: var(--font-display);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 14px;
  }

  .footer-links { display: grid; gap: 6px; }

  .footer-links a {
    color: var(--text-soft);
    font-size: 0.9rem;
    padding: 4px 0;
    border-bottom: 1px solid transparent;
    transition: color 200ms, border-color 200ms;
  }

  .footer-links a:hover {
    color: var(--accent-text);
    border-color: rgba(193,18,31,0.3);
  }

  .footer-copy {
    margin-top: 40px;
    padding-top: 24px;
    border-top: 1px solid var(--line);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
  }

  .footer-copy p {
    font-size: 0.8rem;
    color: var(--text-muted);
    font-family: var(--font-display);
    letter-spacing: 0.06em;
  }

  /* ── DIVIDER LINE ── */
  .rule {
    border: none;
    border-top: 1px solid var(--line);
    margin: 0;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 1000px) {
    .hero {
      grid-template-columns: 1fr;
      min-height: auto;
    }
    .hero-copy-wrap { padding: 52px 0 0; }
    .hero-media-wrap { height: 340px; }
    .hero-media-wrap::before { background: linear-gradient(to bottom, var(--bg) 0%, transparent 30%, transparent 70%, var(--bg) 100%); }
    .split, .detail-grid, .contact-grid, .feature-grid { grid-template-columns: 1fr; }
    .cards-2, .cards-3, .review-grid, .product-gallery { grid-template-columns: 1fr; }
    .contact-highlights,
    .contact-main,
    .trust-grid { grid-template-columns: 1fr 1fr; }
    .carousel-track {
      grid-auto-columns: minmax(280px, 72%);
    }
    .hero-stats { grid-template-columns: repeat(3, 1fr); }
    .footer-grid { grid-template-columns: 1fr 1fr; }
    .section-head { grid-template-columns: 1fr; }
    .nav {
      height: auto;
      padding: 14px 0;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px 14px;
    }
    .brand {
      flex: 1;
    }
    .nav-toggle {
      display: inline-flex;
      flex: none;
    }
    .nav-links {
      display: none;
      width: 100%;
      order: 4;
      flex-direction: column;
      gap: 8px;
      padding-top: 8px;
    }
    .nav-links a {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--line);
      border-radius: 4px;
      background: rgba(255,255,255,0.02);
    }
    .nav-links a[aria-current="page"]::after {
      left: 12px;
      right: 12px;
    }
    .nav-cta {
      display: none;
      width: 100%;
      order: 5;
      justify-content: center;
      align-self: stretch;
    }
    .nav.nav-open .nav-links,
    .nav.nav-open .nav-cta {
      display: flex;
    }
    .hero-badge {
      right: 20px;
      bottom: 20px;
      max-width: min(320px, calc(100% - 40px));
    }
  }

  @media (max-width: 640px) {
    .shell { width: calc(100% - 24px); }
    .hero {
      min-height: auto;
    }
    .hero-copy-wrap {
      padding: 36px 0 0;
    }
    .hero-copy-inner,
    .hero-lead {
      max-width: 100%;
    }
    .hero-actions {
      flex-direction: column;
      align-items: stretch;
    }
    .hero-actions .button,
    .hero-actions .nav-cta {
      width: 100%;
      justify-content: center;
    }
    .carousel-hint {
      justify-content: flex-start;
      margin-bottom: 12px;
      font-size: 0.68rem;
    }
    .carousel-track {
      grid-auto-columns: 88%;
      gap: 12px;
      padding-bottom: 14px;
    }
    .hero-stats { grid-template-columns: 1fr; margin-top: 28px; }
    .hero-stat { padding: 16px; }
    .hero-media-wrap { height: 260px; }
    .hero-badge {
      left: 14px;
      right: 14px;
      bottom: 14px;
      max-width: none;
      padding: 16px 18px;
    }
    h1 { font-size: clamp(2.2rem, 10vw, 3.5rem); }
    h2 { font-size: clamp(1.6rem, 7vw, 2.2rem); }
    .section {
      padding: 48px 0 0;
    }
    .section-head {
      gap: 18px;
      margin-bottom: 28px;
      padding-bottom: 22px;
    }
    .contact-highlights,
    .contact-main,
    .trust-grid { grid-template-columns: 1fr; }
    .panel, .contact-card, .review, .stockist { padding: 20px; }
    .image-panel { min-height: 260px; }
    .image-modal {
      padding: 10px;
    }
    .image-modal-dialog {
      padding: 10px;
    }
    .image-modal img {
      max-height: calc(100vh - 84px);
    }
    .card-link { grid-template-rows: 180px auto; }
    .card-copy, .mini-copy { padding: 18px; }
    .card-copy h3 { font-size: 1.25rem; }
    .review-top {
      flex-direction: column;
      align-items: flex-start;
    }
    .subnav a {
      width: 100%;
      justify-content: center;
      text-align: center;
    }
    .contact-list li {
      padding: 12px 0;
    }
    .footer-grid { grid-template-columns: 1fr; gap: 32px; }
  }

  @media (max-width: 420px) {
    .brand img { width: 142px; }
    .nav-links {
      display: none;
      grid-template-columns: 1fr;
    }
    .nav-links a {
      text-align: left;
      font-size: 0.82rem;
      padding: 10px 8px;
    }
    .button, .nav-cta {
      padding: 12px 18px;
      font-size: 0.84rem;
    }
  }

  /* Scroll animations */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .hero-copy-inner { animation: fadeUp 0.7s ease both; }
`;

function renderPage({ path, title, description, hero, content, flash = "", extraHead = "", recaptchaSiteKey = "" }) {
  const navLinks = nav
    .map((item) => {
      const active = item.href === path ? ' aria-current="page"' : "";
      return `<a href="${item.href}"${active}>${escapeHtml(item.label)}</a>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="icon" type="image/png" href="/public/img/5ac6b86f104b4b372560cc19_favicon-32.png" />
  ${extraHead}
  <style>${globalStyles}</style>
</head>
<body>
  <header class="site-header">
    <div class="shell nav" data-nav-root>
      <a class="brand" href="/" aria-label="PSP Engineering home">
        <img src="/public/img/59e309a0ec229e00016de15d_psp-logo.png" alt="PSP Engineering" />
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Open navigation" data-nav-toggle>
        <span class="nav-toggle-bars"></span>
      </button>
      <nav class="nav-links" id="primary-nav" aria-label="Primary">${navLinks}</nav>
      <a class="nav-cta" href="/contact">Request a Quote</a>
    </div>
  </header>

  ${flash}

  <main>
    <section class="hero">
      <div class="hero-copy-wrap shell">
        <div class="hero-copy-inner">
          <div class="eyebrow">
            <span class="eyebrow-label">${escapeHtml(hero.eyebrow)}</span>
          </div>
          <h1>${hero.title}</h1>
          <p class="hero-lead">${escapeHtml(hero.copy)}</p>
          <div class="hero-actions">${hero.actions.join("")}</div>
          <div class="hero-stats">
            ${hero.points.map(p => `
              <div class="hero-stat">
                <div class="hero-stat-value">${escapeHtml(p.title)}</div>
                <div class="hero-stat-label">${escapeHtml(p.copy)}</div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
      <div class="hero-media-wrap">
        <img class="hero-img" src="${hero.image}" alt="" />
        <div class="hero-badge">
          <strong>${escapeHtml(hero.noteTitle)}</strong>
          <p>${escapeHtml(hero.noteCopy)}</p>
        </div>
      </div>
    </section>

    ${content}
  </main>

  <footer class="site-footer">
    <div class="shell">
      <div class="footer-grid">
        <div>
          <span class="footer-label">About PSP Engineering</span>
          <p>We provide engineering, design, CNC machining, precision component manufacturing, marine equipment manufacturing and overhauling, and 3D design services.</p>
          <div style="margin-top:18px;">
            <a class="button button-secondary" href="/about" style="font-size:0.82rem;">Learn more</a>
          </div>
        </div>
        <div>
          <span class="footer-label">Quick Links</span>
          <div class="footer-links">
            <a href="/services">Our Services</a>
            <a href="/about">About PSP Engineering</a>
            <a href="/products/surfkit">PSP SurfKit</a>
            <a href="/products/vision-trap">Vision Trap</a>
            <a href="/contact">Contact Us</a>
          </div>
        </div>
        <div>
          <span class="footer-label">Contact</span>
          <p style="margin:0;">${escapeHtml(company.legalName)}</p>
          <p>Phone: ${escapeHtml(company.phone)}</p>
          <p>${escapeHtml(company.website)}</p>
          <p style="margin-top:8px; color: var(--text-muted); font-size:0.82rem;">${escapeHtml(company.hours)}</p>
        </div>
      </div>
      <div class="footer-copy">
        <p>&copy; ${new Date().getFullYear()} ${escapeHtml(company.legalName)}. All rights reserved.</p>
        <p>Auckland, New Zealand</p>
      </div>
    </div>
  </footer>
  <div class="image-modal" data-image-modal aria-hidden="true">
    <button class="image-modal-backdrop" type="button" data-image-modal-close aria-label="Close image preview"></button>
    <div class="image-modal-dialog" role="dialog" aria-modal="true" aria-label="Expanded product image">
      <button class="image-modal-close" type="button" data-image-modal-close aria-label="Close image preview">&times;</button>
      <img src="" alt="" data-image-modal-img />
      <div class="image-modal-caption" data-image-modal-caption></div>
    </div>
  </div>
  <script>
    (() => {
      const navRoot = document.querySelector("[data-nav-root]");
      const toggle = document.querySelector("[data-nav-toggle]");
      const imageModal = document.querySelector("[data-image-modal]");
      const modalImage = document.querySelector("[data-image-modal-img]");
      const modalCaption = document.querySelector("[data-image-modal-caption]");

      if (!navRoot || !toggle) {
        return;
      }

      const closeNav = () => {
        navRoot.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open navigation");
      };

      toggle.addEventListener("click", () => {
        const isOpen = navRoot.classList.toggle("nav-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
      });

      window.addEventListener("resize", () => {
        if (window.innerWidth > 1000) {
          closeNav();
        }
      });

      navRoot.querySelectorAll(".nav-links a, .nav-cta").forEach((link) => {
        link.addEventListener("click", () => {
          if (window.innerWidth <= 1000) {
            closeNav();
          }
        });
      });

      const recaptchaSiteKey = ${JSON.stringify(recaptchaSiteKey)};

      if (recaptchaSiteKey) {
        document.querySelectorAll("[data-recaptcha-form]").forEach((form) => {
          form.addEventListener("submit", async (event) => {
            if (form.dataset.recaptchaReady === "true") {
              return;
            }

            if (!window.grecaptcha) {
              return;
            }

            event.preventDefault();

            try {
              await window.grecaptcha.ready(async () => {
                const token = await window.grecaptcha.execute(recaptchaSiteKey, { action: "contact_form" });
                const tokenField = form.querySelector("[data-recaptcha-token]");

                if (tokenField) {
                  tokenField.value = token;
                }

                form.dataset.recaptchaReady = "true";
                form.requestSubmit();
              });
            } catch (error) {
              console.error("reCAPTCHA v3 execution failed", error);
              form.requestSubmit();
            }
          });
        });
      }

      if (imageModal && modalImage && modalCaption) {
        const closeImageModal = () => {
          imageModal.classList.remove("is-open");
          imageModal.setAttribute("aria-hidden", "true");
          modalImage.setAttribute("src", "");
          modalImage.setAttribute("alt", "");
          modalCaption.textContent = "";
        };

        document.querySelectorAll("[data-lightbox-trigger]").forEach((trigger) => {
          trigger.addEventListener("click", () => {
            modalImage.setAttribute("src", trigger.getAttribute("data-lightbox-src") || "");
            modalImage.setAttribute("alt", trigger.getAttribute("data-lightbox-alt") || "");
            modalCaption.textContent = trigger.getAttribute("data-lightbox-alt") || "";
            imageModal.classList.add("is-open");
            imageModal.setAttribute("aria-hidden", "false");
          });
        });

        imageModal.querySelectorAll("[data-image-modal-close]").forEach((button) => {
          button.addEventListener("click", closeImageModal);
        });

        document.addEventListener("keydown", (event) => {
          if (event.key === "Escape" && imageModal.classList.contains("is-open")) {
            closeImageModal();
          }
        });
      }
    })();
  </script>
</body>
</html>`;
}

function section(sectionNum, title, copy, body) {
  return `
    <section class="section">
      <div class="shell">
        <div class="section-head">
          <div>
            <div class="section-num">${escapeHtml(sectionNum)}</div>
            <h2>${escapeHtml(title)}</h2>
          </div>
          <p>${escapeHtml(copy)}</p>
        </div>
        ${body}
      </div>
    </section>
  `;
}

function renderHome() {
  const content = `
    ${section("01", "What We Do",
      "PSP is a one-stop precision engineering partner spanning design, machining, marine work, and specialist manufacturing.",
      `<div class="split">
        <div class="panel panel-accent body-copy">
          <p class="lede">At PSP Engineering we provide production engineering, CNC machining, precision component manufacturing, marine equipment manufacturing and overhauling, and 3D design.</p>
          <ul class="key-list">
            <li><strong>Owner-operated</strong>Fully owner-operated and able to cater to your unique project needs.</li>
            <li><strong>Quality First</strong>Quality workmanship and expert service across one-off and repeat production jobs.</li>
            <li><strong>International Reach</strong>PSP regularly performs projects for overseas companies in the U.S.A., Singapore, and Dubai.</li>
          </ul>
        </div>
        <div class="panel image-panel">
          <img src="/public/img/crankcase.jpg" alt="Precision engineering component" />
          <div class="image-caption">
            <strong>Built around practical engineering</strong>
            <p>From concept to machining, shaped by production realities and precise execution.</p>
          </div>
        </div>
      </div>`
    )}
    ${section("02", "Services",
      "Core capabilities, each with its own dedicated page and detailed technical information.",
      `<div class="cards-2">${services.map(s => cardLink(`/services/${s.slug}`, s.image, "Service", s.name, s.short)).join("")}</div>`
    )}
    ${section("03", "Products",
      "Specialist products backed by the same engineering knowledge that drives our machining work.",
      `<div class="carousel">
        <div class="carousel-hint">Scroll to explore</div>
        <div class="carousel-track">
          ${products.map(p => cardLink(`/products/${p.slug}`, p.image, "Product", p.name, p.short)).join("")}
        </div>
      </div>`
    )}
    ${section("04", "Client Reviews",
      "Direct feedback from clients across industrial, marine, and production engineering work.",
      `<div class="carousel">
        <div class="carousel-hint">Swipe through reviews</div>
        <div class="carousel-track">
          ${reviews.map(r => `
            <article class="review">
              <div class="review-top">
                <div>
                  <strong>${escapeHtml(r.person)}</strong>
                  <div class="review-role">${escapeHtml(r.role || "Client")}</div>
                </div>
                <div class="stars" aria-label="${r.rating} out of 5 stars">${stars(r.rating)}</div>
              </div>
              <p>${escapeHtml(r.quote)}</p>
            </article>`).join("")}
        </div>
      </div>`
    )}
  `;

  return renderPage({
    path: "/",
    title: "PSP Engineering | Engineering, Design, and CNC Machining Services",
    description: "Engineering, design, CNC machining, precision component manufacturing, marine equipment, and specialist products.",
    hero: {
      eyebrow: "Precision Engineering — Auckland, NZ",
      title: "Engineering built for <em>demanding</em> projects.",
      copy: "PSP Engineering combines design knowledge, CNC machining capability, and specialist manufacturing experience to support industrial, marine, and product-focused work.",
      image: "/public/img/multitasking.jpg",
      noteTitle: "One team, multiple capabilities",
      noteCopy: "Design, machining, and marine manufacture under one roof.",
      actions: [linkButton("/services", "Explore Services"), linkButton("/products", "View Products", "secondary")],
      points: [
        { title: "Owner-operated", copy: "Direct, expert support" },
        { title: "International", copy: "Work beyond NZ" },
        { title: "Precision-led", copy: "Design-to-machine aligned" },
      ],
    },
    content,
  });
}

function renderServicesPage() {
  const content = `
    ${section("01", "All Services",
      "CNC and machining services built around Mazak equipment, with quality that proves cost-effective internationally.",
      `<div class="cards-2">${services.map(s => cardLink(`/services/${s.slug}`, s.image, "Service Detail", s.name, s.short)).join("")}</div>`
    )}
  `;

  return renderPage({
    path: "/services",
    title: "Services | PSP Engineering",
    description: "CNC and machining services from PSP Engineering.",
    hero: {
      eyebrow: "Services",
      title: "CNC and machining for <em>every need</em>.",
      copy: "We use Mazak machining equipment to ensure precision and finish across all jobs, with engineering quality that consistently delivers for New Zealand and international clients.",
      image: "/public/img/cnc-machining.jpg",
      noteTitle: "International capability",
      noteCopy: "Projects regularly for the U.S.A., Singapore, and Dubai.",
      actions: [linkButton("/contact", "Request a Quote"), linkButton("/about", "About PSP", "secondary")],
      points: [
        { title: "Mazak", copy: "Equipment precision" },
        { title: "English", copy: "Sales support only" },
        { title: "4 Services", copy: "Dedicated pages" },
      ],
    },
    content,
  });
}

function renderServiceDetail(service) {
  const content = `
    ${section("Detail", service.name, service.short,
      `<div class="detail-grid">
        <div class="panel body-copy">
          <p class="lede">${escapeHtml(service.intro)}</p>
          ${service.body.map(p => `<p>${escapeHtml(p)}</p>`).join("")}
        </div>
        <div class="panel image-panel">
          <img src="${service.image}" alt="${escapeHtml(service.name)}" />
          <div class="image-caption">
            <strong>${escapeHtml(service.highlight)}</strong>
            <p>PSP supports custom requirements and can tailor work to your project scope.</p>
          </div>
        </div>
      </div>`
    )}
    ${section("More", "Explore Further",
      "Use these quick links to move between service pages and the wider site.",
      `<div class="subnav">
        <a href="/services">All Services</a>
        <a href="/products">Products</a>
        <a href="/reviews">Reviews</a>
        <a href="/contact">Contact</a>
      </div>`
    )}
  `;

  return renderPage({
    path: "/services",
    title: `${service.name} | PSP Engineering`,
    description: `${service.name} services from PSP Engineering.`,
    hero: {
      eyebrow: "Service Detail",
      title: `<em>${service.name}</em>`,
      copy: service.short,
      image: service.image,
      noteTitle: "Project-specific support",
      noteCopy: "PSP is fully owner-operated and can cater to unique client needs.",
      actions: [linkButton("/contact", "Discuss Your Project"), linkButton("/services", "Back to Services", "secondary")],
      points: [
        { title: "Precision", copy: service.intro.substring(0, 40) + "…" },
        { title: "Flexible", copy: "One-off and production" },
        { title: "Direct", copy: "Tailored quotes" },
      ],
    },
    content,
  });
}

function renderProductsPage() {
  const content = `
    ${section("01", "Product Range",
      "Specialist products backed by the same engineering knowledge that drives our machining work.",
      `<div class="cards-2">${products.map(p => cardLink(`/products/${p.slug}`, p.image, "Product Detail", p.name, p.short)).join("")}</div>`
    )}
  `;

  return renderPage({
    path: "/products",
    title: "Products | PSP Engineering",
    description: "Product pages for PSP SurfKit and Vision Trap.",
    hero: {
      eyebrow: "Products",
      title: "Specialist products backed by <em>engineering know-how</em>.",
      copy: "PSP's product offering includes SurfKit components for surf lifesaving and Vision Trap for easier air-conditioning drainage maintenance.",
      image: "/public/img/surf-kit.jpg",
      noteTitle: "Engineered for purpose",
      noteCopy: "Each product is backed by the same precision focus as our machining work.",
      actions: [linkButton("/products/surfkit", "View SurfKit"), linkButton("/products/vision-trap", "View Vision Trap", "secondary")],
      points: [
        { title: "SurfKit", copy: "Surf rescue engines" },
        { title: "Vision Trap", copy: "HVAC maintenance" },
        { title: "Enquiry", copy: "Contact-ready pages" },
      ],
    },
    content,
  });
}

function renderSurfkitPage(status = "", options = {}) {
  const recaptchaMarkup = renderRecaptcha(options.recaptchaSiteKey);
  const formStartedAt = Date.now();

  const content = `
    ${section("01", "SurfKit", "Engine upgrade kits and components designed for surf lifesaving conditions.",
      `<div class="split">
        <div class="panel body-copy">
          ${products[0].body.map(p => `<p>${escapeHtml(p)}</p>`).join("")}
          <ul class="bullet-list">
            <li>Trusted by surf lifesaving clubs and competitive sport users.</li>
            <li>Unique PSP product range with multiple upgrade components available.</li>
            <li>Contact PSP for pricing, availability, and recommended purchase or installation pathways.</li>
          </ul>
        </div>
        <div class="panel image-panel">
          ${renderLightboxImage({
            src: "/public/img/surf-kit.jpg",
            alt: "PSP SurfKit",
            buttonClass: "image-lightbox",
          })}
          <div class="image-caption">
            <strong>Purpose-built for surf rescue engines</strong>
            <p>Components engineered for strength where conditions are unforgiving.</p>
          </div>
        </div>
      </div>`
    )}
    ${section("02", "SurfKit Components",
      "Each item in the product family is shown with supporting imagery.",
      `<div class="product-gallery">${surfkitItems.map(item => `
        <article class="mini-card">
          ${renderLightboxImage({
            src: item.image,
            alt: item.name,
          })}
          <div class="mini-copy">
            <h3>${escapeHtml(item.name)}</h3>
            <p>Part of the PSP SurfKit product family.</p>
          </div>
        </article>`).join("")}</div>`
    )}
    ${section("03", "Product Enquiry", "Contact the team for pricing, stock, and installation guidance.",
      `<div class="contact-grid">
        <div class="contact-card">
          <h3>Ask About SurfKit</h3>
          <form class="contact-form" method="post" action="/contact" data-recaptcha-form>
            <input type="hidden" name="returnTo" value="/products/surfkit" />
            <input type="hidden" name="enquiryType" value="SurfKit enquiry" />
            <input type="hidden" name="sourcePage" value="/products/surfkit" />
            <input type="hidden" name="formStartedAt" value="${formStartedAt}" />
            <div class="hp-field" aria-hidden="true">
              <label for="surfkit-fax-number">Fax number</label>
              <input id="surfkit-fax-number" type="text" name="faxNumber" tabindex="-1" autocomplete="off" inputmode="numeric" />
            </div>
            <input type="text" name="name" placeholder="Your name" aria-label="Your name" required />
            <input type="email" name="email" placeholder="Your email" aria-label="Your email" required />
            <textarea name="message" placeholder="Which products are you enquiring about?" aria-label="Products enquiry" required></textarea>
            ${recaptchaMarkup}
            <button class="button button-primary" type="submit">Send Enquiry</button>
          </form>
        </div>
        <div class="contact-card">
          <h3>Need pricing or availability?</h3>
          <div class="contact-stack">
            <div>Contact us for details on pricing, stock, and where to purchase or install the PSP SurfKit.</div>
            <div>Phone: ${escapeHtml(company.phone)}</div>
            <div>International: ${escapeHtml(company.phoneIntl)}</div>
            <div>${escapeHtml(company.website)}</div>
          </div>
        </div>
      </div>`
    )}
  `;

  return renderPage({
    path: "/products",
    title: "PSP SurfKit | PSP Engineering",
    description: "SurfKit engine upgrade kits for surf rescue and surf lifesaving applications.",
    hero: {
      eyebrow: "Product Detail",
      title: "PSP <em>SurfKit</em>",
      copy: products[0].short,
      image: "/public/img/surf-kit.jpg",
      noteTitle: "Built for surf lifesaving",
      noteCopy: "Dependable upgraded engine components for demanding environments.",
      actions: [linkButton("/contact", "Enquire Now"), linkButton("/products", "Back to Products", "secondary")],
      points: [
        { title: "Strength", copy: "Upgraded components" },
        { title: "Reliability", copy: "Clubs and sport users" },
        { title: "9 Items", copy: "Component range" },
      ],
    },
    content,
    flash: buildFlashMarkup(status),
    extraHead: options.recaptchaSiteKey ? `<script src="https://www.google.com/recaptcha/api.js?render=${escapeHtml(options.recaptchaSiteKey)}"></script>` : "",
    recaptchaSiteKey: options.recaptchaSiteKey || "",
  });
}

function renderVisionTrapPage() {
  const features = [
    "One-glance monitoring through a transparent bowl.",
    "Access in seconds by unscrewing the bowl to flush debris.",
    "Compact 90mm-high design for tight ceiling spaces.",
    "225ml capacity — more than twice a traditional p-trap.",
    "Compatible with sterilising tablets for ongoing protection.",
  ];

  const content = `
    ${section("01", "Vision Trap", "A faster, easier, safer way to maintain air-conditioning drainage lines.",
      `<div class="split">
        <div class="panel body-copy">
          ${products[1].body.map(p => `<p>${escapeHtml(p)}</p>`).join("")}
          <ul class="bullet-list">${features.map(f => `<li>${escapeHtml(f)}</li>`).join("")}</ul>
        </div>
        <div class="panel image-panel">
          ${renderLightboxImage({
            src: "/public/img/vision_trap.jpg",
            alt: "Vision Trap",
            buttonClass: "image-lightbox",
          })}
          <div class="image-caption">
            <strong>Designed for simpler maintenance</strong>
            <p>Faster access and easier monitoring versus a traditional p-trap.</p>
          </div>
        </div>
      </div>`
    )}
    ${section("02", "How Vision Trap Works",
      "Versatile across both suction-fan and gravity-drain air-conditioning systems.",
      `<div class="cards-2">
        <article class="panel">
          <span class="badge">Suction-fan A/C</span>
          <p class="lede" style="margin-top:16px;">Acts as a P-Trap / Air-Break crucial for the healthy operation of A/C systems with a suction fan.</p>
          <p style="color:var(--text-soft);line-height:1.75;margin-top:12px;">By breaking suction, it ensures smooth water flow. The clear bowl enables early detection of contamination build-up, helping prevent tray overflow and water damage.</p>
        </article>
        <article class="panel">
          <span class="badge">Gravity-drain A/C</span>
          <p class="lede" style="margin-top:16px;">Makes clear sense in gravity drain systems where blocked drains can be messy, costly, and time consuming to clear.</p>
          <p style="color:var(--text-soft);line-height:1.75;margin-top:12px;">Accessible design makes periodic maintenance easier and lowers friction in routine inspection and servicing.</p>
        </article>
      </div>`
    )}
    ${section("03", "More Information", "Installation notes and stockist locations linked directly.",
      `<div class="subnav">
        <a href="/products/vision-trap/installation">Installation Instructions</a>
        <a href="/products/vision-trap/stockists">Stockists</a>
        <a href="/contact">Enquire</a>
      </div>`
    )}
  `;

  return renderPage({
    path: "/products",
    title: "Vision Trap | PSP Engineering",
    description: "Vision Trap for air-conditioning drainage maintenance and p-trap replacement.",
    hero: {
      eyebrow: "Product Detail",
      title: "Vision <em>Trap</em>",
      copy: products[1].short,
      image: "/public/img/5a93c3e08a834600011a3b5b_visiontrap.jpg",
      noteTitle: "Compact and accessible",
      noteCopy: "Fits tight ceiling spaces while making inspection and maintenance far easier.",
      actions: [linkButton("/products/vision-trap/installation", "Installation"), linkButton("/products/vision-trap/stockists", "Stockists", "secondary")],
      points: [
        { title: "90mm", copy: "Compact height" },
        { title: "225ml", copy: "Capacity" },
        { title: "Clear bowl", copy: "Visible monitoring" },
      ],
    },
    content,
  });
}

function renderVisionTrapInstallationPage() {
  const content = `
    ${section("01", "Installation Instructions",
      "Covering orientation, sealing, breather setup, priming, and care notes.",
      `<div class="split">
        <div class="panel">
          <ul class="bullet-list">
            <li>Ensure inlet and outlet are installed in correct orientation following the directional arrows.</li>
            <li>The Vision Trap bowl has a 2-start thread. Ensure the bowl is square and adequately tightened.</li>
            <li>The sealing O-ring has been pre-lubed during manufacture. Future lubrication can be applied intermittently.</li>
            <li>Install the top breather pipe after Vision Trap installation, with length decided based on normal water tray level.</li>
            <li>We recommend a single sterilising tablet in the bowl for long-lasting protection against bacteria, viruses, fungi and spores.</li>
            <li>Like a p-trap, the Vision Trap must be primed with water to function.</li>
          </ul>
        </div>
        <div class="panel">
          <span class="badge">Notes</span>
          <ul class="bullet-list" style="margin-top:14px;">
            <li>Please install as per manufacturer's instructions.</li>
            <li>The PVC inside dropper pipe has been assembled and glued at time of manufacture.</li>
            <li>Capacity: 225ml.</li>
          </ul>
          <span class="badge" style="margin-top:22px;display:inline-flex;">Disclaimer</span>
          <p class="lede" style="margin-top:14px;">The manufacturer accepts no responsibility for injury, damage or loss due to misuse, poor workmanship, or incorrect installation.</p>
        </div>
      </div>`
    )}
  `;

  return renderPage({
    path: "/products",
    title: "Vision Trap Installation | PSP Engineering",
    description: "Installation instructions for Vision Trap.",
    hero: {
      eyebrow: "Vision Trap",
      title: "Installation <em>Instructions</em>",
      copy: "A dedicated installation reference covering orientation, sealing, breather setup, priming, and care notes.",
      image: "/public/img/vision_trap.jpg",
      noteTitle: "Install carefully",
      noteCopy: "Correct orientation and proper tightening are important for reliable performance.",
      actions: [linkButton("/products/vision-trap", "Back to Vision Trap"), linkButton("/contact", "Contact PSP", "secondary")],
      points: [
        { title: "Orientation", copy: "Follow the arrows" },
        { title: "Priming", copy: "Prime with water" },
        { title: "225ml", copy: "Water capacity" },
      ],
    },
    content,
  });
}

function renderVisionTrapStockistsPage() {
  const content = `
    ${section("01", "Vision Trap Stockists",
      "Available across New Zealand and internationally through specialist refrigeration and HVAC suppliers.",
      `<div class="cards-2">${stockists.map(s => `
        <article class="stockist">
          <h3>${escapeHtml(s.name)}</h3>
          <p>${escapeHtml(s.description)}</p>
          <ul class="location-list">${s.locations.map(l => `<li>${escapeHtml(l)}</li>`).join("")}</ul>
          <p style="margin-top:18px;"><a class="button button-secondary" href="${s.website}" target="_blank" rel="noreferrer">Visit website</a></p>
        </article>`).join("")}</div>`
    )}
  `;

  return renderPage({
    path: "/products",
    title: "Vision Trap Stockists | PSP Engineering",
    description: "Stockists for Vision Trap in New Zealand and internationally.",
    hero: {
      eyebrow: "Vision Trap",
      title: "Where to <em>Buy</em>",
      copy: "Vision Trap is available through specialist HVAC and refrigeration suppliers, with both New Zealand coverage and wider regional availability.",
      image: "/public/img/5a93c3e08a834600011a3b5b_visiontrap.jpg",
      noteTitle: "Find a supplier",
      noteCopy: "Use the listings below or contact PSP directly for guidance.",
      actions: [linkButton("/products/vision-trap", "Back to Vision Trap"), linkButton("/contact", "Ask PSP", "secondary")],
      points: [
        { title: "New Zealand", copy: "National coverage" },
        { title: "Australia+", copy: "International too" },
        { title: "Direct", copy: "PSP can assist" },
      ],
    },
    content,
  });
}

function renderAboutPage() {
  const content = `
    ${section("01", "About PSP Engineering",
      "A practical, project-focused operation combining production engineering, machining, marine manufacture, and 3D design.",
      `<div class="split">
        <div class="panel body-copy">
          <p class="lede">At PSP Engineering we provide our customers with a range of products and services including production engineering, CNC machining, precision component manufacturing, marine equipment manufacturing and overhauling, and 3D design.</p>
          <p>We are your one-stop shop for precision engineering work, providing quality and expert service across a wide variety of project types.</p>
          <p>PSP is fully owner-operated and can cater to your unique needs. Contact our sales team for a quote today.</p>
          <div class="subnav" style="margin-top:24px;">
            <a href="/services/3d-design">3D Design</a>
            <a href="/services/cnc-machining">CNC Machining</a>
            <a href="/services/custom-marine-manufacture">Marine Manufacture</a>
            <a href="/services/multitasking-5-axis">5-Axis MultiTasking</a>
          </div>
        </div>
        <div class="panel image-panel">
          <img src="/public/img/3d-design.jpg" alt="3D design and engineering" />
          <div class="image-caption">
            <strong>Engineering shaped by production knowledge</strong>
            <p>Design and machining inform each other for more practical outcomes.</p>
          </div>
        </div>
      </div>`
    )}
  `;

  return renderPage({
    path: "/about",
    title: "About | PSP Engineering",
    description: "About PSP Engineering and its precision engineering, design, and machining services.",
    hero: {
      eyebrow: "About",
      title: "Owner-operated <em>precision engineering</em>.",
      copy: "PSP Engineering brings together production engineering, machining, marine manufacture, and 3D design in one practical, project-focused Auckland operation.",
      image: "/public/img/3d-design.jpg",
      noteTitle: "One-stop capability",
      noteCopy: "Design, machining, and marine manufacture under one roof.",
      actions: [linkButton("/contact", "Contact Sales"), linkButton("/services", "View Services", "secondary")],
      points: [
        { title: "Production", copy: "End-to-end support" },
        { title: "Owner-operated", copy: "Direct engagement" },
        { title: "Wide scope", copy: "Parts to marine" },
      ],
    },
    content,
  });
}

function renderReviewsPage() {
  const content = `
    ${section("01", "Client Reviews",
      "Recurring themes: quality workmanship, on-time delivery, and practical problem-solving.",
      `<div class="review-grid">${reviews.map(r => `
        <article class="review">
          <div class="review-top">
            <div>
              <strong>${escapeHtml(r.person)}</strong>
              <div class="review-role">${escapeHtml(r.role || "Client")}</div>
            </div>
            <div class="stars" aria-label="${r.rating} out of 5 stars">${stars(r.rating)}</div>
          </div>
          <p>${escapeHtml(r.quote)}</p>
        </article>`).join("")}</div>`
    )}
  `;

  return renderPage({
    path: "/reviews",
    title: "Reviews | PSP Engineering",
    description: "Client reviews for PSP Engineering.",
    hero: {
      eyebrow: "Reviews",
      title: "What clients say about <em>working with PSP</em>.",
      copy: "Testimonials that highlight the recurring themes: quality, practical problem-solving, and responsive service across years of work.",
      image: "/public/img/reviews.png",
      noteTitle: "Trusted over time",
      noteCopy: "Consistency, on-time delivery, and simple solutions to complex problems.",
      actions: [linkButton("/contact", "Start a Project"), linkButton("/about", "About PSP", "secondary")],
      points: [
        { title: "Quality", copy: "Consistent work" },
        { title: "Service", copy: "Responsive support" },
        { title: "Solutions", copy: "Practical thinking" },
      ],
    },
    content,
  });
}

function renderContactPage(status = "", options = {}) {
  const recaptchaMarkup = renderRecaptcha(options.recaptchaSiteKey);
  const formStartedAt = Date.now();

  const content = `
    ${section("01", "Quick Contact",
      "Call, visit, or send an enquiry. The fastest route is often a quick phone call or a concise project brief.",
      `<div class="contact-highlights">
        <article class="contact-card contact-highlight">
          <span class="contact-label">Phone</span>
          <strong>${escapeHtml(company.phone)}</strong>
          <p>Speak directly with the team about engineering work, product enquiries, and quoting.</p>
        </article>
        <article class="contact-card contact-highlight">
          <span class="contact-label">Location</span>
          <strong>Mount Roskill</strong>
          <p>${company.street.slice(0, 2).map(l => escapeHtml(l)).join("<br />")}</p>
        </article>
        <article class="contact-card contact-highlight">
          <span class="contact-label">Hours</span>
          <strong>${escapeHtml(company.hours)}</strong>
          <p>Weekday business hours for calls, enquiries, and project discussions.</p>
        </article>
        <article class="contact-card contact-highlight">
          <span class="contact-label">International</span>
          <strong>${escapeHtml(company.phoneIntl)}</strong>
          <p>International enquiries are welcome. Sales support is English-speaking only.</p>
        </article>
      </div>`
    )}
    ${section("02", "Tell us about your project",
      "Use the enquiry form for product questions, machining requests, or broader engineering work. We will get back to you as soon as possible.",
      `<div class="contact-main">
        <div class="contact-card contact-primary-card">
          <h3>Tell us about your project</h3>
          <p class="contact-support-copy">Share a few details about what you need and the team will come back to you as soon as possible.</p>
          <form class="contact-form" method="post" action="/contact" data-recaptcha-form>
            <input type="hidden" name="returnTo" value="/contact" />
            <input type="hidden" name="enquiryType" value="General website enquiry" />
            <input type="hidden" name="sourcePage" value="/contact" />
            <input type="hidden" name="formStartedAt" value="${formStartedAt}" />
            <div class="hp-field" aria-hidden="true">
              <label for="contact-fax-number">Fax number</label>
              <input id="contact-fax-number" type="text" name="faxNumber" tabindex="-1" autocomplete="off" inputmode="numeric" />
            </div>
            <div class="field-group">
              <label for="contact-name">Your name</label>
              <input id="contact-name" type="text" name="name" placeholder="Enter your name" aria-label="Name" required />
            </div>
            <div class="field-group">
              <label for="contact-company">Company</label>
              <input id="contact-company" type="text" name="companyName" placeholder="Enter your company name" aria-label="Company name" />
            </div>
            <div class="field-group">
              <label for="contact-email">Email</label>
              <input id="contact-email" type="email" name="email" placeholder="Enter your email" aria-label="Email" required />
            </div>
            <div class="field-group">
              <label for="contact-message">Project details</label>
              <textarea id="contact-message" name="message" placeholder="Tell us what you need help with" aria-label="Message" required></textarea>
            </div>
            ${recaptchaMarkup}
            <button class="button button-primary" type="submit">Send Enquiry</button>
          </form>
        </div>
        <div class="contact-card">
          <span class="badge">Prefer to call?</span>
          <h3 style="margin-top:14px;">Talk to PSP directly</h3>
          <p class="contact-support-copy">Many engineering clients prefer a direct conversation first. If you would rather talk through your project, call during business hours and the team can point you in the right direction quickly.</p>
          <div class="contact-stack">
            <div><strong style="display:block;margin-bottom:4px;color:var(--text);">Phone</strong>${escapeHtml(company.phone)}</div>
            <div><strong style="display:block;margin-bottom:4px;color:var(--text);">International</strong>${escapeHtml(company.phoneIntl)}</div>
            <div><strong style="display:block;margin-bottom:4px;color:var(--text);">Website</strong>${escapeHtml(company.website)}</div>
          </div>
          <div class="subnav" style="margin-top:24px;">
            <a href="tel:${company.phoneIntl.replace(/\s+/g, "")}">Call PSP</a>
            <a href="/services">View Services</a>
          </div>
        </div>
      </div>`
    )}
    ${section("03", "Company Details",
      "Supporting business details for clients who want the full company information before getting in touch.",
      `<div class="trust-grid">
        <article class="contact-card trust-card">
          <span class="contact-label">Addresses</span>
          <h3>${escapeHtml(company.legalName)}</h3>
          <div class="contact-stack">
            <div><strong style="display:block;margin-bottom:4px;color:var(--text);">Physical address</strong>${company.street.map(l => escapeHtml(l)).join("<br />")}</div>
            <div><strong style="display:block;margin-bottom:4px;color:var(--text);">Postal address</strong>${company.postal.map(l => escapeHtml(l)).join("<br />")}</div>
          </div>
        </article>
        <article class="contact-card trust-card">
          <span class="contact-label">Team & Support</span>
          <h3>General Enquiries</h3>
          <div class="contact-stack">
            <div>Tony Slimo, Managing Director</div>
            <div>Chris Sargent, Senior Engineer</div>
            <div><strong style="display:block;margin-bottom:4px;color:var(--text);">Phone / Fax</strong>Phone: ${escapeHtml(company.phone)}<br />Fax: ${escapeHtml(company.fax)}</div>
            <div><strong style="display:block;margin-bottom:4px;color:var(--text);">International</strong>Phone: ${escapeHtml(company.phoneIntl)}<br />Fax: ${escapeHtml(company.faxIntl)}</div>
          </div>
        </article>
      </div>`
    )}
  `;

  return renderPage({
    path: "/contact",
    title: "Contact | PSP Engineering",
    description: "Contact PSP Engineering for quotes and project enquiries.",
    hero: {
      eyebrow: "Contact",
      title: "Talk to PSP about your <em>next project</em>.",
      copy: "Whether you need machining, design, specialist marine work, or product guidance — the team is ready to help.",
      image: "/public/img/cogs.png",
      noteTitle: "Local and international",
      noteCopy: "PSP provides its full service range internationally as well as within New Zealand.",
      actions: [linkButton(`tel:${company.phoneIntl.replace(/\s+/g, "")}`, "Call PSP"), linkButton("/services", "View Services", "secondary")],
      points: [
        { title: "Auckland", copy: "44 Carr Road, Mt Roskill" },
        { title: "Hours", copy: company.hours },
        { title: "Quote", copy: "Form or phone" },
      ],
    },
    content,
    flash: buildFlashMarkup(status),
    extraHead: options.recaptchaSiteKey ? `<script src="https://www.google.com/recaptcha/api.js?render=${escapeHtml(options.recaptchaSiteKey)}"></script>` : "",
    recaptchaSiteKey: options.recaptchaSiteKey || "",
  });
}

function renderNotFound() {
  return renderPage({
    path: "",
    title: "Page Not Found | PSP Engineering",
    description: "The page you requested could not be found.",
    hero: {
      eyebrow: "404",
      title: "Page <em>not found</em>.",
      copy: "The requested page doesn't exist. Use the links below to navigate back to the main areas of the site.",
      image: "/public/img/cnc-machining.jpg",
      noteTitle: "Keep exploring",
      noteCopy: "Use the actions below to get back on track.",
      actions: [linkButton("/", "Home"), linkButton("/services", "Services", "secondary")],
      points: [
        { title: "Home", copy: "Main landing page" },
        { title: "Services", copy: "All capabilities" },
        { title: "Products", copy: "SurfKit & Vision Trap" },
      ],
    },
    content: section("—", "Where to next?",
      "These links should get you back to the right part of the site quickly.",
      `<div class="subnav">
        <a href="/">Home</a>
        <a href="/services">Services</a>
        <a href="/products">Products</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </div>`
    ),
  });
}

module.exports = {
  services,
  renderHome,
  renderServicesPage,
  renderServiceDetail,
  renderProductsPage,
  renderSurfkitPage,
  renderVisionTrapPage,
  renderVisionTrapInstallationPage,
  renderVisionTrapStockistsPage,
  renderAboutPage,
  renderReviewsPage,
  renderContactPage,
  renderNotFound,
};
