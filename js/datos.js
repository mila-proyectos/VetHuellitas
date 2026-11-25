// Huellitas · capa de datos
// Guarda todo en localStorage del navegador (simula la base de datos).
// La primera vez se cargan datos de ejemplo con fechas relativas a hoy.

const CLAVE = "huellitas-datos";
const CLAVE_SESION = "huellitas-sesion";

/* ---------- fechas ---------- */
const dos = (n) => String(n).padStart(2, "0");
export const fechaIso = (d) => `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
export const hoy = () => fechaIso(new Date());
export const sumarDias = (iso, dias) => {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + dias);
  return fechaIso(d);
};

/* ---------- datos de ejemplo ---------- */
function datosIniciales() {
  const h = hoy();
  const d = (n) => sumarDias(h, n);
  const usuarios = [
    { id: 1, rol: "veterinario", nombre: "Dra. Andrea Solís", email: "andrea@huellitas.cr", clave: "vet1234", telefono: "2460-1122", especialidad: "Medicina general" },
    { id: 2, rol: "veterinario", nombre: "Dr. Pablo Mora", email: "pablo@huellitas.cr", clave: "vet1234", telefono: "2460-1123", especialidad: "Cirugía y traumatología" },
    { id: 3, rol: "cliente", nombre: "Laura Méndez", email: "laura@correo.com", clave: "cliente1234", telefono: "8888-1234" },
    { id: 4, rol: "cliente", nombre: "Carlos Rojas", email: "carlos@correo.com", clave: "cliente1234", telefono: "8777-5566" },
    { id: 5, rol: "cliente", nombre: "Ana Vargas", email: "ana@correo.com", clave: "cliente1234", telefono: "8555-9090" }
  ];
  const mascotas = [
    { id: 1, duenoId: 3, nombre: "Max", especie: "Perro", raza: "Golden retriever", sexo: "Macho", nacimiento: d(-365 * 4 - 40), peso: 31.5, color: "Dorado", alergias: "Ninguna conocida" },
    { id: 2, duenoId: 3, nombre: "Luna", especie: "Gato", raza: "Siamés", sexo: "Hembra", nacimiento: d(-365 * 2 - 100), peso: 4.2, color: "Crema con puntas café", alergias: "Pollo" },
    { id: 3, duenoId: 4, nombre: "Rocky", especie: "Perro", raza: "Bulldog francés", sexo: "Macho", nacimiento: d(-365 * 3), peso: 12.8, color: "Atigrado", alergias: "Ninguna conocida" },
    { id: 4, duenoId: 5, nombre: "Copito", especie: "Conejo", raza: "Mini lop", sexo: "Macho", nacimiento: d(-365 - 60), peso: 1.9, color: "Blanco", alergias: "Ninguna conocida" },
    { id: 5, duenoId: 5, nombre: "Mía", especie: "Gato", raza: "Mestizo", sexo: "Hembra", nacimiento: d(-200), peso: 2.6, color: "Atigrado gris", alergias: "Ninguna conocida" }
  ];
  const citas = [
    { id: 1, mascotaId: 1, veterinarioId: 1, fecha: h, hora: "09:00", motivo: "Control anual y vacunas", estado: "confirmada" },
    { id: 2, mascotaId: 3, veterinarioId: 1, fecha: h, hora: "10:30", motivo: "Le pica mucho la piel", estado: "pendiente" },
    { id: 3, mascotaId: 5, veterinarioId: 1, fecha: h, hora: "14:00", motivo: "Primera desparasitación", estado: "pendiente" },
    { id: 4, mascotaId: 4, veterinarioId: 2, fecha: h, hora: "11:00", motivo: "Revisión de dientes", estado: "confirmada" },
    { id: 5, mascotaId: 2, veterinarioId: 1, fecha: d(2), hora: "15:30", motivo: "Vómitos ocasionales", estado: "pendiente" },
    { id: 6, mascotaId: 1, veterinarioId: 2, fecha: d(-40), hora: "08:30", motivo: "Cojera en pata trasera", estado: "completada" },
    { id: 7, mascotaId: 2, veterinarioId: 1, fecha: d(-90), hora: "10:00", motivo: "Vacuna triple felina", estado: "completada" },
    { id: 8, mascotaId: 3, veterinarioId: 1, fecha: d(-15), hora: "16:00", motivo: "Control de peso", estado: "cancelada" }
  ];
  const consultas = [
    { id: 1, mascotaId: 1, veterinarioId: 2, citaId: 6, fecha: d(-40), motivo: "Cojera en pata trasera", peso: 32.4, temperatura: 38.6, diagnostico: "Esguince leve de rodilla derecha", tratamiento: "Meloxicam 1 vez al día por 5 días y reposo relativo por 2 semanas", notas: "Evitar escaleras y saltos. Revisar si persiste." },
    { id: 2, mascotaId: 2, veterinarioId: 1, citaId: 7, fecha: d(-90), motivo: "Vacuna triple felina", peso: 4.0, temperatura: 38.4, diagnostico: "Paciente sano", tratamiento: "Se aplica vacuna triple felina", notas: "Muy tranquila durante la consulta." },
    { id: 3, mascotaId: 3, veterinarioId: 1, citaId: null, fecha: d(-120), motivo: "Revisión de oídos", peso: 13.1, temperatura: 38.9, diagnostico: "Otitis externa leve", tratamiento: "Limpiador ótico 2 veces por semana y gotas por 7 días", notas: "" }
  ];
  const vacunas = [
    { id: 1, mascotaId: 1, nombre: "Rabia", fecha: d(-330), proxima: d(35), veterinarioId: 1 },
    { id: 2, mascotaId: 1, nombre: "Séxtuple canina", fecha: d(-330), proxima: d(35), veterinarioId: 1 },
    { id: 3, mascotaId: 2, nombre: "Triple felina", fecha: d(-90), proxima: d(275), veterinarioId: 1 },
    { id: 4, mascotaId: 3, nombre: "Rabia", fecha: d(-380), proxima: d(-15), veterinarioId: 1 },
    { id: 5, mascotaId: 5, nombre: "Triple felina (1.ª dosis)", fecha: d(-20), proxima: d(1), veterinarioId: 1 }
  ];
  return { usuarios, mascotas, citas, consultas, vacunas, siguienteId: 100 };
}

/* ---------- almacenamiento ---------- */
let db = cargar();

function cargar() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE));
    if (guardado && guardado.usuarios) return guardado;
  } catch (e) {}
  const nuevo = datosIniciales();
  guardarTodo(nuevo);
  return nuevo;
}

function guardarTodo(datos) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(datos || db));
  } catch (e) {}
}

export function reiniciarDatos() {
  db = datosIniciales();
  guardarTodo();
}

const nuevoId = () => ++db.siguienteId;

/* ---------- sesión ---------- */
export function usuarioActual() {
  try {
    const id = Number(sessionStorage.getItem(CLAVE_SESION));
    return db.usuarios.find((u) => u.id === id) || null;
  } catch (e) {
    return null;
  }
}

export function iniciarSesion(email, clave) {
  const u = db.usuarios.find((x) => x.email.toLowerCase() === email.trim().toLowerCase() && x.clave === clave);
  if (!u) throw new Error("Correo o contraseña incorrectos.");
  try { sessionStorage.setItem(CLAVE_SESION, u.id); } catch (e) {}
  return u;
}

export function cerrarSesion() {
  try { sessionStorage.removeItem(CLAVE_SESION); } catch (e) {}
}

export function registrarCliente({ nombre, email, telefono, clave }) {
  if (db.usuarios.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
    throw new Error("Ya existe una cuenta con ese correo.");
  }
  const u = { id: nuevoId(), rol: "cliente", nombre: nombre.trim(), email: email.trim(), telefono: telefono.trim(), clave };
  db.usuarios.push(u);
  guardarTodo();
  try { sessionStorage.setItem(CLAVE_SESION, u.id); } catch (e) {}
  return u;
}

/* ---------- consultas de datos ---------- */
export const usuario = (id) => db.usuarios.find((u) => u.id === Number(id));
export const veterinarios = () => db.usuarios.filter((u) => u.rol === "veterinario");
export const clientes = () => db.usuarios.filter((u) => u.rol === "cliente");
export const mascota = (id) => db.mascotas.find((m) => m.id === Number(id));
export const mascotasDe = (duenoId) => db.mascotas.filter((m) => m.duenoId === Number(duenoId));
export const todasLasMascotas = () => db.mascotas.slice();
export const cita = (id) => db.citas.find((c) => c.id === Number(id));
const ordenCita = (a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora);
export const citasDeMascota = (mascotaId) => db.citas.filter((c) => c.mascotaId === Number(mascotaId)).sort(ordenCita);
export const citasDeCliente = (duenoId) => {
  const ids = new Set(mascotasDe(duenoId).map((m) => m.id));
  return db.citas.filter((c) => ids.has(c.mascotaId)).sort(ordenCita);
};
export const citasDelDia = (fecha, veterinarioId) =>
  db.citas.filter((c) => c.fecha === fecha && (!veterinarioId || c.veterinarioId === Number(veterinarioId))).sort(ordenCita);
export const citasPendientesDe = (veterinarioId) =>
  db.citas.filter((c) => c.veterinarioId === Number(veterinarioId) && c.estado === "pendiente" && c.fecha >= hoy());
export const consultasDe = (mascotaId) =>
  db.consultas.filter((c) => c.mascotaId === Number(mascotaId)).sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id);
export const vacunasDe = (mascotaId) =>
  db.vacunas.filter((v) => v.mascotaId === Number(mascotaId)).sort((a, b) => b.fecha.localeCompare(a.fecha));
// una dosis queda "renovada" si después se aplicó la misma vacuna a esa mascota
export const vacunaRenovada = (v) =>
  db.vacunas.some((x) => x.mascotaId === v.mascotaId && x.id !== v.id && x.nombre.toLowerCase() === v.nombre.toLowerCase() && x.fecha > v.fecha);
export const vacunasPorVencer = (dias = 30) => {
  const limite = sumarDias(hoy(), dias);
  return db.vacunas
    .filter((v) => v.proxima && v.proxima <= limite && !vacunaRenovada(v) && mascota(v.mascotaId))
    .sort((a, b) => a.proxima.localeCompare(b.proxima));
};

/* ---------- horarios ---------- */
// atención de lunes a sábado, 8:00 a 17:00, citas cada 30 minutos
export function horariosDisponibles(fecha, veterinarioId, ignorarCitaId) {
  const dia = new Date(fecha + "T12:00:00").getDay();
  if (dia === 0) return [];
  const fin = dia === 6 ? 12 : 17;
  const ocupadas = new Set(
    db.citas
      .filter((c) => c.fecha === fecha && c.veterinarioId === Number(veterinarioId) && c.estado !== "cancelada" && c.id !== ignorarCitaId)
      .map((c) => c.hora)
  );
  const ahora = new Date();
  const lista = [];
  for (let h = 8; h < fin; h++) {
    for (const m of [0, 30]) {
      const hora = `${dos(h)}:${dos(m)}`;
      if (ocupadas.has(hora)) continue;
      if (fecha === hoy() && h * 60 + m <= ahora.getHours() * 60 + ahora.getMinutes()) continue;
      lista.push(hora);
    }
  }
  return lista;
}

/* ---------- cambios ---------- */
export function guardarMascota(datos) {
  const limpio = {
    nombre: datos.nombre.trim(), especie: datos.especie, raza: datos.raza.trim(), sexo: datos.sexo,
    nacimiento: datos.nacimiento || "", peso: datos.peso === "" ? null : Number(datos.peso),
    color: datos.color.trim(), alergias: datos.alergias.trim() || "Ninguna conocida"
  };
  if (datos.id) {
    const m = mascota(datos.id);
    Object.assign(m, limpio);
    guardarTodo();
    return m;
  }
  const m = Object.assign({ id: nuevoId(), duenoId: Number(datos.duenoId) }, limpio);
  db.mascotas.push(m);
  guardarTodo();
  return m;
}

export function eliminarMascota(id) {
  id = Number(id);
  db.mascotas = db.mascotas.filter((m) => m.id !== id);
  db.citas = db.citas.filter((c) => c.mascotaId !== id);
  db.consultas = db.consultas.filter((c) => c.mascotaId !== id);
  db.vacunas = db.vacunas.filter((v) => v.mascotaId !== id);
  guardarTodo();
}

export function agendarCita({ mascotaId, veterinarioId, fecha, hora, motivo }) {
  if (fecha < hoy()) throw new Error("La fecha no puede estar en el pasado.");
  if (!horariosDisponibles(fecha, veterinarioId).includes(hora)) throw new Error("Ese horario ya no está disponible.");
  const c = { id: nuevoId(), mascotaId: Number(mascotaId), veterinarioId: Number(veterinarioId), fecha, hora, motivo: motivo.trim(), estado: "pendiente" };
  db.citas.push(c);
  guardarTodo();
  return c;
}

export function cambiarEstadoCita(id, estado) {
  const c = cita(id);
  if (c) {
    c.estado = estado;
    guardarTodo();
  }
  return c;
}

export function registrarConsulta(datos) {
  const consulta = {
    id: nuevoId(), mascotaId: Number(datos.mascotaId), veterinarioId: Number(datos.veterinarioId),
    citaId: datos.citaId ? Number(datos.citaId) : null, fecha: datos.fecha || hoy(),
    motivo: datos.motivo.trim(), peso: datos.peso === "" ? null : Number(datos.peso),
    temperatura: datos.temperatura === "" ? null : Number(datos.temperatura),
    diagnostico: datos.diagnostico.trim(), tratamiento: datos.tratamiento.trim(), notas: datos.notas.trim()
  };
  db.consultas.push(consulta);
  // la consulta actualiza el peso de la mascota y completa la cita
  if (consulta.peso) mascota(consulta.mascotaId).peso = consulta.peso;
  if (consulta.citaId) cambiarEstadoCita(consulta.citaId, "completada");
  guardarTodo();
  return consulta;
}

export function registrarVacuna(datos) {
  const v = { id: nuevoId(), mascotaId: Number(datos.mascotaId), nombre: datos.nombre.trim(), fecha: datos.fecha, proxima: datos.proxima || "", veterinarioId: Number(datos.veterinarioId) };
  db.vacunas.push(v);
  guardarTodo();
  return v;
}
