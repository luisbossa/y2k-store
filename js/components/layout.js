/* ================= LAYOUT =================
   Header, menús, búsqueda, carrito lateral, footer y toast compartidos por todas las páginas.
   Cada página sólo tiene su <main>; esto se inyecta alrededor. */

import { STORE } from "../data/config.js";
import { GROUPS } from "../data/catalog.js";
import { shopUrl, infoUrl } from "../utils/dom.js";
import { initHeader } from "./header.js";
import { initLogo } from "./logo.js";
import { initSearch } from "./search.js";
import { initCartDrawer } from "./cart-drawer.js";
import { initQuickAdd } from "./quick-add.js";
import { initScrollers } from "./scrollers.js";
import { auth } from "../store/auth.js";

const ICONS = `
  <svg width="0" height="0" style="position:absolute" aria-hidden="true">
    <symbol id="icon-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></symbol>
    <symbol id="icon-chevron-down" viewBox="0 0 24 24"><path d="m5 9 7 7 7-7"/></symbol>
    <symbol id="icon-chevron-right" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></symbol>
    <symbol id="icon-close" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></symbol>
    <symbol id="icon-truck" viewBox="0 0 24 24"><path d="M2 6h12v10H2zM14 10h4l4 4v2h-8z"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></symbol>
    <symbol id="icon-lock" viewBox="0 0 24 24"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></symbol>
    <symbol id="icon-refresh" viewBox="0 0 24 24"><path d="M20 11a8 8 0 0 0-14.5-4.5L4 8M4 4v4h4M4 13a8 8 0 0 0 14.5 4.5L20 16M20 20v-4h-4"/></symbol>
    <symbol id="icon-sparkle" viewBox="0 0 24 24"><path d="M12 2c.8 5.2 4.8 9.2 10 10-5.2.8-9.2 4.8-10 10-.8-5.2-4.8-9.2-10-10 5.2-.8 9.2-4.8 10-10z"/></symbol>
    <symbol id="icon-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></symbol>
    <symbol id="icon-trash" viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></symbol>
    <symbol id="icon-check" viewBox="0 0 24 24"><path d="m5 12 5 5 9-10"/></symbol>
  </svg>`;

const SHOP_LINKS = [
  ["Ver todo", shopUrl()],
  ["Novedades", shopUrl({ tag: "new" })],
  ["Sudaderas", shopUrl({ cat: "hoodies" })],
  ["Camisetas", shopUrl({ cat: "tees" })],
  ["Parte de abajo", shopUrl({ cat: "bottoms" })],
  ["Accesorios", shopUrl({ cat: "accessories" })],
];

// Mega-menú del dropdown "Shop": columnas de categorías.
const SHOP_MENU = [
  ["tops", [["Sudaderas", "hoodies"], ["Camisetas", "tees"], ["Sin mangas", "sleeveless"]]],
  ["bottoms", [["Pantalones", "pants"], ["Jeans", "jeans"], ["Pantalonetas", "shorts"]]],
  ["accessories", [["Gorras", "caps"], ["Gorros", "hats"], ["Cinturones", "belts"]]],
];

const NAV_LINKS = [
  ["Novedades", shopUrl({ tag: "new" })],
  ["Mujer", shopUrl({ gender: "women" })],
  ["Hombre", shopUrl({ gender: "men" })],
];

const ANNOUNCEMENTS = [
  "Envío gratis en compras +₡30 000",
  "Nuevo lanzamiento: Chrome Season Vol. 2",
  "10% de descuento con el código ZONE10",
  "Paga con SINPE Móvil",
];

const accountLabel = () => (auth.current() ? "Mi cuenta" : "Crear cuenta");

/** true si el link apunta a la página (y filtros) actuales. */
function isCurrent(href) {
  const url = new URL(href, window.location.href);
  const here = window.location;
  const page = (p) => p.split("/").pop() || "index.html";
  return page(url.pathname) === page(here.pathname) && url.search === here.search;
}

const current = (href) => (isCurrent(href) ? 'aria-current="page"' : "");

function announcementTemplate() {
  // El texto se duplica para que la cinta haga un loop continuo sin saltos.
  const items = ANNOUNCEMENTS.map((t) => `<span>${t}</span><span aria-hidden="true">✦</span>`).join("");
  return `
  <div class="announcement-bar">
    <div class="announcement-track" aria-label="Anuncios">
      <div class="announcement-items">${items}</div>
      <div class="announcement-items" aria-hidden="true">${items}</div>
    </div>
    <nav class="announcement-social" aria-label="Redes sociales">
      <a href="${STORE.social.instagram}" target="_blank" rel="noopener noreferrer">Instagram</a>
      <a href="${STORE.social.tiktok}" target="_blank" rel="noopener noreferrer">TikTok</a>
    </nav>
  </div>`;
}

function headerTemplate() {
  return `
  <header class="site-header">
    <div class="header-bar">
      <div class="header-left">
        <button class="hamburger-btn chrome-btn" id="hamburgerBtn" aria-label="Abrir menú" aria-controls="mobileMenu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
        <nav class="header-nav" aria-label="Navegación principal">
          <ul class="nav-list">
            <li class="nav-item">
              <details class="dropdown-root">
                <summary class="nav-link">Tienda <svg class="icon"><use href="#icon-chevron-down"/></svg></summary>
                <div class="dropdown-menu y2k-window">
                  <div class="y2k-window-bar"><span>tienda.exe</span><span class="y2k-window-dots" aria-hidden="true"><span></span><span></span><span></span></span></div>
                  <div class="dropdown-body">
                    ${SHOP_MENU.map(
                      ([group, cats]) => `
                      <div class="dropdown-col">
                        <a href="${shopUrl({ cat: group })}" class="dropdown-heading">${GROUPS[group]}</a>
                        <ul>${cats.map(([label, cat]) => `<li><a href="${shopUrl({ cat })}">${label}</a></li>`).join("")}</ul>
                      </div>`,
                    ).join("")}
                    <div class="dropdown-col dropdown-col--cta">
                      <a href="${shopUrl({ tag: "new" })}" class="dropdown-feature">
                        <span class="section-kicker">✦ Recién llegado</span>
                        <strong>Novedades</strong>
                      </a>
                      <a href="${shopUrl()}" class="btn btn--sm glossy">Ver todo</a>
                    </div>
                  </div>
                </div>
              </details>
            </li>
            ${NAV_LINKS.map(([label, href]) => `<li class="nav-item"><a href="${href}" class="nav-link" ${current(href)}>${label}</a></li>`).join("")}
          </ul>
        </nav>
      </div>

      <a href="index.html" class="header-logo" aria-label="Inzone — ir a la página principal" title="Ir al inicio">
        <video id="logoVideo" class="site-logo-video" autoplay muted playsinline preload="auto" aria-hidden="true">
          <source src="videos/logo-3d.mp4" type="video/mp4">
        </video>
        <canvas id="logoCanvas" class="site-logo" aria-hidden="true"></canvas>
      </a>

      <div class="header-right">
        <button class="chrome-btn" id="searchBtn" aria-label="Buscar" aria-controls="searchPanel" aria-expanded="false" title="Buscar ( / )">
          <svg class="icon"><use href="#icon-search"/></svg>
        </button>
        <a href="account.html" class="chrome-btn header-account" aria-label="${accountLabel()}" title="${accountLabel()}" data-account-title ${current("account.html")}>
          <svg class="icon"><use href="#icon-user"/></svg>
        </a>
        <button type="button" class="chrome-btn cart-wrapper" id="cartBtn" data-count="0"
                aria-label="Carrito" aria-controls="cartDrawer" aria-expanded="false" title="Carrito">
          <img src="images/icons/cart.png" alt="" class="cart-image" width="20" height="20">
        </button>
      </div>
    </div>
  </header>`;
}

function searchTemplate() {
  return `
  <div class="search-panel" id="searchPanel" inert>
    <div class="search-overlay" id="searchOverlay"></div>
    <div class="search-box">
      <form class="search-form" id="searchForm" role="search" action="shop.html">
        <svg class="icon" aria-hidden="true"><use href="#icon-search"/></svg>
        <input type="search" name="q" placeholder="Buscar sudaderas, gorras, jeans…" aria-label="Buscar productos" autocomplete="off">
        <button type="button" class="search-close" id="searchClose" aria-label="Cerrar búsqueda">
          <svg class="icon"><use href="#icon-close"/></svg>
        </button>
      </form>
      <div class="search-results" id="searchResults" aria-live="polite"></div>
    </div>
  </div>`;
}

function mobileMenuTemplate() {
  return `
  <div class="mobile-menu" id="mobileMenu" inert>
    <div class="mobile-menu-overlay" id="mobileOverlay"></div>
    <div class="mobile-menu-panel y2k-window" role="dialog" aria-modal="true" aria-label="Menú">
      <div class="y2k-window-bar">
        <span>menú.exe</span>
        <button type="button" class="window-close" id="mobileClose" aria-label="Cerrar menú">
          <svg class="icon"><use href="#icon-close"/></svg>
        </button>
      </div>
      <div class="mobile-menu-body">
        <ul class="mobile-nav-list">
          <li><a href="index.html" ${current("index.html")}>Inicio</a></li>
          ${SHOP_LINKS.map(([label, href]) => `<li><a href="${href}" ${current(href)}>${label}</a></li>`).join("")}
          <li><a href="${shopUrl({ gender: "women" })}" ${current(shopUrl({ gender: "women" }))}>Mujer</a></li>
          <li><a href="${shopUrl({ gender: "men" })}" ${current(shopUrl({ gender: "men" }))}>Hombre</a></li>
        </ul>
        <a href="account.html" class="btn btn--block btn--chrome" data-account-label>${accountLabel()}</a>
        <div class="mobile-social">
          <a href="${STORE.social.instagram}" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="${STORE.social.tiktok}" target="_blank" rel="noopener noreferrer">TikTok</a>
          <a href="${infoUrl("contact")}">Contacto</a>
        </div>
      </div>
    </div>
  </div>`;
}

function cartDrawerTemplate() {
  return `
  <div class="cart-drawer" id="cartDrawer" inert>
    <div class="drawer-overlay" data-close-cart></div>
    <aside class="drawer-panel y2k-window" role="dialog" aria-modal="true" aria-labelledby="cartTitle">
      <div class="y2k-window-bar">
        <span id="cartTitle">carrito.exe — Tu carrito (<span data-cart-count>0</span>)</span>
        <button type="button" class="window-close" data-close-cart aria-label="Cerrar carrito">
          <svg class="icon"><use href="#icon-close"/></svg>
        </button>
      </div>
      <div class="drawer-shipping" id="cartShipping"></div>
      <div class="drawer-items" id="cartItems"></div>
      <div class="drawer-footer" id="cartFooter"></div>
    </aside>
  </div>`;
}

function footerTemplate() {
  const year = new Date().getFullYear();
  return `
  <footer class="site-footer">
    <div class="container footer-main">
      <div class="footer-brand">
        <p class="footer-brand-name">Inzone</p>
        <p class="footer-tagline">Ropa urbana con estética Y2K. Piezas limitadas, actitud ilimitada. Hecho para la nueva generación.</p>
      </div>
      <nav aria-label="Tienda">
        <h2 class="footer-heading">Tienda</h2>
        <ul class="footer-list">
          <li><a href="${shopUrl()}">Ver todo</a></li>
          <li><a href="${shopUrl({ cat: "hoodies" })}">Sudaderas</a></li>
          <li><a href="${shopUrl({ cat: "tees" })}">Camisetas</a></li>
          <li><a href="${shopUrl({ cat: "bottoms" })}">Parte de abajo</a></li>
          <li><a href="${shopUrl({ cat: "accessories" })}">Accesorios</a></li>
        </ul>
      </nav>
      <nav aria-label="Ayuda">
        <h2 class="footer-heading">Ayuda</h2>
        <ul class="footer-list">
          <li><a href="${infoUrl("contact")}">Contáctanos</a></li>
          <li><a href="${infoUrl("help")}">Preguntas frecuentes</a></li>
          <li><a href="${infoUrl("shipping")}">Envíos</a></li>
          <li><a href="${infoUrl("returns")}">Cambios y devoluciones</a></li>
          <li><a href="${infoUrl("terms")}">Términos</a></li>
          <li><a href="${infoUrl("privacy")}">Privacidad</a></li>
        </ul>
      </nav>
      <nav aria-label="Redes sociales">
        <h2 class="footer-heading">Síguenos</h2>
        <ul class="footer-list">
          <li><a href="${STORE.social.instagram}" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          <li><a href="${STORE.social.tiktok}" target="_blank" rel="noopener noreferrer">TikTok</a></li>
          <li><a href="${STORE.social.youtube}" target="_blank" rel="noopener noreferrer">YouTube</a></li>
          <li><a href="${infoUrl("about")}">Sobre Inzone</a></li>
        </ul>
      </nav>
    </div>
    <div class="container footer-bottom">
      <p class="footer-copyright">INZONE © ${year} — Costa Rica</p>
      <ul class="footer-payments" aria-label="Métodos de pago">
        <li>VISA</li><li>MASTERCARD</li><li>SINPE</li><li>PAYPAL</li>
      </ul>
    </div>
  </footer>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>`;
}

export function mountLayout() {
  document.body.insertAdjacentHTML(
    "afterbegin",
    ICONS +
      `<a class="skip-link" href="#main">Saltar al contenido</a>` +
      announcementTemplate() +
      headerTemplate() +
      searchTemplate() +
      mobileMenuTemplate() +
      cartDrawerTemplate(),
  );
  document.body.insertAdjacentHTML("beforeend", footerTemplate());

  initHeader();
  initLogo();
  initSearch();
  initCartDrawer();
  initQuickAdd();
  // Los carruseles que crean las páginas después del layout se activan en el siguiente frame.
  requestAnimationFrame(() => initScrollers());

  // "Crear cuenta" ↔ "Mi cuenta" según la sesión.
  auth.subscribe(() => {
    document.querySelectorAll("[data-account-label]").forEach((el) => (el.textContent = accountLabel()));
    document.querySelectorAll("[data-account-title]").forEach((el) => {
      el.title = accountLabel();
      el.setAttribute("aria-label", accountLabel());
    });
  });
}
