/* ================= LAZY VIDEO =================
   Descarga y reproduce los <video data-lazy-video> sólo cuando entran en pantalla,
   y los pausa al salir para no gastar CPU/batería. */

function load(video) {
  video.querySelectorAll("source[data-src]").forEach((source) => {
    source.src = source.dataset.src;
    source.removeAttribute("data-src");
  });
  video.load();
}

export function initLazyVideos() {
  const videos = document.querySelectorAll("video[data-lazy-video]");
  if (!videos.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target: video, isIntersecting }) => {
        if (!isIntersecting) {
          video.pause();
          return;
        }
        if (video.querySelector("source[data-src]")) load(video);
        if (!reduceMotion) video.play().catch(() => {});
      });
    },
    { rootMargin: "200px 0px" },
  );

  videos.forEach((video) => observer.observe(video));
}
