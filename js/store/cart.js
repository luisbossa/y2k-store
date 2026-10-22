/* ================= CART STORE =================
   Líneas: { id, size, color, qty }. El precio siempre se lee del catálogo. */

import { createStore } from "../utils/storage.js";
import { findProduct, imagesFor } from "../data/catalog.js";
import { FREE_SHIPPING_MIN, SHIPPING_METHODS, DISCOUNT_CODES } from "../data/config.js";

const MAX_QTY = 10;
const store = createStore("inzone-cart-v2", []);

const keyOf = ({ id, size, color }) => `${id}|${size ?? ""}|${color ?? ""}`;

// Para el "+ Agregar" rápido de las tarjetas: M en ropa, "Única" en accesorios.
export const defaultSize = (product) => (product.sizes.includes("M") ? "M" : product.sizes[0]);

// Descarta líneas de productos que ya no existen en el catálogo.
store.set((lines) => (Array.isArray(lines) ? lines.filter((l) => findProduct(l.id)) : []));

export const cart = {
  subscribe: store.subscribe,

  /** Líneas enriquecidas con producto, precio, imagen y total. */
  lines() {
    return store.get().map((line) => {
      const product = findProduct(line.id);
      return {
        ...line,
        key: keyOf(line),
        product,
        image: imagesFor(product, line.color)[0],
        lineTotal: product.price * line.qty,
      };
    });
  },

  count: () => store.get().reduce((sum, l) => sum + l.qty, 0),

  subtotal: () => cart.lines().reduce((sum, l) => sum + l.lineTotal, 0),

  add(id, { size, color = null, qty = 1 } = {}) {
    const product = findProduct(id);
    if (!product) return;
    const line = { id, size: size ?? defaultSize(product), color: color ?? product.colors?.[0].name ?? null };
    store.set((lines) => {
      const existing = lines.find((l) => keyOf(l) === keyOf(line));
      if (existing) {
        return lines.map((l) => (l === existing ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l));
      }
      return [...lines, { ...line, qty: Math.min(MAX_QTY, qty) }];
    });
    return line;
  },

  setQty(key, qty) {
    if (qty < 1) return cart.remove(key);
    store.set((lines) => lines.map((l) => (keyOf(l) === key ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)));
  },

  /** Cambia la talla; si ya existe una línea igual, las fusiona. */
  setSize(key, size) {
    store.set((lines) => {
      const line = lines.find((l) => keyOf(l) === key);
      if (!line) return lines;
      const updated = { ...line, size };
      const twin = lines.find((l) => l !== line && keyOf(l) === keyOf(updated));
      if (twin) {
        return lines.filter((l) => l !== line).map((l) => (l === twin ? { ...l, qty: Math.min(MAX_QTY, l.qty + line.qty) } : l));
      }
      return lines.map((l) => (l === line ? updated : l));
    });
  },

  remove(key) {
    store.set((lines) => lines.filter((l) => keyOf(l) !== key));
  },

  clear() {
    store.set([]);
  },
};

/* ================= TOTALS ================= */

export function shippingCost(method, subtotal) {
  if (method === "standard" && subtotal >= FREE_SHIPPING_MIN) return 0;
  return SHIPPING_METHODS[method]?.price ?? 0;
}

export function discountRate(code) {
  return DISCOUNT_CODES[code?.trim().toUpperCase()] ?? 0;
}

export function totals({ method = "standard", code = "" } = {}) {
  const subtotal = cart.subtotal();
  const discount = Math.round(subtotal * discountRate(code));
  const shipping = cart.count() ? shippingCost(method, subtotal) : 0;
  return { subtotal, discount, shipping, total: subtotal - discount + shipping };
}
