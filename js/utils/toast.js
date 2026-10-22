/* ================= TOAST =================
   Aviso flotante. Opcionalmente con imagen y un botón de acción. */

import { escapeHTML } from "./format.js";

const TOAST_MS = 3200;
let timer;

export function showToast({ title, text = "", image = null, action = null }) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.innerHTML = `
    ${image ? `<img src="${image}" alt="" class="toast-thumb">` : ""}
    <span class="toast-body"><strong>${escapeHTML(title)}</strong>${text ? `<br>${escapeHTML(text)}` : ""}</span>
    ${action ? `<button type="button" class="toast-action">${escapeHTML(action.label)}</button>` : ""}`;

  if (action) {
    toast.querySelector(".toast-action").addEventListener("click", () => {
      hide();
      action.onClick();
    });
  }

  toast.classList.add("is-visible");
  clearTimeout(timer);
  timer = setTimeout(hide, TOAST_MS);

  // Mantiene el toast mientras el mouse está encima.
  toast.onmouseenter = () => clearTimeout(timer);
  toast.onmouseleave = () => (timer = setTimeout(hide, 1200));

  function hide() {
    toast.classList.remove("is-visible");
  }
}
