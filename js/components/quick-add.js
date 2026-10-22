/* ================= QUICK ADD =================
   Cualquier botón [data-add-to-cart="<id>"] agrega el producto con su talla por defecto. */

import { cart, defaultSize } from "../store/cart.js";
import { findProduct } from "../data/catalog.js";
import { showToast } from "../utils/toast.js";
import { openCart } from "./cart-drawer.js";

export function initQuickAdd() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add-to-cart]");
    if (!btn) return;
    e.preventDefault();

    const product = findProduct(btn.dataset.addToCart);
    if (!product) return;

    const line = cart.add(product.id);
    const sizeNote = product.sizes.length > 1 ? `Talla ${defaultSize(product)} · puedes cambiarla en el carrito` : "agregado al carrito";

    showToast({
      title: product.title,
      text: sizeNote,
      image: product.images[0],
      action: { label: "Ver carrito", onClick: openCart },
    });
    return line;
  });
}
