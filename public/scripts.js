const themeBtn = document.getElementById("theme-toggle");
const themeIco = document.getElementById("theme-ico");
const body = document.body;

const savedTheme = localStorage.getItem("theme") || "dark";
body.setAttribute("data-theme", savedTheme);
themeIco.textContent = savedTheme === "light" ? "☀️" : "🌙";

themeBtn.addEventListener("click", () => {
  const next = body.getAttribute("data-theme") === "dark" ? "light" : "dark";
  body.setAttribute("data-theme", next);
  themeIco.textContent = next === "light" ? "☀️" : "🌙";
  localStorage.setItem("theme", next);
});

const words = ["Mau", "Mauricio", "mau.dev", "dev creativo"];
let i = 0, j = 0, deleting = false;
const typed = document.getElementById("typed");

function type() {
  const current = words[i];
  typed.textContent = deleting ? current.substring(0, j--) : current.substring(0, j++);

  if (!deleting && j === current.length + 2) {
    deleting = true;
    setTimeout(type, 900);
    return;
  }
  if (deleting && j === 0) {
    deleting = false;
    i = (i + 1) % words.length;
  }
  setTimeout(type, deleting ? 60 : 110);
}
type();

const revealEls = document.querySelectorAll("[data-reveal]");
function revealCheck() {
  revealEls.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 80) el.classList.add("is-visible");
  });
}
window.addEventListener("scroll", revealCheck);
revealCheck();

let lastScroll = 0;
const header = document.getElementById("site-header");

window.addEventListener("scroll", () => {
  const current = window.scrollY;
  header.classList.toggle("hidden", current > lastScroll && current > 120);
  lastScroll = current;
});

document.getElementById("hireBtn")?.addEventListener("click", () => {
  window.location.href = "#contact";
});

const API = "/api/testimonios";
const lista = document.getElementById("listaTestimonios");
const admin = document.getElementById("admin-testimonios");
const form = document.getElementById("formTestimonio");
const msg = document.getElementById("msg");

function escape(s = "") {
  return s.replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}

function estrellas(n) {
  const full = Math.max(1, Math.min(5, Number(n) || 1));
  return `<div class="test-stars" aria-label="Valoración: ${full} de 5">
      ${Array.from({ length: 5 }, (_, i) => `
        <span class="star ${i < full ? "animate" : ""}">
          ${i < full ? "★" : "☆"}
        </span>`).join("")}
    </div>`;
}

function render(data = []) {
  lista.innerHTML = data.map(t => `
    <article class="testimonio">
      ${t.foto ? `<div class="test-img"><img src="${escape(t.foto)}" alt="${escape(t.nombre)}"></div>` : `<div class="test-img" aria-hidden></div>`}
      <div class="test-content">
        <div style="display:flex;justify-content:space-between;align-items:start;">
          <div>
            <strong>${escape(t.nombre)}</strong>
            <div class="test-time">${new Date(t.fecha).toLocaleString()}</div>
          </div>
          ${estrellas(t.rating)}
        </div>
        <p style="margin-top:8px">${escape(t.mensaje)}</p>
      </div>
    </article>
  `).join("");

  admin.innerHTML = data.map(t => `
    <div class="card">
      <strong>${escape(t.nombre)}</strong>
      <p>${escape(t.mensaje)}</p>
      <button class="btn btn-ghost" onclick="eliminarTestimonio(${t.id})">Eliminar</button>
    </div>
  `).join("");
}

async function cargar() {
  try {
    const res = await fetch(API);
    const data = await res.json();
    render(data);
  } catch (e) {
    lista.innerHTML = `<p class="site-sub">Error al cargar testimonios.</p>`;
  }
}

async function enviar(payload) {
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) return cargar();
  } catch (e) {}
}

window.eliminarTestimonio = async function (id) {
  try {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    cargar();
  } catch (e) {}
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();
  const foto = document.getElementById("foto")?.value.trim() || "";
  const rating = document.getElementById("rating").value;

  if (!nombre || !mensaje) return;

  const payload = {
    nombre,
    mensaje,
    foto,
    rating,
    fecha: new Date().toISOString()
  };

  enviar(payload);
  msg.textContent = "¡Gracias por tu testimonio!";
  form.reset();
  setTimeout(() => msg.textContent = "", 2000);
});

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === "m") {
    document.getElementById("admin-panel").style.display = "block";
  }
});

/* -------------------------------------------------------------
   🔥 FIX — BLOQUE NUEVO PARA QUE EL CARGADO FUNCIONE CORRECTO
--------------------------------------------------------------*/

function escapeHtml(s = "") {
  return s.replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}

function buildStars(n) {
  const full = Math.max(1, Math.min(5, Number(n) || 1));
  return `
    <div class="test-stars">
      ${Array.from({ length: 5 }, (_, i) => `
        <span class="star ${i < full ? "animate" : ""}">
          ${i < full ? "★" : "☆"}
        </span>`).join("")}
    </div>
  `;
}

function renderNuevo(data = []) {
  lista.innerHTML = data.map(t => `
    <article class="testimonio" role="article" aria-label="Testimonio de ${escapeHtml(t.nombre)}">
      <div class="test-header">
        <div class="test-info">
          ${t.foto 
            ? `<div class="test-img"><img src="${escapeHtml(t.foto)}" alt="${escapeHtml(t.nombre)}"></div>`
            : `<div class="test-img" aria-hidden></div>`}
          <div>
            <strong>${escapeHtml(t.nombre)}</strong>
            <div class="test-time">${new Date(t.fecha).toLocaleDateString()}</div>
          </div>
        </div>
        ${buildStars(t.rating)}
      </div>
      <p>${escapeHtml(t.mensaje)}</p>
    </article>
  `).join("");
}

async function cargarSeguro() {
  try {
    const res = await fetch(API);
    const data = await res.json();
    render(data);     
    renderNuevo(data); 
  } catch (e) {
    console.error("Error al cargar testimonios:", e);
    lista.innerHTML = `<p>Error al cargar testimonios.</p>`;
  }
}

cargarSeguro();
