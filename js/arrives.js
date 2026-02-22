const products = [
  {
    title: "Witch Unisex Straight Fit Baggy Pants",
    img1: "/images/t-shirts/t-shirt-1.png",
    img2: "/images/t-shirts/t-shirt-1.1.jpg",
    price: 7500,
    oldPrice: 9500,
    discount: 33,
  },
  {
    title: "Xyden Unisex Straight Fit Baggy Pants",
    img1: "/images/t-shirts/t-shirt-2.png",
    img2: "/images/t-shirts/t-shirt-2.1.jpg",
    price: 1699,
    oldPrice: 2699,
    discount: 37,
  },
  {
    title: "Reaven Black Unisex Zipper Hoodie",
    img1: "/images/t-shirts/t-shirt-3.png",
    img2: "/images/t-shirts/t-shirt-3.1.jpg",
    price: 2399,
    oldPrice: 3699,
    discount: 35,
  },
  {
    title: "Noctra Oversized Tee",
    img1: "/images/caps/cap-1.png",
    img2: "/images/caps/cap-1.1.jpg",
    price: 1299,
    oldPrice: 1999,
    discount: 35,
  },
  {
    title: "Void Graphic Hoodie",
    img1: "/images/t-shirts/t-shirt-4.png",
    img2: "/images/t-shirts/t-shirt-4.1.jpg",
    price: 2599,
    oldPrice: 3899,
    discount: 33,
  },
  {
    title: "Cybercore Baggy Denim",
    img1: "/images/t-shirts/t-shirt-5.png",
    img2: "/images/t-shirts/t-shirt-5.1.png",
    price: 2799,
    oldPrice: 4199,
    discount: 33,
  },
  {
    title: "Nebula Street Jacket",
    img1: "/images/caps/cap-2.jpg",
    img2: "/images/caps/cap-2.1.jpg",
    price: 3299,
    oldPrice: 4799,
    discount: 31,
  },
  {
    title: "Y2K Flame Long Sleeve",
    img1: "/images/hats/hat-1.png",
    img2: "/images/hats/hat-1.1.jpg",
    price: 1499,
    oldPrice: 2199,
    discount: 32,
  },
  {
    title: "Chrome Skull Hoodie",
    img1: "/images/caps/cap-3.png",
    img2: "/images/caps/cap-3.1.jpg",
    price: 2699,
    oldPrice: 3999,
    discount: 32,
  },
  {
    title: "Zone Signature Cargo",
    img1: "/images/shorts/short-1.png",
    img2: "/images/shorts/short-1.1.jpg",
    price: 2999,
    oldPrice: 4399,
    discount: 32,
  },
  {
    title: "Xyden Unisex Straight Fit Baggy Pants",
    img1: "/images/jeans/jean-1.jpg",
    img2: "/images/jeans/jean-1.1.jpg",
    price: 1699,
    oldPrice: 2699,
    discount: 37,
  },
  {
    title: "Reaven Black Unisex Zipper Hoodie",
    img1: "/images/jeans/jean-2.png",
    img2: "/images/jeans/jean-2.1.jpg",
    price: 2399,
    oldPrice: 3699,
    discount: 35,
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

        <badge-list class="badge-list">
          <on-sale-badge class="badge badge--on-sale">
            Save ${product.discount}%
          </on-sale-badge>
        </badge-list>

        <a href="#" class="arrival-anchor">
          <img src="${product.img1}" 
               alt="${product.title}"
               class="product-card__image product-card__image--primary">

          <img src="${product.img2}" 
               alt="${product.title}"
               class="product-card__image product-card__image--secondary">
        </a>

        <button class="product-card__quick-add-button">
          +
        </button>

      </div>

      <div class="product-card__info">
        <a href="#" class="product-title h6">
          ${product.title}
        </a>

        <price-list class="price-list">
          <sale-price class="h6 text-on-sale">
            ${formatCRC(product.price)}
          </sale-price>

          <compare-at-price class="h6 text-subdued line-through">
            ${formatCRC(product.oldPrice)}
          </compare-at-price>
        </price-list>
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
