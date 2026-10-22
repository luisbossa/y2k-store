/* ================= HOME ================= */

import { mountLayout } from "../components/layout.js";
import { initFeatured } from "../components/featured.js";
import { renderGrid, bindSwatches } from "../components/product-card.js";
import { initLazyVideos } from "../components/lazy-video.js";
import { initCountdown } from "../components/countdown.js";
import { initNewsletter } from "../components/newsletter.js";
import { HeroSlider } from "../components/hero-slider.js";
import { newArrivals, PRODUCTS, matchesGender } from "../data/catalog.js";

mountLayout();
initFeatured();

const arrivals = document.getElementById("arrivalList");
if (arrivals) {
  renderGrid(arrivals, newArrivals().slice(0, 12));
  bindSwatches(arrivals);
}

// Cantidad real de productos en cada colección (Mujer / Hombre)
document.querySelectorAll("[data-gender-count]").forEach((el) => {
  const count = PRODUCTS.filter((p) => matchesGender(p, el.dataset.genderCount)).length;
  el.textContent = `${count} productos`;
});

initLazyVideos();
initCountdown();
initNewsletter();

const heroCanvas = document.getElementById("heroCanvas");
if (heroCanvas && window.Curtains) {
  new HeroSlider(heroCanvas, {
    autoplay: true,
    autoplayDelay: 6,
    duration: 1,
    easing: "easeInOutQuint",
    transition: "displacement",
  });
}
