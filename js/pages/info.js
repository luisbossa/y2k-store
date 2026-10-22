/* ================= INFO =================
   info.html?page=help|shipping|returns|terms|privacy|about|contact */

import { mountLayout } from "../components/layout.js";
import { INFO_PAGES } from "../data/pages.js";
import { auth } from "../store/auth.js";
import { qs, params, infoUrl, validateForm, liveValidation } from "../utils/dom.js";
import { escapeHTML } from "../utils/format.js";
import { read, write } from "../utils/storage.js";

mountLayout();

const key = INFO_PAGES[params().get("page")] ? params().get("page") : "help";
const page = INFO_PAGES[key];
document.title = `${page.title} | Inzone`;

qs("#infoNav").innerHTML = Object.entries(INFO_PAGES)
  .map(([k, p]) => `<a href="${infoUrl(k)}" ${k === key ? 'aria-current="page"' : ""}>${p.title}</a>`)
  .join("");

const faq = page.faq
  ? `<div class="accordion">${page.faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div>`
  : "";

const user = auth.current();
const contactForm = page.form
  ? `
  <form id="contactForm" class="contact-form" novalidate>
    <div class="field-grid">
      <div class="field"><label for="cName">Nombre</label><input id="cName" name="name" required autocomplete="name" value="${escapeHTML(user?.name ?? "")}"></div>
      <div class="field"><label for="cEmail">Correo</label><input id="cEmail" name="email" type="email" required autocomplete="email" value="${escapeHTML(user?.email ?? "")}"></div>
      <div class="field field--full"><label for="cTopic">Motivo</label>
        <select id="cTopic" name="topic" required>
          <option value="">Selecciona…</option>
          <option>Estado de mi pedido</option><option>Cambios y devoluciones</option>
          <option>Tallas y productos</option><option>Colaboraciones</option><option>Otro</option>
        </select></div>
      <div class="field field--full"><label for="cOrder">Número de pedido <span class="optional">(opcional)</span></label><input id="cOrder" name="order" placeholder="IZ-XXXXX"></div>
      <div class="field field--full"><label for="cMessage">Mensaje</label><textarea id="cMessage" name="message" rows="5" required minlength="10"></textarea></div>
    </div>
    <button type="submit" class="btn glossy">Enviar mensaje</button>
    <p class="newsletter-message" id="contactMessage" role="status"></p>
  </form>`
  : "";

qs("#infoContent").innerHTML = `
  <p class="section-kicker">${page.kicker}</p>
  <h1 class="info-title">${page.title}</h1>
  <div class="prose">${page.body ?? ""}</div>
  ${faq}
  ${contactForm}
  ${key !== "contact" ? `<p class="info-help">¿No encontraste lo que buscabas? <a href="${infoUrl("contact")}">Escríbenos</a>.</p>` : ""}`;

const form = qs("#contactForm");
if (form) {
  liveValidation(form);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const valid = validateForm(form, {
      name: () => "Escribe tu nombre.",
      email: () => "Ingresa un correo válido.",
      topic: () => "Elige un motivo.",
      message: () => "Cuéntanos un poco más (mínimo 10 caracteres).",
    });
    if (!valid) return;

    // TODO: enviar a un backend / servicio de formularios (Formspree, EmailJS…).
    write("inzone-messages", [...read("inzone-messages", []), { ...Object.fromEntries(new FormData(form)), sentAt: new Date().toISOString() }]);
    form.reset();
    const msg = qs("#contactMessage");
    msg.dataset.state = "success";
    msg.textContent = "¡Mensaje enviado! Te respondemos en menos de 24 horas hábiles ✦";
  });
}
