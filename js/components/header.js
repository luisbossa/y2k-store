/* ================= HEADER =================
   Menú móvil, panel de búsqueda, header sticky y loop del logo. */

const openOverlays = new Set();

/** Bloquea el scroll del body mientras haya algún panel abierto. */
function lockScroll(id, locked) {
  locked ? openOverlays.add(id) : openOverlays.delete(id);
  document.documentElement.classList.toggle("has-overlay", openOverlays.size > 0);
}

/** Panel que se abre/cierra con clase .is-open, inert y aria-expanded. */
export function createToggle(root, { trigger, closers = [], onOpen, onClose, lock = true }) {
  let returnFocus = null;

  const setOpen = (open) => {
    if (open === root.classList.contains("is-open")) return;
    root.classList.toggle("is-open", open);
    root.inert = !open;
    trigger?.setAttribute("aria-expanded", String(open));
    if (lock) lockScroll(root.id, open);
    if (open) {
      returnFocus = document.activeElement;
      onOpen?.();
    } else {
      onClose?.();
      returnFocus?.focus?.();
    }
  };

  closers.forEach((el) => el?.addEventListener("click", () => setOpen(false)));

  const toggle = {
    open: () => setOpen(true),
    close: () => setOpen(false),
    toggle: () => setOpen(!root.classList.contains("is-open")),
    isOpen: () => root.classList.contains("is-open"),
  };

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle.isOpen()) toggle.close();
  });

  return toggle;
}

function initMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  const btn = document.getElementById("hamburgerBtn");
  if (!menu || !btn) return;

  const toggle = createToggle(menu, {
    trigger: btn,
    closers: [document.getElementById("mobileOverlay"), document.getElementById("mobileClose")],
    onOpen: () => btn.classList.add("active"),
    onClose: () => btn.classList.remove("active"),
  });

  btn.addEventListener("click", toggle.toggle);
}

function initSearchPanel() {
  const panel = document.getElementById("searchPanel");
  const btn = document.getElementById("searchBtn");
  if (!panel || !btn) return;

  const input = panel.querySelector("input");
  const toggle = createToggle(panel, {
    trigger: btn,
    closers: [document.getElementById("searchOverlay"), document.getElementById("searchClose")],
    // Espera a que termine la transición de visibilidad antes de enfocar.
    onOpen: () => setTimeout(() => input?.focus(), 50),
  });

  btn.addEventListener("click", toggle.open);

  // Atajo: "/" abre la búsqueda (como en muchas tiendas).
  document.addEventListener("keydown", (e) => {
    if (e.key !== "/" || e.target.closest("input, textarea, select")) return;
    e.preventDefault();
    toggle.open();
  });
}

function initStickyHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  let ticking = false;
  const update = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 20);
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true },
  );
  update();
}

function initDropdown() {
  const dropdown = document.querySelector(".dropdown-root");
  if (!dropdown) return;

  // En escritorio con mouse se abre al pasar por encima (con un pequeño retardo al salir).
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let closeTimer;
    dropdown.addEventListener("mouseenter", () => {
      clearTimeout(closeTimer);
      dropdown.open = true;
    });
    dropdown.addEventListener("mouseleave", () => {
      closeTimer = setTimeout(() => (dropdown.open = false), 180);
    });
    // Si ya se abrió por hover, el click no debe cerrarlo (Escape o salir con el mouse lo cierran).
    dropdown.querySelector("summary").addEventListener("click", (e) => {
      if (dropdown.open && dropdown.matches(":hover")) e.preventDefault();
    });
  }

  // Cierra el dropdown al hacer click fuera o con Escape.
  document.addEventListener("click", (e) => {
    if (dropdown.open && !dropdown.contains(e.target)) dropdown.open = false;
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") dropdown.open = false;
  });
}

export function initHeader() {
  initMobileMenu();
  initSearchPanel();
  initStickyHeader();
  initDropdown();
}
