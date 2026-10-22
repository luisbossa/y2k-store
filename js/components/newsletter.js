/* ================= NEWSLETTER =================
   Validación en el cliente. Sin backend todavía: guarda el correo localmente y muestra el cupón. */

import { read, write } from "../utils/storage.js";

export function initNewsletter() {
  const form = document.getElementById("newsletterForm");
  if (!form) return;

  const input = form.querySelector("input[type=email]");
  const message = document.getElementById("newsletterMessage");

  const setMessage = (text, state) => {
    message.textContent = text;
    message.dataset.state = state;
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!input.checkValidity()) {
      setMessage("Ingresa un correo válido.", "error");
      input.focus();
      return;
    }

    // TODO: conectar con el proveedor de email marketing (Mailchimp, Klaviyo…).
    write("inzone-newsletter", [...new Set([...read("inzone-newsletter", []), input.value.trim().toLowerCase()])]);
    form.reset();
    setMessage("¡Estás dentro! Usa el código ZONE10 al pagar y obtén 10% de descuento ✦", "success");
  });

  input.addEventListener("input", () => setMessage("", ""));
}
