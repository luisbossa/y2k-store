new Slider("c", {
  autoplay: true,
  autoplayTimer: 6,
  duration: 1,
  easeType: 12,
  type: 0,
});

const indicators = document.querySelectorAll(".indicator");
let current = 0;
const autoplayTime = 6000; 

function activateIndicator(index) {
  indicators.forEach((ind) => {
    ind.classList.remove("active");
    const bar = ind.querySelector("::after");
    ind.style.animation = "none";
    void ind.offsetWidth;
  });

  indicators[index].classList.add("active");
}

activateIndicator(current);

setInterval(() => {
  current = (current + 1) % indicators.length;
  activateIndicator(current);
}, autoplayTime);
