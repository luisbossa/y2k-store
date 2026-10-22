/* ================= DROP COUNTDOWN =================
   <div data-countdown="2026-11-14T20:00:00-06:00"> con hijos [data-unit="days|hours|minutes|seconds"]. */

const UNITS = {
  days: 86_400_000,
  hours: 3_600_000,
  minutes: 60_000,
  seconds: 1000,
};

const pad = (n) => String(n).padStart(2, "0");

export function initCountdown() {
  document.querySelectorAll("[data-countdown]").forEach((root) => {
    const target = new Date(root.dataset.countdown).getTime();
    if (Number.isNaN(target)) return;

    const fields = Object.keys(UNITS).map((unit) => [unit, root.querySelector(`[data-unit="${unit}"]`)]);
    const section = root.closest("section");
    let timer;

    function tick() {
      let remaining = Math.max(0, target - Date.now());

      fields.forEach(([unit, el]) => {
        const value = Math.floor(remaining / UNITS[unit]);
        remaining -= value * UNITS[unit];
        if (el && el.textContent !== pad(value)) el.textContent = pad(value);
      });

      if (target <= Date.now()) {
        clearInterval(timer);
        section?.classList.add("is-live");
      }
    }

    tick();
    timer = setInterval(tick, 1000);
  });
}
