/* ================= LIVE SEARCH =================
   Resultados mientras se escribe; Enter lleva a shop.html?q=… */

import { searchProducts, categoryLabel } from "../data/catalog.js";
import { formatCRC, escapeHTML } from "../utils/format.js";
import { productUrl, shopUrl } from "../utils/dom.js";

const MAX_RESULTS = 6;
const POPULAR = ["sudadera", "jeans", "gorra", "gorro", "esqueleto"];

export function initSearch() {
  const form = document.getElementById("searchForm");
  const results = document.getElementById("searchResults");
  if (!form || !results) return;

  const input = form.querySelector("input");
  let timer;

  function render(query) {
    const q = query.trim();

    if (!q) {
      results.innerHTML = `
        <p class="search-hint">Búsquedas populares</p>
        <div class="chip-row">
          ${POPULAR.map((term) => `<button type="button" class="chip" data-term="${term}">${term}</button>`).join("")}
        </div>`;
      return;
    }

    const found = searchProducts(q);
    if (!found.length) {
      results.innerHTML = `<p class="search-empty">No encontramos nada para “${escapeHTML(q)}”. Prueba con otra palabra.</p>`;
      return;
    }

    results.innerHTML = `
      <ul class="search-list">
        ${found
          .slice(0, MAX_RESULTS)
          .map(
            (p) => `
          <li>
            <a href="${productUrl(p.id)}" class="search-item">
              <img src="${p.images[0]}" alt="" loading="lazy">
              <span class="search-item-info">
                <span class="search-item-title">${escapeHTML(p.title)}</span>
                <span class="search-item-meta">${categoryLabel(p.category)} · ${formatCRC(p.price)}</span>
              </span>
            </a>
          </li>`,
          )
          .join("")}
      </ul>
      <a class="search-all" href="${shopUrl({ q })}">Ver los ${found.length} resultados →</a>`;
  }

  input.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => render(input.value), 120);
  });

  results.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-term]");
    if (!chip) return;
    input.value = chip.dataset.term;
    render(input.value);
    input.focus();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (q) window.location.href = shopUrl({ q });
  });

  render("");
}
