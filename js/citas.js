// ==========================================
// CITAS - CRUD COMPLETO
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    const tablaCitas = document.querySelector(".appointments-table");
    const botonNuevaCita = document.querySelector(".page-heading .btn-principal");
    const botonBuscar = document.querySelector(".filter-btn");
    const filtroFecha = document.getElementById("fecha");
    const filtroEstado = document.getElementById("estado");

    const STORAGE_KEY = "citas";
    const USUARIOS_KEY = "usuarios";
    const PACIENTES_KEY = "pacientes";

    // =========================
    // MOSTRAR USUARIO ACTUAL
    // =========================
    const usuarioSesion = JSON.parse(localStorage.getItem("usuarioSesion"));
    const nombreUsuario = document.getElementById("nombreUsuario");

    if (nombreUsuario && usuarioSesion) {
        nombreUsuario.textContent = usuarioSesion.nombre;
    }

    // ==========================================
    // GENERAR ID ÚNICO
    // ==========================================
    function generarIdCita() {
        return (
            "CITA-" +
            Date.now() +
            "-" +
            Math.random().toString(36).substring(2, 8)
        );
    }

    // ==========================================
    // OBTENER PACIENTES
    // ==========================================
    function obtenerPacientes() {
        return JSON.parse(localStorage.getItem(PACIENTES_KEY)) || [];
    }

    // ==========================================
    // BUSCAR PACIENTE POR NOMBRE
    // ==========================================
    function obtenerPacientePorNombre(nombre) {
        const pacientes = obtenerPacientes();

        if (!nombre) {
            return null;
        }

        return pacientes.find(function (paciente) {
            return (
                paciente.nombre.trim().toLowerCase() ===
                nombre.trim().toLowerCase()
            );
        }) || null;
    }

    // ==========================================
    // DATOS INICIALES
    // ==========================================
    const citasIniciales = [
        {
            id: generarIdCita(),
            pacienteDocumento: "",
            paciente: "Laura Gómez",
            odontologo: "Carlos Pérez",
            fecha: "08/08/2026",
            hora: "09:00 AM",
            estado: "Confirmada"
        },
        {
            id: generarIdCita(),
            pacienteDocumento: "",
            paciente: "Carlos Rodríguez",
            odontologo: "Carlos Pérez",
            fecha: "08/08/2026",
            hora: "10:30 AM",
            estado: "Pendiente"
        },
        {
            id: generarIdCita(),
            pacienteDocumento: "",
            paciente: "Ana Torres",
            odontologo: "Carlos Pérez",
            fecha: "08/08/2026",
            hora: "02:00 PM",
            estado: "Confirmada"
        },
        {
            id: generarIdCita(),
            pacienteDocumento: "",
            paciente: "Andrés Martínez",
            odontologo: "Carlos Pérez",
            fecha: "08/08/2026",
            hora: "03:30 PM",
            estado: "Cancelada"
        }
    ];

    // ==========================================
    // CARGAR DATOS
    // ==========================================
    let citas = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (!citas || !Array.isArray(citas) || citas.length === 0) {
        citas = citasIniciales;
        guardarCitas();
    }

    // ==========================================
    // GUARDAR EN LOCALSTORAGE
    // ==========================================
    function guardarCitas() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(citas));
    }

    // ==========================================
    // MIGRAR CITAS ANTIGUAS
    // ==========================================
    function migrarCitas() {
        let huboCambios = false;

        citas = citas.map(function (cita) {
            if (!cita.id || typeof cita.id === "number") {
                cita.id = generarIdCita();
                huboCambios = true;
            }

            if (cita.pacienteDocumento && cita.pacienteDocumento !== "") {
                return cita;
            }

            const pacienteEncontrado = obtenerPacientePorNombre(cita.paciente);

            if (pacienteEncontrado) {
                cita.pacienteDocumento = pacienteEncontrado.documento;
                cita.paciente = pacienteEncontrado.nombre;
                huboCambios = true;
            } else {
                console.warn(
                    "No se encontró el documento del paciente:",
                    cita.paciente
                );

                if (!cita.pacienteDocumento) {
                    cita.pacienteDocumento = "";
                    huboCambios = true;
                }
            }

            return cita;
        });

        if (huboCambios) {
            guardarCitas();
            console.log("Migración de citas completada.");
        }
    }

    migrarCitas();

    // ==========================================
    // OBTENER ODONTÓLOGOS ACTIVOS
    // ==========================================
    function obtenerOdontologos() {
        const usuarios = JSON.parse(localStorage.getItem(USUARIOS_KEY)) || [];

        return usuarios.filter(function (usuario) {
            return (
                usuario.rol === "Odontólogo" &&
                usuario.estado === "Activo"
            );
        });
    }

    // ==========================================
    // GENERAR OPCIONES DE ODONTÓLOGOS
    // ==========================================
    function generarOpcionesOdontologos(odontologoSeleccionado = "") {
        const odontologos = obtenerOdontologos();

        let opciones = `
            <option value="">
                Seleccione un odontólogo
            </option>
        `;

        odontologos.forEach(function (odontologo) {
            const seleccionado =
                odontologo.nombre === odontologoSeleccionado
                    ? "selected"
                    : "";

            opciones += `
                <option value="${odontologo.nombre}" ${seleccionado}>
                    ${odontologo.nombre}
                </option>
            `;
        });

        return opciones;
    }

    // ==========================================
    // CONVERTIR FECHA DD/MM/YYYY A YYYY-MM-DD
    // ==========================================
    function convertirFechaParaInput(fecha) {
        if (!fecha || !fecha.includes("/")) {
            return "";
        }

        const partes = fecha.split("/");

        return partes[2] + "-" + partes[1] + "-" + partes[0];
    }

    // ==========================================
    // CONVERTIR FECHA YYYY-MM-DD A DD/MM/YYYY
    // ==========================================
    function convertirFechaParaMostrar(fecha) {
        if (!fecha || !fecha.includes("-")) {
            return fecha;
        }

        const partes = fecha.split("-");

        return partes[2] + "/" + partes[1] + "/" + partes[0];
    }

    // ==========================================
    // CONVERTIR HORA 24H A AM/PM
    // ==========================================
    function convertirHoraParaMostrar(hora) {
        if (!hora) {
            return "";
        }

        const partes = hora.split(":");

        if (partes.length !== 2) {
            return hora;
        }

        let horas = parseInt(partes[0]);
        const minutos = partes[1];
        const periodo = horas >= 12 ? "PM" : "AM";

        if (horas === 0) {
            horas = 12;
        } else if (horas > 12) {
            horas -= 12;
        }

        return (
            String(horas).padStart(2, "0") +
            ":" +
            minutos +
            " " +
            periodo
        );
    }

    // ==========================================
    // OBTENER CLASE DEL ESTADO
    // ==========================================
    function obtenerClaseEstado(estado) {
        const estadoNormalizado = String(estado || "")
            .trim()
            .toLocaleLowerCase("es")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        if (
            estadoNormalizado === "confirmada" ||
            estadoNormalizado === "confirmado"
        ) {
            return "confirmada";
        }

        if (
            estadoNormalizado === "cancelada" ||
            estadoNormalizado === "cancelado"
        ) {
            return "cancelada";
        }

        return "pendiente";
    }

    // ==========================================
    // OBTENER TEXTO DEL ESTADO
    // ==========================================
    function obtenerTextoEstado(estado) {
        const clase = obtenerClaseEstado(estado);

        if (clase === "confirmada") {
            return "Confirmada";
        }

        if (clase === "cancelada") {
            return "Cancelada";
        }

        return "Pendiente";
    }

    // ==========================================
    // RENDERIZAR TABLA
    // ==========================================
    function renderizarCitas(lista = citas) {
        if (!tablaCitas) {
            return;
        }

        tablaCitas.innerHTML = `
            <div class="table-row table-header">
                <span>Paciente</span>
                <span>Odontólogo</span>
                <span>Fecha</span>
                <span>Hora</span>
                <span>Estado</span>
                <span>Acciones</span>
            </div>
        `;

        if (lista.length === 0) {
            const filaVacia = document.createElement("div");
            filaVacia.className = "table-row fila-vacia";

            filaVacia.innerHTML = `
                <span style="grid-column: 1 / -1; text-align: center;">
                    No se encontraron citas.
                </span>
            `;

            tablaCitas.appendChild(filaVacia);
            return;
        }

        lista.forEach(function (cita) {
            const fila = document.createElement("div");
            fila.className = "table-row";
            fila.dataset.id = cita.id;

            fila.innerHTML = `
                <span>${cita.paciente}</span>
                <span>${cita.odontologo}</span>
                <span>${cita.fecha}</span>
                <span>${cita.hora}</span>

                <span class="estado-cita ${obtenerClaseEstado(cita.estado)}">
                    ${obtenerTextoEstado(cita.estado)}
                </span>

                <span class="acciones-cita">
                    <button
                        class="btn-accion btn-ver"
                        data-id="${cita.id}"
                        title="Ver cita"
                    >
                        Ver
                    </button>

                    <button
                        class="btn-accion btn-editar"
                        data-id="${cita.id}"
                        title="Editar cita"
                    >
                        Editar
                    </button>

                    <button
                        class="btn-accion btn-eliminar"
                        data-id="${cita.id}"
                        title="Eliminar cita"
                    >
                        Eliminar
                    </button>
                </span>
            `;

            tablaCitas.appendChild(fila);
        });

        activarBotonesAcciones();
    }

    // ==========================================
    // FILTRAR CITAS
    // ==========================================
    function filtrarCitas() {
        const fechaSeleccionada = filtroFecha ? filtroFecha.value : "";
        const estadoSeleccionado = filtroEstado ? filtroEstado.value : "todas";

        const resultado = citas.filter(function (cita) {
            let coincideFecha = true;
            let coincideEstado = true;

            if (fechaSeleccionada !== "") {
                const fechaCita = convertirFechaParaInput(cita.fecha);
                coincideFecha = fechaCita === fechaSeleccionada;
            }

            if (estadoSeleccionado !== "todas") {
                coincideEstado =
                    obtenerClaseEstado(cita.estado) ===
                    obtenerClaseEstado(estadoSeleccionado);
            }

            return coincideFecha && coincideEstado;
        });

        renderizarCitas(resultado);
    }

    // ==========================================
    // MODAL NUEVA CITA
    // ==========================================
    function abrirModalNuevaCita() {
        const modal = document.createElement("div");
        modal.className = "modal-cita";

        modal.innerHTML = `
            <div class="modal-contenido">
                <div class="modal-header">
                    <div>
                        <h2>Nueva cita</h2>
                        <p>Registra una nueva cita odontológica.</p>
                    </div>
                    <button class="modal-cerrar" type="button">×</button>
                </div>

                <form id="formCita">
                    <div class="form-group">
                        <label for="citaPaciente">Paciente</label>
                        <input
                            type="text"
                            id="citaPaciente"
                            placeholder="Nombre del paciente"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label for="citaOdontologo">Odontólogo</label>
                        <select id="citaOdontologo" required>
                            ${generarOpcionesOdontologos()}
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="citaFecha">Fecha</label>
                        <input type="date" id="citaFecha" required>
                    </div>

                    <div class="form-group">
                        <label for="citaHora">Hora</label>
                        <input type="time" id="citaHora" required>
                    </div>

                    <div class="form-group">
                        <label for="citaEstado">Estado</label>
                        <select id="citaEstado" required>
                            <option value="Confirmada">Confirmada</option>
                            <option value="Pendiente" selected>Pendiente</option>
                            <option value="Cancelada">Cancelada</option>
                        </select>
                    </div>

                    <div class="modal-acciones">
                        <button type="button" class="btn btn-secondary btn-cancelar">
                            Cancelar
                        </button>
                        <button type="submit" class="btn btn-primary">
                            Guardar cita
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        function cerrarModal() {
            modal.remove();
        }

        modal.querySelector(".modal-cerrar").addEventListener("click", cerrarModal);
        modal.querySelector(".btn-cancelar").addEventListener("click", cerrarModal);

        modal.addEventListener("click", function (e) {
            if (e.target === modal) {
                cerrarModal();
            }
        });

        modal.querySelector("#formCita").addEventListener("submit", function (e) {
            e.preventDefault();

            const paciente = document.getElementById("citaPaciente").value.trim();
            const odontologo = document.getElementById("citaOdontologo").value;
            const fecha = document.getElementById("citaFecha").value;
            const hora = document.getElementById("citaHora").value;
            const estado = document.getElementById("citaEstado").value;

            if (!paciente || !odontologo || !fecha || !hora) {
                alert("Por favor completa todos los campos.");
                return;
            }

            const pacienteEncontrado = obtenerPacientePorNombre(paciente);

            if (!pacienteEncontrado) {
                alert(
                    "El paciente no existe en el sistema. Verifica el nombre e inténtalo nuevamente."
                );
                return;
            }

            const fechaMostrar = convertirFechaParaMostrar(fecha);
            const horaMostrar = convertirHoraParaMostrar(hora);

            const citaExistente = citas.some(function (cita) {
                return (
                    cita.odontologo.toLowerCase() === odontologo.toLowerCase() &&
                    cita.fecha === fechaMostrar &&
                    cita.hora === horaMostrar &&
                    obtenerClaseEstado(cita.estado) !== "cancelada"
                );
            });

            if (citaExistente) {
                alert(
                    "Ya existe una cita activa para ese odontólogo en la misma fecha y hora."
                );
                return;
            }

            const nuevaCita = {
                id: generarIdCita(),
                pacienteDocumento: pacienteEncontrado.documento,
                paciente: pacienteEncontrado.nombre,
                odontologo: odontologo,
                fecha: fechaMostrar,
                hora: horaMostrar,
                estado: estado
            };

            citas.push(nuevaCita);
            guardarCitas();
            renderizarCitas();
            cerrarModal();

            alert("Cita registrada correctamente.");
        });
    }

    // ==========================================
    // VER CITA
    // ==========================================
    function verCita(id) {
        const cita = citas.find(function (item) {
            return item.id == id;
        });

        if (!cita) {
            return;
        }

        const modal = document.createElement("div");
        modal.className = "modal-cita";

        modal.innerHTML = `
            <div class="modal-contenido">
                <div class="modal-header">
                    <div>
                        <h2>Detalle de la cita</h2>
                        <p>Información registrada de la cita.</p>
                    </div>
                    <button class="modal-cerrar" type="button">×</button>
                </div>

                <div class="datos-cita">
                    <div class="dato">
                        <strong>Paciente</strong>
                        <span>${cita.paciente}</span>
                    </div>

                    <div class="dato">
                        <strong>Documento</strong>
                        <span>${cita.pacienteDocumento || "No registrado"}</span>
                    </div>

                    <div class="dato">
                        <strong>Odontólogo</strong>
                        <span>${cita.odontologo}</span>
                    </div>

                    <div class="dato">
                        <strong>Fecha</strong>
                        <span>${cita.fecha}</span>
                    </div>

                    <div class="dato">
                        <strong>Hora</strong>
                        <span>${cita.hora}</span>
                    </div>

                    <div class="dato">
                        <strong>Estado</strong>
                        <span class="estado-cita ${obtenerClaseEstado(cita.estado)}">
                            ${obtenerTextoEstado(cita.estado)}
                        </span>
                    </div>
                </div>

                <div class="modal-acciones">
                    <button type="button" class="btn btn-secondary btn-cerrar-modal">
                        Cerrar
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        function cerrarModal() {
            modal.remove();
        }

        modal.querySelector(".modal-cerrar").addEventListener("click", cerrarModal);
        modal.querySelector(".btn-cerrar-modal").addEventListener("click", cerrarModal);

        modal.addEventListener("click", function (e) {
            if (e.target === modal) {
                cerrarModal();
            }
        });
    }

    // ==========================================
    // EDITAR CITA
    // ==========================================
    function editarCita(id) {
        const cita = citas.find(function (item) {
            return item.id == id;
        });

        if (!cita) {
            return;
        }

        const modal = document.createElement("div");
        modal.className = "modal-cita";

        modal.innerHTML = `
            <div class="modal-contenido">
                <div class="modal-header">
                    <div>
                        <h2>Editar cita</h2>
                        <p>Modifica la información de la cita.</p>
                    </div>
                    <button class="modal-cerrar" type="button">×</button>
                </div>

                <form id="formEditarCita">
                    <div class="form-group">
                        <label for="editarPaciente">Paciente</label>
                        <input
                            type="text"
                            id="editarPaciente"
                            value="${cita.paciente}"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label for="editarOdontologo">Odontólogo</label>
                        <select id="editarOdontologo" required>
                            ${generarOpcionesOdontologos(cita.odontologo)}
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="editarFecha">Fecha</label>
                        <input
                            type="date"
                            id="editarFecha"
                            value="${convertirFechaParaInput(cita.fecha)}"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label for="editarHora">Hora</label>
                        <input
                            type="time"
                            id="editarHora"
                            value="${convertirHoraParaInput(cita.hora)}"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label for="editarEstado">Estado</label>
                        <select id="editarEstado" required>
                            <option value="Confirmada" ${obtenerClaseEstado(cita.estado) === "confirmada" ? "selected" : ""}>
                                Confirmada
                            </option>
                            <option value="Pendiente" ${obtenerClaseEstado(cita.estado) === "pendiente" ? "selected" : ""}>
                                Pendiente
                            </option>
                            <option value="Cancelada" ${obtenerClaseEstado(cita.estado) === "cancelada" ? "selected" : ""}>
                                Cancelada
                            </option>
                        </select>
                    </div>

                    <div class="modal-acciones">
                        <button type="button" class="btn btn-secondary btn-cancelar">
                            Cancelar
                        </button>
                        <button type="submit" class="btn btn-primary">
                            Guardar cambios
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        function cerrarModal() {
            modal.remove();
        }

        modal.querySelector(".modal-cerrar").addEventListener("click", cerrarModal);
        modal.querySelector(".btn-cancelar").addEventListener("click", cerrarModal);

        modal.addEventListener("click", function (e) {
            if (e.target === modal) {
                cerrarModal();
            }
        });

        modal.querySelector("#formEditarCita").addEventListener("submit", function (e) {
            e.preventDefault();

            const paciente = document.getElementById("editarPaciente").value.trim();
            const odontologo = document.getElementById("editarOdontologo").value;
            const fecha = document.getElementById("editarFecha").value;
            const hora = document.getElementById("editarHora").value;
            const estado = document.getElementById("editarEstado").value;

            if (!paciente || !odontologo || !fecha || !hora) {
                alert("Por favor completa todos los campos.");
                return;
            }

            const pacienteEncontrado = obtenerPacientePorNombre(paciente);

            if (!pacienteEncontrado) {
                alert(
                    "El paciente no existe en el sistema. Verifica el nombre e inténtalo nuevamente."
                );
                return;
            }

            const fechaMostrar = convertirFechaParaMostrar(fecha);
            const horaMostrar = convertirHoraParaMostrar(hora);

            const citaExistente = citas.some(function (otraCita) {
                return (
                    otraCita.id != id &&
                    otraCita.odontologo.toLowerCase() === odontologo.toLowerCase() &&
                    otraCita.fecha === fechaMostrar &&
                    otraCita.hora === horaMostrar &&
                    obtenerClaseEstado(otraCita.estado) !== "cancelada"
                );
            });

            if (citaExistente) {
                alert(
                    "Ya existe otra cita activa para ese odontólogo en la misma fecha y hora."
                );
                return;
            }

            cita.paciente = pacienteEncontrado.nombre;
            cita.pacienteDocumento = pacienteEncontrado.documento;
            cita.odontologo = odontologo;
            cita.fecha = fechaMostrar;
            cita.hora = horaMostrar;
            cita.estado = estado;

            guardarCitas();
            renderizarCitas();
            cerrarModal();

            alert("Cita actualizada correctamente.");
        });
    }

    // ==========================================
    // CONVERTIR HORA AM/PM A INPUT TIME
    // ==========================================
    function convertirHoraParaInput(hora) {
        if (!hora) {
            return "";
        }

        const partes = hora.trim().split(" ");

        if (partes.length !== 2) {
            return hora;
        }

        const horaMinutos = partes[0];
        const periodo = partes[1].toUpperCase();
        const partesHora = horaMinutos.split(":");

        let horas = parseInt(partesHora[0]);
        const minutos = partesHora[1];

        if (periodo === "PM" && horas !== 12) {
            horas += 12;
        }

        if (periodo === "AM" && horas === 12) {
            horas = 0;
        }

        return String(horas).padStart(2, "0") + ":" + minutos;
    }

    // ==========================================
    // ELIMINAR CITA
    // ==========================================
    function eliminarCita(id) {
        const cita = citas.find(function (item) {
            return item.id == id;
        });

        if (!cita) {
            return;
        }

        const confirmar = confirm(
            "¿Está seguro de eliminar la cita de " + cita.paciente + "?"
        );

        if (!confirmar) {
            return;
        }

        citas = citas.filter(function (item) {
            return item.id != id;
        });

        guardarCitas();
        renderizarCitas();

        alert("Cita eliminada correctamente.");
    }

    // ==========================================
    // ACTIVAR BOTONES
    // ==========================================
    function activarBotonesAcciones() {
        const botonesVer = document.querySelectorAll(".btn-ver");
        const botonesEditar = document.querySelectorAll(".btn-editar");
        const botonesEliminar = document.querySelectorAll(".btn-eliminar");

        botonesVer.forEach(function (boton) {
            boton.addEventListener("click", function () {
                verCita(boton.dataset.id);
            });
        });

        botonesEditar.forEach(function (boton) {
            boton.addEventListener("click", function () {
                editarCita(boton.dataset.id);
            });
        });

        botonesEliminar.forEach(function (boton) {
            boton.addEventListener("click", function () {
                eliminarCita(boton.dataset.id);
            });
        });
    }

    // ==========================================
    // EVENTOS
    // ==========================================
    if (botonNuevaCita) {
        botonNuevaCita.addEventListener("click", abrirModalNuevaCita);
    }

    if (botonBuscar) {
        botonBuscar.addEventListener("click", filtrarCitas);
    }

    // ==========================================
    // CARGA INICIAL
    // ==========================================
    renderizarCitas();
});