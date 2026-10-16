document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // SESIÓN
    // =========================
    const usuarioSesion =
        JSON.parse(
            localStorage.getItem("usuarioSesion")
        );

    if (!usuarioSesion) {
        window.location.href = "../index.html";
        return;
    }


    // =========================
    // MOSTRAR USUARIO
    // =========================
    const nombreUsuario =
        document.getElementById("nombreUsuario");

    if (nombreUsuario) {
        nombreUsuario.textContent =
            usuarioSesion.nombre;
    }


    // =========================
    // DATOS
    // =========================
    const citas =
        JSON.parse(
            localStorage.getItem("citas")
        ) || [];

    const historiales =
        JSON.parse(
            localStorage.getItem("historiales")
        ) || [];


    // =========================
    // TABLA
    // =========================
    const tabla =
        document.querySelector(
            ".treatments-table"
        );

    if (!tabla) {
        return;
    }


    // =========================
    // ELIMINAR FILAS DE EJEMPLO
    // =========================
    tabla
        .querySelectorAll(
            ".table-row:not(.table-header)"
        )
        .forEach(function (fila) {

            fila.remove();

        });


    // =========================
    // ODONTÓLOGO ACTUAL
    // =========================
    const odontologoActual =
        usuarioSesion.nombre
            .trim()
            .toLowerCase();


    // =========================
    // CREAR MODAL
    // =========================
    function crearModal(contenido) {

        const modal =
            document.createElement("div");

        modal.className =
            "modal-tratamiento";

        modal.innerHTML =
            contenido;

        document.body.appendChild(
            modal
        );


        // =========================
        // BOTÓN X
        // =========================
        const botonCerrar =
            modal.querySelector(
                ".modal-cerrar"
            );

        if (botonCerrar) {

            botonCerrar.addEventListener(
                "click",
                function () {

                    modal.remove();

                }
            );

        }


        // =========================
        // BOTÓN CERRAR
        // =========================
        const botonCerrarModal =
            modal.querySelector(
                ".btn-cerrar-modal"
            );

        if (botonCerrarModal) {

            botonCerrarModal.addEventListener(
                "click",
                function () {

                    modal.remove();

                }
            );

        }


        // =========================
        // CERRAR AL HACER CLIC
        // EN EL FONDO
        // =========================
        modal.addEventListener(
            "click",
            function (evento) {

                if (
                    evento.target === modal
                ) {

                    modal.remove();

                }

            }
        );


        return modal;

    }


    // =========================
    // VER TRATAMIENTO
    // =========================
    function verTratamiento(
        documento
    ) {

        const historial =
            historiales.find(
                function (registro) {

                    return (
                        registro.documento &&
                        documento &&
                        String(
                            registro.documento
                        ).trim() ===
                        String(
                            documento
                        ).trim()
                    );

                }
            );


        if (!historial) {

            alert(
                "No se encontró la información del tratamiento."
            );

            return;

        }


        // =========================
        // MODAL
        // =========================
        crearModal(`

            <div class="modal-contenido">

                <div class="modal-header">

                    <div>

                        <h2>
                            Información del tratamiento
                        </h2>

                        <p>
                            Información registrada del paciente.
                        </p>

                    </div>

                    <button
                        type="button"
                        class="modal-cerrar"
                        aria-label="Cerrar"
                    >
                        ×
                    </button>

                </div>


                <div class="datos-tratamiento">


                    <div class="dato">

                        <strong>
                            Documento
                        </strong>

                        <span>
                            ${historial.documento || "-"}
                        </span>

                    </div>


                    <div class="dato">

                        <strong>
                            Paciente
                        </strong>

                        <span>
                            ${historial.paciente || "-"}
                        </span>

                    </div>


                    <div class="dato">

                        <strong>
                            Fecha de consulta
                        </strong>

                        <span>
                            ${historial.ultimaConsulta || "-"}
                        </span>

                    </div>


                    <div class="dato">

                        <strong>
                            Motivo de consulta
                        </strong>

                        <span>
                            ${historial.motivo || "-"}
                        </span>

                    </div>


                    <div class="dato">

                        <strong>
                            Diagnóstico
                        </strong>

                        <span>
                            ${historial.diagnostico || "-"}
                        </span>

                    </div>


                    <div class="dato">

                        <strong>
                            Tratamiento realizado
                        </strong>

                        <span>
                            ${historial.tratamiento || "-"}
                        </span>

                    </div>


                    <div class="dato">

                        <strong>
                            Evolución / Observaciones
                        </strong>

                        <span>
                            ${historial.evolucion || "-"}
                        </span>

                    </div>


                    <div class="dato">

                        <strong>
                            Recomendaciones
                        </strong>

                        <span>
                            ${historial.recomendaciones || "-"}
                        </span>

                    </div>


                </div>


                <div class="modal-acciones">

                    <button
                        type="button"
                        class="btn-cerrar-modal"
                    >
                        Cerrar
                    </button>

                </div>


            </div>

        `);

    }


    // =========================
    // OBTENER CITAS DEL
    // ODONTÓLOGO ACTUAL
    // =========================
    const citasOdontologo =
        citas.filter(
            function (cita) {

                return (
                    cita.odontologo &&
                    cita.odontologo
                        .trim()
                        .toLowerCase() ===
                    odontologoActual
                );

            }
        );


    // =========================
    // CREAR FILAS
    // =========================
    citasOdontologo.forEach(
        function (cita) {


            // =========================
            // BUSCAR HISTORIAL
            // =========================
            const historial =
                historiales.find(
                    function (registro) {


                        const mismoDocumento =
                            registro.documento &&
                            cita.documentoPaciente &&
                            String(
                                registro.documento
                            ).trim() ===
                            String(
                                cita.documentoPaciente
                            ).trim();


                        const mismoPaciente =
                            registro.paciente &&
                            cita.paciente &&
                            registro.paciente
                                .trim()
                                .toLowerCase() ===
                            cita.paciente
                                .trim()
                                .toLowerCase();


                        return (
                            mismoDocumento ||
                            mismoPaciente
                        );

                    }
                );


            // =========================
            // SI NO HAY HISTORIAL
            // O NO HAY TRATAMIENTO
            // =========================
            if (
                !historial ||
                !historial.tratamiento ||
                historial.tratamiento
                    .trim() === ""
            ) {

                return;

            }


            // =========================
            // CREAR FILA
            // =========================
            const fila =
                document.createElement(
                    "div"
                );

            fila.className =
                "table-row";


            fila.innerHTML = `

                <span>
                    ${
                        historial.paciente ||
                        cita.paciente ||
                        "-"
                    }
                </span>


                <span>
                    ${
                        historial.tratamiento ||
                        "-"
                    }
                </span>


                <span>
                    ${
                        historial.diagnostico ||
                        "-"
                    }
                </span>


                <span class="status active">
                    Registrado
                </span>


                <span class="actions">

                    <button
                        class="btn-action"
                        type="button"
                        data-documento="${
                            historial.documento || ""
                        }"
                    >
                        Ver
                    </button>

                </span>

            `;


            tabla.appendChild(
                fila
            );

        }
    );


    // =========================
    // EVENTOS BOTONES "VER"
    // =========================
    const botonesVer =
        tabla.querySelectorAll(
            ".btn-action"
        );


    botonesVer.forEach(
        function (boton) {

            boton.addEventListener(
                "click",
                function () {

                    const documento =
                        boton.getAttribute(
                            "data-documento"
                        );

                    verTratamiento(
                        documento
                    );

                }
            );

        }
    );


    // =========================
    // BUSCADOR
    // =========================
    const buscador =
        document.getElementById(
            "buscarTratamiento"
        );


    if (buscador) {

        buscador.addEventListener(
            "input",
            function () {


                const texto =
                    buscador.value
                        .toLowerCase()
                        .trim();


                const filas =
                    tabla.querySelectorAll(
                        ".table-row:not(.table-header)"
                    );


                filas.forEach(
                    function (fila) {


                        const contenido =
                            fila.textContent
                                .toLowerCase();


                        if (
                            contenido.includes(
                                texto
                            )
                        ) {

                            fila.style.display =
                                "grid";

                        } else {

                            fila.style.display =
                                "none";

                        }

                    }
                );

            }
        );

    }

});






