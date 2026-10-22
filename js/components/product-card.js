/* ================= PRODUCT CARD =================
   Tarjeta de producto compartida (home, tienda, relacionados). */

import { formatCRC, escapeHTML } from "../utils/format.js";
import { productUrl } from "../utils/dom.js";
import { imagesFor } from "../data/catalog.js";

function swatches(product) {
  if (!product.colors) return "";
  const buttons = product.colors
    .map((c) => {
      const [img1, img2 = img1] = c.images;
      return `
        <button type="button" class="variant-btn" data-img1="${img1}" data-img2="${img2}" data-color="${escapeHTML(c.name)}"
                aria-label="Color ${escapeHTML(c.name)}" title="${escapeHTML(c.name)}">
          <img src="${img1}" alt="" class="variant-circle" loading="lazy" decoding="async">
        </button>`;
    })
    .join("");
  return `<div class="product-variants">${buttons}</div>`;
}

export function productCard(product) {
  const title = escapeHTML(product.title);
  const [img1, img2 = img1] = imagesFor(product);
  const url = productUrl(product.id);

  return `
    <article class="product-tile" data-product-id="${product.id}">
      <div class="product-tile-figure">
        ${product.badge ? `<span class="product-badge">${escapeHTML(product.badge)}</span>` : ""}
        <button type="button" class="quick-add glossy" data-add-to-cart="${product.id}"
                aria-label="Agregar ${title} al carrito">+ Agregar</button>
        <a href="${url}" class="product-tile-link" tabindex="-1" aria-hidden="true">
          <img src="${img1}" alt="" loading="lazy" decoding="async"
               class="product-tile-image product-tile-image--primary">
          <img src="${img2}" alt="" loading="lazy" decoding="async"
               class="product-tile-image product-tile-image--secondary">
        </a>
      </div>
      <div class="product-tile-info">
        <a href="${url}" class="product-title">${title}</a>
        <span class="price-current">${formatCRC(product.price)}</span>
        ${swatches(product)}
      </div>
    </article>`;
}

/** Cambia las imágenes de la tarjeta al elegir un color (delegado en el contenedor). */
export function bindSwatches(container) {
  container.addEventListener("click", (e) => {
    const btn = e.target.closest(".variant-btn");
    if (!btn) return;
    const card = btn.closest(".product-tile");
    card.querySelector(".product-tile-image--primary").src = btn.dataset.img1;
    card.querySelector(".product-tile-image--secondary").src = btn.dataset.img2;
    card.querySelectorAll(".variant-btn").forEach((b) => b.classList.toggle("is-active", b === btn));
    // El link lleva a la ficha con ese color preseleccionado.
    card.querySelectorAll("a[href*='product.html']").forEach((a) => {
      const url = new URL(a.href);
      url.searchParams.set("color", btn.dataset.color);
      a.href = url.pathname.split("/").pop() + url.search;
    });
  });
}

export function renderGrid(container, products) {
  container.innerHTML = products.map(productCard).join("");
}
