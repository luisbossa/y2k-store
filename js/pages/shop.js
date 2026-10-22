/* ================= SHOP =================
   Catálogo con filtros sincronizados con la URL:
   ?cat=hoodies|bottoms…  &gender=women|men  &tag=new  &q=texto  &sort=… */

import { mountLayout } from "../components/layout.js";
import { renderGrid, bindSwatches } from "../components/product-card.js";
import { PRODUCTS, CATEGORIES, GROUPS, GENDERS, categoryLabel, matchesCategory, matchesGender, searchProducts } from "../data/catalog.js";
import { qs, params, setParams } from "../utils/dom.js";
import { escapeHTML } from "../utils/format.js";

mountLayout();

const SORTS = {
  featured: { label: "Destacados", fn: (a, b) => Number(b.featured) - Number(a.featured) },
  new: { label: "Novedades", fn: (a, b) => Number(b.isNew) - Number(a.isNew) },
  "price-asc": { label: "Precio: menor a mayor", fn: (a, b) => a.price - b.price },
  "price-desc": { label: "Precio: mayor a menor", fn: (a, b) => b.price - a.price },
  name: { label: "Nombre A–Z", fn: (a, b) => a.title.localeCompare(b.title) },
};

const CHIPS = [
  ["", "Todo"],
  ...Object.entries(GROUPS),
  ...Object.entries(CATEGORIES).map(([key, c]) => [key, c.label]),
];

const p = params();
const state = {
  cat: p.get("cat") ?? "",
  gender: p.get("gender") ?? "",
  tag: p.get("tag") ?? "",
  q: p.get("q") ?? "",
  sort: SORTS[p.get("sort")] ? p.get("sort") : "featured",
};

const grid = qs("#shopGrid");
const title = qs("#shopTitle");
const kicker = qs("#shopKicker");
const count = qs("#shopCount");
const chips = qs("#shopChips");
const genderSelect = qs("#shopGender");
const sortSelect = qs("#shopSort");
const searchInput = qs("#shopSearch");
const activeFilters = qs("#shopActive");

chips.innerHTML = CHIPS.map(
  ([key, label]) => `<button type="button" class="chip" data-cat="${key}" aria-pressed="false">${label}</button>`,
).join("");
genderSelect.innerHTML = `<option value="">Todos</option>` + Object.entries(GENDERS).map(([k, v]) => `<option value="${k}">${v}</option>`).join("");
sortSelect.innerHTML = Object.entries(SORTS).map(([k, s]) => `<option value="${k}">${s.label}</option>`).join("");

function filtered() {
  const base = state.q ? searchProducts(state.q) : PRODUCTS;
  return base
    .filter((product) => matchesCategory(product, state.cat))
    .filter((product) => matchesGender(product, state.gender))
    .filter((product) => (state.tag === "new" ? product.isNew : true))
    .sort(SORTS[state.sort].fn);
}

function heading() {
  if (state.q) return `Resultados: “${state.q}”`;
  if (state.tag === "new") return "Novedades";
  if (state.cat) return categoryLabel(state.cat);
  if (state.gender) return GENDERS[state.gender];
  return "Toda la tienda";
}

function render() {
  const results = filtered();

  title.textContent = heading();
  kicker.textContent = state.gender && (state.cat || state.q || state.tag) ? GENDERS[state.gender] : "Tienda Inzone";
  document.title = `${heading()} | Inzone`;
  count.textContent = `${results.length} ${results.length === 1 ? "producto" : "productos"}`;

  chips.querySelectorAll(".chip").forEach((chip) => chip.setAttribute("aria-pressed", String(chip.dataset.cat === state.cat)));
  genderSelect.value = state.gender;
  sortSelect.value = state.sort;
  searchInput.value = state.q;

  // Píldoras de filtros activos que se pueden quitar.
  const active = [
    state.q && ["q", `Búsqueda: ${state.q}`],
    state.tag && ["tag", "Sólo novedades"],
    state.gender && ["gender", GENDERS[state.gender]],
  ].filter(Boolean);
  activeFilters.innerHTML = active
    .map(([key, label]) => `<button type="button" class="chip chip--removable" data-clear="${key}">${escapeHTML(label)} <span aria-hidden="true">×</span></button>`)
    .join("");
  activeFilters.hidden = !active.length;

  if (!results.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <p class="empty-state-title">No hay productos con estos filtros</p>
        <p>Prueba quitando algún filtro o buscando otra palabra.</p>
        <button type="button" class="btn glossy" data-reset>Ver todo</button>
      </div>`;
    grid.classList.add("is-empty");
  } else {
    renderGrid(grid, results);
    grid.classList.remove("is-empty");
  }

  setParams({ cat: state.cat, gender: state.gender, tag: state.tag, q: state.q, sort: state.sort === "featured" ? "" : state.sort });
}

chips.addEventListener("click", (e) => {
  const chip = e.target.closest("[data-cat]");
  if (!chip) return;
  state.cat = chip.dataset.cat;
  render();
});

genderSelect.addEventListener("change", () => {
  state.gender = genderSelect.value;
  render();
});

sortSelect.addEventListener("change", () => {
  state.sort = sortSelect.value;
  render();
});

let searchTimer;
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    state.q = searchInput.value.trim();
    render();
  }, 200);
});
qs("#shopSearchForm").addEventListener("submit", (e) => e.preventDefault());

activeFilters.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-clear]");
  if (!btn) return;
  state[btn.dataset.clear] = "";
  render();
});

grid.addEventListener("click", (e) => {
  if (!e.target.closest("[data-reset]")) return;
  Object.assign(state, { cat: "", gender: "", tag: "", q: "" });
  render();
});

bindSwatches(grid);
render();
