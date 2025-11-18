// Espera a que el contenido del documento esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {

  // Obtiene el rol del usuario almacenado al iniciar sesión
  const rol = localStorage.getItem("rol");

  // Si no hay rol guardado (es decir, no se inició sesión), redirige al login
  if (!rol) {
    window.location.href = "index.html";
    return; // Detiene la ejecución del resto del código
  }

  // --- Lista de alumnos (cada uno con un id y un nombre) ---
  const alumnos = [
    { id: 1, nombre: "Goku" },
    { id: 2, nombre: "Vegeta" },
    { id: 3, nombre: "Gohan" },
    { id: 4, nombre: "Piccolo" },
    { id: 5, nombre: "Krillin" }
  ];

  // ==============================
  //   SECCIÓN PARA EL PRECEPTOR
  // ==============================

  // Verifica si la página tiene la tabla de alumnos (solo existe en preceptor.html)
  if (document.body.contains(document.getElementById("tablaAlumnos"))) {
    
    const tabla = document.querySelector("#tablaAlumnos tbody"); // Cuerpo de la tabla
    const fechaInput = document.getElementById("fecha"); // Campo de selección de fecha
    fechaInput.valueAsDate = new Date(); // Coloca la fecha actual por defecto

    // Crea dinámicamente las filas de alumnos
    alumnos.forEach(al => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${al.nombre}</td>
        <td class="has-text-success"><input type="checkbox" data-id="${al.id}" data-estado="Presente"></td>
        <td class="has-text-warning"><input type="checkbox" data-id="${al.id}" data-estado="Tarde"></td>
        <td class="has-text-danger"><input type="checkbox" data-id="${al.id}" data-estado="Ausente"></td>
      `;
      tabla.appendChild(fila); // Agrega cada fila a la tabla
    });

    // --- Evento al presionar el botón "Guardar Asistencias" ---
    document.getElementById("btnGuardar").addEventListener("click", () => {
      const fecha = fechaInput.value; // Obtiene la fecha seleccionada
      if (!fecha) return alert("Seleccioná una fecha."); // Si no hay fecha, muestra alerta

      // Selecciona todos los checkbox marcados
      const checkboxes = document.querySelectorAll("#tablaAlumnos input[type='checkbox']");
      let asistencias = JSON.parse(localStorage.getItem("asistencias")) || {}; // Carga los datos guardados o crea uno nuevo
      if (!asistencias[fecha]) asistencias[fecha] = []; // Si no existe la fecha, crea una lista vacía

      // Recorre todos los checkbox
      checkboxes.forEach(chk => {
        const id = parseInt(chk.dataset.id); // Id del alumno
        const estado = chk.dataset.estado;   // Estado (Presente, Tarde o Ausente)
        const fila = chk.closest("tr");      // Fila actual

        // Si el checkbox está marcado, guarda la asistencia
        if (chk.checked) {
          const alumno = alumnos.find(a => a.id === id);
          asistencias[fecha].push({ id, nombre: alumno.nombre, estado });

          // Cambia el color de la fila según el estado elegido
          fila.classList.remove("is-success", "is-warning", "is-danger");
          if (estado === "Presente") fila.classList.add("is-success");
          if (estado === "Tarde") fila.classList.add("is-warning");
          if (estado === "Ausente") fila.classList.add("is-danger");
        }
      });

      // Guarda las asistencias actualizadas en el almacenamiento local
      localStorage.setItem("asistencias", JSON.stringify(asistencias));
      alert("Asistencias guardadas correctamente."); // Mensaje de confirmación
    });

    // --- Asegura que solo se pueda marcar UNA opción por alumno ---
    const allCheckboxes = document.querySelectorAll("#tablaAlumnos input[type='checkbox']");
    allCheckboxes.forEach(chk => {
      chk.addEventListener("change", () => {
        if (chk.checked) {
          const id = chk.dataset.id; // Id del alumno
          // Desmarca los otros checkbox del mismo alumno
          document.querySelectorAll(`#tablaAlumnos input[data-id='${id}']`).forEach(c => {
            if (c !== chk) c.checked = false;
          });
        }
      });
    });
  } // Fin de la sección del preceptor
}); // Fin del DOMContentLoaded

// ===========================
//   SECCIÓN PARA EL ADMIN
// ===========================

// Verifica si la página tiene una tabla de reportes (solo en admin.html)
if (document.body.contains(document.getElementById("tablaReporte"))) {
  const btnVer = document.getElementById("btnVer"); // Botón "Ver asistencias"
  const tablaReporte = document.querySelector("#tablaReporte tbody"); // Cuerpo de la tabla donde se mostrarán los datos

  // --- Al hacer clic en "Ver asistencias" ---
  btnVer.addEventListener("click", () => {
    const fecha = document.getElementById("fechaReporte").value; // Fecha seleccionada
    if (!fecha) return alert("Seleccioná una fecha."); // Si no hay fecha, muestra alerta
    tablaReporte.innerHTML = ""; // Limpia la tabla antes de mostrar nuevos datos

    // Carga las asistencias guardadas desde localStorage
    const asistencias = JSON.parse(localStorage.getItem("asistencias")) || {};
    const registros = asistencias[fecha] || []; // Obtiene los registros de esa fecha

    // Si no hay registros para esa fecha
    if (registros.length === 0) {
      tablaReporte.innerHTML = `<tr><td colspan="4">No hay asistencias registradas para esta fecha.</td></tr>`;
      return;
    }

    // Si existen registros, crea una fila por alumno
    registros.forEach(r => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${r.nombre}</td>
        <td class="has-text-success">${r.estado === "Presente" ? "✔" : ""}</td>
        <td class="has-text-warning">${r.estado === "Tarde" ? "✔" : ""}</td>
        <td class="has-text-danger">${r.estado === "Ausente" ? "✔" : ""}</td>
      `;
      tablaReporte.appendChild(fila); // Agrega la fila a la tabla
    });
  });
}
