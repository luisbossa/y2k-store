/* ================= LOGO 3D =================
   El video del logo trae un fondo gris liso (#c4c4c4) que no se puede quitar de un MP4.
   Cada frame se dibuja en un <canvas> y se vuelve transparente SÓLO el fondo conectado
   a los bordes (flood fill), así los tonos plateados del propio logo no se agujerean.
   Si algo falla, se muestra el video tal cual. */

const TOLERANCE = 22; // diferencia máx. por canal para considerar un píxel "fondo"
const FEATHER = 48; // rango para suavizar el contorno (anti-halo)
const SKIP_START = 0.033; // el primer frame del video está vacío

/** Pone alpha 0 al fondo conectado a los bordes y suaviza el contorno. */
function keyOutBackground(data, w, h) {
  const bgR = data[0];
  const bgG = data[1];
  const bgB = data[2];
  const diff = (i) => Math.max(Math.abs(data[i] - bgR), Math.abs(data[i + 1] - bgG), Math.abs(data[i + 2] - bgB));

  const visited = new Uint8Array(w * h);
  const stack = new Int32Array(w * h);
  let top = 0;

  const push = (p) => {
    if (!visited[p] && diff(p * 4) <= TOLERANCE) {
      visited[p] = 1;
      stack[top++] = p;
    }
  };

  for (let x = 0; x < w; x++) {
    push(x);
    push((h - 1) * w + x);
  }
  for (let y = 0; y < h; y++) {
    push(y * w);
    push(y * w + w - 1);
  }

  while (top) {
    const p = stack[--top];
    data[p * 4 + 3] = 0;
    const x = p % w;
    if (x > 0) push(p - 1);
    if (x < w - 1) push(p + 1);
    if (p >= w) push(p - w);
    if (p < w * (h - 1)) push(p + w);
  }

  // Contorno: los píxeles pegados al fondo se vuelven semitransparentes según cuánto se parecen al gris.
  for (let p = 0; p < w * h; p++) {
    if (visited[p]) continue;
    const x = p % w;
    const touchesBg = (x > 0 && visited[p - 1]) || (x < w - 1 && visited[p + 1]) || (p >= w && visited[p - w]) || (p < w * (h - 1) && visited[p + w]);
    if (touchesBg) data[p * 4 + 3] = Math.min(255, Math.round((diff(p * 4) / FEATHER) * 255));
  }
}

export function initLogo() {
  const video = document.getElementById("logoVideo");
  const canvas = document.getElementById("logoCanvas");
  if (!video || !canvas) return;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  let failed = false;

  const fallback = () => {
    failed = true;
    canvas.hidden = true;
    video.classList.add("is-fallback");
  };

  function resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.round(canvas.clientWidth * dpr);
    if (!width || !video.videoWidth) return;
    canvas.width = width;
    canvas.height = Math.round((width * video.videoHeight) / video.videoWidth);
  }

  function draw() {
    if (failed || video.readyState < 2) return;
    if (!canvas.width) resize();
    const { width, height } = canvas;
    try {
      ctx.drawImage(video, 0, 0, width, height);
      const frame = ctx.getImageData(0, 0, width, height);
      keyOutBackground(frame.data, width, height);
      ctx.putImageData(frame, 0, 0);
      canvas.classList.add("is-ready");
    } catch {
      fallback();
    }
  }

  // Un frame por frame de video cuando el navegador lo soporta; si no, por animation frame.
  if ("requestVideoFrameCallback" in HTMLVideoElement.prototype) {
    const onFrame = () => {
      draw();
      if (!failed) video.requestVideoFrameCallback(onFrame);
    };
    video.requestVideoFrameCallback(onFrame);
  } else {
    const loop = () => {
      draw();
      if (!failed) requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  // Siempre girando: loop saltando el frame vacío y reintento si el navegador lo pausa.
  const play = () => video.play().catch(() => {});
  video.addEventListener("ended", () => {
    video.currentTime = SKIP_START;
    play();
  });
  video.addEventListener("loadedmetadata", resize);
  video.addEventListener("pause", () => {
    if (!video.ended && !document.hidden) play();
  });
  document.addEventListener("visibilitychange", () => !document.hidden && play());
  // Algunos móviles bloquean el autoplay hasta la primera interacción.
  ["pointerdown", "touchstart", "keydown"].forEach((evt) => window.addEventListener(evt, play, { once: true, passive: true }));
  window.addEventListener("resize", resize, { passive: true });

  if (video.readyState >= 1) resize();
  play();
}
