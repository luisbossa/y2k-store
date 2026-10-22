/* ================= FEATURED COLLECTION =================
   Slider horizontal filtrable por categoría. */

import { PRODUCTS } from "../data/catalog.js";
import { formatCRC, escapeHTML } from "../utils/format.js";
import { productUrl, shopUrl } from "../utils/dom.js";
import { scrollIntoViewInline } from "./scrollers.js";

const FADE_MS = 200;

function createCard(product) {
  const title = escapeHTML(product.title);
  const [img1, img2 = img1] = product.images;
  const url = productUrl(product.id);

  return `
    <article class="product-card">
      <div class="product-image ${product.category}">
        <a href="${url}" class="product-image-link" tabindex="-1" aria-hidden="true">
          <img src="${img1}" alt="" class="primary" loading="lazy" decoding="async">
          <img src="${img2}" alt="" class="secondary" loading="lazy" decoding="async">
        </a>
        <button type="button" class="quick-add glossy" data-add-to-cart="${product.id}"
                aria-label="Agregar ${title} al carrito">+ Agregar</button>
      </div>
      <div class="product-card__info">
        <h3 class="product-title"><a href="${url}">${title}</a></h3>
        <div class="price-list">${formatCRC(product.price)}</div>
      </div>
    </article>
  `;
}

export function initFeatured() {
  const slider = document.getElementById("featuredSlider");
  if (!slider) return;

  const filterButtons = document.querySelectorAll(".filter-btn");
  const viewAll = document.getElementById("featuredViewAll");
  let fadeTimer;

  function render(category) {
    clearTimeout(fadeTimer);
    slider.classList.add("fade-out");
    if (viewAll) viewAll.href = shopUrl({ cat: category });

    fadeTimer = setTimeout(() => {
      slider.innerHTML = PRODUCTS.filter((p) => p.featured && p.category === category)
        .map(createCard)
        .join("");

      slider.scrollLeft = 0;
      slider.classList.remove("fade-out");
    }, FADE_MS);
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-pressed", String(b === btn));
      });
      // En móvil las pestañas se deslizan: la elegida queda centrada y visible.
      scrollIntoViewInline(btn);
      render(btn.dataset.category);
    });
  });

  // Avanza exactamente una tarjeta (ancho + gap), sea cual sea el breakpoint.
  const step = () => {
    const card = slider.querySelector(".product-card");
    if (!card) return 0;
    return card.offsetWidth + parseFloat(getComputedStyle(slider).columnGap || 0);
  };

  document
    .querySelector(".slider-prev")
    ?.addEventListener("click", () => slider.scrollBy({ left: -step(), behavior: "smooth" }));
  document
    .querySelector(".slider-next")
    ?.addEventListener("click", () => slider.scrollBy({ left: step(), behavior: "smooth" }));

  const initial = document.querySelector(".filter-btn.active")?.dataset.category ?? "pants";
  render(initial);
}
