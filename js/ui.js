// Huellitas · utilidades de interfaz

export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

export function fechaCorta(iso) {
  if (!iso) return "—";
  const [a, m, d] = iso.split("-").map(Number);
  return `${d} ${MESES[m - 1]} ${a}`;
}

export function fechaLarga(iso) {
  const d = new Date(iso + "T12:00:00");
  return `${DIAS[d.getDay()]} ${d.getDate()} de ${["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"][d.getMonth()]}`;
}

export function edad(nacimiento) {
  if (!nacimiento) return "Edad desconocida";
  const n = new Date(nacimiento + "T12:00:00");
  const ahora = new Date();
  let meses = (ahora.getFullYear() - n.getFullYear()) * 12 + ahora.getMonth() - n.getMonth();
  if (ahora.getDate() < n.getDate()) meses--;
  if (meses < 1) return "Menos de 1 mes";
  if (meses < 12) return `${meses} ${meses === 1 ? "mes" : "meses"}`;
  const anios = Math.floor(meses / 12);
  return `${anios} ${anios === 1 ? "año" : "años"}`;
}

export const ESPECIES = ["Perro", "Gato", "Conejo", "Ave", "Otro"];
const ICONOS = { Perro: "fa-dog", Gato: "fa-cat", Conejo: "fa-carrot", Ave: "fa-dove", Otro: "fa-paw" };
export const iconoEspecie = (especie) => ICONOS[especie] || "fa-paw";

export function avatarMascota(m, tam = "") {
  return `<span class="avatar avatar-${esc((m.especie || "otro").toLowerCase())} ${tam}"><i class="fa-solid ${iconoEspecie(m.especie)}" aria-hidden="true"></i></span>`;
}

const ESTADOS = {
  pendiente: ["Pendiente", "fa-clock"],
  confirmada: ["Confirmada", "fa-circle-check"],
  completada: ["Atendida", "fa-stethoscope"],
  cancelada: ["Cancelada", "fa-ban"],
  ausente: ["No asistió", "fa-user-xmark"]
};
export const estadoCita = (estado) => {
  const [texto, icono] = ESTADOS[estado] || [estado, "fa-circle"];
  return `<span class="estado estado-${esc(estado)}"><i class="fa-solid ${icono}" aria-hidden="true"></i> ${texto}</span>`;
};

/* ---------- avisos ---------- */
export function aviso(texto, tipo = "ok") {
  let caja = document.querySelector(".avisos");
  if (!caja) {
    caja = document.createElement("div");
    caja.className = "avisos";
    caja.setAttribute("role", "status");
    caja.setAttribute("aria-live", "polite");
    document.body.appendChild(caja);
  }
  const el = document.createElement("div");
  el.className = `aviso aviso-${tipo}`;
  el.innerHTML = `<i class="fa-solid ${tipo === "ok" ? "fa-circle-check" : "fa-triangle-exclamation"}" aria-hidden="true"></i> ${esc(texto)}`;
  caja.appendChild(el);
  setTimeout(() => el.classList.add("saliendo"), 2600);
  setTimeout(() => el.remove(), 3000);
}

/* ---------- ventana modal ---------- */
// abre un <dialog> con un formulario; alEnviar recibe los datos y puede
// lanzar un Error para mostrarlo sin cerrar la ventana
export function modal({ titulo, contenido, textoBoton = "Guardar", alEnviar, alAbrir, peligro = false }) {
  const d = document.createElement("dialog");
  d.className = "modal";
  d.innerHTML = `
    <form method="dialog" novalidate>
      <header class="modal-cabeza">
        <h2>${titulo}</h2>
        <button type="button" class="icono-boton" data-cerrar aria-label="Cerrar"><i class="fa-solid fa-xmark"></i></button>
      </header>
      <div class="modal-cuerpo">${contenido}</div>
      <p class="error-form" hidden></p>
      <footer class="modal-pie">
        <button type="button" class="boton boton-claro" data-cerrar>Cancelar</button>
        <button type="submit" class="boton ${peligro ? "boton-peligro" : "boton-principal"}">${textoBoton}</button>
      </footer>
    </form>`;
  document.body.appendChild(d);
  const form = d.querySelector("form");
  const error = d.querySelector(".error-form");
  d.addEventListener("close", () => d.remove());
  d.addEventListener("click", (e) => {
    if (e.target.closest("[data-cerrar]") || e.target === d) d.close();
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    error.hidden = true;
    if (!form.checkValidity()) {
      const malo = form.querySelector(":invalid");
      error.textContent = malo.dataset.error || "Revisa los campos marcados.";
      error.hidden = false;
      form.classList.add("validado");
      malo.focus();
      return;
    }
    try {
      const datos = Object.fromEntries(new FormData(form).entries());
      alEnviar(datos);
      d.close();
    } catch (err) {
      error.textContent = err.message;
      error.hidden = false;
    }
  });
  d.showModal();
  if (alAbrir) alAbrir(form);
  return d;
}

export function confirmar(titulo, mensaje, textoBoton, alAceptar) {
  modal({ titulo, contenido: `<p>${mensaje}</p>`, textoBoton, peligro: true, alEnviar: alAceptar });
}
