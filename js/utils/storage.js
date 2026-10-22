/* ================= STORAGE =================
   localStorage con JSON y tolerante a fallos (modo privado, cuota llena…). */

const memory = new Map();

export function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return memory.has(key) ? memory.get(key) : fallback;
  }
}

export function write(key, value) {
  memory.set(key, value);
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Sin storage: el dato vive en memoria durante esta visita.
  }
}

export function remove(key) {
  memory.delete(key);
  try {
    localStorage.removeItem(key);
  } catch {}
}

/** Pequeño store observable sobre una clave de storage. */
export function createStore(key, initial) {
  let state = read(key, initial);
  const listeners = new Set();

  const notify = () => listeners.forEach((fn) => fn(state));

  // Sincroniza entre pestañas.
  window.addEventListener("storage", (e) => {
    if (e.key !== key) return;
    state = read(key, initial);
    notify();
  });

  return {
    get: () => state,
    set(next) {
      state = typeof next === "function" ? next(state) : next;
      write(key, state);
      notify();
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}
