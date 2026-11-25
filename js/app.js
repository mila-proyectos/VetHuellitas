// Huellitas · aplicación (enrutador y pantallas)
import * as D from "./datos.js";
import { esc, fechaCorta, fechaLarga, edad, ESPECIES, avatarMascota, estadoCita, aviso, modal, confirmar } from "./ui.js";

const app = document.getElementById("app");

/* ---------- enrutador por hash: #/ruta/parametro ---------- */
const RUTAS = {
  login: { vista: vistaLogin, publica: true },
  registro: { vista: vistaRegistro, publica: true },
  inicio: { vista: vistaInicioCliente, rol: "cliente" },
  mascotas: { vista: vistaMascotas, rol: "cliente" },
  citas: { vista: vistaCitasCliente, rol: "cliente" },
  agenda: { vista: vistaAgenda, rol: "veterinario" },
  pacientes: { vista: vistaPacientes, rol: "veterinario" },
  mascota: { vista: vistaMascota }
};
const inicioDe = (u) => (u.rol === "veterinario" ? "#/agenda" : "#/inicio");

function leerRuta() {
  const [ruta, param] = location.hash.replace(/^#\/?/, "").split("?")[0].split("/");
  const query = new URLSearchParams(location.hash.split("?")[1] || "");
  return { ruta: ruta || "", param, query };
}

function navegar() {
  const { ruta, param, query } = leerRuta();
  const u = D.usuarioActual();
  const def = RUTAS[ruta];
  if (!def) return location.replace(u ? inicioDe(u) : "#/login");
  if (def.publica && u) return location.replace(inicioDe(u));
  if (!def.publica && !u) return location.replace("#/login");
  if (def.rol && u.rol !== def.rol) return location.replace(inicioDe(u));

  if (def.publica) {
    app.className = "app app-publica";
    app.innerHTML = def.vista();
  } else {
    app.className = "app";
    app.innerHTML = marco(u, ruta, def.vista(u, param, query));
  }
  window.scrollTo(0, 0);
  const principal = app.querySelector("main");
  if (principal) principal.focus({ preventScroll: true });
}

window.addEventListener("hashchange", navegar);

/* ---------- marco con menú ---------- */
function marco(u, ruta, contenido) {
  const enlaces = u.rol === "veterinario"
    ? [["agenda", "fa-calendar-days", "Agenda"], ["pacientes", "fa-paw", "Pacientes"]]
    : [["inicio", "fa-house", "Inicio"], ["mascotas", "fa-paw", "Mis mascotas"], ["citas", "fa-calendar-check", "Mis citas"]];
  const activo = ruta === "mascota" ? (u.rol === "veterinario" ? "pacientes" : "mascotas") : ruta;
  return `
    <aside class="menu">
      <a class="marca" href="${inicioDe(u)}"><span class="marca-logo"><i class="fa-solid fa-paw"></i></span> Huellitas</a>
      <nav aria-label="Menú principal">
        ${enlaces.map(([r, i, t]) => `<a href="#/${r}" class="${activo === r ? "activo" : ""}" ${activo === r ? 'aria-current="page"' : ""}><i class="fa-solid ${i}" aria-hidden="true"></i><span>${t}</span></a>`).join("")}
      </nav>
      <div class="menu-usuario">
        <span class="inicial">${esc(u.nombre.replace(/^(Dra?\.)\s*/, "").charAt(0))}</span>
        <div><strong>${esc(u.nombre)}</strong><small>${u.rol === "veterinario" ? esc(u.especialidad) : "Cliente"}</small></div>
        <button class="icono-boton" data-accion="salir" title="Cerrar sesión" aria-label="Cerrar sesión"><i class="fa-solid fa-right-from-bracket"></i></button>
      </div>
      <button class="restablecer" data-accion="reiniciar"><i class="fa-solid fa-rotate-left"></i> Restablecer datos de demo</button>
    </aside>
    <main class="contenido" tabindex="-1">${contenido}</main>`;
}

/* ---------- login y registro ---------- */
function vistaLogin() {
  return `
    <div class="acceso">
      <section class="acceso-lado">
        <span class="marca-logo grande"><i class="fa-solid fa-paw"></i></span>
        <h1>Huellitas</h1>
        <p>Clínica veterinaria. Agenda citas para tus mascotas y consulta su expediente en línea.</p>
        <ul>
          <li><i class="fa-solid fa-calendar-check"></i> Citas en línea según la disponibilidad real</li>
          <li><i class="fa-solid fa-notes-medical"></i> Expediente con consultas y vacunas</li>
          <li><i class="fa-solid fa-user-doctor"></i> Agenda diaria para el equipo veterinario</li>
        </ul>
      </section>
      <section class="acceso-form">
        <h2>Iniciar sesión</h2>
        <form id="form-login" novalidate>
          <label>Correo electrónico<input name="email" type="email" required autocomplete="username" placeholder="tu@correo.com"></label>
          <label>Contraseña<input name="clave" type="password" required autocomplete="current-password" placeholder="••••••••"></label>
          <p class="error-form" hidden></p>
          <button class="boton boton-principal ancho" type="submit">Entrar</button>
        </form>
        <p class="separador"><span>o prueba la demo</span></p>
        <div class="demo-cuentas">
          <button class="cuenta-demo" data-demo="andrea@huellitas.cr|vet1234"><i class="fa-solid fa-user-doctor"></i><span><strong>Veterinaria</strong><small>andrea@huellitas.cr · vet1234</small></span></button>
          <button class="cuenta-demo" data-demo="laura@correo.com|cliente1234"><i class="fa-solid fa-user"></i><span><strong>Cliente</strong><small>laura@correo.com · cliente1234</small></span></button>
        </div>
        <p class="pie-form">¿No tienes cuenta? <a href="#/registro">Regístrate</a></p>
      </section>
    </div>`;
}

function vistaRegistro() {
  return `
    <div class="acceso solo">
      <section class="acceso-form">
        <a class="volver" href="#/login"><i class="fa-solid fa-arrow-left"></i> Volver</a>
        <h2>Crear cuenta de cliente</h2>
        <p class="ayuda">Con tu cuenta puedes registrar a tus mascotas y agendar citas.</p>
        <form id="form-registro" novalidate>
          <label>Nombre completo<input name="nombre" required minlength="3" data-error="Escribe tu nombre completo."></label>
          <label>Correo electrónico<input name="email" type="email" required data-error="Escribe un correo válido."></label>
          <label>Teléfono<input name="telefono" required pattern="[0-9 \\-]{8,}" placeholder="8888-8888" data-error="Escribe un teléfono de 8 dígitos."></label>
          <label>Contraseña<input name="clave" type="password" required minlength="6" data-error="La contraseña debe tener al menos 6 caracteres."></label>
          <p class="error-form" hidden></p>
          <button class="boton boton-principal ancho" type="submit">Crear cuenta</button>
        </form>
      </section>
    </div>`;
}

function entrar(email, clave) {
  const u = D.iniciarSesion(email, clave);
  aviso(`¡Hola, ${u.nombre.split(" ").slice(0, 2).join(" ")}!`);
  location.hash = inicioDe(u);
}

/* ---------- cliente: inicio ---------- */
function vistaInicioCliente(u) {
  const mascotas = D.mascotasDe(u.id);
  const proximas = D.citasDeCliente(u.id).filter((c) => c.fecha >= D.hoy() && ["pendiente", "confirmada"].includes(c.estado));
  const ids = new Set(mascotas.map((m) => m.id));
  const vacunas = D.vacunasPorVencer(45).filter((v) => ids.has(v.mascotaId));
  return `
    <header class="cabecera">
      <div><p class="saludo">¡Hola, ${esc(u.nombre.split(" ")[0])}!</p><h1>¿Cómo están tus mascotas hoy?</h1></div>
      <button class="boton boton-principal" data-accion="nueva-cita"><i class="fa-solid fa-plus"></i> Agendar cita</button>
    </header>

    <section class="bloque">
      <div class="bloque-cabeza"><h2>Próximas citas</h2><a href="#/citas">Ver todas</a></div>
      ${proximas.length ? `<div class="lista-citas">${proximas.slice(0, 3).map((c) => tarjetaCita(c, "cliente")).join("")}</div>`
        : vacio("fa-calendar", "No tienes citas próximas.", `<button class="boton boton-claro" data-accion="nueva-cita">Agendar una cita</button>`)}
    </section>

    ${vacunas.length ? `
    <section class="bloque alerta-vacunas">
      <h2><i class="fa-solid fa-syringe"></i> Recordatorio de vacunas</h2>
      <ul>${vacunas.map((v) => {
        const m = D.mascota(v.mascotaId);
        return `<li><strong>${esc(m.nombre)}</strong> · ${esc(v.nombre)} — ${v.proxima < D.hoy() ? `<span class="vencida">venció el ${fechaCorta(v.proxima)}</span>` : `toca el ${fechaCorta(v.proxima)}`}</li>`;
      }).join("")}</ul>
    </section>` : ""}

    <section class="bloque">
      <div class="bloque-cabeza"><h2>Mis mascotas</h2><a href="#/mascotas">Administrar</a></div>
      <div class="rejilla-mascotas">${mascotas.map(tarjetaMascota).join("")}
        <button class="tarjeta-mascota agregar" data-accion="nueva-mascota"><i class="fa-solid fa-plus"></i><span>Agregar mascota</span></button>
      </div>
    </section>`;
}

function tarjetaMascota(m) {
  return `
    <a class="tarjeta-mascota" href="#/mascota/${m.id}">
      ${avatarMascota(m, "grande")}
      <strong>${esc(m.nombre)}</strong>
      <small>${esc(m.especie)} · ${esc(m.raza || "Sin raza definida")}</small>
      <small>${edad(m.nacimiento)}${m.peso ? ` · ${m.peso} kg` : ""}</small>
    </a>`;
}

function tarjetaCita(c, vista, conVeterinario) {
  const m = D.mascota(c.mascotaId);
  const vet = D.usuario(c.veterinarioId);
  const dueno = D.usuario(m.duenoId);
  const activa = ["pendiente", "confirmada"].includes(c.estado);
  let acciones = "";
  if (vista === "cliente" && activa) {
    acciones = `<button class="boton boton-claro chico" data-accion="cancelar-cita" data-id="${c.id}">Cancelar</button>`;
  }
  if (vista === "veterinario" && activa) {
    acciones = `
      ${c.estado === "pendiente" ? `<button class="boton boton-claro chico" data-accion="confirmar-cita" data-id="${c.id}"><i class="fa-solid fa-check"></i> Confirmar</button>` : ""}
      <button class="boton boton-principal chico" data-accion="atender" data-id="${c.id}"><i class="fa-solid fa-stethoscope"></i> Atender</button>
      <details class="mas-acciones"><summary class="icono-boton" aria-label="Más acciones"><i class="fa-solid fa-ellipsis-vertical"></i></summary>
        <div><button data-accion="ausente-cita" data-id="${c.id}">Marcar no asistió</button><button data-accion="cancelar-cita" data-id="${c.id}">Cancelar cita</button></div>
      </details>`;
  }
  return `
    <article class="tarjeta-cita ${esc(c.estado)}">
      <div class="cita-hora"><strong>${c.hora}</strong><small>${vista === "veterinario" ? "" : fechaCorta(c.fecha)}</small></div>
      ${avatarMascota(m)}
      <div class="cita-info">
        <a href="#/mascota/${m.id}"><strong>${esc(m.nombre)}</strong></a> <small>${esc(m.especie)} · ${esc(m.raza)}</small>
        <p>${esc(c.motivo)}</p>
        <small>${vista === "veterinario" ? `<i class="fa-solid fa-user"></i> ${esc(dueno.nombre)} · ${esc(dueno.telefono)}${conVeterinario ? ` · <i class="fa-solid fa-user-doctor"></i> ${esc(vet.nombre)}` : ""}` : `<i class="fa-solid fa-user-doctor"></i> ${esc(vet.nombre)}`}</small>
      </div>
      <div class="cita-estado">${estadoCita(c.estado)}<div class="cita-acciones">${acciones}</div></div>
    </article>`;
}

const mayuscula = (t) => t.charAt(0).toUpperCase() + t.slice(1);
const vacio = (icono, texto, extra = "") => `<div class="vacio"><i class="fa-solid ${icono}"></i><p>${texto}</p>${extra}</div>`;

/* ---------- cliente: mascotas y citas ---------- */
function vistaMascotas(u) {
  const mascotas = D.mascotasDe(u.id);
  return `
    <header class="cabecera">
      <div><h1>Mis mascotas</h1><p class="ayuda">${mascotas.length} ${mascotas.length === 1 ? "mascota registrada" : "mascotas registradas"}</p></div>
      <button class="boton boton-principal" data-accion="nueva-mascota"><i class="fa-solid fa-plus"></i> Agregar mascota</button>
    </header>
    ${mascotas.length ? `<div class="rejilla-mascotas">${mascotas.map(tarjetaMascota).join("")}</div>`
      : vacio("fa-paw", "Todavía no has registrado mascotas.", `<button class="boton boton-principal" data-accion="nueva-mascota">Registrar mi primera mascota</button>`)}`;
}

function vistaCitasCliente(u) {
  const citas = D.citasDeCliente(u.id);
  const proximas = citas.filter((c) => c.fecha >= D.hoy() && ["pendiente", "confirmada"].includes(c.estado));
  const historial = citas.filter((c) => !proximas.includes(c)).reverse();
  return `
    <header class="cabecera">
      <div><h1>Mis citas</h1></div>
      <button class="boton boton-principal" data-accion="nueva-cita"><i class="fa-solid fa-plus"></i> Agendar cita</button>
    </header>
    <section class="bloque"><h2>Próximas</h2>
      ${proximas.length ? `<div class="lista-citas">${proximas.map((c) => tarjetaCita(c, "cliente")).join("")}</div>` : vacio("fa-calendar", "No tienes citas próximas.")}
    </section>
    <section class="bloque"><h2>Historial</h2>
      ${historial.length ? `<div class="lista-citas">${historial.map((c) => tarjetaCita(c, "cliente")).join("")}</div>` : vacio("fa-clock-rotate-left", "Aún no hay citas anteriores.")}
    </section>`;
}

/* ---------- veterinario: agenda ---------- */
function vistaAgenda(u, _param, query) {
  const fecha = query.get("fecha") || D.hoy();
  const todos = query.get("todos") === "1";
  const citas = D.citasDelDia(fecha, todos ? null : u.id);
  const hoyCitas = D.citasDelDia(D.hoy(), u.id).filter((c) => c.estado !== "cancelada");
  const atendidas = hoyCitas.filter((c) => c.estado === "completada").length;
  const vacunas = D.vacunasPorVencer(15);
  return `
    <header class="cabecera">
      <div><p class="saludo">${mayuscula(fechaLarga(D.hoy()))}</p><h1>Buen día, ${esc(u.nombre.split(" ").slice(0, 2).join(" "))}</h1></div>
      <button class="boton boton-principal" data-accion="nueva-cita"><i class="fa-solid fa-plus"></i> Nueva cita</button>
    </header>

    <div class="indicadores">
      <div class="indicador"><i class="fa-solid fa-calendar-day"></i><strong>${hoyCitas.length}</strong><span>Citas hoy</span></div>
      <div class="indicador"><i class="fa-solid fa-stethoscope"></i><strong>${atendidas}/${hoyCitas.length}</strong><span>Atendidas hoy</span></div>
      <div class="indicador"><i class="fa-solid fa-hourglass-half"></i><strong>${D.citasPendientesDe(u.id).length}</strong><span>Por confirmar</span></div>
      <div class="indicador"><i class="fa-solid fa-syringe"></i><strong>${vacunas.length}</strong><span>Vacunas por vencer</span></div>
    </div>

    <section class="bloque">
      <div class="bloque-cabeza agenda-controles">
        <h2>${fecha === D.hoy() ? "Hoy" : mayuscula(fechaLarga(fecha))}</h2>
        <div class="controles">
          <a class="icono-boton" href="#/agenda?fecha=${D.sumarDias(fecha, -1)}${todos ? "&todos=1" : ""}" aria-label="Día anterior"><i class="fa-solid fa-chevron-left"></i></a>
          <input type="date" value="${fecha}" data-accion="cambiar-fecha" aria-label="Elegir fecha">
          <a class="icono-boton" href="#/agenda?fecha=${D.sumarDias(fecha, 1)}${todos ? "&todos=1" : ""}" aria-label="Día siguiente"><i class="fa-solid fa-chevron-right"></i></a>
          ${fecha !== D.hoy() ? `<a class="boton boton-claro chico" href="#/agenda${todos ? "?todos=1" : ""}">Hoy</a>` : ""}
          <label class="interruptor"><input type="checkbox" data-accion="ver-todos" ${todos ? "checked" : ""}> Toda la clínica</label>
        </div>
      </div>
      ${citas.length ? `<div class="lista-citas">${citas.map((c) => tarjetaCita(c, "veterinario", todos)).join("")}</div>`
        : vacio("fa-mug-hot", new Date(fecha + "T12:00:00").getDay() === 0 ? "Los domingos la clínica está cerrada." : "No hay citas para este día.")}
    </section>

    ${vacunas.length ? `
    <section class="bloque alerta-vacunas">
      <h2><i class="fa-solid fa-syringe"></i> Vacunas vencidas o por vencer (15 días)</h2>
      <ul>${vacunas.map((v) => {
        const m = D.mascota(v.mascotaId);
        if (!m) return "";
        const d = D.usuario(m.duenoId);
        return `<li><a href="#/mascota/${m.id}"><strong>${esc(m.nombre)}</strong></a> · ${esc(v.nombre)} — ${v.proxima < D.hoy() ? `<span class="vencida">venció el ${fechaCorta(v.proxima)}</span>` : fechaCorta(v.proxima)} <small>(${esc(d.nombre)} · ${esc(d.telefono)})</small></li>`;
      }).join("")}</ul>
    </section>` : ""}`;
}

/* ---------- veterinario: pacientes ---------- */
function vistaPacientes(u, _p, query) {
  const filtro = (query.get("q") || "").toLowerCase();
  const lista = D.todasLasMascotas()
    .map((m) => ({ m, d: D.usuario(m.duenoId), ultima: D.consultasDe(m.id)[0] }))
    .filter(({ m, d }) => !filtro || [m.nombre, m.especie, m.raza, d.nombre, d.telefono].join(" ").toLowerCase().includes(filtro))
    .sort((a, b) => a.m.nombre.localeCompare(b.m.nombre));
  return `
    <header class="cabecera">
      <div><h1>Pacientes</h1><p class="ayuda">${D.todasLasMascotas().length} mascotas · ${D.clientes().length} clientes</p></div>
    </header>
    <form class="buscador" data-accion="buscar">
      <i class="fa-solid fa-magnifying-glass"></i>
      <input name="q" type="search" value="${esc(query.get("q") || "")}" placeholder="Buscar por mascota, raza, dueño o teléfono" aria-label="Buscar paciente">
    </form>
    ${lista.length ? `
    <div class="tabla-envoltura"><table class="tabla">
      <thead><tr><th>Paciente</th><th>Especie</th><th>Edad / peso</th><th>Dueño</th><th>Última consulta</th></tr></thead>
      <tbody>${lista.map(({ m, d, ultima }) => `
        <tr data-ir="#/mascota/${m.id}" tabindex="0">
          <td><span class="celda-mascota">${avatarMascota(m)}<span><strong>${esc(m.nombre)}</strong><small>${esc(m.raza)}</small></span></span></td>
          <td>${esc(m.especie)}</td>
          <td>${edad(m.nacimiento)}${m.peso ? ` · ${m.peso} kg` : ""}</td>
          <td>${esc(d.nombre)}<small>${esc(d.telefono)}</small></td>
          <td>${ultima ? `${fechaCorta(ultima.fecha)}<small>${esc(ultima.diagnostico)}</small>` : "—"}</td>
        </tr>`).join("")}
      </tbody></table></div>` : vacio("fa-magnifying-glass", "No hay pacientes que coincidan con la búsqueda.")}`;
}

/* ---------- expediente de la mascota (ambos roles) ---------- */
function vistaMascota(u, id) {
  const m = D.mascota(id);
  if (!m || (u.rol === "cliente" && m.duenoId !== u.id)) {
    return vacio("fa-circle-question", "No encontramos esa mascota.", `<a class="boton boton-claro" href="${inicioDe(u)}">Volver</a>`);
  }
  const vet = u.rol === "veterinario";
  const dueno = D.usuario(m.duenoId);
  const consultas = D.consultasDe(m.id);
  const vacunas = D.vacunasDe(m.id);
  const citas = D.citasDeMascota(m.id).filter((c) => c.fecha >= D.hoy() && ["pendiente", "confirmada"].includes(c.estado));
  return `
    <a class="volver" href="${vet ? "#/pacientes" : "#/mascotas"}"><i class="fa-solid fa-arrow-left"></i> ${vet ? "Pacientes" : "Mis mascotas"}</a>
    <header class="ficha-mascota">
      ${avatarMascota(m, "enorme")}
      <div class="ficha-datos">
        <h1>${esc(m.nombre)}</h1>
        <p>${esc(m.especie)} · ${esc(m.raza || "Sin raza definida")} · ${esc(m.sexo)}</p>
        <ul class="datos-rapidos">
          <li><i class="fa-solid fa-cake-candles"></i> ${edad(m.nacimiento)}</li>
          <li><i class="fa-solid fa-weight-scale"></i> ${m.peso ? m.peso + " kg" : "Sin peso"}</li>
          <li><i class="fa-solid fa-palette"></i> ${esc(m.color || "—")}</li>
          <li class="${m.alergias && m.alergias !== "Ninguna conocida" ? "alergia" : ""}"><i class="fa-solid fa-triangle-exclamation"></i> Alergias: ${esc(m.alergias)}</li>
        </ul>
        ${vet ? `<p class="dueno"><i class="fa-solid fa-user"></i> ${esc(dueno.nombre)} · <a href="tel:${esc(dueno.telefono)}">${esc(dueno.telefono)}</a> · <a href="mailto:${esc(dueno.email)}">${esc(dueno.email)}</a></p>` : ""}
      </div>
      <div class="ficha-acciones">
        ${vet ? `<button class="boton boton-principal" data-accion="nueva-consulta" data-mascota="${m.id}"><i class="fa-solid fa-notes-medical"></i> Registrar consulta</button>
                 <button class="boton boton-claro" data-accion="nueva-vacuna" data-mascota="${m.id}"><i class="fa-solid fa-syringe"></i> Registrar vacuna</button>`
              : `<button class="boton boton-principal" data-accion="nueva-cita" data-mascota="${m.id}"><i class="fa-solid fa-calendar-plus"></i> Agendar cita</button>
                 <button class="boton boton-claro" data-accion="editar-mascota" data-mascota="${m.id}"><i class="fa-solid fa-pen"></i> Editar</button>
                 <button class="boton boton-texto" data-accion="eliminar-mascota" data-mascota="${m.id}"><i class="fa-solid fa-trash"></i> Eliminar</button>`}
      </div>
    </header>

    ${citas.length ? `<section class="bloque"><h2>Próximas citas</h2><div class="lista-citas">${citas.map((c) => tarjetaCita(c, vet ? "veterinario" : "cliente")).join("")}</div></section>` : ""}

    <div class="expediente">
      <section class="bloque">
        <h2><i class="fa-solid fa-file-medical"></i> Historial de consultas</h2>
        ${consultas.length ? `<ol class="linea-tiempo">${consultas.map((c) => `
          <li>
            <div class="lt-fecha">${fechaCorta(c.fecha)}</div>
            <div class="lt-tarjeta">
              <strong>${esc(c.motivo)}</strong>
              <dl>
                <div><dt>Diagnóstico</dt><dd>${esc(c.diagnostico)}</dd></div>
                <div><dt>Tratamiento</dt><dd>${esc(c.tratamiento)}</dd></div>
                ${c.notas ? `<div><dt>Notas</dt><dd>${esc(c.notas)}</dd></div>` : ""}
              </dl>
              <small>${c.peso ? `<i class="fa-solid fa-weight-scale"></i> ${c.peso} kg` : ""} ${c.temperatura ? `<i class="fa-solid fa-temperature-half"></i> ${c.temperatura} °C` : ""} · ${esc(D.usuario(c.veterinarioId).nombre)}</small>
            </div>
          </li>`).join("")}</ol>` : vacio("fa-file-circle-plus", "Todavía no hay consultas registradas.")}
      </section>

      <section class="bloque">
        <h2><i class="fa-solid fa-syringe"></i> Vacunas</h2>
        ${vacunas.length ? `<ul class="lista-vacunas">${vacunas.map((v) => `
          <li>
            <strong>${esc(v.nombre)}</strong>
            <small>Aplicada: ${fechaCorta(v.fecha)}</small>
            ${D.vacunaRenovada(v) ? `<span class="renovada"><i class="fa-solid fa-rotate"></i> Renovada</span>`
              : v.proxima ? `<span class="${v.proxima < D.hoy() ? "vencida" : "proxima"}">${v.proxima < D.hoy() ? "Vencida" : "Próxima"}: ${fechaCorta(v.proxima)}</span>` : ""}
          </li>`).join("")}</ul>` : vacio("fa-syringe", "Sin vacunas registradas.")}
      </section>
    </div>`;
}

/* ---------- formularios ---------- */
function formMascota(u, m) {
  const op = (lista, actual) => lista.map((x) => `<option ${x === actual ? "selected" : ""}>${x}</option>`).join("");
  modal({
    titulo: m ? `Editar a ${esc(m.nombre)}` : "Registrar mascota",
    textoBoton: m ? "Guardar cambios" : "Registrar",
    contenido: `
      <div class="campos">
        <label>Nombre<input name="nombre" required value="${esc(m?.nombre)}" data-error="Escribe el nombre de la mascota."></label>
        <label>Especie<select name="especie">${op(ESPECIES, m?.especie)}</select></label>
        <label>Raza<input name="raza" value="${esc(m?.raza)}" placeholder="Mestizo"></label>
        <label>Sexo<select name="sexo">${op(["Macho", "Hembra"], m?.sexo)}</select></label>
        <label>Fecha de nacimiento<input name="nacimiento" type="date" max="${D.hoy()}" value="${esc(m?.nacimiento)}"></label>
        <label>Peso (kg)<input name="peso" type="number" min="0.05" max="120" step="0.01" value="${m?.peso ?? ""}" data-error="El peso debe estar entre 0.05 y 120 kg."></label>
        <label class="completo">Color / señas<input name="color" value="${esc(m?.color)}"></label>
        <label class="completo">Alergias<input name="alergias" value="${esc(m?.alergias === "Ninguna conocida" ? "" : m?.alergias)}" placeholder="Ninguna conocida"></label>
      </div>`,
    alEnviar(datos) {
      const guardada = D.guardarMascota(Object.assign(datos, { id: m?.id, duenoId: u.id }));
      aviso(m ? "Cambios guardados." : `${guardada.nombre} quedó registrada.`);
      navegar();
    }
  });
}

function formCita(u, mascotaId) {
  const mascotas = u.rol === "cliente" ? D.mascotasDe(u.id) : D.todasLasMascotas();
  if (!mascotas.length) {
    aviso("Primero registra una mascota.", "error");
    return formMascota(u);
  }
  const vets = D.veterinarios();
  let fecha = D.hoy();
  if (!D.horariosDisponibles(fecha, vets[0].id).length) fecha = D.sumarDias(fecha, 1);
  modal({
    titulo: "Agendar cita",
    textoBoton: "Agendar",
    contenido: `
      <div class="campos">
        <label class="completo">Mascota<select name="mascotaId">${mascotas.map((m) => `<option value="${m.id}" ${Number(mascotaId) === m.id ? "selected" : ""}>${esc(m.nombre)} (${esc(m.especie)})${u.rol === "veterinario" ? " · " + esc(D.usuario(m.duenoId).nombre) : ""}</option>`).join("")}</select></label>
        <label class="completo">Veterinario<select name="veterinarioId">${vets.map((v) => `<option value="${v.id}" ${u.id === v.id ? "selected" : ""}>${esc(v.nombre)} — ${esc(v.especialidad)}</option>`).join("")}</select></label>
        <label>Fecha<input name="fecha" type="date" required min="${D.hoy()}" value="${fecha}" data-error="Elige una fecha válida."></label>
        <label>Hora<select name="hora" required data-error="No hay horarios libres ese día; elige otra fecha."></select></label>
        <label class="completo">Motivo de la consulta<textarea name="motivo" required minlength="4" rows="3" placeholder="Ej.: control anual, vacunas, no quiere comer…" data-error="Cuéntanos brevemente el motivo de la cita."></textarea></label>
      </div>
      <p class="ayuda"><i class="fa-solid fa-circle-info"></i> Atendemos de lunes a viernes de 8:00 a 17:00 y sábados hasta las 12:00.</p>`,
    alAbrir(form) {
      const pintarHoras = () => {
        const horas = D.horariosDisponibles(form.fecha.value, form.veterinarioId.value);
        form.hora.innerHTML = horas.length ? horas.map((h) => `<option>${h}</option>`).join("") : `<option value="">Sin horarios disponibles</option>`;
      };
      form.fecha.addEventListener("change", pintarHoras);
      form.veterinarioId.addEventListener("change", pintarHoras);
      pintarHoras();
    },
    alEnviar(datos) {
      const c = D.agendarCita(datos);
      aviso(`Cita agendada para el ${fechaCorta(c.fecha)} a las ${c.hora}.`);
      navegar();
    }
  });
}

function formConsulta(u, mascotaId, citaId) {
  const m = D.mascota(mascotaId);
  const c = citaId ? D.cita(citaId) : null;
  modal({
    titulo: `Consulta de ${esc(m.nombre)}`,
    textoBoton: "Guardar consulta",
    contenido: `
      <p class="ayuda">${avatarMascota(m)} ${esc(m.especie)} · ${esc(m.raza)} · ${edad(m.nacimiento)}${m.alergias !== "Ninguna conocida" ? ` · <span class="vencida">Alergias: ${esc(m.alergias)}</span>` : ""}</p>
      <div class="campos">
        <label class="completo">Motivo<input name="motivo" required value="${esc(c?.motivo)}" data-error="Escribe el motivo de la consulta."></label>
        <label>Peso (kg)<input name="peso" type="number" min="0.05" max="120" step="0.01" value="${m.peso ?? ""}"></label>
        <label>Temperatura (°C)<input name="temperatura" type="number" min="34" max="43" step="0.1" placeholder="38.5" data-error="La temperatura debe estar entre 34 y 43 °C."></label>
        <label class="completo">Diagnóstico<textarea name="diagnostico" required rows="2" data-error="Escribe el diagnóstico."></textarea></label>
        <label class="completo">Tratamiento<textarea name="tratamiento" required rows="2" data-error="Escribe el tratamiento indicado."></textarea></label>
        <label class="completo">Notas (opcional)<textarea name="notas" rows="2"></textarea></label>
      </div>`,
    alEnviar(datos) {
      D.registrarConsulta(Object.assign(datos, { mascotaId: m.id, veterinarioId: u.id, citaId }));
      aviso(`Consulta de ${m.nombre} guardada en el expediente.`);
      navegar();
    }
  });
}

function formVacuna(u, mascotaId) {
  const m = D.mascota(mascotaId);
  modal({
    titulo: `Vacuna para ${esc(m.nombre)}`,
    textoBoton: "Registrar vacuna",
    contenido: `
      <div class="campos">
        <label class="completo">Vacuna<input name="nombre" required list="lista-vacunas" data-error="Escribe el nombre de la vacuna.">
          <datalist id="lista-vacunas"><option>Rabia</option><option>Séxtuple canina</option><option>Triple felina</option><option>Leucemia felina</option><option>Bordetella</option><option>Desparasitación interna</option></datalist></label>
        <label>Fecha de aplicación<input name="fecha" type="date" required max="${D.hoy()}" value="${D.hoy()}"></label>
        <label>Próxima dosis<input name="proxima" type="date" value="${D.sumarDias(D.hoy(), 365)}"></label>
      </div>`,
    alEnviar(datos) {
      if (datos.proxima && datos.proxima <= datos.fecha) throw new Error("La próxima dosis debe ser después de la aplicación.");
      D.registrarVacuna(Object.assign(datos, { mascotaId: m.id, veterinarioId: u.id }));
      aviso("Vacuna registrada.");
      navegar();
    }
  });
}

/* ---------- eventos globales ---------- */
document.addEventListener("submit", (e) => {
  const form = e.target;
  if (form.closest("dialog")) return;
  e.preventDefault();
  const error = form.querySelector(".error-form");
  if (form.id === "form-login" || form.id === "form-registro") {
    if (!form.checkValidity()) {
      error.textContent = form.querySelector(":invalid").dataset.error || "Completa los campos.";
      error.hidden = false;
      form.classList.add("validado");
      return;
    }
    try {
      const datos = Object.fromEntries(new FormData(form).entries());
      if (form.id === "form-login") entrar(datos.email, datos.clave);
      else {
        D.registrarCliente(datos);
        aviso("¡Cuenta creada! Ya puedes registrar a tus mascotas.");
        location.hash = "#/inicio";
      }
    } catch (err) {
      error.textContent = err.message;
      error.hidden = false;
    }
  }
  if (form.dataset.accion === "buscar") {
    location.hash = `#/pacientes?q=${encodeURIComponent(form.q.value.trim())}`;
  }
});

document.addEventListener("click", (e) => {
  const demo = e.target.closest("[data-demo]");
  if (demo) {
    const [email, clave] = demo.dataset.demo.split("|");
    entrar(email, clave);
    return;
  }
  const fila = e.target.closest("[data-ir]");
  if (fila && !e.target.closest("a")) location.hash = fila.dataset.ir;

  const b = e.target.closest("[data-accion]");
  if (!b || b.tagName === "FORM" || b.tagName === "INPUT") return;
  const u = D.usuarioActual();
  const id = b.dataset.id;
  const mascotaId = b.dataset.mascota;
  switch (b.dataset.accion) {
    case "salir":
      D.cerrarSesion();
      location.hash = "#/login";
      break;
    case "nueva-mascota": formMascota(u); break;
    case "editar-mascota": formMascota(u, D.mascota(mascotaId)); break;
    case "eliminar-mascota": {
      const m = D.mascota(mascotaId);
      confirmar(`¿Eliminar a ${esc(m.nombre)}?`, "Se borrarán también sus citas y su expediente. Esta acción no se puede deshacer.", "Eliminar", () => {
        D.eliminarMascota(m.id);
        aviso(`${m.nombre} fue eliminada.`);
        location.hash = "#/mascotas";
      });
      break;
    }
    case "nueva-cita": formCita(u, mascotaId); break;
    case "cancelar-cita": {
      const c = D.cita(id);
      confirmar("¿Cancelar la cita?", `Cita de ${esc(D.mascota(c.mascotaId).nombre)} el ${fechaCorta(c.fecha)} a las ${c.hora}.`, "Cancelar cita", () => {
        D.cambiarEstadoCita(id, "cancelada");
        aviso("La cita fue cancelada.");
        navegar();
      });
      break;
    }
    case "confirmar-cita":
      D.cambiarEstadoCita(id, "confirmada");
      aviso("Cita confirmada.");
      navegar();
      break;
    case "ausente-cita":
      D.cambiarEstadoCita(id, "ausente");
      aviso("Se marcó que no asistió.");
      navegar();
      break;
    case "atender": formConsulta(u, D.cita(id).mascotaId, Number(id)); break;
    case "nueva-consulta": formConsulta(u, mascotaId); break;
    case "nueva-vacuna": formVacuna(u, mascotaId); break;
    case "reiniciar":
      D.reiniciarDatos();
      D.cerrarSesion();
      aviso("Datos de demostración restablecidos.");
      location.hash = "#/login";
      navegar();
      break;
  }
});

document.addEventListener("change", (e) => {
  const t = e.target;
  if (t.dataset.accion === "cambiar-fecha" && t.value) {
    const todos = leerRuta().query.get("todos") === "1";
    location.hash = `#/agenda?fecha=${t.value}${todos ? "&todos=1" : ""}`;
  }
  if (t.dataset.accion === "ver-todos") {
    const fecha = leerRuta().query.get("fecha");
    const q = [fecha ? `fecha=${fecha}` : "", t.checked ? "todos=1" : ""].filter(Boolean).join("&");
    location.hash = "#/agenda" + (q ? "?" + q : "");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.matches("tr[data-ir]")) location.hash = e.target.dataset.ir;
});

/* ---------- arranque ---------- */
// ?entrar=veterinario|cliente abre la demo con la sesión iniciada (lo usa el portafolio)
const rolDemo = new URLSearchParams(location.search).get("entrar");
if (rolDemo === "veterinario") D.iniciarSesion("andrea@huellitas.cr", "vet1234");
if (rolDemo === "cliente") D.iniciarSesion("laura@correo.com", "cliente1234");
if (rolDemo === "salir") D.cerrarSesion();
navegar();
