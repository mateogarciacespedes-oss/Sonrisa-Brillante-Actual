document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    //  VALIDAR SESIÓN
    // =========================================================
    const usuarioSesion = JSON.parse(
        localStorage.getItem("usuarioSesion")
    );

    if (!usuarioSesion) {
        window.location.href = "../index.html";
        return;
    }


    // =========================================================
    //  ELEMENTOS DEL HTML
    // =========================================================
    const nombreUsuario = document.querySelector(".user-info strong");

    const patientData = document.querySelector(".patient-data");

    const clinicalTable = document.querySelector(".clinical-table");

    const evolutionBox = document.querySelector(".evolution-box");


    // =========================================================
    //  OBTENER INFORMACIÓN DEL PACIENTE
    // =========================================================
    const pacientes = JSON.parse(
        localStorage.getItem("pacientes")
    ) || [];

    let pacienteActual = null;

    // Primero buscamos por documento
    if (usuarioSesion.documento) {
        pacienteActual = pacientes.find(
            paciente =>
                String(paciente.documento) ===
                String(usuarioSesion.documento)
        );
    }

    // Si no lo encuentra, buscamos por correo
    if (!pacienteActual && usuarioSesion.correo) {
        pacienteActual = pacientes.find(
            paciente =>
                paciente.correo &&
                paciente.correo.toLowerCase() ===
                usuarioSesion.correo.toLowerCase()
        );
    }


    // =========================================================
    //  MOSTRAR NOMBRE EN EL ENCABEZADO
    // =========================================================
    const nombrePaciente =
        pacienteActual?.nombre ||
        usuarioSesion.nombre ||
        "Paciente";

    if (nombreUsuario) {
        nombreUsuario.textContent = nombrePaciente;
    }


    // =========================================================
    //  ACTUALIZAR INFORMACIÓN DEL PACIENTE
    // =========================================================
    if (patientData) {

        const datos = patientData.querySelectorAll(".data-item");

        if (datos.length >= 4) {

            // Nombre
            datos[0].querySelector("strong").textContent =
                pacienteActual?.nombre ||
                usuarioSesion.nombre ||
                "No registrado";

            // Documento
            datos[1].querySelector("strong").textContent =
                pacienteActual?.documento ||
                usuarioSesion.documento ||
                "No registrado";

            // Fecha de nacimiento
            datos[2].querySelector("strong").textContent =
                pacienteActual?.fechaNacimiento ||
                pacienteActual?.fecha_nacimiento ||
                "No registrada";

            // Tipo de sangre
            datos[3].querySelector("strong").textContent =
                pacienteActual?.tipoSangre ||
                pacienteActual?.tipo_sangre ||
                "No registrado";
        }
    }


    // =========================================================
    //  OBTENER HISTORIAL CLÍNICO
    // =========================================================
    let historial = JSON.parse(
        localStorage.getItem("historialClinico")
    ) || [];


    // =========================================================
    //  FILTRAR HISTORIAL DEL PACIENTE ACTUAL
    // =========================================================
    const documentoPaciente =
        pacienteActual?.documento ||
        usuarioSesion.documento;

    const correoPaciente =
        pacienteActual?.correo ||
        usuarioSesion.correo;

    const nombrePacienteSesion =
        pacienteActual?.nombre ||
        usuarioSesion.nombre;


    historial = historial.filter(registro => {

        // Buscar por documento
        if (
            registro.pacienteDocumento &&
            documentoPaciente
        ) {
            return String(registro.pacienteDocumento) ===
                String(documentoPaciente);
        }

        if (
            registro.documento &&
            documentoPaciente
        ) {
            return String(registro.documento) ===
                String(documentoPaciente);
        }

        // Buscar por correo
        if (
            registro.pacienteCorreo &&
            correoPaciente
        ) {
            return registro.pacienteCorreo.toLowerCase() ===
                correoPaciente.toLowerCase();
        }

        if (
            registro.correo &&
            correoPaciente
        ) {
            return registro.correo.toLowerCase() ===
                correoPaciente.toLowerCase();
        }

        // Compatibilidad con registros antiguos
        if (registro.paciente) {
            return registro.paciente === nombrePacienteSesion;
        }

        return false;
    });


    // =========================================================
    //  ORDENAR DEL MÁS RECIENTE AL MÁS ANTIGUO
    // =========================================================
    historial.sort((a, b) => {

        const fechaA = convertirFecha(a.fecha);
        const fechaB = convertirFecha(b.fecha);

        return fechaB - fechaA;
    });


    // =========================================================
    //  MOSTRAR HISTORIAL EN LA TABLA
    // =========================================================
    if (clinicalTable) {

        // Conservamos el encabezado
        const encabezado =
            clinicalTable.querySelector(".table-header");

        // Eliminamos registros anteriores
        clinicalTable
            .querySelectorAll(".table-row:not(.table-header)")
            .forEach(row => row.remove());


        if (historial.length === 0) {

            const mensaje = document.createElement("div");

            mensaje.className = "table-row";

            mensaje.innerHTML = `
                <span style="grid-column: 1 / -1; text-align: center;">
                    No hay consultas registradas en tu historial clínico.
                </span>
            `;

            clinicalTable.appendChild(mensaje);

        } else {

            historial.forEach((registro, index) => {

                const fila = document.createElement("div");

                fila.className = "table-row";

                const fecha =
                    formatearFecha(registro.fecha);

                const odontologo =
                    registro.odontologo ||
                    registro.doctor ||
                    "No registrado";

                const diagnostico =
                    registro.diagnostico ||
                    "No registrado";

                const tratamiento =
                    registro.tratamiento ||
                    "No registrado";


                fila.innerHTML = `
                    <span>${fecha}</span>

                    <span>${odontologo}</span>

                    <span>${diagnostico}</span>

                    <span>${tratamiento}</span>

                    <span>
                        <button
                            class="btn-action btn-ver-historial"
                            data-index="${index}"
                        >
                            Ver
                        </button>
                    </span>
                `;

                clinicalTable.appendChild(fila);
            });
        }
    }


    // =========================================================
    //  MOSTRAR ÚLTIMA EVOLUCIÓN
    // =========================================================
    if (evolutionBox) {

        if (historial.length === 0) {

            evolutionBox.innerHTML = `
                <div class="evolution-date">
                    <span>📅</span>
                    <strong>Sin registros</strong>
                </div>

                <p>
                    No hay evoluciones clínicas registradas.
                </p>
            `;

        } else {

            const ultimaEvolucion = historial[0];

            const fecha =
                formatearFecha(ultimaEvolucion.fecha);

            const observaciones =
                ultimaEvolucion.observaciones ||
                ultimaEvolucion.evolucion ||
                ultimaEvolucion.descripcion ||
                "No hay observaciones registradas.";

            evolutionBox.innerHTML = `
                <div class="evolution-date">
                    <span>📅</span>

                    <strong>
                        ${fecha}
                    </strong>
                </div>

                <p>
                    ${observaciones}
                </p>
            `;
        }
    }


    // =========================================================
    //  BOTONES "VER"
    // =========================================================
    document
        .querySelectorAll(".btn-ver-historial")
        .forEach(boton => {

            boton.addEventListener("click", () => {

                const index =
                    parseInt(boton.dataset.index);

                const registro =
                    historial[index];

                if (!registro) {
                    return;
                }

                mostrarModalHistorial(registro);
            });
        });


    // =========================================================
    //  CREAR MODAL
    // =========================================================
    function mostrarModalHistorial(registro) {

        // Si ya existe un modal, lo eliminamos
        const modalAnterior =
            document.querySelector(".modal-historial-paciente");

        if (modalAnterior) {
            modalAnterior.remove();
        }


        const modal =
            document.createElement("div");

        modal.className =
            "modal-historial-paciente";


        const fecha =
            formatearFecha(registro.fecha);

        const odontologo =
            registro.odontologo ||
            registro.doctor ||
            "No registrado";

        const diagnostico =
            registro.diagnostico ||
            "No registrado";

        const tratamiento =
            registro.tratamiento ||
            "No registrado";

        const observaciones =
            registro.observaciones ||
            registro.evolucion ||
            registro.descripcion ||
            "No hay observaciones registradas.";


        modal.innerHTML = `
            <div class="modal-historial-contenido">

                <div class="modal-historial-header">

                    <div>
                        <h2>
                            Detalle de consulta
                        </h2>

                        <p>
                            Información de la atención odontológica
                        </p>
                    </div>

                    <button
                        class="modal-historial-cerrar"
                        type="button"
                    >
                        ×
                    </button>

                </div>


                <div class="datos-historial">

                    <div class="dato-historial">
                        <span>Fecha</span>
                        <strong>${fecha}</strong>
                    </div>

                    <div class="dato-historial">
                        <span>Odontólogo</span>
                        <strong>${odontologo}</strong>
                    </div>

                    <div class="dato-historial">
                        <span>Diagnóstico</span>
                        <strong>${diagnostico}</strong>
                    </div>

                    <div class="dato-historial">
                        <span>Tratamiento</span>
                        <strong>${tratamiento}</strong>
                    </div>

                </div>


                <div class="observaciones-historial">

                    <h3>
                        Evolución / Observaciones
                    </h3>

                    <p>
                        ${observaciones}
                    </p>

                </div>


                <div class="modal-historial-acciones">

                    <button
                        type="button"
                        class="btn-cerrar-historial"
                    >
                        Cerrar
                    </button>

                </div>

            </div>
        `;


        document.body.appendChild(modal);


        // =====================================================
        // CERRAR MODAL
        // =====================================================
        const cerrar =
            () => modal.remove();


        modal
            .querySelector(".modal-historial-cerrar")
            .addEventListener("click", cerrar);


        modal
            .querySelector(".btn-cerrar-historial")
            .addEventListener("click", cerrar);


        // Cerrar haciendo clic fuera
        modal.addEventListener("click", event => {

            if (
                event.target === modal
            ) {
                cerrar();
            }
        });


        // Cerrar con ESC
        document.addEventListener(
            "keydown",
            function cerrarConEscape(event) {

                if (event.key === "Escape") {

                    cerrar();

                    document.removeEventListener(
                        "keydown",
                        cerrarConEscape
                    );
                }
            }
        );
    }


    // =========================================================
    //  CONVERTIR FECHA
    // =========================================================
    function convertirFecha(fecha) {

        if (!fecha) {
            return new Date(0);
        }


        // YYYY-MM-DD
        if (
            /^\d{4}-\d{2}-\d{2}$/.test(fecha)
        ) {
            return new Date(fecha + "T00:00:00");
        }


        // DD/MM/YYYY
        if (
            /^\d{2}\/\d{2}\/\d{4}$/.test(fecha)
        ) {

            const partes =
                fecha.split("/");

            return new Date(
                `${partes[2]}-${partes[1]}-${partes[0]}T00:00:00`
            );
        }


        const fechaNormal =
            new Date(fecha);

        return isNaN(fechaNormal)
            ? new Date(0)
            : fechaNormal;
    }


    // =========================================================
    //  FORMATEAR FECHA
    // =========================================================
    function formatearFecha(fecha) {

        if (!fecha) {
            return "No registrada";
        }


        // Si ya viene DD/MM/YYYY
        if (
            /^\d{2}\/\d{2}\/\d{4}$/.test(fecha)
        ) {
            return fecha;
        }


        const fechaConvertida =
            convertirFecha(fecha);


        if (
            fechaConvertida.getTime() === 0
        ) {
            return "No registrada";
        }


        const dia =
            String(
                fechaConvertida.getDate()
            ).padStart(2, "0");

        const mes =
            String(
                fechaConvertida.getMonth() + 1
            ).padStart(2, "0");

        const año =
            fechaConvertida.getFullYear();


        return `${dia}/${mes}/${año}`;
    }

});