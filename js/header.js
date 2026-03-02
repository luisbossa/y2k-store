const menu = document.getElementById("mobileMenu");
const btn = document.getElementById("hamburgerBtn");
const overlay = document.getElementById("mobileOverlay");
const mobileClose = document.getElementById("mobileClose");

const searchPanel = document.getElementById("searchPanel");
const searchBtn = document.querySelector(".fa-search");
const searchOverlay = document.getElementById("searchOverlay");
const searchClose = document.getElementById("searchClose");

/* MOBILE MENU */
btn.addEventListener("click", () => {
  menu.classList.toggle("is-open");
  btn.classList.toggle("active");
});

overlay.addEventListener("click", closeMenu);
mobileClose.addEventListener("click", closeMenu);

function closeMenu() {
  menu.classList.remove("is-open");
  btn.classList.remove("active");
}

/* SEARCH */
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  searchPanel.classList.add("is-open");
});

searchOverlay.addEventListener("click", closeSearch);
searchClose.addEventListener("click", closeSearch);

function closeSearch() {
  searchPanel.classList.remove("is-open");
}

/* STICKY EFFECT */
window.addEventListener("scroll", () => {
  document
    .querySelector(".site-header")
    .classList.toggle("is-scrolled", window.scrollY > 20);
});

const logoVideo = document.getElementById("logoVideo");

logoVideo.addEventListener("ended", () => {
  logoVideo.currentTime = 0.033; 
  logoVideo.play();
});
