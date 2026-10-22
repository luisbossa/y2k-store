/* ================= DOM HELPERS ================= */

export const qs = (selector, root = document) => root.querySelector(selector);
export const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

export const params = () => new URLSearchParams(window.location.search);

/** Actualiza la query string sin recargar (para filtros compartibles). */
export function setParams(values) {
  const url = new URL(window.location.href);
  Object.entries(values).forEach(([k, v]) => (v ? url.searchParams.set(k, v) : url.searchParams.delete(k)));
  history.replaceState(null, "", url);
}

export const productUrl = (id) => `product.html?id=${encodeURIComponent(id)}`;

export function shopUrl(filters = {}) {
  const query = new URLSearchParams(Object.entries(filters).filter(([, v]) => v)).toString();
  return query ? `shop.html?${query}` : "shop.html";
}

export const infoUrl = (page) => `info.html?page=${page}`;

/** Marca un campo como inválido con un mensaje accesible debajo. */
export function setFieldError(input, message) {
  const field = input.closest(".field") ?? input.parentElement;
  let error = field.querySelector(".field-error");
  if (!error) {
    error = document.createElement("p");
    error.className = "field-error";
    error.id = `${input.id || input.name}-error`;
    field.append(error);
  }
  error.textContent = message;
  input.setAttribute("aria-invalid", message ? "true" : "false");
  if (message) input.setAttribute("aria-describedby", error.id);
  else input.removeAttribute("aria-describedby");
}

/** Valida todos los campos de un formulario con la API nativa; devuelve true si todo es válido. */
export function validateForm(form, messages = {}) {
  let firstInvalid = null;
  qsa("input, select, textarea", form).forEach((input) => {
    if (input.disabled || input.type === "hidden" || input.closest("[hidden]")) return;
    const valid = input.checkValidity();
    const msg = valid ? "" : messages[input.name]?.(input) ?? input.validationMessage;
    if (input.type !== "radio") setFieldError(input, msg);
    if (!valid && !firstInvalid) firstInvalid = input;
  });
  firstInvalid?.focus();
  return !firstInvalid;
}

/** Limpia el error de un campo apenas el usuario lo corrige. */
export function liveValidation(form) {
  form.addEventListener("input", (e) => {
    const input = e.target;
    if (input.getAttribute("aria-invalid") === "true" && input.checkValidity()) setFieldError(input, "");
  });
}
