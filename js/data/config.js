/* ================= STORE CONFIG =================
   Reglas de negocio en un solo lugar. Ajusta estos valores a los reales. */

export const STORE = {
  name: "Inzone",
  email: "hola@inzone.cr",
  whatsapp: "+506 8888-8888",
  sinpe: { number: "8888-8888", holder: "Inzone Store" },
  social: {
    instagram: "https://www.instagram.com/",
    tiktok: "https://www.tiktok.com/",
    youtube: "https://www.youtube.com/",
  },
};

export const FREE_SHIPPING_MIN = 30000;

export const SHIPPING_METHODS = {
  standard: { label: "Estándar (Correos de CR)", eta: "2–4 días hábiles", price: 2500 },
  express: { label: "Express (mensajería GAM)", eta: "24 horas", price: 4500 },
};

export const PAYMENT_METHODS = {
  sinpe: { label: "SINPE Móvil", detail: "Te enviamos los datos al confirmar el pedido." },
  card: { label: "Tarjeta de crédito / débito", detail: "Serás redirigido a la pasarela de pago segura." },
  cash: { label: "Efectivo contra entrega", detail: "Disponible sólo en el GAM con envío Express." },
};

// Códigos de descuento: porcentaje (0–1).
export const DISCOUNT_CODES = {
  ZONE10: 0.1,
  Y2K15: 0.15,
};

export const PROVINCES = ["San José", "Alajuela", "Cartago", "Heredia", "Guanacaste", "Puntarenas", "Limón"];
