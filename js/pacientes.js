// =========================
// ELEMENTOS PRINCIPALES
// =========================
const buscador = document.getElementById("buscarPaciente");

const tablaPacientes = document.querySelector(".patients-table");

const botonNuevo = document.querySelector(".page-heading .btn-principal");

    // =========================
    // DATOS
    // =========================
    let pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];

    async function cargarPacientesDesdeBackend() {
    try {
        const respuesta = await fetch("http://localhost:8080/api/pacientes");

        if (!respuesta.ok) {
            throw new Error("No se pudieron consultar los pacientes.");
        }

        pacientes = await respuesta.json();
        mostrarPacientes();
    } catch (error) {
        console.error("Error al cargar pacientes:", error);
        alert("No fue posible cargar los pacientes desde el servidor.");
    }


    // =========================
    // MOSTRAR USUARIO ACTUAL
    // =========================
    const usuarioSesion =
        JSON.parse(
            localStorage.getItem("usuarioSesion")
        );

    const nombreUsuario =
        document.getElementById("nombreUsuario");

    if (nombreUsuario && usuarioSesion) {

        nombreUsuario.textContent =
            usuarioSesion.nombre;

    }


    // =========================
    // CARGAR DATOS INICIALES
    // =========================
    if (pacientes.length === 0) {

        const filasIniciales = document.querySelectorAll(
            ".patients-table .patient-row"
        );

        filasIniciales.forEach(function (fila) {

            const datos = fila.querySelectorAll("span");

            pacientes.push({
                documento: datos[0].textContent.trim(),
                nombre: datos[1].textContent.trim(),
                telefono: datos[2].textContent.trim(),
                correo: datos[3].textContent.trim()
            });

        });

        guardarPacientes();
    }

    // =========================
    // GUARDAR EN LOCALSTORAGE
    // =========================
    function guardarPacientes() {

        localStorage.setItem(
            "pacientes",
            JSON.stringify(pacientes)
        );
    }


    // =========================
    // MOSTRAR PACIENTES
    // =========================
    function mostrarPacientes(lista = pacientes) {

        const filas = tablaPacientes.querySelectorAll(".patient-row");

        filas.forEach(function (fila) {
            fila.remove();
        });

        lista.forEach(function (paciente) {

            const fila = document.createElement("div");

            fila.className = "table-row patient-row";

            fila.innerHTML = `
                <span>${paciente.documento}</span>

                <span>${paciente.nombre}</span>

                <span>${paciente.telefono}</span>

                <span>${paciente.correo}</span>

                <span class="actions">

                    <button class="btn-action btn-ver">
                        Ver
                    </button>

                    <button class="btn-action btn-editar">
                        Editar
                    </button>

                    <button class="btn-action btn-eliminar">
                        Eliminar
                    </button>

                </span>
            `;

            tablaPacientes.appendChild(fila);
        });

        agregarEventosBotones();
    }

    // =========================
    // BUSCADOR
    // =========================
    buscador.addEventListener("input", function () {

        const texto = buscador.value.toLowerCase().trim();

        const resultados = pacientes.filter(function (paciente) {

            return (
                paciente.documento.toLowerCase().includes(texto) ||
                paciente.nombre.toLowerCase().includes(texto) ||
                paciente.telefono.toLowerCase().includes(texto) ||
                paciente.correo.toLowerCase().includes(texto)
            );

        });

        mostrarPacientes(resultados);
    });


    // =========================
    // MODAL
    // =========================
    function crearModal(contenido) {

        const modal = document.createElement("div");

        modal.className = "modal-paciente";

        modal.innerHTML = contenido;

        document.body.appendChild(modal);

        return modal;
    }

    // =========================
    // NUEVO PACIENTE
    // =========================
    function abrirFormularioNuevo() {

        const modal = crearModal(`

            <div class="modal-contenido">

                <div class="modal-header">

                    <div>
                        <h2>Nuevo paciente</h2>

                        <p>
                            Registra la información del paciente.
                        </p>
                    </div>

                    <button class="modal-cerrar">
                        ×
                    </button>

                </div>


                <form id="formPaciente">

                    <div class="form-group">

                        <label for="documentoPaciente">
                            Documento
                        </label>

                        <input
                            type="text"
                            id="documentoPaciente"
                            required
                        >

                    </div>


                    <div class="form-group">

                        <label for="nombrePaciente">
                            Nombre completo
                        </label>

                        <input
                            type="text"
                            id="nombrePaciente"
                            required
                        >

                    </div>


                    <div class="form-group">

                        <label for="telefonoPaciente">
                            Teléfono
                        </label>

                        <input
                            type="text"
                            id="telefonoPaciente"
                            required
                        >

                    </div>


                    <div class="form-group">

                        <label for="correoPaciente">
                            Correo electrónico
                        </label>

                        <input
                            type="email"
                            id="correoPaciente"
                            required
                        >

                    </div>


                    <div class="modal-acciones">

                        <button
                            type="button"
                            class="btn btn-secondary modal-cancelar"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            class="btn btn-primary"
                        >
                            Guardar paciente
                        </button>

                    </div>

                </form>

            </div>
        `);


        const formulario = modal.querySelector("#formPaciente");


        // CERRAR
        modal.querySelector(".modal-cerrar")
            .addEventListener("click", function () {

                modal.remove();

            });


        modal.querySelector(".modal-cancelar")
            .addEventListener("click", function () {

                modal.remove();

            });


        // GUARDAR
        formulario.addEventListener("submit", function (evento) {

            evento.preventDefault();


            const documento =
                document.getElementById("documentoPaciente")
                    .value.trim();

            const nombre =
                document.getElementById("nombrePaciente")
                    .value.trim();

            const telefono =
                document.getElementById("telefonoPaciente")
                    .value.trim();

            const correo =
                document.getElementById("correoPaciente")
                    .value.trim();


            // VALIDAR DOCUMENTO
            const existe = pacientes.some(function (paciente) {
                return paciente.documento === documento;
            });


            if (existe) {

                alert(
                    "Ya existe un paciente registrado con ese documento."
                );

                return;
            }


            // CREAR OBJETO
            const nuevoPaciente = {
                documento: documento,
                nombre: nombre,
                telefono: telefono,
                correo: correo
            };

            pacientes.push(nuevoPaciente);

            guardarPacientes();

            mostrarPacientes();

            modal.remove();

            alert(
                "Paciente registrado correctamente."
            );

        });
    }


    // =========================
    // VER PACIENTE
    // =========================
    function verPaciente(documento) {

        const paciente = pacientes.find(function (paciente) {

            return paciente.documento === documento;

        });


        if (!paciente) {
            return;
        }


        const modal = crearModal(`

            <div class="modal-contenido">

                <div class="modal-header">

                    <div>
                        <h2>Información del paciente</h2>

                        <p>
                            Datos registrados en el sistema.
                        </p>
                    </div>

                    <button class="modal-cerrar">
                        ×
                    </button>

                </div>


                <div class="datos-paciente">

                    <div class="dato">

                        <strong>
                            Documento
                        </strong>

                        <span>
                            ${paciente.documento}
                        </span>

                    </div>


                    <div class="dato">

                        <strong>
                            Nombre completo
                        </strong>

                        <span>
                            ${paciente.nombre}
                        </span>

                    </div>


                    <div class="dato">

                        <strong>
                            Teléfono
                        </strong>

                        <span>
                            ${paciente.telefono}
                        </span>

                    </div>


                    <div class="dato">

                        <strong>
                            Correo electrónico
                        </strong>

                        <span>
                            ${paciente.correo}
                        </span>

                    </div>

                </div>


                <div class="modal-acciones">

                    <button
                        type="button"
                        class="btn btn-primary modal-cerrar"
                    >
                        Cerrar
                    </button>

                </div>

            </div>
        `);

        modal.querySelectorAll(".modal-cerrar")
            .forEach(function (boton) {

                boton.addEventListener("click", function () {
                    modal.remove();
                });

            });
    }

    // =========================
    // EDITAR PACIENTE
    // =========================
    function editarPaciente(documento) {

        const paciente = pacientes.find(function (paciente) {
            return paciente.documento === documento;
        });

        if (!paciente) {
            return;
        }

        const modal = crearModal(`

            <div class="modal-contenido">

                <div class="modal-header">

                    <div>
                        <h2>Editar paciente</h2>

                        <p>
                            Actualiza la información del paciente.
                        </p>
                    </div>

                    <button class="modal-cerrar">
                        ×
                    </button>

                </div>

                <form id="formEditarPaciente">

                    <div class="form-group">

                        <label>
                            Documento
                        </label>

                        <input
                            type="text"
                            value="${paciente.documento}"
                            disabled
                        >

                    </div>

                    <div class="form-group">

                        <label for="editarNombre">
                            Nombre completo
                        </label>

                        <input
                            type="text"
                            id="editarNombre"
                            value="${paciente.nombre}"
                            required
                        >

                    </div>

                    <div class="form-group">

                        <label for="editarTelefono">
                            Teléfono
                        </label>

                        <input
                            type="text"
                            id="editarTelefono"
                            value="${paciente.telefono}"
                            required
                        >

                    </div>


                    <div class="form-group">

                        <label for="editarCorreo">
                            Correo electrónico
                        </label>

                        <input
                            type="email"
                            id="editarCorreo"
                            value="${paciente.correo}"
                            required
                        >

                    </div>


                    <div class="modal-acciones">

                        <button
                            type="button"
                            class="btn btn-secondary modal-cancelar"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            class="btn btn-primary"
                        >
                            Guardar cambios
                        </button>

                    </div>

                </form>

            </div>
        `);


        // CERRAR
        modal.querySelector(".modal-cerrar")
            .addEventListener("click", function () {
                modal.remove();
            });


        modal.querySelector(".modal-cancelar")
            .addEventListener("click", function () {
                modal.remove();
            });


        // GUARDAR CAMBIOS
        modal.querySelector("#formEditarPaciente")
            .addEventListener("submit", function (evento) {

                evento.preventDefault();


                paciente.nombre =
                    document.getElementById("editarNombre")
                        .value.trim();

                paciente.telefono =
                    document.getElementById("editarTelefono")
                        .value.trim();

                paciente.correo =
                    document.getElementById("editarCorreo")
                        .value.trim();

                guardarPacientes();

                mostrarPacientes();

                modal.remove();


                alert(
                    "Paciente actualizado correctamente."
                );

            });
    }

    // =========================
    // ELIMINAR PACIENTE
    // =========================
    function eliminarPaciente(documento) {

        const paciente = pacientes.find(function (paciente) {
            return paciente.documento === documento;
        });

        if (!paciente) {
            return;
        }

        const confirmar = confirm(

            "¿Está seguro de eliminar este paciente?\n\n" +

            "Paciente: " + paciente.nombre + "\n" +

            "Documento: " + paciente.documento
        );

        if (!confirmar) {
            return;
        }

        pacientes = pacientes.filter(function (paciente) {
            return paciente.documento !== documento;
        });

        guardarPacientes();

        mostrarPacientes();

        alert(
            "Paciente eliminado correctamente."
        );
    }

    // =========================
    // EVENTOS DE LOS BOTONES
    // =========================
    function agregarEventosBotones() {

        const botonesVer =
            document.querySelectorAll(".btn-ver");

        const botonesEditar =
            document.querySelectorAll(".btn-editar");

        const botonesEliminar =
            document.querySelectorAll(".btn-eliminar");


        // VER
        botonesVer.forEach(function (boton) {

            boton.addEventListener("click", function () {

                const fila =
                    boton.closest(".patient-row");

                const documento =
                    fila.querySelector("span").textContent.trim();

                verPaciente(documento);

            });

        });


        // EDITAR
        botonesEditar.forEach(function (boton) {

            boton.addEventListener("click", function () {

                const fila =
                    boton.closest(".patient-row");

                const documento =
                    fila.querySelector("span").textContent.trim();

                editarPaciente(documento);

            });

        });


        // ELIMINAR
        botonesEliminar.forEach(function (boton) {

            boton.addEventListener("click", function () {

                const fila =
                    boton.closest(".patient-row");

                const documento =
                    fila.querySelector("span").textContent.trim();

                eliminarPaciente(documento);

            });

        });
    }

    // =========================
    // BOTÓN NUEVO PACIENTE
    // =========================
    botonNuevo.addEventListener("click", function () {
        abrirFormularioNuevo();
    });


    // =========================
    // MOSTRAR AL CARGAR
    // =========================
    cargarPacientesDesdeBackend();
    
}
