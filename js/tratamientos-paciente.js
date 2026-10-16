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
    const nombreUsuario =
        document.getElementById("nombreUsuario");

    const resumen =
        document.querySelector(".treatment-summary");

    const treatmentsTable =
        document.querySelector(".treatments-table");

    const treatmentDetail =
        document.querySelector(".treatment-detail");

    const observations =
        document.querySelector(".observations");


    // =========================================================
    //  OBTENER PACIENTE ACTUAL
    // =========================================================
    const pacientes = JSON.parse(
        localStorage.getItem("pacientes")
    ) || [];

    let pacienteActual = null;

    if (usuarioSesion.documento) {

        pacienteActual = pacientes.find(
            paciente =>
                String(paciente.documento) ===
                String(usuarioSesion.documento)
        );
    }

    if (!pacienteActual && usuarioSesion.correo) {

        pacienteActual = pacientes.find(
            paciente =>
                paciente.correo &&
                paciente.correo.toLowerCase() ===
                usuarioSesion.correo.toLowerCase()
        );
    }


    const nombrePaciente =
        pacienteActual?.nombre ||
        usuarioSesion.nombre ||
        "Paciente";


    // =========================================================
    //  MOSTRAR NOMBRE
    // =========================================================
    if (nombreUsuario) {
        nombreUsuario.textContent =
            nombrePaciente;
    }


    // =========================================================
    //  OBTENER TRATAMIENTOS
    // =========================================================

    let tratamientos = JSON.parse(
        localStorage.getItem("tratamientos")
    ) || [];


    // =========================================================
    //  FILTRAR TRATAMIENTOS DEL PACIENTE
    // =========================================================
    const documentoPaciente =
        pacienteActual?.documento ||
        usuarioSesion.documento;

    const correoPaciente =
        pacienteActual?.correo ||
        usuarioSesion.correo;


    tratamientos = tratamientos.filter(
        tratamiento => {

            if (
                tratamiento.pacienteDocumento &&
                documentoPaciente
            ) {
                return String(
                    tratamiento.pacienteDocumento
                ) === String(documentoPaciente);
            }


            if (
                tratamiento.documento &&
                documentoPaciente
            ) {
                return String(
                    tratamiento.documento
                ) === String(documentoPaciente);
            }


            if (
                tratamiento.pacienteCorreo &&
                correoPaciente
            ) {
                return tratamiento.pacienteCorreo
                    .toLowerCase() ===
                    correoPaciente.toLowerCase();
            }


            if (
                tratamiento.correo &&
                correoPaciente
            ) {
                return tratamiento.correo
                    .toLowerCase() ===
                    correoPaciente.toLowerCase();
            }


            if (tratamiento.paciente) {
                return tratamiento.paciente ===
                    nombrePaciente;
            }


            return false;
        }
    );


    // =========================================================
    //  ORDENAR POR FECHA
    // =========================================================
    tratamientos.sort((a, b) => {

        const fechaA =
            convertirFecha(
                a.fecha
            );

        const fechaB =
            convertirFecha(
                b.fecha
            );

        return fechaB - fechaA;
    });


    // =========================================================
    //  IDENTIFICAR ESTADOS
    // =========================================================
    const activos =
        tratamientos.filter(
            tratamiento =>
                esActivo(tratamiento.estado)
        );

    const finalizados =
        tratamientos.filter(
            tratamiento =>
                esFinalizado(tratamiento.estado)
        );


    // =========================================================
    //  ACTUALIZAR RESUMEN
    // =========================================================
    if (resumen) {

        const tarjetas =
            resumen.querySelectorAll(
                ".summary-card"
            );


        // Tratamientos activos
        if (tarjetas[0]) {

            const valor =
                tarjetas[0].querySelector("strong");

            if (valor) {
                valor.textContent =
                    activos.length;
            }
        }


        // Tratamientos finalizados
        if (tarjetas[1]) {

            const valor =
                tarjetas[1].querySelector("strong");

            if (valor) {
                valor.textContent =
                    finalizados.length;
            }
        }


        // Próximo control
        if (tarjetas[2]) {

            const valor =
                tarjetas[2].querySelector("strong");

            if (valor) {

                const proximoControl =
                    obtenerProximoControl(
                        activos
                    );

                valor.textContent =
                    proximoControl;
            }
        }
    }


    // =========================================================
    //  MOSTRAR TRATAMIENTOS EN TABLA
    // =========================================================
    if (treatmentsTable) {

        const encabezado =
            treatmentsTable.querySelector(
                ".table-header"
            );


        treatmentsTable
            .querySelectorAll(
                ".table-row:not(.table-header)"
            )
            .forEach(row =>
                row.remove()
            );


        if (tratamientos.length === 0) {

            const mensaje =
                document.createElement("div");

            mensaje.className =
                "table-row";

            mensaje.innerHTML = `
                <span style="grid-column: 1 / -1; text-align: center;">
                    No tienes tratamientos registrados.
                </span>
            `;

            treatmentsTable.appendChild(
                mensaje
            );

        } else {

            tratamientos.forEach(
                (tratamiento, index) => {

                    const fila =
                        document.createElement("div");

                    fila.className =
                        "table-row";


                    const nombre =
                        tratamiento.tratamiento ||
                        tratamiento.nombre ||
                        "No registrado";


                    const odontologo =
                        tratamiento.odontologo ||
                        tratamiento.doctor ||
                        "No registrado";


                    const fecha =
                        formatearFecha(
                            tratamiento.fecha
                        );


                    const estado =
                        tratamiento.estado ||
                        "No registrado";


                    const claseEstado =
                        obtenerClaseEstado(
                            estado
                        );


                    fila.innerHTML = `
                        <span>
                            ${nombre}
                        </span>

                        <span>
                            ${odontologo}
                        </span>

                        <span>
                            ${fecha}
                        </span>

                        <span class="status ${claseEstado}">
                            ${estado}
                        </span>

                        <span>
                            <button
                                class="btn-action btn-ver-tratamiento"
                                data-index="${index}"
                            >
                                Ver
                            </button>
                        </span>
                    `;


                    treatmentsTable.appendChild(
                        fila
                    );
                }
            );
        }
    }


    // =========================================================
    //  MOSTRAR TRATAMIENTO ACTUAL
    // =========================================================
    if (activos.length > 0) {

        const tratamientoActual =
            activos[0];

        mostrarDetalleActual(
            tratamientoActual
        );

    } else {

        mostrarSinTratamiento();
    }


    // =========================================================
    //  BOTONES "VER"
    // =========================================================
    document
        .querySelectorAll(
            ".btn-ver-tratamiento"
        )
        .forEach(boton => {

            boton.addEventListener(
                "click",
                () => {

                    const index =
                        parseInt(
                            boton.dataset.index
                        );

                    const tratamiento =
                        tratamientos[index];

                    if (!tratamiento) {
                        return;
                    }

                    mostrarModalTratamiento(
                        tratamiento
                    );
                }
            );
        });


    // =========================================================
    //  MOSTRAR DETALLE DEL TRATAMIENTO ACTUAL
    // =========================================================
    function mostrarDetalleActual(
        tratamiento
    ) {

        if (!treatmentDetail) {
            return;
        }


        const items =
            treatmentDetail.querySelectorAll(
                ".detail-item"
            );


        if (items.length >= 4) {

            items[0]
                .querySelector("strong")
                .textContent =
                tratamiento.tratamiento ||
                tratamiento.nombre ||
                "No registrado";


            items[1]
                .querySelector("strong")
                .textContent =
                tratamiento.diagnostico ||
                "No registrado";


            items[2]
                .querySelector("strong")
                .textContent =
                tratamiento.odontologo ||
                tratamiento.doctor ||
                "No registrado";


            items[3]
                .querySelector("strong")
                .textContent =
                tratamiento.estado ||
                "En proceso";
        }


        if (observations) {

            const texto =
                observations.querySelector("p");

            if (texto) {

                texto.textContent =
                    tratamiento.observaciones ||
                    tratamiento.evolucion ||
                    tratamiento.descripcion ||
                    "No hay observaciones registradas.";
            }
        }
    }


    // =========================================================
    //  CUANDO NO HAY TRATAMIENTO ACTIVO
    // =========================================================
    function mostrarSinTratamiento() {

        if (!treatmentDetail) {
            return;
        }


        const items =
            treatmentDetail.querySelectorAll(
                ".detail-item"
            );


        if (items.length >= 4) {

            items[0]
                .querySelector("strong")
                .textContent =
                "Sin tratamiento activo";


            items[1]
                .querySelector("strong")
                .textContent =
                "No registrado";


            items[2]
                .querySelector("strong")
                .textContent =
                "No registrado";


            items[3]
                .querySelector("strong")
                .textContent =
                "Sin tratamiento";
        }


        if (observations) {

            const texto =
                observations.querySelector("p");

            if (texto) {

                texto.textContent =
                    "Actualmente no tienes tratamientos en proceso.";
            }
        }
    }


    // =========================================================
    //  MODAL DE DETALLE
    // =========================================================
    function mostrarModalTratamiento(
        tratamiento
    ) {

        const modalAnterior =
            document.querySelector(
                ".modal-tratamiento-paciente"
            );

        if (modalAnterior) {
            modalAnterior.remove();
        }


        const modal =
            document.createElement("div");

        modal.className =
            "modal-tratamiento-paciente";


        const nombre =
            tratamiento.tratamiento ||
            tratamiento.nombre ||
            "No registrado";


        const odontologo =
            tratamiento.odontologo ||
            tratamiento.doctor ||
            "No registrado";


        const fecha =
            formatearFecha(
                tratamiento.fecha
            );


        const estado =
            tratamiento.estado ||
            "No registrado";


        const diagnostico =
            tratamiento.diagnostico ||
            "No registrado";


        const observacion =
            tratamiento.observaciones ||
            tratamiento.evolucion ||
            tratamiento.descripcion ||
            "No hay observaciones registradas.";


        modal.innerHTML = `

            <div class="modal-tratamiento-contenido">

                <div class="modal-tratamiento-header">

                    <div>

                        <h2>
                            Detalle del tratamiento
                        </h2>

                        <p>
                            Información del tratamiento odontológico
                        </p>

                    </div>


                    <button
                        type="button"
                        class="modal-tratamiento-cerrar"
                    >
                        ×
                    </button>

                </div>


                <div class="datos-tratamiento">

                    <div class="dato-tratamiento">

                        <span>
                            Tratamiento
                        </span>

                        <strong>
                            ${nombre}
                        </strong>

                    </div>


                    <div class="dato-tratamiento">

                        <span>
                            Odontólogo
                        </span>

                        <strong>
                            ${odontologo}
                        </strong>

                    </div>


                    <div class="dato-tratamiento">

                        <span>
                            Fecha
                        </span>

                        <strong>
                            ${fecha}
                        </strong>

                    </div>


                    <div class="dato-tratamiento">

                        <span>
                            Estado
                        </span>

                        <strong>
                            ${estado}
                        </strong>

                    </div>


                    <div class="dato-tratamiento">

                        <span>
                            Diagnóstico
                        </span>

                        <strong>
                            ${diagnostico}
                        </strong>

                    </div>

                </div>


                <div class="observaciones-tratamiento">

                    <h3>
                        Observaciones
                    </h3>

                    <p>
                        ${observacion}
                    </p>

                </div>


                <div class="modal-tratamiento-acciones">

                    <button
                        type="button"
                        class="btn-cerrar-tratamiento"
                    >
                        Cerrar
                    </button>

                </div>

            </div>
        `;


        document.body.appendChild(
            modal
        );


        // Cerrar con X
        modal
            .querySelector(
                ".modal-tratamiento-cerrar"
            )
            .addEventListener(
                "click",
                () => modal.remove()
            );


        // Cerrar con botón
        modal
            .querySelector(
                ".btn-cerrar-tratamiento"
            )
            .addEventListener(
                "click",
                () => modal.remove()
            );


        // Cerrar haciendo clic fuera
        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {
                    modal.remove();
                }
            }
        );


        // Cerrar con ESC
        const cerrarConEscape =
            event => {

                if (
                    event.key === "Escape"
                ) {

                    modal.remove();

                    document.removeEventListener(
                        "keydown",
                        cerrarConEscape
                    );
                }
            };


        document.addEventListener(
            "keydown",
            cerrarConEscape
        );
    }


    // =========================================================
    //  ESTADOS
    // =========================================================
    function esActivo(estado) {

        if (!estado) {
            return false;
        }

        const valor =
            estado
                .toString()
                .toLowerCase()
                .trim();

        return (
            valor === "activo" ||
            valor === "en proceso" ||
            valor === "en_proceso" ||
            valor === "pendiente"
        );
    }


    function esFinalizado(estado) {

        if (!estado) {
            return false;
        }

        const valor =
            estado
                .toString()
                .toLowerCase()
                .trim();

        return (
            valor === "finalizado" ||
            valor === "finalizada" ||
            valor === "completado" ||
            valor === "completada" ||
            valor === "terminado" ||
            valor === "terminada"
        );
    }


    function obtenerClaseEstado(estado) {

        if (esActivo(estado)) {
            return "active";
        }

        if (esFinalizado(estado)) {
            return "completed";
        }

        return "";
    }


    // =========================================================
    //  PRÓXIMO CONTROL
    // =========================================================
    function obtenerProximoControl(
        tratamientosActivos
    ) {

        let fechas = [];


        tratamientosActivos.forEach(
            tratamiento => {

                const fecha =
                    tratamiento.proximoControl ||
                    tratamiento.proximo_control ||
                    tratamiento.fechaControl ||
                    tratamiento.fecha_control;


                if (fecha) {

                    const fechaConvertida =
                        convertirFecha(fecha);

                    if (
                        fechaConvertida >
                        new Date()
                    ) {
                        fechas.push(
                            fechaConvertida
                        );
                    }
                }
            }
        );


        if (fechas.length === 0) {
            return "No programado";
        }


        fechas.sort(
            (a, b) => a - b
        );


        return formatearFecha(
            fechas[0]
        );
    }


    // =========================================================
    //  FECHAS
    // =========================================================
    function convertirFecha(fecha) {

        if (!fecha) {
            return new Date(0);
        }


        if (
            /^\d{4}-\d{2}-\d{2}$/.test(fecha)
        ) {

            return new Date(
                fecha + "T00:00:00"
            );
        }


        if (
            /^\d{2}\/\d{2}\/\d{4}$/.test(fecha)
        ) {

            const partes =
                fecha.split("/");


            return new Date(
                `${partes[2]}-${partes[1]}-${partes[0]}T00:00:00`
            );
        }


        const resultado =
            new Date(fecha);


        return isNaN(resultado)
            ? new Date(0)
            : resultado;
    }


    function formatearFecha(fecha) {

        if (!fecha) {
            return "No registrada";
        }


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