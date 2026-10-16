// =========================================================
// SOLICITAR CITA - PACIENTE
// =========================================================


document.addEventListener("DOMContentLoaded", function () {


    // =========================================================
    // 1. OBTENER ELEMENTOS
    // =========================================================

    const formulario =
        document.querySelector(".appointment-form");

    const nombreUsuario =
        document.getElementById("nombreUsuario");

    const servicio =
        document.getElementById("servicio");

    const odontologo =
        document.getElementById("odontologo");

    const fecha =
        document.getElementById("fecha");

    const hora =
        document.getElementById("hora");

    const motivo =
        document.getElementById("motivo");


    // =========================================================
    // 2. VALIDAR SESIÓN
    // =========================================================

    const usuarioSesion =
        JSON.parse(
            localStorage.getItem("usuarioSesion")
        );


    if (!usuarioSesion) {

        window.location.href =
            "../index.html";

        return;
    }


    // =========================================================
    // 3. MOSTRAR NOMBRE DEL USUARIO
    // =========================================================

    if (nombreUsuario) {

        nombreUsuario.textContent =
            usuarioSesion.nombre || "Paciente";
    }


    // =========================================================
    // 4. CARGAR ODONTÓLOGOS ACTIVOS
    // =========================================================

    function obtenerOdontologosActivos() {

        const usuarios =
            JSON.parse(
                localStorage.getItem("usuarios")
            ) || [];


        return usuarios.filter(function (usuario) {

            return (
                usuario.rol === "Odontólogo" &&
                usuario.estado === "Activo"
            );

        });

    }


    // =========================================================
    // 5. MOSTRAR ODONTÓLOGOS EN EL SELECT
    // =========================================================

    function cargarOdontologos() {

        if (!odontologo) {
            return;
        }


        const odontologos =
            obtenerOdontologosActivos();


        // Limpiar las opciones que están
        // escritas directamente en el HTML

        odontologo.innerHTML = "";


        // Opción inicial

        const opcionInicial =
            document.createElement("option");

        opcionInicial.value = "";

        opcionInicial.textContent =
            "Selecciona un odontólogo";

        odontologo.appendChild(
            opcionInicial
        );


        // =====================================================
        // CREAR OPCIONES
        // =====================================================

        odontologos.forEach(function (odontologoActual) {

            const opcion =
                document.createElement("option");


            /*
             * IMPORTANTE:
             *
             * El value será el DOCUMENTO
             * del odontólogo.
             *
             * El texto visible será su
             * NOMBRE COMPLETO.
             */

            opcion.value =
                odontologoActual.documento;


            opcion.textContent =
                odontologoActual.nombre;


            odontologo.appendChild(
                opcion
            );

        });


        // =====================================================
        // SI NO HAY ODONTÓLOGOS ACTIVOS
        // =====================================================

        if (odontologos.length === 0) {

            const opcionSinOdontologos =
                document.createElement("option");

            opcionSinOdontologos.value = "";

            opcionSinOdontologos.textContent =
                "No hay odontólogos disponibles";

            opcionSinOdontologos.disabled = true;

            odontologo.appendChild(
                opcionSinOdontologos
            );
        }

    }


    // Ejecutar inmediatamente

    cargarOdontologos();


    // =========================================================
    // 6. FECHA MÍNIMA
    // =========================================================

    if (fecha) {

        const hoy =
            new Date();


        const año =
            hoy.getFullYear();


        const mes =
            String(
                hoy.getMonth() + 1
            ).padStart(2, "0");


        const dia =
            String(
                hoy.getDate()
            ).padStart(2, "0");


        const fechaHoy =
            `${año}-${mes}-${dia}`;


        fecha.min =
            fechaHoy;
    }


    // =========================================================
    // 7. OBTENER PACIENTE ACTUAL
    // =========================================================

    function obtenerPacienteActual() {

        const pacientes =
            JSON.parse(
                localStorage.getItem("pacientes")
            ) || [];


        let pacienteActual =
            null;


        // Buscar por documento

        if (usuarioSesion.documento) {

            pacienteActual =
                pacientes.find(function (paciente) {

                    return (
                        String(
                            paciente.documento
                        ) ===
                        String(
                            usuarioSesion.documento
                        )
                    );

                });

        }


        // Si no lo encontró, buscar por correo

        if (
            !pacienteActual &&
            usuarioSesion.correo
        ) {

            pacienteActual =
                pacientes.find(function (paciente) {

                    return (
                        paciente.correo &&
                        paciente.correo.toLowerCase() ===
                        usuarioSesion.correo.toLowerCase()
                    );

                });

        }


        return pacienteActual;
    }


    // =========================================================
    // 8. OBTENER NOMBRE DEL ODONTÓLOGO SELECCIONADO
    // =========================================================

    function obtenerDatosOdontologo() {

        if (!odontologo) {

            return {
                documento: "",
                nombre: ""
            };

        }


        const documentoSeleccionado =
            odontologo.value;


        if (!documentoSeleccionado) {

            return {
                documento: "",
                nombre: ""
            };

        }


        const odontologos =
            obtenerOdontologosActivos();


        const odontologoSeleccionado =
            odontologos.find(function (item) {

                return String(
                    item.documento
                ) === String(
                    documentoSeleccionado
                );

            });


        if (!odontologoSeleccionado) {

            return {
                documento: documentoSeleccionado,
                nombre: ""
            };

        }


        return {

            documento:
                odontologoSeleccionado.documento,

            nombre:
                odontologoSeleccionado.nombre

        };

    }


    // =========================================================
    // 9. CONVERTIR FECHA
    // =========================================================

    function convertirFechaParaMostrar(
        fechaValor
    ) {

        if (!fechaValor) {
            return "";
        }


        // Si viene como YYYY-MM-DD

        if (
            fechaValor.includes("-")
        ) {

            const partes =
                fechaValor.split("-");


            return (
                partes[2] +
                "/" +
                partes[1] +
                "/" +
                partes[0]
            );

        }


        return fechaValor;
    }


    // =========================================================
    // 10. OBTENER HORA
    // =========================================================

    function obtenerHoraSeleccionada() {

        if (!hora) {
            return "";
        }


        const opcion =
            hora.options[
                hora.selectedIndex
            ];


        if (!opcion) {
            return "";
        }


        return opcion.textContent.trim();
    }


    // =========================================================
    // 11. GENERAR ID ÚNICO
    // =========================================================

    function generarIdCita(citas) {

        if (!citas.length) {

            return 1;
        }


        const idsNumericos =
            citas
                .map(function (cita) {

                    return Number(
                        cita.id
                    );

                })
                .filter(function (id) {

                    return !isNaN(id);

                });


        if (!idsNumericos.length) {

            return 1;
        }


        return (
            Math.max(...idsNumericos) +
            1
        );
    }


    // =========================================================
    // 12. EVENTO SUBMIT
    // =========================================================

    if (formulario) {

        formulario.addEventListener(
            "submit",
            function (evento) {

                evento.preventDefault();


                // =================================================
                // DATOS DEL FORMULARIO
                // =================================================

                const servicioSeleccionado =
                    servicio.value;


                const fechaSeleccionada =
                    fecha.value;


                const horaSeleccionada =
                    obtenerHoraSeleccionada();


                const motivoSeleccionado =
                    motivo
                        ? motivo.value.trim()
                        : "";


                const datosOdontologo =
                    obtenerDatosOdontologo();


                // =================================================
                // VALIDACIONES
                // =================================================

                if (!servicioSeleccionado) {

                    mostrarModalMensaje(
                        "Información incompleta",
                        "Selecciona el servicio odontológico.",
                        "error"
                    );

                    return;
                }


                if (!datosOdontologo.documento) {

                    mostrarModalMensaje(
                        "Información incompleta",
                        "Selecciona un odontólogo.",
                        "error"
                    );

                    return;
                }


                if (!fechaSeleccionada) {

                    mostrarModalMensaje(
                        "Información incompleta",
                        "Selecciona la fecha de la cita.",
                        "error"
                    );

                    return;
                }


                if (!horaSeleccionada) {

                    mostrarModalMensaje(
                        "Información incompleta",
                        "Selecciona una hora disponible.",
                        "error"
                    );

                    return;
                }


                // =================================================
                // BUSCAR PACIENTE
                // =================================================

                const pacienteActual =
                    obtenerPacienteActual();


                const nombrePaciente =
                    pacienteActual?.nombre ||
                    usuarioSesion.nombre ||
                    "";


                const documentoPaciente =
                    pacienteActual?.documento ||
                    usuarioSesion.documento ||
                    "";


                // =================================================
                // OBTENER CITAS EXISTENTES
                // =================================================

                let citas =
                    JSON.parse(
                        localStorage.getItem("citas")
                    ) || [];


                // =================================================
                // FECHA PARA GUARDAR
                // =================================================

                const fechaMostrar =
                    convertirFechaParaMostrar(
                        fechaSeleccionada
                    );


                // =================================================
                // EVITAR CITA DUPLICADA
                // =================================================

                const citaDuplicada =
                    citas.some(function (cita) {

                        const mismaFecha =
                            cita.fecha ===
                            fechaMostrar;


                        const mismaHora =
                            cita.hora ===
                            horaSeleccionada;


                        const mismoPaciente =
                            (
                                cita.pacienteDocumento &&
                                documentoPaciente
                            )
                                ? String(
                                    cita.pacienteDocumento
                                ) ===
                                String(
                                    documentoPaciente
                                )
                                : (
                                    cita.paciente &&
                                    cita.paciente
                                        .trim()
                                        .toLowerCase() ===
                                    nombrePaciente
                                        .trim()
                                        .toLowerCase()
                                );


                        const activa =
                            cita.estado !==
                            "Cancelada";


                        return (
                            mismaFecha &&
                            mismaHora &&
                            mismoPaciente &&
                            activa
                        );

                    });


                if (citaDuplicada) {

                    mostrarModalMensaje(
                        "Cita duplicada",
                        "Ya tienes una cita registrada para esa fecha y hora.",
                        "error"
                    );

                    return;
                }


                // =================================================
                // CREAR NUEVA CITA
                // =================================================

                const nuevaCita = {

                    id:
                        generarIdCita(citas),

                    paciente:
                        nombrePaciente,

                    pacienteDocumento:
                        documentoPaciente,

                    odontologo:
                        datosOdontologo.nombre,

                    odontologoDocumento:
                        datosOdontologo.documento,

                    fecha:
                        fechaMostrar,

                    hora:
                        horaSeleccionada,

                    servicio:
                        obtenerTextoServicio(),

                    motivo:
                        motivoSeleccionado,

                    estado:
                        "Pendiente"

                };


                // =================================================
                // GUARDAR CITA
                // =================================================

                citas.push(
                    nuevaCita
                );


                localStorage.setItem(
                    "citas",
                    JSON.stringify(citas)
                );


                // =================================================
                // LIMPIAR FORMULARIO
                // =================================================

                formulario.reset();


                // Volver a colocar la fecha mínima

                if (fecha) {

                    const hoy =
                        new Date();


                    const año =
                        hoy.getFullYear();


                    const mes =
                        String(
                            hoy.getMonth() + 1
                        ).padStart(2, "0");


                    const dia =
                        String(
                            hoy.getDate()
                        ).padStart(2, "0");


                    fecha.min =
                        `${año}-${mes}-${dia}`;
                }


                // =================================================
                // MODAL DE CONFIRMACIÓN
                // =================================================

                mostrarModalConfirmacion(
                    nuevaCita
                );

            }
        );

    }


    // =========================================================
    // 13. OBTENER TEXTO DEL SERVICIO
    // =========================================================

    function obtenerTextoServicio() {

        if (!servicio) {
            return "";
        }


        const opcion =
            servicio.options[
                servicio.selectedIndex
            ];


        if (!opcion) {
            return "";
        }


        return opcion.textContent.trim();
    }


    // =========================================================
    // 14. MODAL DE CONFIRMACIÓN
    // =========================================================

    function mostrarModalConfirmacion(
        cita
    ) {

        const modalAnterior =
            document.querySelector(
                ".modal-solicitud-cita"
            );


        if (modalAnterior) {
            modalAnterior.remove();
        }


        const modal =
            document.createElement("div");


        modal.className =
            "modal-solicitud-cita";


        modal.innerHTML = `

            <div class="modal-solicitud-contenido">

                <div class="modal-solicitud-icono">
                    ✓
                </div>


                <h2>
                    ¡Solicitud enviada!
                </h2>


                <p>
                    Tu cita fue registrada correctamente.
                </p>


                <div class="detalle-solicitud">

                    <div>
                        <strong>
                            Odontólogo
                        </strong>

                        <span>
                            ${cita.odontologo}
                        </span>
                    </div>


                    <div>
                        <strong>
                            Fecha
                        </strong>

                        <span>
                            ${cita.fecha}
                        </span>
                    </div>


                    <div>
                        <strong>
                            Hora
                        </strong>

                        <span>
                            ${cita.hora}
                        </span>
                    </div>


                    <div>
                        <strong>
                            Servicio
                        </strong>

                        <span>
                            ${cita.servicio}
                        </span>
                    </div>

                </div>


                <button
                    type="button"
                    class="btn-modal-solicitud"
                >
                    Ver mis citas
                </button>

            </div>

        `;


        document.body.appendChild(
            modal
        );


        // =====================================================
        // ESTILOS DEL MODAL
        // =====================================================

        aplicarEstilosModalSolicitud();


        // =====================================================
        // BOTÓN
        // =====================================================

        const boton =
            modal.querySelector(
                ".btn-modal-solicitud"
            );


        boton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "citas-paciente.html";

            }
        );


        // =====================================================
        // CERRAR HACIENDO CLIC FUERA
        // =====================================================

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

    }


    // =========================================================
    // 15. MODAL DE MENSAJES / ERRORES
    // =========================================================

    function mostrarModalMensaje(
        titulo,
        mensaje,
        tipo
    ) {

        const modalAnterior =
            document.querySelector(
                ".modal-mensaje-paciente"
            );


        if (modalAnterior) {
            modalAnterior.remove();
        }


        const modal =
            document.createElement("div");


        modal.className =
            "modal-mensaje-paciente";


        const icono =
            tipo === "success"
                ? "✓"
                : "!";


        modal.innerHTML = `

            <div class="modal-mensaje-contenido">

                <div
                    class="modal-mensaje-icono ${tipo}"
                >
                    ${icono}
                </div>


                <div class="modal-mensaje-texto">

                    <h2>
                        ${titulo}
                    </h2>

                    <p>
                        ${mensaje}
                    </p>

                </div>


                <button
                    type="button"
                    class="btn-modal-mensaje"
                >
                    Aceptar
                </button>

            </div>

        `;


        document.body.appendChild(
            modal
        );


        // =====================================================
        // CERRAR
        // =====================================================

        const cerrar =
            function () {

                modal.remove();

            };


        modal
            .querySelector(
                ".btn-modal-mensaje"
            )
            .addEventListener(
                "click",
                cerrar
            );


        modal.addEventListener(
            "click",
            function (evento) {

                if (
                    evento.target === modal
                ) {

                    cerrar();

                }

            }
        );

    }


    // =========================================================
    // 16. ESTILOS DEL MODAL DE SOLICITUD
    // =========================================================

    function aplicarEstilosModalSolicitud() {

        if (
            document.getElementById(
                "estilosModalSolicitud"
            )
        ) {

            return;
        }


        const estilo =
            document.createElement("style");


        estilo.id =
            "estilosModalSolicitud";


        estilo.textContent = `

            .modal-solicitud-cita {

                position: fixed;

                top: 0;
                left: 0;

                width: 100%;
                height: 100%;

                background-color:
                    rgba(15, 23, 42, 0.55);

                display: flex;

                align-items: center;
                justify-content: center;

                padding: 20px;

                box-sizing: border-box;

                z-index: 9999;

            }


            .modal-solicitud-contenido {

                width: 100%;

                max-width: 480px;

                background-color:
                    var(--color-white, #ffffff);

                border-radius: 12px;

                padding: 30px;

                box-sizing: border-box;

                text-align: center;

                box-shadow:
                    0 20px 50px
                    rgba(0, 0, 0, 0.20);

                animation:
                    modalSolicitudAparecer
                    0.25s ease;

            }


            .modal-solicitud-icono {

                width: 60px;
                height: 60px;

                margin:
                    0 auto 18px;

                border-radius: 50%;

                display: flex;

                align-items: center;
                justify-content: center;

                background-color:
                    #DCFCE7;

                color:
                    #16A34A;

                font-size: 30px;

                font-weight: bold;

            }


            .modal-solicitud-contenido h2 {

                margin:
                    0 0 10px;

                color:
                    var(--color-text, #1e293b);

                font-size: 24px;

            }


            .modal-solicitud-contenido > p {

                margin:
                    0 0 20px;

                color:
                    var(
                        --color-text-secondary,
                        #64748b
                    );

                font-size: 15px;

            }


            .detalle-solicitud {

                display: flex;

                flex-direction: column;

                gap: 12px;

                margin-bottom: 25px;

                padding: 18px;

                background-color:
                    var(
                        --color-background,
                        #f8fafc
                    );

                border-radius: 8px;

                text-align: left;

            }


            .detalle-solicitud div {

                display: flex;

                justify-content:
                    space-between;

                gap: 15px;

            }


            .detalle-solicitud strong {

                color:
                    var(
                        --color-text,
                        #1e293b
                    );

                font-size: 14px;

            }


            .detalle-solicitud span {

                color:
                    var(
                        --color-text-secondary,
                        #64748b
                    );

                font-size: 14px;

                text-align: right;

            }


            .btn-modal-solicitud {

                width: 100%;

                padding: 12px 18px;

                border: none;

                border-radius: 8px;

                background-color:
                    var(
                        --color-primary,
                        #2563eb
                    );

                color:
                    #ffffff;

                font-size: 14px;

                font-weight: 600;

                cursor: pointer;

                transition: 0.2s;

            }


            .btn-modal-solicitud:hover {

                opacity: 0.9;

            }


            @keyframes modalSolicitudAparecer {

                from {

                    opacity: 0;

                    transform:
                        translateY(-10px)
                        scale(0.98);

                }

                to {

                    opacity: 1;

                    transform:
                        translateY(0)
                        scale(1);

                }

            }


            @media (max-width: 600px) {

                .modal-solicitud-contenido {

                    padding: 22px;

                }


                .detalle-solicitud div {

                    flex-direction:
                        column;

                    gap: 4px;

                }


                .detalle-solicitud span {

                    text-align: left;

                }

            }

        `;


        document.head.appendChild(
            estilo
        );

    }

});













