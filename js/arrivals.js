const products = [
  {
    title: "Witch Unisex Straight Fit Baggy Pants",
    img1: "/images/t-shirts/t-shirt-1.png",
    img2: "/images/t-shirts/t-shirt-1.1.jpg",
    price: 7500,
  },
  {
    title: "Xyden Unisex Straight Fit Baggy Pants",
    img1: "/images/t-shirts/t-shirt-2.png",
    img2: "/images/t-shirts/t-shirt-2.1.jpg",
    price: 1699,
  },
  {
    title: "Reaven Black Unisex Zipper Hoodie",
    img1: "/images/t-shirts/t-shirt-3.png",
    img2: "/images/t-shirts/t-shirt-3.1.jpg",
    price: 2399,
  },
  {
    title: "Noctra Oversized Tee",
    img1: "/images/caps/cap-1.png",
    img2: "/images/caps/cap-1.1.jpg",
    price: 1299,
  },
  {
    title: "Void Graphic Hoodie",
    img1: "/images/t-shirts/t-shirt-4.png",
    img2: "/images/t-shirts/t-shirt-4.1.jpg",
    price: 2599,
  },
  {
    title: "Cybercore Baggy Denim",
    img1: "/images/t-shirts/t-shirt-5.png",
    img2: "/images/t-shirts/t-shirt-5.1.png",
    price: 2799,
  },
  {
    title: "Nebula Street Jacket",
    img1: "/images/caps/cap-2.jpg",
    img2: "/images/caps/cap-2.1.jpg",
    price: 3299,
  },
  {
    title: "Y2K Flame Long Sleeve",
    img1: "/images/hats/hat-1.png",
    img2: "/images/hats/hat-1.1.jpg",
    price: 1499,
  },
  {
    title: "Chrome Skull Hoodie",
    img1: "/images/caps/cap-3.png",
    img2: "/images/caps/cap-3.1.jpg",
    price: 2699,
  },
  {
    title: "Zone Signature Cargo",
    img1: "/images/shorts/short-1.png",
    img2: "/images/shorts/short-1.1.jpg",
    price: 2999,
  },
  {
    title: "Xyden Unisex Straight Fit Baggy Pants",
    img1: "/images/jeans/jean-1.jpg",
    img2: "/images/jeans/jean-1.1.jpg",
    price: 1699,
  },
  {
    title: "Reaven Black Unisex Zipper Hoodie",
    img1: "/images/jeans/jean-2.png",
    img2: "/images/jeans/jean-2.1.jpg",
    price: 2399,
  },
];

// ===============================
// UTILITIES
// ===============================

function formatCRC(number) {
  return "₡ " + number.toLocaleString("es-CR");
}

// ===============================
// CARD TEMPLATE
// ===============================

function createProductCard(product) {
  return `
    <product-card class="arrival-card">

      <div class="arrival-figure">
        <a href="#" class="arrival-anchor">
          <img src="${product.img1}" 
               alt="${product.title}"
               class="product-card__image product-card__image--primary">

          <img src="${product.img2}" 
               alt="${product.title}"
               class="product-card__image product-card__image--secondary">
        </a>
      </div>

      <div class="product-card__info">

        <a href="#" class="product-title">
          ${product.title}
        </a>

        <div class="product-card__price">
          <span class="price-current">
            ${formatCRC(product.price)}
          </span>
        </div>

        <div class="product-variants">
          <img src="/images/variant-1.jpg" class="variant-circle">
          <img src="/images/variant-2.jpg" class="variant-circle">
          <img src="/images/variant-3.jpg" class="variant-circle">
          <img src="/images/variant-4.jpg" class="variant-circle">
        </div>

      </div>

    </product-card>
  `;
}

// ===============================
// RENDER
// ===============================

function renderProducts() {
  const container = document.getElementById("arrivalList");

  if (!container) return;

  container.innerHTML = products
    .map((product) => createProductCard(product))
    .join("");
}

document.addEventListener("DOMContentLoaded", renderProducts);
