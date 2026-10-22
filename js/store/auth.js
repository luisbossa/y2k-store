/* ================= AUTH STORE (demo) =================
   Cuentas guardadas en el navegador. Las contraseñas se guardan como hash SHA-256,
   pero esto NO reemplaza un backend: para producción usar un servicio de auth real. */

import { createStore } from "../utils/storage.js";

const users = createStore("inzone-users", {});
const session = createStore("inzone-session", null);

async function hash(text) {
  const data = new TextEncoder().encode(`inzone:${text}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const normalizeEmail = (email) => email.trim().toLowerCase();

/** Usuario público (sin hash de contraseña). */
function publicUser(record) {
  if (!record) return null;
  const { passwordHash, ...user } = record;
  return user;
}

export const auth = {
  subscribe: session.subscribe,

  current() {
    const email = session.get();
    return email ? publicUser(users.get()[email]) : null;
  },

  async signUp({ name, email, password }) {
    email = normalizeEmail(email);
    if (users.get()[email]) throw new Error("Ya existe una cuenta con ese correo.");
    const record = {
      name: name.trim(),
      email,
      phone: "",
      province: "",
      city: "",
      address: "",
      createdAt: new Date().toISOString(),
      passwordHash: await hash(password),
    };
    users.set((all) => ({ ...all, [email]: record }));
    session.set(email);
    return publicUser(record);
  },

  async logIn({ email, password }) {
    email = normalizeEmail(email);
    const record = users.get()[email];
    if (!record || record.passwordHash !== (await hash(password))) {
      throw new Error("Correo o contraseña incorrectos.");
    }
    session.set(email);
    return publicUser(record);
  },

  logOut() {
    session.set(null);
  },

  updateProfile(changes) {
    const email = session.get();
    if (!email) return;
    users.set((all) => ({ ...all, [email]: { ...all[email], ...changes, email } }));
    session.set(email); // notifica a los suscriptores
  },
};
