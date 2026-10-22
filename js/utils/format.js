const crcFormatter = new Intl.NumberFormat("es-CR");

export function formatCRC(amount) {
  return `₡ ${crcFormatter.format(amount)}`;
}

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

export function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ESCAPES[char]);
}
