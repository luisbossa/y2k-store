/* ================= CHECKOUT =================
   Formulario de envío + pago, resumen con cupón y confirmación del pedido.
   checkout.html?order=<número> muestra la confirmación de un pedido ya hecho. */

import { mountLayout } from "../components/layout.js";
import { openCart } from "../components/cart-drawer.js";
import { cart, totals, discountRate } from "../store/cart.js";
import { auth } from "../store/auth.js";
import { orders } from "../store/orders.js";
import { SHIPPING_METHODS, PAYMENT_METHODS, PROVINCES, STORE, FREE_SHIPPING_MIN } from "../data/config.js";
import { qs, params, setParams, shopUrl, validateForm, liveValidation } from "../utils/dom.js";
import { formatCRC, escapeHTML } from "../utils/format.js";

mountLayout();

const root = qs("#checkoutRoot");
const existing = orders.find(params().get("order"));

if (existing) renderConfirmation(existing);
else renderCheckout();

/* ================= CHECKOUT FORM ================= */

function renderCheckout() {
  const state = { method: "standard", payment: "sinpe", code: "" };
  const user = auth.current();

  root.innerHTML = `
    <div class="checkout">
      <form class="checkout-form" id="checkoutForm" novalidate>
        <section class="form-section">
          <h2 class="form-section-title"><span>1</span> Contacto</h2>
          ${user ? "" : `<p class="form-hint">¿Ya tienes cuenta? <a href="account.html?next=checkout.html">Inicia sesión</a> para usar tus datos guardados.</p>`}
          <div class="field-grid">
            <div class="field field--full">
              <label for="email">Correo electrónico</label>
              <input type="email" id="email" name="email" autocomplete="email" required value="${escapeHTML(user?.email ?? "")}">
            </div>
            <div class="field">
              <label for="name">Nombre completo</label>
              <input type="text" id="name" name="name" autocomplete="name" required minlength="3" value="${escapeHTML(user?.name ?? "")}">
            </div>
            <div class="field">
              <label for="phone">Teléfono</label>
              <input type="tel" id="phone" name="phone" autocomplete="tel" required pattern="[0-9]{4}-?[0-9]{4}" placeholder="8888-8888" value="${escapeHTML(user?.phone ?? "")}">
            </div>
          </div>
        </section>

        <section class="form-section">
          <h2 class="form-section-title"><span>2</span> Envío</h2>
          <div class="field-grid">
            <div class="field">
              <label for="province">Provincia</label>
              <select id="province" name="province" required>
                <option value="">Selecciona…</option>
                ${PROVINCES.map((p) => `<option ${user?.province === p ? "selected" : ""}>${p}</option>`).join("")}
              </select>
            </div>
            <div class="field">
              <label for="city">Cantón / Distrito</label>
              <input type="text" id="city" name="city" autocomplete="address-level2" required value="${escapeHTML(user?.city ?? "")}">
            </div>
            <div class="field field--full">
              <label for="address">Dirección exacta</label>
              <textarea id="address" name="address" rows="3" autocomplete="street-address" required minlength="10"
                placeholder="Ej: 200 m norte de la iglesia, casa blanca portón negro">${escapeHTML(user?.address ?? "")}</textarea>
            </div>
          </div>

          <div class="option-cards" role="radiogroup" aria-label="Método de envío">
            ${Object.entries(SHIPPING_METHODS)
              .map(
                ([key, m]) => `
              <label class="option-card">
                <input type="radio" name="method" value="${key}" ${key === state.method ? "checked" : ""}>
                <span class="option-card-body">
                  <span class="option-card-title">${m.label}</span>
                  <span class="option-card-text">${m.eta}</span>
                </span>
                <span class="option-card-price" data-method-price="${key}"></span>
              </label>`,
              )
              .join("")}
          </div>
        </section>

        <section class="form-section">
          <h2 class="form-section-title"><span>3</span> Pago</h2>
          <div class="option-cards" role="radiogroup" aria-label="Método de pago">
            ${Object.entries(PAYMENT_METHODS)
              .map(
                ([key, m]) => `
              <label class="option-card">
                <input type="radio" name="payment" value="${key}" ${key === state.payment ? "checked" : ""}>
                <span class="option-card-body">
                  <span class="option-card-title">${m.label}</span>
                  <span class="option-card-text">${m.detail}</span>
                </span>
              </label>`,
              )
              .join("")}
          </div>
          <div class="field field--full">
            <label for="notes">Notas del pedido <span class="optional">(opcional)</span></label>
            <textarea id="notes" name="notes" rows="2" maxlength="300" placeholder="Horario de entrega, referencias…"></textarea>
          </div>
          ${user ? `<label class="checkbox"><input type="checkbox" name="saveProfile" checked> Guardar estos datos en mi cuenta</label>` : ""}
        </section>

        <p class="field-error" id="checkoutError" role="alert"></p>
        <button type="submit" class="btn btn--block btn--lg glossy" id="placeOrder">Confirmar pedido</button>
        <p class="form-hint form-hint--center"><svg class="icon"><use href="#icon-lock"/></svg> Tus datos viajan cifrados. Demo: no se procesa ningún cobro real.</p>
      </form>

      <aside class="checkout-summary y2k-window" aria-label="Resumen del pedido">
        <div class="y2k-window-bar"><span>resumen.exe</span><span class="y2k-window-dots" aria-hidden="true"><span></span><span></span><span></span></span></div>
        <div class="checkout-summary-body">
          <div id="summaryLines"></div>
          <button type="button" class="btn-link" id="editCart">Editar carrito</button>
          <form class="coupon" id="couponForm" novalidate>
            <label for="coupon" class="visually-hidden">Código de descuento</label>
            <input type="text" id="coupon" name="coupon" placeholder="Código de descuento" autocomplete="off">
            <button type="submit" class="btn btn--sm glossy">Aplicar</button>
          </form>
          <p class="coupon-message" id="couponMessage" role="status"></p>
          <div id="summaryTotals"></div>
        </div>
      </aside>
    </div>`;

  const form = qs("#checkoutForm");
  const couponForm = qs("#couponForm");
  const couponMessage = qs("#couponMessage");
  liveValidation(form);

  function renderSummary() {
    const lines = cart.lines();

    if (!lines.length) {
      root.innerHTML = `
        <div class="empty-state empty-state--page">
          <p class="empty-state-title">Tu carrito está vacío</p>
          <p>Agrega algunas piezas antes de finalizar la compra.</p>
          <a href="${shopUrl()}" class="btn glossy">Ir a la tienda</a>
        </div>`;
      return;
    }

    // Efectivo sólo con Express (entrega en mano en el GAM).
    const cashInput = form.querySelector('input[value="cash"]');
    cashInput.disabled = state.method !== "express";
    cashInput.closest(".option-card").classList.toggle("is-disabled", cashInput.disabled);
    if (cashInput.disabled && state.payment === "cash") {
      state.payment = "sinpe";
      form.querySelector('input[value="sinpe"]').checked = true;
    }

    const t = totals(state);

    Object.entries(SHIPPING_METHODS).forEach(([key, m]) => {
      const free = key === "standard" && t.subtotal >= FREE_SHIPPING_MIN;
      qs(`[data-method-price="${key}"]`).textContent = free ? "Gratis" : formatCRC(m.price);
    });

    qs("#summaryLines").innerHTML = lines
      .map(
        (l) => `
        <div class="summary-line">
          <span class="summary-thumb"><img src="${l.image}" alt=""><span class="summary-qty">${l.qty}</span></span>
          <span class="summary-line-info">
            <span class="summary-line-title">${escapeHTML(l.product.title)}</span>
            <span class="summary-line-meta">${[l.color, l.size !== "Única" ? `Talla ${l.size}` : "Talla única"].filter(Boolean).join(" · ")}</span>
          </span>
          <span>${formatCRC(l.lineTotal)}</span>
        </div>`,
      )
      .join("");

    qs("#summaryTotals").innerHTML = `
      <div class="summary-row"><span>Subtotal</span><span>${formatCRC(t.subtotal)}</span></div>
      ${t.discount ? `<div class="summary-row summary-row--discount"><span>Descuento (${state.code.toUpperCase()})</span><span>−${formatCRC(t.discount)}</span></div>` : ""}
      <div class="summary-row"><span>Envío</span><span>${t.shipping ? formatCRC(t.shipping) : "Gratis"}</span></div>
      <div class="summary-row summary-row--total"><span>Total</span><span>${formatCRC(t.total)}</span></div>`;

    qs("#placeOrder").textContent = `Confirmar pedido — ${formatCRC(t.total)}`;
  }

  form.addEventListener("change", (e) => {
    if (e.target.name === "method") state.method = e.target.value;
    if (e.target.name === "payment") state.payment = e.target.value;
    renderSummary();
  });

  couponForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const code = qs("#coupon").value.trim();
    if (!code) return;
    if (discountRate(code)) {
      state.code = code;
      couponMessage.textContent = `Código ${code.toUpperCase()} aplicado: ${Math.round(discountRate(code) * 100)}% de descuento ✦`;
      couponMessage.dataset.state = "success";
    } else {
      state.code = "";
      couponMessage.textContent = "Ese código no es válido.";
      couponMessage.dataset.state = "error";
    }
    renderSummary();
  });

  qs("#editCart").addEventListener("click", openCart);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const errorBox = qs("#checkoutError");
    errorBox.textContent = "";

    if (!cart.count()) return renderSummary();

    const valid = validateForm(form, {
      email: () => "Ingresa un correo válido.",
      name: () => "Escribe tu nombre completo.",
      phone: () => "Usa un teléfono de 8 dígitos, por ejemplo 8888-8888.",
      province: () => "Selecciona tu provincia.",
      city: () => "Indica tu cantón o distrito.",
      address: () => "Escribe una dirección con más detalle (mínimo 10 caracteres).",
    });
    if (!valid) {
      errorBox.textContent = "Revisa los campos marcados.";
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    const t = totals(state);
    const customer = { email: data.email.trim().toLowerCase(), name: data.name.trim(), phone: data.phone.trim() };
    const shipping = { province: data.province, city: data.city.trim(), address: data.address.trim(), method: state.method };

    const order = orders.create({
      customer,
      shipping,
      payment: state.payment,
      notes: data.notes?.trim() ?? "",
      code: t.discount ? state.code.toUpperCase() : "",
      items: cart.lines().map((l) => ({
        id: l.id,
        title: l.product.title,
        size: l.size,
        color: l.color,
        qty: l.qty,
        price: l.product.price,
        image: l.image,
      })),
      totals: t,
    });

    if (user && data.saveProfile) {
      auth.updateProfile({ name: customer.name, phone: customer.phone, province: shipping.province, city: shipping.city, address: shipping.address });
    }

    cart.clear();
    setParams({ order: order.number });
    window.scrollTo({ top: 0, behavior: "smooth" });
    renderConfirmation(order);
  });

  // Si el carrito cambia desde el drawer, se actualiza el resumen.
  const unsubscribe = cart.subscribe(() => {
    if (qs("#checkoutForm")) renderSummary();
    else unsubscribe();
  });

  renderSummary();
}

/* ================= CONFIRMATION ================= */

function paymentInstructions(order) {
  const total = formatCRC(order.totals.total);
  if (order.payment === "sinpe") {
    return `
      <p><strong>Paga con SINPE Móvil para confirmar tu pedido:</strong></p>
      <ol>
        <li>Envía <strong>${total}</strong> al <strong>${STORE.sinpe.number}</strong> (${STORE.sinpe.holder}).</li>
        <li>En el detalle escribe tu número de pedido: <strong>${order.number}</strong>.</li>
        <li>Mándanos el comprobante a ${STORE.email} o por WhatsApp al ${STORE.whatsapp}.</li>
      </ol>`;
  }
  if (order.payment === "card") {
    return `<p>En la tienda en producción aquí se abre la pasarela de pago para cobrar <strong>${total}</strong>.
            Este sitio es una demo, así que no se realizó ningún cargo.</p>`;
  }
  return `<p>Paga <strong>${total}</strong> en efectivo al recibir tu pedido. Ten el monto exacto, por favor.</p>`;
}

function renderConfirmation(order) {
  const date = new Date(order.createdAt).toLocaleDateString("es-CR", { day: "numeric", month: "long", year: "numeric" });
  const user = auth.current();
  document.title = `Pedido ${order.number} | Inzone`;

  root.innerHTML = `
    <div class="confirmation y2k-window">
      <div class="y2k-window-bar"><span>pedido_listo.exe</span><span class="y2k-window-dots" aria-hidden="true"><span></span><span></span><span></span></span></div>
      <div class="confirmation-body">
        <span class="confirmation-icon"><svg class="icon"><use href="#icon-check"/></svg></span>
        <p class="section-kicker">Pedido ${escapeHTML(order.number)} · ${date}</p>
        <h1 class="confirmation-title">¡Gracias, ${escapeHTML(order.customer.name.split(" ")[0])}!</h1>
        <p>Recibimos tu pedido. Te enviamos la confirmación a <strong>${escapeHTML(order.customer.email)}</strong>.</p>

        <div class="confirmation-payment">${paymentInstructions(order)}</div>

        <div class="confirmation-grid">
          <div>
            <h2 class="footer-heading">Envío</h2>
            <p>${escapeHTML(order.customer.name)}<br>${escapeHTML(order.shipping.address)}<br>
               ${escapeHTML(order.shipping.city)}, ${escapeHTML(order.shipping.province)}<br>
               ${SHIPPING_METHODS[order.shipping.method].label} · ${SHIPPING_METHODS[order.shipping.method].eta}</p>
          </div>
          <div>
            <h2 class="footer-heading">Resumen</h2>
            ${order.items
              .map((i) => `<div class="summary-row"><span>${i.qty}× ${escapeHTML(i.title)} (${escapeHTML(i.size)})</span><span>${formatCRC(i.price * i.qty)}</span></div>`)
              .join("")}
            ${order.totals.discount ? `<div class="summary-row summary-row--discount"><span>Descuento ${escapeHTML(order.code)}</span><span>−${formatCRC(order.totals.discount)}</span></div>` : ""}
            <div class="summary-row"><span>Envío</span><span>${order.totals.shipping ? formatCRC(order.totals.shipping) : "Gratis"}</span></div>
            <div class="summary-row summary-row--total"><span>Total</span><span>${formatCRC(order.totals.total)}</span></div>
          </div>
        </div>

        <div class="confirmation-actions">
          <a href="${shopUrl()}" class="btn glossy">Seguir comprando</a>
          ${user ? `<a href="account.html#orders" class="btn btn--chrome">Ver mis pedidos</a>` : `<a href="account.html?mode=signup" class="btn btn--chrome">Crear cuenta</a>`}
        </div>
      </div>
    </div>`;
}

