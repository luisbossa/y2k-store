/* ================= CART DRAWER =================
   Panel lateral con las líneas del carrito, envío gratis y acceso al checkout. */

import { cart } from "../store/cart.js";
import { FREE_SHIPPING_MIN } from "../data/config.js";
import { formatCRC, escapeHTML } from "../utils/format.js";
import { productUrl, shopUrl } from "../utils/dom.js";
import { createToggle } from "./header.js";

let drawer = null;

export const openCart = () => drawer?.open();
export const closeCart = () => drawer?.close();

function shippingTemplate(subtotal) {
  if (!subtotal) return "";
  const remaining = FREE_SHIPPING_MIN - subtotal;
  const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_MIN) * 100));
  const message =
    remaining > 0
      ? `Te faltan <strong>${formatCRC(remaining)}</strong> para envío gratis`
      : `<strong>¡Tienes envío gratis!</strong> ✦`;
  return `
    <p>${message}</p>
    <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}">
      <span style="width:${progress}%"></span>
    </div>`;
}

function lineTemplate(line) {
  const { product, key, qty, size, color } = line;
  const title = escapeHTML(product.title);
  const sizeControl =
    product.sizes.length > 1
      ? `<label class="cart-line-size">Talla
           <select data-size="${key}" aria-label="Talla de ${title}">
             ${product.sizes.map((s) => `<option ${s === size ? "selected" : ""}>${s}</option>`).join("")}
           </select>
         </label>`
      : `<span class="cart-line-meta">Talla única</span>`;

  return `
    <article class="cart-line">
      <a href="${productUrl(product.id)}" class="cart-line-thumb"><img src="${line.image}" alt="${title}"></a>
      <div class="cart-line-info">
        <a href="${productUrl(product.id)}" class="cart-line-title">${title}</a>
        ${color ? `<span class="cart-line-meta">Color: ${escapeHTML(color)}</span>` : ""}
        ${sizeControl}
        <div class="stepper" aria-label="Cantidad">
          <button type="button" data-qty="${key}" data-delta="-1" aria-label="Quitar uno">−</button>
          <span aria-live="polite">${qty}</span>
          <button type="button" data-qty="${key}" data-delta="1" aria-label="Agregar uno">+</button>
        </div>
      </div>
      <div class="cart-line-side">
        <span class="cart-line-price">${formatCRC(line.lineTotal)}</span>
        <button type="button" class="icon-btn" data-remove="${key}" aria-label="Eliminar ${title}">
          <svg class="icon"><use href="#icon-trash"/></svg>
        </button>
      </div>
    </article>`;
}

export function initCartDrawer() {
  const root = document.getElementById("cartDrawer");
  const btn = document.getElementById("cartBtn");
  if (!root || !btn) return;

  const items = document.getElementById("cartItems");
  const shipping = document.getElementById("cartShipping");
  const footer = document.getElementById("cartFooter");
  const counters = document.querySelectorAll("[data-cart-count]");

  drawer = createToggle(root, {
    trigger: btn,
    closers: [...root.querySelectorAll("[data-close-cart]")],
    onOpen: () => setTimeout(() => root.querySelector(".window-close")?.focus(), 50),
  });
  btn.addEventListener("click", drawer.open);

  let lastCount = cart.count();

  function render() {
    const lines = cart.lines();
    const count = cart.count();
    const subtotal = cart.subtotal();

    // Badge del header (+ animación si aumentó).
    btn.dataset.count = count;
    btn.setAttribute("aria-label", `Carrito (${count} productos)`);
    counters.forEach((el) => (el.textContent = count));
    if (count > lastCount) {
      btn.classList.remove("is-bumped");
      void btn.offsetWidth;
      btn.classList.add("is-bumped");
    }
    lastCount = count;

    shipping.innerHTML = shippingTemplate(subtotal);
    shipping.hidden = !lines.length;

    if (!lines.length) {
      items.innerHTML = `
        <div class="empty-state">
          <p class="empty-state-title">Tu carrito está vacío</p>
          <p>Todavía no agregas nada. Date una vuelta por los nuevos lanzamientos.</p>
          <a href="${shopUrl()}" class="btn glossy">Ir a la tienda</a>
        </div>`;
      footer.innerHTML = "";
      return;
    }

    items.innerHTML = lines.map(lineTemplate).join("");
    footer.innerHTML = `
      <div class="summary-row summary-row--total"><span>Subtotal</span><span>${formatCRC(subtotal)}</span></div>
      <p class="drawer-note">Impuestos incluidos. Envío y descuentos se calculan al finalizar la compra.</p>
      <a href="checkout.html" class="btn btn--block glossy">Finalizar compra</a>
      <button type="button" class="btn-link" data-close-cart>Seguir comprando</button>`;
  }

  root.addEventListener("click", (e) => {
    const qtyBtn = e.target.closest("[data-qty]");
    if (qtyBtn) {
      const line = cart.lines().find((l) => l.key === qtyBtn.dataset.qty);
      if (line) cart.setQty(line.key, line.qty + Number(qtyBtn.dataset.delta));
      return;
    }
    const removeBtn = e.target.closest("[data-remove]");
    if (removeBtn) {
      cart.remove(removeBtn.dataset.remove);
      return;
    }
    // El botón "Seguir comprando" se crea dinámicamente.
    if (e.target.closest(".drawer-footer [data-close-cart]")) drawer.close();
  });

  root.addEventListener("change", (e) => {
    const select = e.target.closest("[data-size]");
    if (select) cart.setSize(select.dataset.size, select.value);
  });

  cart.subscribe(render);
  render();
}
