/* ================= INFO PAGES =================
   Contenido de info.html?page=<key>. Textos de ejemplo: ajústalos a tus políticas reales. */

import { STORE, FREE_SHIPPING_MIN, SHIPPING_METHODS } from "./config.js";
import { formatCRC } from "../utils/format.js";

export const INFO_PAGES = {
  help: {
    title: "Preguntas frecuentes",
    kicker: "Centro de ayuda",
    faq: [
      ["¿Cuánto tarda mi pedido?", `Envío estándar: ${SHIPPING_METHODS.standard.eta}. Express en el GAM: ${SHIPPING_METHODS.express.eta}. Recibirás un correo cuando salga tu paquete.`],
      ["¿Cómo sé mi talla?", "Cada producto tiene una guía de tallas. Nuestro corte es holgado: si prefieres algo más ajustado, pide una talla menos."],
      ["¿Qué métodos de pago aceptan?", "SINPE Móvil, tarjetas de crédito y débito (Visa y Mastercard) y efectivo contra entrega en el GAM con envío Express."],
      ["¿Puedo cambiar mi pedido?", "Sí, escríbenos dentro de las 2 horas siguientes a tu compra y lo ajustamos antes de que salga."],
      ["¿Van a reponer un producto agotado?", "Algunos lanzamientos son de edición limitada y no se repiten. Suscríbete al boletín para enterarte primero de las reposiciones."],
      ["¿Tienen tienda física?", "Por ahora somos 100% en línea, pero hacemos ventas temporales en distintos lugares. Síguenos en Instagram para saber dónde estaremos."],
    ],
  },
  shipping: {
    title: "Envíos",
    kicker: "Centro de ayuda",
    body: `
      <p>Enviamos a las 7 provincias de Costa Rica.</p>
      <ul>
        <li><strong>${SHIPPING_METHODS.standard.label}:</strong> ${formatCRC(SHIPPING_METHODS.standard.price)} · ${SHIPPING_METHODS.standard.eta}. <strong>Gratis</strong> en compras desde ${formatCRC(FREE_SHIPPING_MIN)}.</li>
        <li><strong>${SHIPPING_METHODS.express.label}:</strong> ${formatCRC(SHIPPING_METHODS.express.price)} · ${SHIPPING_METHODS.express.eta}.</li>
      </ul>
      <p>Los pedidos pagados antes de las 12 md salen el mismo día hábil. Te enviaremos el número de guía por correo.</p>`,
  },
  returns: {
    title: "Cambios y devoluciones",
    kicker: "Centro de ayuda",
    body: `
      <p>Tienes <strong>30 días naturales</strong> desde que recibes tu pedido para solicitar un cambio o devolución.</p>
      <ul>
        <li>La pieza debe estar sin usar, sin lavar y con sus etiquetas.</li>
        <li>El primer cambio de talla es gratis; el envío de devoluciones corre por cuenta del cliente.</li>
        <li>Los reembolsos se hacen por el mismo medio de pago en un máximo de 8 días hábiles.</li>
        <li>Los productos en liquidación final no tienen devolución.</li>
      </ul>
      <p>Para iniciar un cambio escríbenos desde la página de <a href="info.html?page=contact">contacto</a> con tu número de pedido.</p>`,
  },
  terms: {
    title: "Términos y condiciones",
    kicker: "Legal",
    body: `
      <p>Al comprar en ${STORE.name} aceptas estos términos. Los precios están en colones costarricenses e incluyen IVA.</p>
      <p>Nos reservamos el derecho de cancelar pedidos por errores evidentes de precio o falta de inventario; en ese caso se reembolsará el 100% del monto pagado.</p>
      <p>Las imágenes de producto son ilustrativas; los colores pueden variar ligeramente según la pantalla.</p>
      <p>Los códigos de descuento no son acumulables y tienen vigencia limitada.</p>`,
  },
  privacy: {
    title: "Política de privacidad",
    kicker: "Legal",
    body: `
      <p>Usamos tus datos (nombre, correo, teléfono y dirección) únicamente para procesar tus pedidos y, si lo autorizas, para enviarte novedades.</p>
      <p>No vendemos ni compartimos tu información con terceros, salvo con la empresa de mensajería que entrega tu pedido.</p>
      <p>Puedes pedir que eliminemos tus datos en cualquier momento escribiendo a ${STORE.email}, conforme a la Ley 8968 de Protección de Datos Personales.</p>`,
  },
  about: {
    title: "Sobre Inzone",
    kicker: "Nuestra historia",
    body: `
      <p><strong>Inzone</strong> nace en Costa Rica con una idea: traer la estética Y2K —cromo, brillo, gráficos agresivos y nostalgia digital— a la ropa urbana de todos los días.</p>
      <p>Trabajamos en lanzamientos pequeños y limitados. Cada pieza se diseña para tener personalidad propia y durar más que una temporada.</p>
      <p>Medios como TrustNoOne, ADP y GCL ya hablaron de nosotros. Gracias por ser parte de la zona ✦</p>`,
  },
  contact: {
    title: "Contacto",
    kicker: "Centro de ayuda",
    body: `
      <p>¿Dudas con tu pedido, una talla o una colaboración? Escríbenos y te respondemos en menos de 24 horas hábiles.</p>
      <ul class="contact-list">
        <li><strong>Correo:</strong> <a href="mailto:${STORE.email}">${STORE.email}</a></li>
        <li><strong>WhatsApp:</strong> <a href="https://wa.me/${STORE.whatsapp.replace(/\D/g, "")}" target="_blank" rel="noopener noreferrer">${STORE.whatsapp}</a></li>
        <li><strong>Horario:</strong> lunes a viernes, 9 a. m. – 6 p. m.</li>
      </ul>`,
    form: true,
  },
};
