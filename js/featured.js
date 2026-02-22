document.addEventListener("DOMContentLoaded", () => {
  const featuredProducts = [
    // PANTS
    {
      title: "Witch Baggy Pants",
      category: "pants",
      img1: "/images/pants/pant-1.png",
      img2: "/images/pants/pant-1.1.jpg",
      price: 1799,
    },
    {
      title: "Scripture Grey Pants",
      category: "pants",
      img1: "/images/pants/pant-2.png",
      img2: "/images/pants/pant-2.1.jpg",
      price: 1699,
    },
    {
      title: "Stryk Utility Pants",
      category: "pants",
      img1: "/images/pants/pant-3.png",
      img2: "/images/pants/pant-3.1.jpg",
      price: 1899,
    },
    {
      title: "Stryk Utility Pants",
      category: "pants",
      img1: "/images/pants/pant-4.png",
      img2: "/images/pants/pant-4.1.jpg",
      price: 1899,
    },

    // HOODIES
    {
      title: "Void Oversized Hoodie",
      category: "hoodies",
      img1: "/images/hoodies/hoodie-1.png",
      img2: "/images/hoodies/hoodie-1.1.jpg",
      price: 2399,
    },
    {
      title: "Chrome Skull Hoodie",
      category: "hoodies",
      img1: "/images/hoodies/hoodie-2.png",
      img2: "/images/hoodies/hoodie-2.1.jpg",
      price: 2599,
    },
    {
      title: "Void Oversized Hoodie",
      category: "hoodies",
      img1: "/images/hoodies/hoodie-3.png",
      img2: "/images/hoodies/hoodie-3.1.jpg",
      price: 2399,
    },
    {
      title: "Chrome Skull Hoodie",
      category: "hoodies",
      img1: "/images/hoodies/hoodie-4.png",
      img2: "/images/hoodies/hoodie-4.1.jpg",
      price: 2599,
    },

    // CAPS
    {
      title: "Nebula Tactical Vest",
      category: "caps",
      img1: "/images/caps/cap-1.png",
      img2: "/images/caps/cap-1.1.jpg",
      price: 1999,
    },
    {
      title: "Nebula Tactical Vest",
      category: "caps",
      img1: "/images/caps/cap-2.jpg",
      img2: "/images/caps/cap-2.1.jpg",
      price: 1999,
    },
    {
      title: "Nebula Tactical Vest",
      category: "caps",
      img1: "/images/caps/cap-3.png",
      img2: "/images/caps/cap-3.1.jpg",
      price: 1999,
    },
    {
      title: "Nebula Tactical Vest",
      category: "caps",
      img1: "/images/caps/cap-4.png",
      img2: "/images/caps/cap-4.1.jpg",
      price: 1999,
    },

    // TSHIRTS
    {
      title: "Y2K Flame Tee",
      category: "tshirts",
      img1: "/images/t-shirts/t-shirt-1.png",
      img2: "/images/t-shirts/t-shirt-1.1.jpg",
      price: 1299,
    },
    {
      title: "Zone Signature Tee",
      category: "tshirts",
      img1: "/images/t-shirts/t-shirt-2.png",
      img2: "/images/t-shirts/t-shirt-2.1.jpg",
      price: 1399,
    },
    {
      title: "Y2K Flame Tee",
      category: "tshirts",
      img1: "/images/t-shirts/t-shirt-3.png",
      img2: "/images/t-shirts/t-shirt-3.1.jpg",
      price: 1299,
    },
    {
      title: "Zone Signature Tee",
      category: "tshirts",
      img1: "/images/t-shirts/t-shirt-4.png",
      img2: "/images/t-shirts/t-shirt-4.1.jpg",
      price: 1399,
    },

    // HATS
    {
      title: "Cyber Baby Tee",
      category: "hats",
      img1: "/images/hats/hat-1.png",
      img2: "/images/hats/hat-1.1.jpg",
      price: 1199,
    },
    {
      title: "Cyber Baby Tee",
      category: "hats",
      img1: "/images/hats/hat-2.png",
      img2: "/images/hats/hat-2.1.jpg",
      price: 1199,
    },
    {
      title: "Cyber Baby Tee",
      category: "hats",
      img1: "/images/hats/hat-3.png",
      img2: "/images/hats/hat-3.1.jpg",
      price: 1199,
    },
    {
      title: "Cyber Baby Tee",
      category: "hats",
      img1: "/images/hats/hat-4.png",
      img2: "/images/hats/hat-4.1.jpg",
      price: 1199,
    },
  ];

  const slider = document.getElementById("featuredSlider");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const prevBtn = document.querySelector(".slider-prev");
  const nextBtn = document.querySelector(".slider-next");

  function formatCRC(num) {
    return "₡ " + num.toLocaleString("es-CR");
  }

  function renderProducts(category) {
    slider.classList.add("fade-out");

    setTimeout(() => {
      slider.innerHTML = "";

      const filtered = featuredProducts.filter((p) => p.category === category);

      filtered.forEach((product) => {
        slider.innerHTML += `
          <div class="product-card">
            <div class="product-image ${product.category}">
              <img src="${product.img1}" class="primary">
              <img src="${product.img2}" class="secondary">
            </div>
              <div class="product-card__info">
              <div class="product-title h6">${product.title}</div>
              <div class="price-list">${formatCRC(product.price)}</div>
            </div>
          </div>
        `;
      });

      slider.scrollLeft = 0;
      slider.classList.remove("fade-out");
    }, 200);
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderProducts(btn.dataset.category);
    });
  });

  prevBtn.addEventListener("click", () => {
    slider.scrollBy({ left: -320, behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    slider.scrollBy({ left: 320, behavior: "smooth" });
  });

  renderProducts("pants");
});
