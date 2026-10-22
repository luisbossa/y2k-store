/* ================= CATALOG =================
   Fuente única de productos. Precios en colones (CRC).
   Las rutas de imagen son relativas a la raíz del sitio. */

export const CATEGORIES = {
  hoodies: { label: "Sudaderas", group: "tops" },
  tees: { label: "Camisetas", group: "tops" },
  sleeveless: { label: "Sin mangas", group: "tops" },
  pants: { label: "Pantalones", group: "bottoms" },
  jeans: { label: "Jeans", group: "bottoms" },
  shorts: { label: "Pantalonetas", group: "bottoms" },
  caps: { label: "Gorras", group: "accessories" },
  hats: { label: "Gorros", group: "accessories" },
  belts: { label: "Cinturones", group: "accessories" },
};

export const GROUPS = {
  tops: "Parte de arriba",
  bottoms: "Parte de abajo",
  accessories: "Accesorios",
};

export const GENDERS = {
  women: "Mujer",
  men: "Hombre",
};

const APPAREL_SIZES = ["S", "M", "L", "XL"];
const ONE_SIZE = ["Única"];

const DESCRIPTIONS = {
  hoodies:
    "Sudadera holgada de felpa pesada (400 g/m²) con interior perchado, capucha doble capa y gráficos de alta densidad. Corte amplio estilo Y2K.",
  tees: "Camisa de algodón 100% de 240 g/m² con corte cuadrado, cuello reforzado y estampado de larga duración que no se cuartea.",
  sleeveless:
    "Esqueleto holgado de algodón lavado con sisas amplias y estampado vintage. Ideal solo o combinado en capas.",
  pants: "Pantalón holgado de felpa con cintura elástica, cordón ajustable y detalles bordados. Caída amplia hasta el tobillo.",
  jeans: "Mezclilla rígida de 13 oz de pierna ancha y lavado artesanal: cada pieza es ligeramente única.",
  shorts: "Short de felpa lavada con cintura elástica, bolsillos laterales y bordado en relieve.",
  caps: "Gorra de algodón lavado con visera curva, bordado frontal y cierre ajustable trasero.",
  hats: "Beanie de punto jacquard, suave y elástico. Se adapta a cualquier talla.",
  belts: "Cinturón de cuero sintético con hebilla metálica cromada. Largo ajustable.",
};

const img = (...paths) => paths.map((p) => `images/${p}`);

function product({ id, title, category, price, images, gender = "unisex", badge = null, isNew = false, featured = false, colors = null }) {
  const accessory = CATEGORIES[category].group === "accessories";
  return {
    id,
    title,
    category,
    price,
    images,
    gender,
    badge,
    isNew,
    featured,
    // colors: [{ name, swatch (imagen miniatura), images }] — la primera es la de por defecto
    colors,
    sizes: accessory ? ONE_SIZE : APPAREL_SIZES,
    description: DESCRIPTIONS[category],
  };
}

export const PRODUCTS = [
  // ---------- TEES ----------
  product({
    id: "camisa-rich",
    title: "Camisa Rich",
    category: "tees",
    price: 16500,
    images: img("t-shirts/t-shirt-1.png", "t-shirts/t-shirt-1.1.png"),
    badge: "Nuevo",
    isNew: true,
    featured: true,
    colors: [
      { name: "Gris", images: img("t-shirts/t-shirt-1.png", "t-shirts/t-shirt-1.1.png") },
      { name: "Morado", images: img("t-shirts/t-shirt-1.2.png", "t-shirts/t-shirt-1.2.1.png") },
      { name: "Café", images: img("t-shirts/t-shirt-1.3.png", "t-shirts/t-shirt-1.3.1.png") },
    ],
  }),
  product({
    id: "camisa-unusual",
    title: "Camisa Unusual",
    category: "tees",
    price: 14900,
    images: img("t-shirts/t-shirt-2.png", "t-shirts/t-shirt-2.1.png"),
    badge: "Nuevo",
    isNew: true,
    featured: true,
    colors: [
      { name: "Verde", images: img("t-shirts/t-shirt-2.png", "t-shirts/t-shirt-2.1.png") },
      { name: "Negro", images: img("t-shirts/t-shirt-2.2.png", "t-shirts/t-shirt-2.2.1.png") },
      { name: "Vino", images: img("t-shirts/t-shirt-2.3.png", "t-shirts/t-shirt-2.3.1.png") },
    ],
  }),
  product({ id: "challenge-racing-shirt", title: "Camisa Challenge Racing", category: "tees", price: 15900, images: img("t-shirts/t-shirt-3.png", "t-shirts/t-shirt-3.1.jpg"), badge: "Popular", isNew: true, featured: true }),
  product({ id: "ghost-logo-tee", title: "Camiseta Ghost Logo", category: "tees", price: 12900, images: img("t-shirts/t-shirt-4.png", "t-shirts/t-shirt-4.1.jpg"), badge: "Últimas unidades", isNew: true, featured: true }),
  product({ id: "star-sports-jersey", title: "Camiseta Star Sports", category: "tees", price: 15900, images: img("t-shirts/t-shirt-5.png", "t-shirts/t-shirt-5.1.png"), isNew: true }),

  // ---------- HOODIES ----------
  product({ id: "void-oversized-hoodie", title: "Sudadera Void Oversized", category: "hoodies", price: 24900, images: img("hoodies/hoodie-1.png", "hoodies/hoodie-1.1.jpg"), featured: true }),
  product({ id: "chrome-skull-hoodie", title: "Sudadera Chrome Skull", category: "hoodies", price: 26900, images: img("hoodies/hoodie-2.png", "hoodies/hoodie-2.1.jpg"), badge: "Popular", featured: true }),
  product({ id: "phantom-zip-hoodie", title: "Sudadera Phantom con cierre", category: "hoodies", price: 27900, images: img("hoodies/hoodie-3.png", "hoodies/hoodie-3.1.jpg"), featured: true }),
  product({ id: "static-noise-hoodie", title: "Sudadera Static Noise", category: "hoodies", price: 25900, images: img("hoodies/hoodie-4.png", "hoodies/hoodie-4.1.jpg"), featured: true }),
  product({ id: "orbit-hoodie", title: "Sudadera Orbit", category: "hoodies", price: 24900, images: img("hoodies/hoodie-5.png", "hoodies/hoodie-5.1.jpg") }),

  // ---------- SLEEVELESS ----------
  product({ id: "back-on-my-90-tank", title: "Esqueleto Back On My 90", category: "sleeveless", price: 12900, images: img("sleeveless/sleeveless-1.png") }),
  product({ id: "number-7-jersey-tank", title: "Esqueleto Jersey Número 7", category: "sleeveless", price: 13900, images: img("sleeveless/sleeveless-2.png", "sleeveless/sleeveless-2.1.jpg") }),
  product({ id: "rose-garden-tank", title: "Esqueleto Rose Garden", category: "sleeveless", price: 12900, images: img("sleeveless/sleeveless-3.png", "sleeveless/sleeveless-3.1.jpg"), gender: "women" }),
  product({ id: "serpent-halo-tank", title: "Esqueleto Serpent Halo", category: "sleeveless", price: 13900, images: img("sleeveless/sleeveless-4.png", "sleeveless/sleeveless-4.1.jpg"), badge: "Popular" }),
  product({ id: "833-chrome-logo-tank", title: "Esqueleto 833 Chrome", category: "sleeveless", price: 11900, images: img("sleeveless/sleeveless-5.jpg"), gender: "men" }),
  product({ id: "heavenly-prayer-tank", title: "Esqueleto Heavenly", category: "sleeveless", price: 12900, images: img("sleeveless/sleeveless-6.jpg"), gender: "men" }),

  // ---------- PANTS ----------
  product({ id: "witch-baggy-pants", title: "Pantalón Witch Baggy", category: "pants", price: 21900, images: img("pants/pant-1.png", "pants/pant-1.1.jpg"), featured: true }),
  product({ id: "scripture-wide-pants", title: "Pantalón ancho Scripture", category: "pants", price: 20900, images: img("pants/pant-2.png", "pants/pant-2.1.jpg"), featured: true }),
  product({ id: "zru-flame-pants", title: "Pantalón Zru Flame", category: "pants", price: 21900, images: img("pants/pant-3.png", "pants/pant-3.1.jpg"), badge: "Popular", featured: true }),
  product({ id: "stryk-track-pants", title: "Pantalón deportivo Stryk", category: "pants", price: 19900, images: img("pants/pant-4.png", "pants/pant-4.1.jpg"), featured: true }),

  // ---------- JEANS ----------
  product({ id: "rust-wash-baggy-jeans", title: "Jeans baggy Rust Wash", category: "jeans", price: 27900, images: img("jeans/jean-1.jpg", "jeans/jean-1.1.jpg"), isNew: true, gender: "men" }),
  product({ id: "split-panel-wide-jeans", title: "Jeans anchos Split Panel", category: "jeans", price: 28900, images: img("jeans/jean-2.png", "jeans/jean-2.1.jpg"), isNew: true }),

  // ---------- SHORTS ----------
  product({ id: "zone-star-shorts", title: "Pantaloneta Zone Star", category: "shorts", price: 14900, images: img("shorts/short-1.png", "shorts/short-1.1.jpg"), isNew: true }),

  // ---------- CAPS ----------
  product({ id: "fire-flame-cap", title: "Gorra Fire Flame", category: "caps", price: 11900, images: img("caps/cap-1.png", "caps/cap-1.1.jpg"), isNew: true, featured: true }),
  product({ id: "udfm-washed-cap", title: "Gorra UDFM deslavada", category: "caps", price: 12900, images: img("caps/cap-2.jpg", "caps/cap-2.1.jpg"), isNew: true, featured: true }),
  product({ id: "blonded-denim-cap", title: "Gorra Blonded de mezclilla", category: "caps", price: 11900, images: img("caps/cap-3.png", "caps/cap-3.1.jpg"), isNew: true, featured: true }),
  product({ id: "wave-washed-cap", title: "Gorra Wave deslavada", category: "caps", price: 10900, images: img("caps/cap-4.png", "caps/cap-4.1.jpg"), gender: "women", featured: true }),
  product({ id: "kitty-dad-cap", title: "Gorra Kitty", category: "caps", price: 10900, images: img("caps/cap-5.png", "caps/cap-5.1.jpg"), gender: "women" }),

  // ---------- BEANIES ----------
  product({ id: "filthy-knit-beanie", title: "Gorro Filthy", category: "hats", price: 9900, images: img("hats/hat-1.png", "hats/hat-1.1.jpg"), isNew: true, featured: true }),
  product({ id: "starlight-beanie", title: "Gorro Starlight", category: "hats", price: 10900, images: img("hats/hat-2.png", "hats/hat-2.1.jpg"), gender: "women", featured: true }),
  product({ id: "desire-knit-beanie", title: "Gorro Desire", category: "hats", price: 9900, images: img("hats/hat-3.png", "hats/hat-3.1.jpg"), featured: true }),
  product({ id: "infinity-knit-beanie", title: "Gorro Infinity", category: "hats", price: 9900, images: img("hats/hat-4.png", "hats/hat-4.1.jpg"), featured: true }),

  // ---------- BELTS ----------
  product({ id: "chrome-orbit-belt", title: "Cinturón Chrome Orbit", category: "belts", price: 13900, images: img("belts/belt-1.png", "belts/belt-1.1.jpg"), badge: "Nuevo" }),
];

/* ================= QUERIES ================= */

const byId = new Map(PRODUCTS.map((p) => [p.id, p]));

export const findProduct = (id) => byId.get(id);

export const categoryLabel = (key) => CATEGORIES[key]?.label ?? GROUPS[key] ?? "Shop";

/** Coincide con una categoría ("hoodies") o con un grupo ("bottoms"). */
export function matchesCategory(product, key) {
  if (!key) return true;
  return product.category === key || CATEGORIES[product.category].group === key;
}

/** "women" incluye también lo unisex. */
export function matchesGender(product, gender) {
  if (!gender) return true;
  return product.gender === gender || product.gender === "unisex";
}

const normalize = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

// Sinónimos (y términos en inglés que la gente igual busca) por categoría.
const SEARCH_ALIASES = {
  hoodies: "hoodie hoodies buzo sueter abrigo",
  tees: "camisa camisas tee tees t-shirt shirt playera",
  sleeveless: "esqueleto tank top musculosa",
  pants: "pantalon pants baggy jogger",
  jeans: "jean denim mezclilla",
  shorts: "short shorts bermuda",
  caps: "cap caps gorra visera",
  hats: "beanie beanies gorro",
  belts: "belt cinturon faja",
};

export function searchProducts(query) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return PRODUCTS.filter((p) => {
    const haystack = normalize(
      `${p.title} ${categoryLabel(p.category)} ${GROUPS[CATEGORIES[p.category].group]} ${p.category} ${SEARCH_ALIASES[p.category]}`,
    );
    return terms.every((t) => haystack.includes(t));
  });
}

export const newArrivals = () => PRODUCTS.filter((p) => p.isNew);

export function relatedProducts(product, limit = 4) {
  const sameCategory = PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category);
  const sameGroup = PRODUCTS.filter(
    (p) => p.id !== product.id && p.category !== product.category && CATEGORIES[p.category].group === CATEGORIES[product.category].group,
  );
  return [...sameCategory, ...sameGroup].slice(0, limit);
}

/** Imágenes a mostrar para un color concreto (o las del producto). */
export function imagesFor(product, colorName) {
  return product.colors?.find((c) => c.name === colorName)?.images ?? product.images;
}
