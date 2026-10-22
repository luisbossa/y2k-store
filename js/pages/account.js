/* ================= ACCOUNT =================
   Sin sesión: ingresar / crear cuenta (?mode=signup, ?next=url).
   Con sesión: pedidos, datos guardados y cerrar sesión. */

import { mountLayout } from "../components/layout.js";
import { auth } from "../store/auth.js";
import { orders } from "../store/orders.js";
import { SHIPPING_METHODS, PAYMENT_METHODS, PROVINCES } from "../data/config.js";
import { qs, params, shopUrl, validateForm, liveValidation, setFieldError } from "../utils/dom.js";
import { formatCRC, escapeHTML } from "../utils/format.js";
import { showToast } from "../utils/toast.js";

mountLayout();

const root = qs("#accountRoot");

// Sólo se permite volver a páginas internas.
const next = /^[\w-]+\.html(\?.*)?$/.test(params().get("next") ?? "") ? params().get("next") : null;

function render() {
  const user = auth.current();
  if (user) renderDashboard(user);
  else renderAuth(params().get("mode") === "signup" ? "signup" : "login");
}

/* ================= LOGIN / SIGNUP ================= */

function renderAuth(mode) {
  document.title = `${mode === "signup" ? "Crear cuenta" : "Ingresar"} | Inzone`;

  root.innerHTML = `
    <div class="auth y2k-window">
      <div class="y2k-window-bar"><span>ingresar.exe</span><span class="y2k-window-dots" aria-hidden="true"><span></span><span></span><span></span></span></div>
      <div class="auth-body">
        <div class="tabs" role="tablist">
          <button type="button" role="tab" class="tab" data-mode="login" aria-selected="${mode === "login"}">Ingresar</button>
          <button type="button" role="tab" class="tab" data-mode="signup" aria-selected="${mode === "signup"}">Crear cuenta</button>
        </div>

        <h1 class="auth-title">${mode === "signup" ? "Únete a la zona" : "¡Hola de nuevo!"}</h1>
        <p class="auth-text">${
          mode === "signup"
            ? "Guarda tus datos de envío, revisa tus pedidos y recibe acceso anticipado a los lanzamientos."
            : "Ingresa para ver tus pedidos y comprar más rápido."
        }</p>

        <form id="authForm" class="auth-form" novalidate>
          ${
            mode === "signup"
              ? `<div class="field"><label for="name">Nombre</label><input id="name" name="name" autocomplete="name" required minlength="2"></div>`
              : ""
          }
          <div class="field"><label for="email">Correo electrónico</label><input type="email" id="email" name="email" autocomplete="email" required></div>
          <div class="field">
            <label for="password">Contraseña</label>
            <div class="password-field">
              <input type="password" id="password" name="password" required minlength="8"
                autocomplete="${mode === "signup" ? "new-password" : "current-password"}">
              <button type="button" class="btn-link" data-toggle-password aria-label="Mostrar contraseña">Ver</button>
            </div>
            ${mode === "signup" ? `<p class="form-hint">Mínimo 8 caracteres.</p>` : ""}
          </div>
          ${
            mode === "signup"
              ? `<div class="field"><label for="confirm">Confirmar contraseña</label><input type="password" id="confirm" name="confirm" required autocomplete="new-password"></div>
                 <label class="checkbox field"><input type="checkbox" name="terms" required> Acepto los <a href="info.html?page=terms" target="_blank">términos</a> y la <a href="info.html?page=privacy" target="_blank">política de privacidad</a></label>`
              : ""
          }
          <p class="field-error" id="authError" role="alert"></p>
          <button type="submit" class="btn btn--block glossy">${mode === "signup" ? "Crear cuenta" : "Ingresar"}</button>
        </form>
        <p class="form-hint form-hint--center">Demo: las cuentas se guardan sólo en este navegador.</p>
      </div>
    </div>`;

  const form = qs("#authForm");
  liveValidation(form);

  root.querySelectorAll("[data-mode]").forEach((tab) =>
    tab.addEventListener("click", () => {
      const url = new URL(window.location.href);
      url.searchParams.set("mode", tab.dataset.mode);
      history.replaceState(null, "", url);
      renderAuth(tab.dataset.mode);
    }),
  );

  qs("[data-toggle-password]").addEventListener("click", (e) => {
    const input = qs("#password");
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    e.target.textContent = show ? "Ocultar" : "Ver";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const error = qs("#authError");
    error.textContent = "";

    const confirm = form.elements.confirm;
    if (confirm) setFieldError(confirm, confirm.value && confirm.value !== form.elements.password.value ? "Las contraseñas no coinciden." : "");

    const valid = validateForm(form, {
      name: () => "Escribe tu nombre.",
      email: () => "Ingresa un correo válido.",
      password: () => "La contraseña debe tener al menos 8 caracteres.",
      confirm: () => "Confirma tu contraseña.",
      terms: () => "Debes aceptar los términos.",
    });
    if (!valid || (confirm && confirm.value !== form.elements.password.value)) return;

    const data = Object.fromEntries(new FormData(form));
    try {
      const user = mode === "signup" ? await auth.signUp(data) : await auth.logIn(data);
      showToast({ title: `¡Hola, ${user.name.split(" ")[0]}!`, text: mode === "signup" ? "Tu cuenta fue creada." : "Sesión iniciada." });
      if (next) window.location.href = next;
    } catch (err) {
      error.textContent = err.message;
    }
  });
}

/* ================= DASHBOARD ================= */

const formatDate = (iso) => new Date(iso).toLocaleDateString("es-CR", { day: "numeric", month: "short", year: "numeric" });

function orderTemplate(order) {
  return `
    <details class="order">
      <summary>
        <span class="order-number">${escapeHTML(order.number)}</span>
        <span>${formatDate(order.createdAt)}</span>
        <span class="order-status">${escapeHTML(order.status)}</span>
        <strong>${formatCRC(order.totals.total)}</strong>
      </summary>
      <div class="order-body">
        ${order.items
          .map(
            (i) => `<div class="summary-line">
              <span class="summary-thumb"><img src="${i.image}" alt=""><span class="summary-qty">${i.qty}</span></span>
              <span class="summary-line-info"><span class="summary-line-title">${escapeHTML(i.title)}</span>
              <span class="summary-line-meta">${[i.color, `Talla ${i.size}`].filter(Boolean).map(escapeHTML).join(" · ")}</span></span>
              <span>${formatCRC(i.price * i.qty)}</span>
            </div>`,
          )
          .join("")}
        <p class="order-meta">${SHIPPING_METHODS[order.shipping.method].label} · ${PAYMENT_METHODS[order.payment].label}<br>
          ${escapeHTML(order.shipping.address)}, ${escapeHTML(order.shipping.city)}, ${escapeHTML(order.shipping.province)}</p>
        <a href="checkout.html?order=${encodeURIComponent(order.number)}" class="btn-link">Ver confirmación</a>
      </div>
    </details>`;
}

function renderDashboard(user) {
  document.title = "Mi cuenta | Inzone";
  const list = orders.byEmail(user.email);

  root.innerHTML = `
    <div class="account">
      <header class="account-header">
        <div>
          <p class="section-kicker">Mi cuenta</p>
          <h1 class="account-title">Hola, ${escapeHTML(user.name.split(" ")[0])}</h1>
          <p class="account-email">${escapeHTML(user.email)}</p>
        </div>
        <button type="button" class="btn btn--chrome" id="logout">Cerrar sesión</button>
      </header>

      <div class="account-grid">
        <section class="account-card y2k-window" id="orders" aria-labelledby="ordersTitle">
          <div class="y2k-window-bar"><span id="ordersTitle">Mis pedidos (${list.length})</span></div>
          <div class="account-card-body">
            ${
              list.length
                ? list.map(orderTemplate).join("")
                : `<div class="empty-state"><p class="empty-state-title">Aún no tienes pedidos</p>
                   <p>Cuando compres, vas a ver aquí el estado de cada pedido.</p>
                   <a href="${shopUrl()}" class="btn glossy">Ir a la tienda</a></div>`
            }
          </div>
        </section>

        <section class="account-card y2k-window" aria-labelledby="profileTitle">
          <div class="y2k-window-bar"><span id="profileTitle">Mis datos</span></div>
          <form class="account-card-body" id="profileForm" novalidate>
            <div class="field"><label for="pName">Nombre</label><input id="pName" name="name" required minlength="2" value="${escapeHTML(user.name)}"></div>
            <div class="field"><label for="pPhone">Teléfono</label><input id="pPhone" name="phone" type="tel" pattern="[0-9]{4}-?[0-9]{4}" placeholder="8888-8888" value="${escapeHTML(user.phone)}"></div>
            <div class="field"><label for="pProvince">Provincia</label>
              <select id="pProvince" name="province"><option value="">Selecciona…</option>
                ${PROVINCES.map((p) => `<option ${user.province === p ? "selected" : ""}>${p}</option>`).join("")}
              </select></div>
            <div class="field"><label for="pCity">Cantón / Distrito</label><input id="pCity" name="city" value="${escapeHTML(user.city)}"></div>
            <div class="field"><label for="pAddress">Dirección exacta</label><textarea id="pAddress" name="address" rows="3">${escapeHTML(user.address)}</textarea></div>
            <button type="submit" class="btn btn--block glossy">Guardar cambios</button>
          </form>
        </section>
      </div>
    </div>`;

  qs("#logout").addEventListener("click", () => {
    auth.logOut();
    showToast({ title: "Sesión cerrada", text: "¡Vuelve pronto!" });
  });

  const form = qs("#profileForm");
  liveValidation(form);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm(form, { name: () => "Escribe tu nombre.", phone: () => "Usa 8 dígitos, por ejemplo 8888-8888." })) return;
    const data = Object.fromEntries(new FormData(form));
    auth.updateProfile(Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v.trim()])));
    showToast({ title: "Datos guardados", text: "Los usaremos en tu próxima compra." });
  });

  if (location.hash === "#orders") qs("#orders").scrollIntoView();
}

/* ================= INIT ================= */

render();
auth.subscribe(render);
