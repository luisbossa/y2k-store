/* ================= ORDERS STORE (demo) =================
   Pedidos guardados en el navegador para mostrar confirmación e historial. */

import { createStore } from "../utils/storage.js";

const store = createStore("inzone-orders", []);

function orderNumber() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `IZ-${stamp}${rand}`;
}

export const orders = {
  create(data) {
    const order = {
      ...data,
      number: orderNumber(),
      status: data.payment === "card" ? "Pago pendiente" : "Recibido",
      createdAt: new Date().toISOString(),
    };
    store.set((list) => [order, ...list]);
    return order;
  },

  find: (number) => store.get().find((o) => o.number === number),

  byEmail: (email) => store.get().filter((o) => o.customer.email === email),
};
