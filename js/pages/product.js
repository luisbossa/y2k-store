/* ================= PRODUCT PAGE =================
   product.html?id=<id>[&color=<nombre>] */

import { mountLayout } from "../components/layout.js";
import { renderGrid, bindSwatches } from "../components/product-card.js";
import { openCart } from "../components/cart-drawer.js";
import { findProduct, relatedProducts, imagesFor, categoryLabel, CATEGORIES, GROUPS } from "../data/catalog.js";
import { FREE_SHIPPING_MIN } from "../data/config.js";
import { cart } from "../store/cart.js";
import { qs, params, shopUrl, infoUrl, setParams } from "../utils/dom.js";
import { formatCRC, escapeHTML } from "../utils/format.js";

mountLayout();

const root = qs("#productRoot");
const product = findProduct(params().get("id"));

const SIZE_GUIDE = [
  ["S", "54", "70"],
  ["M", "57", "72"],
  ["L", "60", "74"],
  ["XL", "63", "76"],
];

if (!product) {
  document.title = "Producto no encontrado | Inzone";
  root.innerHTML = `
    <div class="empty-state empty-state--page">
      <p class="empty-state-title">Este producto no existe o ya no está disponible</p>
      <p>Puede que se haya agotado en el último lanzamiento.</p>
      <a href="${shopUrl()}" class="btn glossy">Ver la tienda</a>
    </div>`;
  qs("#relatedSection")?.remove();
} else {
  renderProduct(product);
}

function renderProduct(product) {
  const state = {
    color: product.colors?.some((c) => c.name === params().get("color")) ? params().get("color") : product.colors?.[0].name ?? null,
    size: product.sizes.length === 1 ? product.sizes[0] : null,
    qty: 1,
    image: 0,
  };

  const title = escapeHTML(product.title);
  const group = CATEGORIES[product.category].group;
  document.title = `${product.title} | Inzone`;
  qs('meta[name="description"]')?.setAttribute("content", `${product.title} — ${product.description}`);

  qs("#breadcrumb").innerHTML = `
    <a href="index.html">Inicio</a><span aria-hidden="true">/</span>
    <a href="${shopUrl({ cat: group })}">${GROUPS[group]}</a><span aria-hidden="true">/</span>
    <a href="${shopUrl({ cat: product.category })}">${categoryLabel(product.category)}</a><span aria-hidden="true">/</span>
    <span aria-current="page">${title}</span>`;

  root.innerHTML = `
    <div class="pdp">
      <div class="pdp-gallery">
        <div class="pdp-main-image">
          ${product.badge ? `<span class="product-badge">${escapeHTML(product.badge)}</span>` : ""}
          <img id="pdpImage" src="" alt="${title}">
        </div>
        <div class="pdp-thumbs" id="pdpThumbs" role="list" data-scroll-fade></div>
      </div>

      <div class="pdp-info">
        <p class="section-kicker">${categoryLabel(product.category)}</p>
        <h1 class="pdp-title">${title}</h1>
        <p class="pdp-price">${formatCRC(product.price)} <span>IVA incluido</span></p>

        <form id="pdpForm" class="pdp-form" novalidate>
          ${
            product.colors
              ? `<fieldset class="pdp-option">
                  <legend>Color: <strong id="pdpColorName"></strong></legend>
                  <div class="pdp-colors">
                    ${product.colors
                      .map(
                        (c) => `<label class="color-option" title="${escapeHTML(c.name)}">
                          <input type="radio" name="color" value="${escapeHTML(c.name)}" class="visually-hidden">
                          <img src="${c.images[0]}" alt="${escapeHTML(c.name)}">
                        </label>`,
                      )
                      .join("")}
                  </div>
                </fieldset>`
              : ""
          }

          <fieldset class="pdp-option field">
            <legend>Talla ${product.sizes.length > 1 ? `<button type="button" class="btn-link" data-open="sizeGuide">Guía de tallas</button>` : ""}</legend>
            <div class="size-options">
              ${product.sizes
                .map(
                  (s) => `<label class="size-option">
                    <input type="radio" name="size" value="${s}" ${state.size === s ? "checked" : ""} required>
                    <span>${s}</span>
                  </label>`,
                )
                .join("")}
            </div>
            <p class="field-error" id="sizeError" role="alert"></p>
          </fieldset>

          <div class="pdp-option">
            <span class="pdp-label">Cantidad</span>
            <div class="stepper stepper--lg">
              <button type="button" data-step="-1" aria-label="Quitar uno">−</button>
              <span id="pdpQty" aria-live="polite">1</span>
              <button type="button" data-step="1" aria-label="Agregar uno">+</button>
            </div>
          </div>

          <div class="pdp-actions">
            <button type="submit" class="btn btn--block glossy" data-action="add">Agregar al carrito — <span id="pdpTotal"></span></button>
            <button type="submit" class="btn btn--block btn--chrome" data-action="buy">Comprar ahora</button>
          </div>
        </form>

        <ul class="pdp-perks">
          <li><svg class="icon"><use href="#icon-truck"/></svg> Envío gratis en compras desde ${formatCRC(FREE_SHIPPING_MIN)}</li>
          <li><svg class="icon"><use href="#icon-refresh"/></svg> Cambios fáciles hasta 30 días</li>
          <li><svg class="icon"><use href="#icon-lock"/></svg> Pago seguro con tarjeta o SINPE Móvil</li>
        </ul>

        <div class="accordion">
          <details open>
            <summary>Descripción</summary>
            <p>${escapeHTML(product.description)}</p>
          </details>
          ${
            product.sizes.length > 1
              ? `<details id="sizeGuide">
                  <summary>Guía de tallas</summary>
                  <table class="size-table">
                    <thead><tr><th>Talla</th><th>Ancho (cm)</th><th>Largo (cm)</th></tr></thead>
                    <tbody>${SIZE_GUIDE.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>
                  </table>
                  <p>Corte holgado: si prefieres un corte regular, pide una talla menos.</p>
                </details>`
              : ""
          }
          <details>
            <summary>Envíos</summary>
            <p>Enviamos a todo Costa Rica. Estándar 2–4 días hábiles, Express 24 h en el GAM. <a href="${infoUrl("shipping")}">Más info</a></p>
          </details>
          <details>
            <summary>Cambios y devoluciones</summary>
            <p>Tienes 30 días para cambiar tu pieza si está sin usar y con etiquetas. <a href="${infoUrl("returns")}">Ver política</a></p>
          </details>
        </div>
      </div>
    </div>`;

  const form = qs("#pdpForm");
  const mainImage = qs("#pdpImage");
  const thumbs = qs("#pdpThumbs");
  const sizeError = qs("#sizeError");

  function renderGallery() {
    const images = imagesFor(product, state.color);
    state.image = Math.min(state.image, images.length - 1);
    mainImage.src = images[state.image];
    thumbs.innerHTML = images
      .map(
        (src, i) => `<button type="button" class="pdp-thumb ${i === state.image ? "is-active" : ""}" data-image="${i}"
                       role="listitem" aria-label="Ver imagen ${i + 1}"><img src="${src}" alt=""></button>`,
      )
      .join("");
    thumbs.hidden = images.length < 2;
  }

  function renderState() {
    qs("#pdpQty").textContent = state.qty;
    qs("#pdpTotal").textContent = formatCRC(product.price * state.qty);
    if (state.color) {
      qs("#pdpColorName").textContent = state.color;
      form.querySelectorAll('input[name="color"]').forEach((i) => (i.checked = i.value === state.color));
    }
  }

  thumbs.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-image]");
    if (!btn) return;
    state.image = Number(btn.dataset.image);
    renderGallery();
  });

  form.addEventListener("change", (e) => {
    if (e.target.name === "color") {
      state.color = e.target.value;
      state.image = 0;
      setParams({ color: state.color });
      renderGallery();
      renderState();
    }
    if (e.target.name === "size") {
      state.size = e.target.value;
      sizeError.textContent = "";
    }
  });

  form.addEventListener("click", (e) => {
    const step = e.target.closest("[data-step]");
    if (step) {
      state.qty = Math.max(1, Math.min(10, state.qty + Number(step.dataset.step)));
      renderState();
    }
    const open = e.target.closest("[data-open]");
    if (open) {
      const details = document.getElementById(open.dataset.open);
      details.open = true;
      details.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!state.size) {
      sizeError.textContent = "Elige una talla para continuar.";
      form.querySelector('input[name="size"]').focus();
      return;
    }
    cart.add(product.id, { size: state.size, color: state.color, qty: state.qty });
    if (e.submitter?.dataset.action === "buy") {
      window.location.href = "checkout.html";
    } else {
      openCart();
    }
  });

  renderGallery();
  renderState();

  const related = qs("#relatedGrid");
  renderGrid(related, relatedProducts(product));
  bindSwatches(related);
}
