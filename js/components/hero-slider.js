/* ================= HERO SLIDER (WebGL) =================
   Transición entre imágenes con un mapa de desplazamiento usando curtains.js
   (cargado como script global en index.html: Curtains, Plane). */

const EASINGS = {
  linear: (t) => t,
  easeInQuad: (t) => t * t,
  easeOutQuad: (t) => t * (2 - t),
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => --t * t * t + 1,
  easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  easeInQuart: (t) => t * t * t * t,
  easeOutQuart: (t) => 1 - --t * t * t * t,
  easeInOutQuart: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
  easeInQuint: (t) => t * t * t * t * t,
  easeOutQuint: (t) => 1 + --t * t * t * t * t,
  easeInOutQuint: (t) => (t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t),
};

const VERTEX_SHADER = `
  precision mediump float;
  attribute vec3 aVertexPosition;
  attribute vec2 aTextureCoord;
  uniform mat4 uMVMatrix;
  uniform mat4 uPMatrix;
  uniform mat4 activeTexMatrix;
  uniform mat4 nextTexMatrix;
  varying vec3 vVertexPosition;
  varying vec2 vTextureCoord;
  varying vec2 vActiveTextureCoord;
  varying vec2 vNextTextureCoord;

  void main() {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vTextureCoord = aTextureCoord;
    vActiveTextureCoord = (activeTexMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
    vNextTextureCoord = (nextTexMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
    vVertexPosition = aVertexPosition;
  }
`;

const FRAGMENT_HEADER = `
  precision mediump float;
  varying vec3 vVertexPosition;
  varying vec2 vTextureCoord;
  varying vec2 vActiveTextureCoord;
  varying vec2 vNextTextureCoord;
  uniform float uTime;
  uniform float uDuration;
  uniform float uDirection;
  uniform sampler2D activeTex;
  uniform sampler2D nextTex;
  uniform sampler2D displacement;
`;

// Cada transición: shader de fragmento + multiplicador de tiempo usado en onRender.
const TRANSITIONS = {
  // Desplazamiento vertical guiado por la textura "displacement".
  displacement: {
    timerMultiplier: 1,
    fragment: `${FRAGMENT_HEADER}
      void main() {
        float tm = uTime;
        vec4 displacementTexture = texture2D(displacement, vTextureCoord);

        float factFirst = ((cos((tm + uDuration) / (uDuration / 3.141592)) + 1.0) / 1.25);
        float factSecon = ((cos(tm / (uDuration / 3.141592)) + 1.0) / 1.25);

        vec2 firstDisplacementCoords = vActiveTextureCoord + displacementTexture.r * factFirst;
        vec2 secondDisplacementCoords = vNextTextureCoord - displacementTexture.r * factSecon;

        vec4 firstDistortedColor = texture2D(activeTex, vec2(vActiveTextureCoord.x, firstDisplacementCoords.y));
        vec4 secondDistortedColor = texture2D(nextTex, vec2(vNextTextureCoord.x, secondDisplacementCoords.y));

        float factor = 1.0 - ((cos(uTime / (uDuration / 3.141592)) + 1.0) / 2.0);
        vec4 finalColor = mix(firstDistortedColor, secondDistortedColor, factor);
        gl_FragColor = vec4(finalColor.rgb * finalColor.a, finalColor.a);
      }
    `,
  },
  // Transición por diferencia de color entre píxeles.
  pixelDistance: {
    timerMultiplier: 0,
    fragment: `${FRAGMENT_HEADER}
      void main() {
        vec4 firstColor = texture2D(activeTex, vTextureCoord);
        vec4 secondColor = texture2D(nextTex, vTextureCoord);
        float m = step(distance(secondColor, firstColor) / 2.0, uTime);
        vec4 finalColor = mix(firstColor, secondColor, m);
        gl_FragColor = vec4(finalColor.rgb * finalColor.a, finalColor.a);
      }
    `,
  },
};

const DEFAULTS = {
  autoplay: true,
  autoplayDelay: 6, // segundos entre slides
  duration: 1, // segundos de transición
  easing: "easeInOutQuint",
  transition: "displacement",
};

const FPS = 60;

export class HeroSlider {
  constructor(container, options = {}) {
    const opt = { ...DEFAULTS, ...options };

    // Respeta la preferencia del usuario de reducir animaciones.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) opt.autoplay = false;

    this.opt = opt;
    this.container = container;
    this.ease = EASINGS[opt.easing] ?? EASINGS.linear;
    this.transition = TRANSITIONS[opt.transition] ?? TRANSITIONS.displacement;
    this.frames = opt.duration * FPS;

    this.controls = [...document.querySelectorAll(".ctrlbtn")];
    this.slideCount = document.querySelectorAll(".slide-images").length;
    this.isAnimating = false;
    this.autoplayId = null;

    // Índice 0 es la textura de desplazamiento; los slides van de 1 a slideCount.
    this.state = { active: 1, next: 2, frame: 0 };

    this.curtains = new Curtains({
      container,
      watchScroll: false,
      pixelRatio: Math.min(1.5, window.devicePixelRatio),
    });
    this.curtains.disableDrawing();

    this.plane = new Plane(this.curtains, document.querySelector(".wrap"), {
      vertexShader: VERTEX_SHADER,
      fragmentShader: this.transition.fragment,
      widthSegments: 1,
      heightSegments: 1,
      uniforms: {
        time: { name: "uTime", type: "1f", value: 0 },
        duration: { name: "uDuration", type: "1f", value: this.frames },
        direction: { name: "uDirection", type: "1f", value: 0 },
      },
    });

    this.bindPlane();
  }

  bindPlane() {
    this.plane
      .onLoading((tex) => tex.setMinFilter(this.curtains.gl.LINEAR_MIPMAP_NEAREST))
      .onReady(() => {
        this.activeTex = this.plane.createTexture({
          sampler: "activeTex",
          fromTexture: this.plane.textures[this.state.active],
        });
        this.nextTex = this.plane.createTexture({
          sampler: "nextTex",
          fromTexture: this.plane.textures[this.state.next],
        });

        // controls[0] = anterior, controls[1] = siguiente
        this.controls.forEach((btn, i) => {
          btn.addEventListener("click", () => {
            this.slide(i === 1);
            this.restartAutoplay();
          });
        });

        this.buildDots();
        this.bindSwipe();
        this.startAutoplay();
        document.addEventListener("visibilitychange", () =>
          document.hidden ? this.stopAutoplay() : this.startAutoplay(),
        );
      })
      .onRender(() => this.renderFrame());
  }

  renderFrame() {
    if (!this.isAnimating) return;

    const { state } = this;
    state.frame++;

    const progress = this.ease(state.frame / this.frames);
    this.plane.uniforms.time.value = progress * (1 + state.frame * this.transition.timerMultiplier);

    if (state.frame >= this.frames) {
      this.curtains.disableDrawing();
      this.isAnimating = false;
      state.active = state.next;
      this.activeTex.setSource(this.plane.images[state.active]);
      state.frame = 0;
    }
  }

  slide(forward) {
    const { active } = this.state;
    const max = this.slideCount;
    this.goTo(forward ? (active % max) + 1 : ((active - 2 + max) % max) + 1);
  }

  /** Va a un slide concreto (1..slideCount). */
  goTo(index) {
    if (this.isAnimating || index === this.state.active) return;

    this.state.next = index;
    this.isAnimating = true;
    this.nextTex.setSource(this.plane.images[index]);
    this.curtains.enableDrawing();
    this.updateDots(index);
  }

  /* ================= INDICADOR ================= */

  buildDots() {
    const hero = this.container.closest(".hero");
    if (!hero) return;
    const pad = (n) => String(n).padStart(2, "0");
    this.dots = document.createElement("div");
    this.dots.className = "hero-dots";
    this.dots.setAttribute("role", "group");
    this.dots.setAttribute("aria-label", "Elegir imagen");
    // Duración del relleno de la píldora activa = tiempo hasta el próximo cambio automático.
    this.dots.style.setProperty("--hero-delay", `${this.opt.autoplayDelay}s`);
    this.dots.classList.toggle("is-autoplay", this.opt.autoplay);
    this.dots.innerHTML = `
      <span class="hero-counter" aria-hidden="true"><strong data-hero-current>01</strong> / ${pad(this.slideCount)}</span>
      <span class="hero-dot-list">
        ${Array.from(
          { length: this.slideCount },
          (_, i) => `<button type="button" class="hero-dot" data-slide="${i + 1}" aria-label="Imagen ${i + 1} de ${this.slideCount}"><span></span></button>`,
        ).join("")}
      </span>`;
    hero.append(this.dots);

    this.dots.addEventListener("click", (e) => {
      const dot = e.target.closest("[data-slide]");
      if (!dot) return;
      this.goTo(Number(dot.dataset.slide));
      this.restartAutoplay();
    });
    this.updateDots(this.state.active);
  }

  updateDots(index) {
    if (!this.dots) return;
    this.dots.querySelector("[data-hero-current]").textContent = String(index).padStart(2, "0");
    this.dots.querySelectorAll(".hero-dot").forEach((dot) => {
      const current = Number(dot.dataset.slide) === index;
      dot.classList.toggle("is-active", current);
      dot.setAttribute("aria-current", String(current));
      // Reinicia la animación de relleno en la píldora activa.
      if (current) {
        const fill = dot.firstElementChild;
        fill.style.animation = "none";
        void fill.offsetWidth;
        fill.style.animation = "";
      }
    });
  }

  /* ================= SWIPE ================= */

  /** Deslizar con el dedo (o arrastrar con el mouse) cambia de imagen sin bloquear el scroll vertical. */
  bindSwipe() {
    const hero = this.container.closest(".hero");
    if (!hero) return;
    const THRESHOLD = 40;
    let start = null;

    hero.addEventListener(
      "pointerdown",
      (e) => {
        if (e.target.closest("a, button")) return;
        start = { x: e.clientX, y: e.clientY };
      },
      { passive: true },
    );

    const end = (e) => {
      if (!start) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      start = null;
      // Sólo cuenta como swipe si el gesto es claramente horizontal.
      if (Math.abs(dx) < THRESHOLD || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      this.slide(dx < 0);
      this.restartAutoplay();
    };

    hero.addEventListener("pointerup", end, { passive: true });
    hero.addEventListener("pointercancel", () => (start = null), { passive: true });
  }

  startAutoplay() {
    if (!this.opt.autoplay || this.autoplayId) return;
    this.autoplayId = setInterval(() => this.slide(true), this.opt.autoplayDelay * 1000);
  }

  stopAutoplay() {
    clearInterval(this.autoplayId);
    this.autoplayId = null;
  }

  restartAutoplay() {
    this.stopAutoplay();
    this.startAutoplay();
  }
}
