const products = [
  {
    title: "Camisa Rich",
    img1: "/images/t-shirts/t-shirt-1.png",
    img2: "/images/t-shirts/t-shirt-1.1.png",
    price: 16500,
    variants: [
      {
        img1: "/images/t-shirts/t-shirt-1.2.png",
        img2: "/images/t-shirts/t-shirt-1.2.1.png",
      },
      {
        img1: "/images/t-shirts/t-shirt-1.3.png",
        img2: "/images/t-shirts/t-shirt-1.3.1.png",
      },
      {
        img1: "/images/t-shirts/t-shirt-1.png",
        img2: "/images/t-shirts/t-shirt-1.1.png",
      },
    ],
  },
  {
    title: "Camisa Unusual",
    img1: "/images/t-shirts/t-shirt-2.png",
    img2: "/images/t-shirts/t-shirt-2.1.png",
    price: 14900,
    variants: [
      {
        img1: "/images/t-shirts/t-shirt-2.2.png",
        img2: "/images/t-shirts/t-shirt-2.2.1.png",
      },
      {
        img1: "/images/t-shirts/t-shirt-2.3.png",
        img2: "/images/t-shirts/t-shirt-2.3.1.png",
      },
      {
        img1: "/images/t-shirts/t-shirt-2.png",
        img2: "/images/t-shirts/t-shirt-2.1.png",
      },
    ],
  },
  {
    title: "Reaven Black Unisex Zipper Hoodie",
    img1: "/images/t-shirts/t-shirt-3.png",
    img2: "/images/t-shirts/t-shirt-3.1.jpg",
    price: 2399,
    variants: [
      {
        img1: "/images/t-shirts/t-shirt-2.png",
        img2: "/images/t-shirts/t-shirt-2.1.png",
      },
      {
        img1: "/images/t-shirts/t-shirt-3.png",
        img2: "/images/t-shirts/t-shirt-3.1.png",
      },
    ],
  },
  {
    title: "Noctra Oversized Tee",
    img1: "/images/caps/cap-1.png",
    img2: "/images/caps/cap-1.1.jpg",
    price: 1299,
    variants: [
      {
        img1: "/images/t-shirts/t-shirt-2.png",
        img2: "/images/t-shirts/t-shirt-2.1.png",
      },
      {
        img1: "/images/t-shirts/t-shirt-3.png",
        img2: "/images/t-shirts/t-shirt-3.1.png",
      },
    ],
  },
  {
    title: "Void Graphic Hoodie",
    img1: "/images/t-shirts/t-shirt-4.png",
    img2: "/images/t-shirts/t-shirt-4.1.jpg",
    price: 2599,
    variants: [
      {
        img1: "/images/t-shirts/t-shirt-2.png",
        img2: "/images/t-shirts/t-shirt-2.1.png",
      },
      {
        img1: "/images/t-shirts/t-shirt-3.png",
        img2: "/images/t-shirts/t-shirt-3.1.png",
      },
    ],
  },
  {
    title: "Cybercore Baggy Denim",
    img1: "/images/t-shirts/t-shirt-5.png",
    img2: "/images/t-shirts/t-shirt-5.1.png",
    price: 2799,
    variants: [
      {
        img1: "/images/t-shirts/t-shirt-2.png",
        img2: "/images/t-shirts/t-shirt-2.1.png",
      },
      {
        img1: "/images/t-shirts/t-shirt-3.png",
        img2: "/images/t-shirts/t-shirt-3.1.png",
      },
    ],
  },
  {
    title: "Nebula Street Jacket",
    img1: "/images/caps/cap-2.jpg",
    img2: "/images/caps/cap-2.1.jpg",
    price: 3299,
    variants: [
      {
        img1: "/images/t-shirts/t-shirt-2.png",
        img2: "/images/t-shirts/t-shirt-2.1.png",
      },
      {
        img1: "/images/t-shirts/t-shirt-3.png",
        img2: "/images/t-shirts/t-shirt-3.1.png",
      },
    ],
  },
  {
    title: "Y2K Flame Long Sleeve",
    img1: "/images/hats/hat-1.png",
    img2: "/images/hats/hat-1.1.jpg",
    price: 1499,
    variants: [
      {
        img1: "/images/t-shirts/t-shirt-2.png",
        img2: "/images/t-shirts/t-shirt-2.1.png",
      },
      {
        img1: "/images/t-shirts/t-shirt-3.png",
        img2: "/images/t-shirts/t-shirt-3.1.png",
      },
    ],
  },
  {
    title: "Chrome Skull Hoodie",
    img1: "/images/caps/cap-3.png",
    img2: "/images/caps/cap-3.1.jpg",
    price: 2699,
    variants: [
      {
        img1: "/images/t-shirts/t-shirt-2.png",
        img2: "/images/t-shirts/t-shirt-2.1.png",
      },
      {
        img1: "/images/t-shirts/t-shirt-3.png",
        img2: "/images/t-shirts/t-shirt-3.1.png",
      },
    ],
  },
  {
    title: "Zone Signature Cargo",
    img1: "/images/shorts/short-1.png",
    img2: "/images/shorts/short-1.1.jpg",
    price: 2999,
    variants: [
      {
        img1: "/images/t-shirts/t-shirt-2.png",
        img2: "/images/t-shirts/t-shirt-2.1.png",
      },
      {
        img1: "/images/t-shirts/t-shirt-3.png",
        img2: "/images/t-shirts/t-shirt-3.1.png",
      },
    ],
  },
  {
    title: "Xyden Unisex Straight Fit Baggy Pants",
    img1: "/images/jeans/jean-1.jpg",
    img2: "/images/jeans/jean-1.1.jpg",
    price: 1699,
    variants: [
      {
        img1: "/images/t-shirts/t-shirt-2.png",
        img2: "/images/t-shirts/t-shirt-2.1.png",
      },
      {
        img1: "/images/t-shirts/t-shirt-3.png",
        img2: "/images/t-shirts/t-shirt-3.1.png",
      },
    ],
  },
  {
    title: "Reaven Black Unisex Zipper Hoodie",
    img1: "/images/jeans/jean-2.png",
    img2: "/images/jeans/jean-2.1.jpg",
    price: 2399,
    variants: [
      {
        img1: "/images/t-shirts/t-shirt-2.png",
        img2: "/images/t-shirts/t-shirt-2.1.png",
      },
      {
        img1: "/images/t-shirts/t-shirt-3.png",
        img2: "/images/t-shirts/t-shirt-3.1.png",
      },
    ],
  },
];

/* ================= FORMAT PRICE ================= */

function formatCRC(number) {
  return "₡ " + number.toLocaleString("es-CR");
}

/* ================= CREATE CARD ================= */

function createProductCard(product, index) {
  const variantsHTML =
    product.variants && product.variants.length
      ? `
        <div class="product-variants">
          ${product.variants
            .map(
              (variant) => `
    <img 
      src="${variant.img1}" 
      class="variant-circle" 
      data-img1="${variant.img1}"
      data-img2="${variant.img2}"
    >
  `,
            )
            .join("")}
        </div>
      `
      : "";

  return `
    <product-card class="arrival-card" data-index="${index}">

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

        ${variantsHTML}

      </div>

    </product-card>
  `;
}

/* ================= RENDER PRODUCTS ================= */

function renderProducts() {
  const container = document.getElementById("arrivalList");

  if (!container) return;

  container.innerHTML = products
    .map((product, index) => createProductCard(product, index))
    .join("");
}

/* ================= VARIANT CLICK EVENT ================= */

document.addEventListener("click", function (e) {
  if (!e.target.classList.contains("variant-circle")) return;

  const newImg1 = e.target.dataset.img1;
  const newImg2 = e.target.dataset.img2;

  const card = e.target.closest(".arrival-card");

  const primaryImg = card.querySelector(".product-card__image--primary");
  const secondaryImg = card.querySelector(".product-card__image--secondary");

  primaryImg.src = newImg1;
  secondaryImg.src = newImg2;
});

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", renderProducts);
