# Huellitas · Clínica veterinaria

Aplicación web para una clínica veterinaria: los clientes registran a sus
mascotas y agendan citas, y el equipo veterinario lleva la agenda del día y el
expediente clínico de cada paciente.

Hecha con **HTML, CSS y JavaScript** (módulos ES), sin frameworks ni compilación.
Los datos se guardan en el navegador con `localStorage`, como si fuera la base
de datos, y se cargan datos de ejemplo la primera vez.

## Funcionalidades

**Cliente (dueño de mascotas)**
- Registro de cuenta e inicio de sesión
- Registrar, editar y eliminar mascotas (especie, raza, edad, peso, alergias)
- Agendar citas eligiendo veterinario, fecha y un horario libre
- Ver y cancelar sus citas; historial de citas
- Consultar el expediente de cada mascota y recordatorios de vacunas

**Veterinario**
- Agenda diaria con indicadores (citas, atendidas, por confirmar, vacunas por vencer)
- Confirmar citas, marcar inasistencia, cancelar y agendar citas nuevas
- Atender una cita: registrar consulta (motivo, peso, temperatura, diagnóstico,
  tratamiento y notas) — la cita queda como atendida y el peso se actualiza
- Registrar vacunas con la fecha de la próxima dosis
- Lista de pacientes con búsqueda por mascota, raza, dueño o teléfono

**Reglas de negocio**
- Horario: lunes a viernes de 8:00 a 17:00 y sábados hasta las 12:00, citas cada 30 minutos
- No se pueden agendar citas en el pasado ni en un horario ocupado
- Validación de formularios (peso, temperatura, teléfono, campos obligatorios)
- Una vacuna vencida deja de alertar cuando se aplica una dosis nueva

## Cuentas de prueba
| Rol | Correo | Contraseña |
|---|---|---|
| Veterinaria | `andrea@huellitas.cr` | `vet1234` |
| Cliente | `laura@correo.com` | `cliente1234` |

El botón **Restablecer datos de demo** del menú vuelve a los datos de ejemplo.

## Cómo correrlo
Usa módulos de JavaScript, así que necesita un servidor local:
abrí la carpeta en VS Code y usá **Live Server** sobre `index.html`.

## Estructura
```
index.html
css/estilos.css
js/datos.js   → datos, reglas y almacenamiento
js/ui.js      → formato de fechas, avisos y ventanas modales
js/app.js     → enrutador por hash y pantallas de cada rol
```

---
Camila Barrantes (Mila) · [Portafolio](https://milabarrantesdev.github.io)
