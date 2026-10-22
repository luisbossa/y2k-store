/* ================= SCROLLERS =================
   Mejora cualquier contenedor con scroll horizontal:
   - [data-scroll-progress]: barra cromada debajo que indica cuánto falta por deslizar.
   - [data-scroll-fade]: desvanece el borde por donde todavía hay contenido.
   Ambos se ocultan solos cuando no hay nada que deslizar (p. ej. en escritorio). */

function enhance(el) {
  if (el.dataset.scrollerReady) return;
  el.dataset.scrollerReady = "true";

  let bar = null;
  let thumb = null;
  if (el.hasAttribute("data-scroll-progress")) {
    bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    bar.innerHTML = "<span></span>";
    thumb = bar.firstElementChild;
    el.after(bar);
  }

  const fade = el.hasAttribute("data-scroll-fade");

  function update() {
    const max = el.scrollWidth - el.clientWidth;
    const scrollable = max > 2;

    if (bar) {
      bar.hidden = !scrollable;
      if (scrollable) {
        const size = el.clientWidth / el.scrollWidth;
        const progress = el.scrollLeft / max;
        thumb.style.width = `${size * 100}%`;
        thumb.style.transform = `translateX(${(progress * (1 - size) * 100) / size}%)`;
      }
    }

    if (fade) {
      el.classList.toggle("fade-start", scrollable && el.scrollLeft > 4);
      el.classList.toggle("fade-end", scrollable && el.scrollLeft < max - 4);
    }
  }

  let frame;
  const schedule = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(update);
  };

  el.addEventListener("scroll", schedule, { passive: true });
  new ResizeObserver(schedule).observe(el);
  // El contenido de algunos carruseles se re-renderiza (filtros, imágenes que cargan).
  new MutationObserver(schedule).observe(el, { childList: true, subtree: true });
  el.addEventListener("load", schedule, true);
  update();
}

export function initScrollers(root = document) {
  root.querySelectorAll("[data-scroll-progress], [data-scroll-fade]").forEach(enhance);
}

/** Lleva un elemento (pestaña, chip) al centro de su carrusel. */
export function scrollIntoViewInline(el) {
  el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
}
