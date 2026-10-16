document.addEventListener("DOMContentLoaded", function () {

    // ==================================================
    // USUARIO ACTUAL
    // ==================================================

    const usuarioSesion =
        JSON.parse(localStorage.getItem("usuarioSesion"));

    const nombreUsuario =
        document.getElementById("nombreUsuario");

    if (nombreUsuario && usuarioSesion) {
        nombreUsuario.textContent = usuarioSesion.nombre;
    }

    // ==================================================
    // DATOS
    // ==================================================

    let citas = JSON.parse(localStorage.getItem("citas")) || [];
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // ==================================================
    // ELEMENTOS PRINCIPALES
    // ==================================================

    const tabla = document.querySelector(".appointments-table");
    const botonNuevaCita = document.getElementById("btnNuevaCita");
    const fechaCita = document.getElementById("fechaCita");
    const odontologo = document.getElementById("odontologo");
    const estadoCita = document.getElementById("estadoCita");
    const botonBuscar = document.querySelector(".filter-btn");

    // ==================================================
    // ELEMENTOS DEL MODAL
    // ==================================================

    const modalCita = document.getElementById("modalCita");
    const formCita = document.getElementById("formCita");
    const tituloModalCita = document.getElementById("tituloModalCita");
    const cerrarModalCita = document.getElementById("cerrarModalCita");
    const cancelarCita = document.getElementById("cancelarCita");
    const citaId = document.getElementById("citaId");
    const fechaModal = document.getElementById("fechaModal");
    const horaModal = document.getElementById("horaModal");
    const pacienteModal = document.getElementById("pacienteModal");
    const odontologoModal = document.getElementById("odontologoModal");
    const servicioModal = document.getElementById("servicioModal");
    const estadoModal = document.getElementById("estadoModal");

    // ==================================================
    // OCULTAR EL MODAL AL CARGAR LA PÁGINA
    // ==================================================

    if (modalCita) {
        modalCita.style.display = "none";
    }

    // ==================================================
    // GUARDAR CITAS
    // ==================================================

    function guardarCitas() {
        localStorage.setItem("citas", JSON.stringify(citas));
    }

    // ==================================================
    // FECHA
    // ==================================================

    function normalizarFecha(fecha) {
        if (!fecha) return "";

        fecha = String(fecha).trim();

        if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
            return fecha;
        }

        if (/^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) {
            const partes = fecha.split("/");
            return partes[2] + "-" + partes[1] + "-" + partes[0];
        }

        return fecha;
    }

    // ==================================================
    // HORA
    // ==================================================

    function normalizarHora(hora) {
        if (!hora) return "";

        hora = String(hora).trim().toUpperCase();

        const partesAMPM = hora.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);

        if (partesAMPM) {
            let horas = parseInt(partesAMPM[1], 10);
            const minutos = partesAMPM[2];
            const periodo = partesAMPM[3];

            if (periodo === "AM" && horas === 12) horas = 0;
            if (periodo === "PM" && horas !== 12) horas += 12;

            return String(horas).padStart(2, "0") + ":" + minutos;
        }

        const partes24 = hora.match(/^(\d{1,2}):(\d{2})$/);

        if (partes24) {
            return String(parseInt(partes24[1], 10)).padStart(2, "0") + ":" + partes24[2];
        }

        return hora;
    }

    function formatearHora(hora) {
        const horaNormalizada = normalizarHora(hora);

        if (!horaNormalizada) return "";

        const partes = horaNormalizada.split(":");

        if (partes.length !== 2) return hora;

        let horas = parseInt(partes[0], 10);
        const minutos = partes[1];
        const periodo = horas >= 12 ? "PM" : "AM";

        horas = horas % 12 || 12;

        return String(horas).padStart(2, "0") + ":" + minutos + " " + periodo;
    }

    // ==================================================
    // ESTADO
    // ==================================================

    function normalizarEstado(estado) {
        if (!estado) return "pendiente";

        const valor = String(estado).trim().toLowerCase();

        if (valor === "confirmada") return "confirmada";
        if (valor === "cancelada") return "cancelada";

        return "pendiente";
    }

    // ==================================================
    // ODONTÓLOGOS REALES DEL SISTEMA
    // ==================================================

    function obtenerOdontologos() {
        const odontologos = usuarios.filter(function (usuario) {
            const rol = String(usuario.rol || "").trim().toLowerCase();

            return rol === "odontólogo" || rol === "odontologo";
        });

        const resultado = [];
        const nombres = new Set();

        odontologos.forEach(function (usuario) {
            const nombre = String(usuario.nombre || "").trim();

            if (nombre && !nombres.has(nombre.toLowerCase())) {
                resultado.push({
                    nombre: nombre,
                    documento: usuario.documento || ""
                });

                nombres.add(nombre.toLowerCase());
            }
        });

        // IMPORTANTE:
        // Los odontólogos del sistema salen únicamente de "usuarios".
        // No agregamos nombres antiguos guardados en las citas porque
        // podrían tener títulos antiguos como "Dr." o "Dra.".

        return resultado;
    }

    function normalizarNombreOdontologo(nombreOdontologo, documentoOdontologo) {
        const nombreOriginal = String(nombreOdontologo || "").trim();
        const documento = String(documentoOdontologo || "").trim();

        if (!nombreOriginal && !documento) {
            return { nombre: "", documento: "" };
        }

        const odontologos = usuarios.filter(function (usuario) {
            const rol = String(usuario.rol || "").trim().toLowerCase();

            return rol === "odontólogo" || rol === "odontologo";
        });

        // Primero intentamos por documento.

        if (documento) {
            const porDocumento = odontologos.find(function (usuario) {
                return String(usuario.documento || "").trim() === documento;
            });

            if (porDocumento) {
                return {
                    nombre: String(porDocumento.nombre || "").trim(),
                    documento: String(porDocumento.documento || "").trim()
                };
            }
        }

        // Luego intentamos por nombre exacto.

        const porNombre = odontologos.find(function (usuario) {
            return String(usuario.nombre || "").trim().toLowerCase() === nombreOriginal.toLowerCase();
        });

        if (porNombre) {
            return {
                nombre: String(porNombre.nombre || "").trim(),
                documento: String(porNombre.documento || "").trim()
            };
        }

        // Compatibilidad con citas antiguas que tenían "Dr." o "Dra.".

        const nombreSinTitulo = nombreOriginal
            .replace(/^(dr\.?|dra\.?|doctor|doctora)\s+/i, "")
            .trim();

        const porNombreSinTitulo = odontologos.find(function (usuario) {
            return String(usuario.nombre || "").trim().toLowerCase() === nombreSinTitulo.toLowerCase();
        });

        if (porNombreSinTitulo) {
            return {
                nombre: String(porNombreSinTitulo.nombre || "").trim(),
                documento: String(porNombreSinTitulo.documento || "").trim()
            };
        }

        // Si la cita antigua solo tenía apellido, buscamos un único
        // odontólogo cuyo apellido coincida.

        const partes = nombreSinTitulo.split(/\s+/).filter(Boolean);

        const posibleApellido = partes.length
            ? partes[partes.length - 1].toLowerCase()
            : "";

        if (posibleApellido) {
            const coincidenciasApellido = odontologos.filter(function (usuario) {
                const partesUsuario = String(usuario.nombre || "").trim().split(/\s+/).filter(Boolean);

                const apellidoUsuario = partesUsuario.length
                    ? partesUsuario[partesUsuario.length - 1].toLowerCase()
                    : "";

                return apellidoUsuario === posibleApellido;
            });

            if (coincidenciasApellido.length === 1) {
                return {
                    nombre: String(coincidenciasApellido[0].nombre || "").trim(),
                    documento: String(coincidenciasApellido[0].documento || "").trim()
                };
            }
        }

        return {
            nombre: nombreSinTitulo,
            documento: documento
        };
    }

    function cargarOdontologos() {
        const lista = obtenerOdontologos();

        if (odontologo) {
            odontologo.innerHTML = `
                <option value="todos">
                    Todos
                </option>
            `;

            lista.forEach(function (doctor) {
                const opcion = document.createElement("option");

                opcion.value = doctor.nombre;
                opcion.textContent = doctor.nombre;

                odontologo.appendChild(opcion);
            });
        }

        if (odontologoModal) {
            odontologoModal.innerHTML = `
                <option value="">
                    Selecciona un odontólogo
                </option>
            `;

            lista.forEach(function (doctor) {
                const opcion = document.createElement("option");

                opcion.value = doctor.nombre;
                opcion.textContent = doctor.nombre;

                odontologoModal.appendChild(opcion);
            });
        }
    }

    function cargarOdontologoEnSelect(nombreOdontologo, documentoOdontologo) {
        const nombre = String(nombreOdontologo || "").trim();
        const documento = String(documentoOdontologo || "").trim();

        if (!nombre && !documento) {
            odontologoModal.value = "";
            return;
        }

        let doctor = obtenerOdontologos().find(function (item) {
            return item.nombre.toLowerCase() === nombre.toLowerCase();
        });

        if (!doctor && documento) {
            doctor = obtenerOdontologos().find(function (item) {
                return String(item.documento) === documento;
            });
        }

        if (doctor) {
            odontologoModal.value = doctor.nombre;
            return;
        }

        // Último recurso: conservar exactamente el nombre guardado.

        const nuevaOpcion = document.createElement("option");

        nuevaOpcion.value = nombre;
        nuevaOpcion.textContent = nombre;

        odontologoModal.appendChild(nuevaOpcion);
        odontologoModal.value = nombre;
    }

    // ==================================================
    // NORMALIZAR CITAS EXISTENTES
    // ==================================================

    let huboCambios = false;

    citas = citas.map(function (cita) {
        const nueva = { ...cita };

        const fecha = normalizarFecha(nueva.fecha);
        const hora = normalizarHora(nueva.hora);
        const estado = normalizarEstado(nueva.estado);

        const odontologoNormalizado = normalizarNombreOdontologo(
            nueva.odontologo,
            nueva.odontologoDocumento
        );

        if (nueva.fecha !== fecha) {
            nueva.fecha = fecha;
            huboCambios = true;
        }

        if (nueva.hora !== hora) {
            nueva.hora = hora;
            huboCambios = true;
        }

        if (nueva.estado !== estado) {
            nueva.estado = estado;
            huboCambios = true;
        }

        if (nueva.servicio === undefined || nueva.servicio === null) {
            nueva.servicio = "";
            huboCambios = true;
        }

        if (nueva.odontologo !== odontologoNormalizado.nombre) {
            nueva.odontologo = odontologoNormalizado.nombre;
            huboCambios = true;
        }

        if (
            odontologoNormalizado.documento &&
            nueva.odontologoDocumento !== odontologoNormalizado.documento
        ) {
            nueva.odontologoDocumento = odontologoNormalizado.documento;
            huboCambios = true;
        }

        return nueva;
    });

    if (huboCambios) {
        guardarCitas();
    }

    // Cargamos los odontólogos después de limpiar las citas antiguas.

    cargarOdontologos();

    // ==================================================
    // MOSTRAR CITAS
    // ==================================================

    function mostrarCitas(lista = citas) {
        if (!tabla) return;

        const filas = tabla.querySelectorAll(".table-row:not(.table-header)");

        filas.forEach(function (fila) {
            fila.remove();
        });

        if (lista.length === 0) {
            const fila = document.createElement("div");

            fila.className = "table-row";

            fila.innerHTML = `
                <span>-</span>
                <span>No hay citas registradas</span>
                <span>-</span>
                <span>-</span>
                <span>-</span>
                <span>-</span>
            `;

            tabla.appendChild(fila);

            actualizarResumen(lista);
            return;
        }

        lista.forEach(function (cita) {
            const fila = document.createElement("div");

            fila.className = "table-row";

            const estado = normalizarEstado(cita.estado);

            let claseEstado = "pending";
            let textoEstado = "Pendiente";

            if (estado === "confirmada") {
                claseEstado = "confirmed";
                textoEstado = "Confirmada";
            }

            if (estado === "cancelada") {
                claseEstado = "cancelled";
                textoEstado = "Cancelada";
            }

            fila.innerHTML = `
                <span>${formatearHora(cita.hora)}</span>
                <span>${cita.paciente || "Sin paciente"}</span>
                <span>${cita.odontologo || "Sin odontólogo"}</span>
                <span>${cita.servicio || "No registrado"}</span>
                <span class="status ${claseEstado}">${textoEstado}</span>
                <span class="actions">
                    <button type="button" class="btn-action btn-ver" data-id="${cita.id}">Ver</button>
                    <button type="button" class="btn-action btn-editar" data-id="${cita.id}">Editar</button>
                </span>
            `;

            tabla.appendChild(fila);
        });

        agregarEventos();
        actualizarResumen(lista);
    }

    // ==================================================
    // FILTROS
    // ==================================================

    function aplicarFiltros() {
        const fecha = fechaCita ? fechaCita.value : "";
        const doctor = odontologo ? odontologo.value : "todos";
        const estado = estadoCita ? estadoCita.value : "todas";

        const resultados = citas.filter(function (cita) {
            const coincideFecha =
                !fecha || normalizarFecha(cita.fecha) === fecha;

            const coincideDoctor =
                doctor === "todos" ||
                String(cita.odontologo || "").trim().toLowerCase() === doctor.trim().toLowerCase();

            const coincideEstado =
                estado === "todas" || normalizarEstado(cita.estado) === estado;

            return coincideFecha && coincideDoctor && coincideEstado;
        });

        mostrarCitas(resultados);
    }

    if (botonBuscar) {
        botonBuscar.addEventListener("click", aplicarFiltros);
    }

    // ==================================================
    // RESUMEN
    // ==================================================

    function actualizarResumen(lista) {
        const tarjetas = document.querySelectorAll(".summary-card strong");

        if (tarjetas.length < 4) return;

        tarjetas[0].textContent = lista.length;

        tarjetas[1].textContent = lista.filter(function (cita) {
            return normalizarEstado(cita.estado) === "confirmada";
        }).length;

        tarjetas[2].textContent = lista.filter(function (cita) {
            return normalizarEstado(cita.estado) === "pendiente";
        }).length;

        tarjetas[3].textContent = lista.filter(function (cita) {
            return normalizarEstado(cita.estado) === "cancelada";
        }).length;
    }

    // ==================================================
    // MODAL
    // ==================================================

    function abrirModal() {
        if (modalCita) {
            modalCita.style.display = "flex";
        }
    }

    function cerrarModal() {
        if (!modalCita) return;

        modalCita.style.display = "none";

        if (formCita) {
            formCita.reset();
        }

        if (citaId) {
            citaId.value = "";
        }

        cargarOdontologos();
        habilitarCampos();
    }

    function habilitarCampos() {
        if (fechaModal) fechaModal.disabled = false;
        if (horaModal) horaModal.disabled = false;
        if (pacienteModal) pacienteModal.disabled = false;
        if (odontologoModal) odontologoModal.disabled = false;
        if (servicioModal) servicioModal.disabled = false;
        if (estadoModal) estadoModal.disabled = false;

        const botonGuardar = formCita
            ? formCita.querySelector("button[type='submit']")
            : null;

        if (botonGuardar) {
            botonGuardar.style.display = "block";
        }

        if (cancelarCita) {
            cancelarCita.textContent = "Cancelar";
        }
    }

    function deshabilitarCampos() {
        if (fechaModal) fechaModal.disabled = true;
        if (horaModal) horaModal.disabled = true;
        if (pacienteModal) pacienteModal.disabled = true;
        if (odontologoModal) odontologoModal.disabled = true;
        if (servicioModal) servicioModal.disabled = true;
        if (estadoModal) estadoModal.disabled = true;

        const botonGuardar = formCita
            ? formCita.querySelector("button[type='submit']")
            : null;

        if (botonGuardar) {
            botonGuardar.style.display = "none";
        }

        if (cancelarCita) {
            cancelarCita.textContent = "Cerrar";
        }
    }

    // ==================================================
    // VER CITA
    // ==================================================

    function verCita(id) {
        const cita = citas.find(function (item) {
            return String(item.id) === String(id);
        });

        if (!cita) return;

        tituloModalCita.textContent = "Información de la cita";
        citaId.value = cita.id;
        fechaModal.value = normalizarFecha(cita.fecha);
        horaModal.value = normalizarHora(cita.hora);
        pacienteModal.value = cita.paciente || "";

        cargarOdontologoEnSelect(
            cita.odontologo,
            cita.odontologoDocumento
        );

        servicioModal.value = cita.servicio || "";
        estadoModal.value = normalizarEstado(cita.estado);

        deshabilitarCampos();
        abrirModal();
    }

    // ==================================================
    // EDITAR CITA
    // ==================================================

    function editarCita(id) {
        const cita = citas.find(function (item) {
            return String(item.id) === String(id);
        });

        if (!cita) return;

        tituloModalCita.textContent = "Editar cita";
        citaId.value = cita.id;
        fechaModal.value = normalizarFecha(cita.fecha);
        horaModal.value = normalizarHora(cita.hora);
        pacienteModal.value = cita.paciente || "";

        cargarOdontologoEnSelect(
            cita.odontologo,
            cita.odontologoDocumento
        );

        servicioModal.value = cita.servicio || "";
        estadoModal.value = normalizarEstado(cita.estado);

        habilitarCampos();
        abrirModal();
    }

    // ==================================================
    // NUEVA CITA
    // ==================================================

    function nuevaCita() {
        tituloModalCita.textContent = "Nueva cita";

        formCita.reset();
        citaId.value = "";

        cargarOdontologos();
        habilitarCampos();

        estadoModal.value = "pendiente";

        abrirModal();
    }

    // ==================================================
    // GUARDAR CITA
    // ==================================================

    if (formCita) {
        formCita.addEventListener("submit", function (evento) {
            evento.preventDefault();

            const id = citaId.value;
            const fecha = fechaModal.value.trim();
            const hora = normalizarHora(horaModal.value.trim());
            const paciente = pacienteModal.value.trim();
            const odontologoSeleccionado = odontologoModal.value.trim();
            const servicio = servicioModal.value.trim();
            const estado = normalizarEstado(estadoModal.value);

            if (
                !fecha ||
                !hora ||
                !paciente ||
                !odontologoSeleccionado ||
                !servicio
            ) {
                alert("Por favor, completa todos los campos.");
                return;
            }

            const doctorUsuario = usuarios.find(function (usuario) {
                return String(usuario.nombre || "").trim().toLowerCase() === odontologoSeleccionado.toLowerCase();
            });

            const odontologoDocumento = doctorUsuario
                ? (doctorUsuario.documento || "")
                : "";

            const citaDuplicada = citas.some(function (cita) {
                return (
                    String(cita.id) !== String(id) &&
                    normalizarFecha(cita.fecha) === fecha &&
                    normalizarHora(cita.hora) === hora &&
                    String(cita.odontologo || "").trim().toLowerCase() === odontologoSeleccionado.toLowerCase() &&
                    normalizarEstado(cita.estado) !== "cancelada"
                );
            });

            if (citaDuplicada) {
                alert("Ya existe una cita activa para ese odontólogo en la misma fecha y hora.");
                return;
            }

            // ACTUALIZAR CITA EXISTENTE

            if (id) {
                const cita = citas.find(function (item) {
                    return String(item.id) === String(id);
                });

                if (!cita) return;

                cita.fecha = fecha;
                cita.hora = hora;
                cita.paciente = paciente;
                cita.odontologo = odontologoSeleccionado;
                cita.odontologoDocumento = odontologoDocumento;
                cita.servicio = servicio;
                cita.estado = estado;

                guardarCitas();
                mostrarCitas();
                cerrarModal();

                alert("Cita actualizada correctamente.");
                return;
            }

            // REGISTRAR NUEVA CITA

            citas.push({
                id: Date.now(),
                fecha: fecha,
                hora: hora,
                paciente: paciente,
                odontologo: odontologoSeleccionado,
                odontologoDocumento: odontologoDocumento,
                servicio: servicio,
                estado: estado
            });

            guardarCitas();
            mostrarCitas();
            cerrarModal();

            alert("Cita registrada correctamente.");
        });
    }

    // ==================================================
    // EVENTOS DE VER / EDITAR
    // ==================================================

    function agregarEventos() {
        document.querySelectorAll(".btn-ver").forEach(function (boton) {
            boton.addEventListener("click", function () {
                verCita(boton.dataset.id);
            });
        });

        document.querySelectorAll(".btn-editar").forEach(function (boton) {
            boton.addEventListener("click", function () {
                editarCita(boton.dataset.id);
            });
        });
    }

    // ==================================================
    // EVENTOS DEL MODAL
    // ==================================================

    if (botonNuevaCita) {
        botonNuevaCita.addEventListener("click", nuevaCita);
    }

    if (cerrarModalCita) {
        cerrarModalCita.addEventListener("click", cerrarModal);
    }

    if (cancelarCita) {
        cancelarCita.addEventListener("click", cerrarModal);
    }

    if (modalCita) {
        modalCita.addEventListener("click", function (evento) {
            if (evento.target === modalCita) {
                cerrarModal();
            }
        });
    }

    // ==================================================
    // CARGAR PANTALLA
    // ==================================================

    mostrarCitas();

});







