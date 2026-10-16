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
    //  ELEMENTOS
    // =========================================================
    const nombreUsuario =
        document.getElementById("nombreUsuario");

    const nombre =
        document.getElementById("nombre");

    const documento =
        document.getElementById("documento");

    const telefono =
        document.getElementById("telefono");

    const correo =
        document.getElementById("correo");

    const fechaNacimiento =
        document.getElementById("fechaNacimiento");

    const tipoSangre =
        document.getElementById("tipoSangre");

    const direccion =
        document.getElementById("direccion");

    const botonGuardar =
        document.querySelector(
            ".form-actions .btn-primary"
        );

    const botonCambiarPassword =
        document.querySelector(
            ".security-option .btn-secondary"
        );


    // =========================================================
    //  OBTENER DATOS
    // =========================================================
    let usuarios = JSON.parse(
        localStorage.getItem("usuarios")
    ) || [];

    let pacientes = JSON.parse(
        localStorage.getItem("pacientes")
    ) || [];


    // =========================================================
    //  BUSCAR USUARIO ACTUAL
    // =========================================================
    let usuarioActual = null;

    if (usuarioSesion.documento) {

        usuarioActual = usuarios.find(
            usuario =>
                String(usuario.documento) ===
                String(usuarioSesion.documento)
        );
    }

    if (!usuarioActual && usuarioSesion.correo) {

        usuarioActual = usuarios.find(
            usuario =>
                usuario.correo &&
                usuario.correo.toLowerCase() ===
                usuarioSesion.correo.toLowerCase()
        );
    }


    // =========================================================
    //  BUSCAR PACIENTE ACTUAL
    // =========================================================
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


    // =========================================================
    //  OBTENER INFORMACIÓN ACTUAL
    // =========================================================
    const nombreActual =
        pacienteActual?.nombre ||
        usuarioActual?.nombre ||
        usuarioSesion.nombre ||
        "";

    const documentoActual =
        pacienteActual?.documento ||
        usuarioActual?.documento ||
        usuarioSesion.documento ||
        "";

    const telefonoActual =
        pacienteActual?.telefono ||
        usuarioActual?.telefono ||
        "";

    const correoActual =
        pacienteActual?.correo ||
        usuarioActual?.correo ||
        usuarioSesion.correo ||
        "";

    const fechaActual =
        pacienteActual?.fechaNacimiento ||
        pacienteActual?.fecha_nacimiento ||
        usuarioActual?.fechaNacimiento ||
        usuarioActual?.fecha_nacimiento ||
        "";

    const tipoSangreActual =
        pacienteActual?.tipoSangre ||
        pacienteActual?.tipo_sangre ||
        "";

    const direccionActual =
        pacienteActual?.direccion ||
        usuarioActual?.direccion ||
        "";


    // =========================================================
    //  MOSTRAR INFORMACIÓN
    // =========================================================
    if (nombreUsuario) {
        nombreUsuario.textContent =
            nombreActual || "Paciente";
    }

    if (nombre) {
        nombre.value = nombreActual;
    }

    if (documento) {
        documento.value = documentoActual;
    }

    if (telefono) {
        telefono.value = telefonoActual;
    }

    if (correo) {
        correo.value = correoActual;
    }

    if (fechaNacimiento) {
        fechaNacimiento.value =
            convertirFechaParaInput(
                fechaActual
            );
    }

    if (tipoSangre) {
        tipoSangre.value =
            tipoSangreActual;
    }

    if (direccion) {
        direccion.value =
            direccionActual;
    }


    // =========================================================
    //  GUARDAR CAMBIOS
    // =========================================================
    if (botonGuardar) {

        botonGuardar.addEventListener(
            "click",
            () => {

                const nuevoNombre =
                    nombre.value.trim();

                const nuevoTelefono =
                    telefono.value.trim();

                const nuevoCorreo =
                    correo.value.trim();

                const nuevaFecha =
                    fechaNacimiento.value;

                const nuevoTipoSangre =
                    tipoSangre.value;

                const nuevaDireccion =
                    direccion.value.trim();


                // ============================================
                //  VALIDACIONES
                // ============================================
                if (!nuevoNombre) {

                    mostrarModalMensaje(
                        "Información incompleta",
                        "Por favor ingresa tu nombre completo.",
                        "error"
                    );

                    return;
                }


                if (!nuevoTelefono) {

                    mostrarModalMensaje(
                        "Información incompleta",
                        "Por favor ingresa tu teléfono.",
                        "error"
                    );

                    return;
                }


                if (!nuevoCorreo) {

                    mostrarModalMensaje(
                        "Información incompleta",
                        "Por favor ingresa tu correo electrónico.",
                        "error"
                    );

                    return;
                }


                if (!validarCorreo(nuevoCorreo)) {

                    mostrarModalMensaje(
                        "Correo no válido",
                        "Ingresa un correo electrónico válido.",
                        "error"
                    );

                    return;
                }


                // =================================================
                //  ACTUALIZAR USUARIO
                // =================================================
                if (usuarioActual) {

                    usuarioActual.nombre =
                        nuevoNombre;

                    usuarioActual.correo =
                        nuevoCorreo;

                    usuarioActual.telefono =
                        nuevoTelefono;

                    usuarioActual.fechaNacimiento =
                        nuevaFecha;

                    usuarioActual.direccion =
                        nuevaDireccion;


                    const indiceUsuario =
                        usuarios.findIndex(
                            usuario =>
                                usuario ===
                                usuarioActual
                        );


                    if (indiceUsuario !== -1) {

                        usuarios[indiceUsuario] =
                            usuarioActual;
                    }
                }


                // =================================================
                //  ACTUALIZAR PACIENTE
                // =================================================
                if (pacienteActual) {

                    pacienteActual.nombre =
                        nuevoNombre;

                    pacienteActual.telefono =
                        nuevoTelefono;

                    pacienteActual.correo =
                        nuevoCorreo;

                    pacienteActual.fechaNacimiento =
                        nuevaFecha;

                    pacienteActual.direccion =
                        nuevaDireccion;

                    pacienteActual.tipoSangre =
                        nuevoTipoSangre;


                    const indicePaciente =
                        pacientes.findIndex(
                            paciente =>
                                paciente ===
                                pacienteActual
                        );


                    if (indicePaciente !== -1) {

                        pacientes[indicePaciente] =
                            pacienteActual;
                    }

                } else {

                    /* 
                        Si todavía no existe el paciente,
                        se crea con toda su información. 
                    */

                    pacientes.push({

                        documento:
                            documentoActual,

                        nombre:
                            nuevoNombre,

                        telefono:
                            nuevoTelefono,

                        correo:
                            nuevoCorreo,

                        fechaNacimiento:
                            nuevaFecha,

                        tipoSangre:
                            nuevoTipoSangre,

                        direccion:
                            nuevaDireccion
                    });
                }


                // =================================================
                //  ACTUALIZAR SESIÓN
                // =================================================
                usuarioSesion.nombre =
                    nuevoNombre;

                usuarioSesion.correo =
                    nuevoCorreo;


                // =================================================
                //  GUARDAR LOCALSTORAGE
                // =================================================
                localStorage.setItem(
                    "usuarios",
                    JSON.stringify(usuarios)
                );

                localStorage.setItem(
                    "pacientes",
                    JSON.stringify(pacientes)
                );

                localStorage.setItem(
                    "usuarioSesion",
                    JSON.stringify(usuarioSesion)
                );


                // =================================================
                //  ACTUALIZAR ENCABEZADO
                // =================================================
                if (nombreUsuario) {

                    nombreUsuario.textContent =
                        nuevoNombre;
                }


                // =================================================
                //  CONFIRMACIÓN
                // =================================================
                mostrarModalMensaje(
                    "¡Cambios guardados!",
                    "Tu información personal se actualizó correctamente.",
                    "success"
                );

            }
        );
    }


    // =========================================================
    //  CAMBIAR CONTRASEÑA
    // =========================================================
    if (botonCambiarPassword) {

        botonCambiarPassword.addEventListener(
            "click",
            () => {

                mostrarModalPassword();

            }
        );
    }


    // =========================================================
    //  MODAL CAMBIAR CONTRASEÑA
    // =========================================================
    function mostrarModalPassword() {

        const modalAnterior =
            document.querySelector(
                ".modal-password-paciente"
            );

        if (modalAnterior) {
            modalAnterior.remove();
        }


        const modal =
            document.createElement("div");

        modal.className =
            "modal-password-paciente";


        modal.innerHTML = `

            <div class="modal-password-contenido">

                <div class="modal-password-header">

                    <div>

                        <h2>
                            Cambiar contraseña
                        </h2>

                        <p>
                            Actualiza la contraseña de tu cuenta.
                        </p>

                    </div>


                    <button
                        type="button"
                        class="modal-password-cerrar"
                    >
                        ×
                    </button>

                </div>


                <div class="password-form">

                    <div class="form-group">

                        <label for="passwordActual">
                            Contraseña actual
                        </label>

                        <input
                            type="password"
                            id="passwordActual"
                            placeholder="Ingresa tu contraseña actual"
                        >

                    </div>


                    <div class="form-group">

                        <label for="nuevaPassword">
                            Nueva contraseña
                        </label>

                        <input
                            type="password"
                            id="nuevaPassword"
                            placeholder="Ingresa la nueva contraseña"
                        >

                    </div>


                    <div class="form-group">

                        <label for="confirmarPassword">
                            Confirmar nueva contraseña
                        </label>

                        <input
                            type="password"
                            id="confirmarPassword"
                            placeholder="Confirma la nueva contraseña"
                        >

                    </div>

                </div>


                <div class="modal-password-acciones">

                    <button
                        type="button"
                        class="btn btn-secondary btn-cancelar-password"
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        class="btn btn-primary btn-guardar-password"
                    >
                        Cambiar contraseña
                    </button>

                </div>

            </div>

        `;


        document.body.appendChild(modal);


        // =====================================================
        //  CERRAR MODAL
        // =====================================================
        const cerrar =
            () => modal.remove();


        modal
            .querySelector(
                ".modal-password-cerrar"
            )
            .addEventListener(
                "click",
                cerrar
            );


        modal
            .querySelector(
                ".btn-cancelar-password"
            )
            .addEventListener(
                "click",
                cerrar
            );


        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {
                    cerrar();
                }

            }
        );


        // =====================================================
        //  GUARDAR NUEVA CONTRASEÑA
        // =====================================================
        modal
            .querySelector(
                ".btn-guardar-password"
            )
            .addEventListener(
                "click",
                () => {

                    const actual =
                        document.getElementById(
                            "passwordActual"
                        ).value;

                    const nueva =
                        document.getElementById(
                            "nuevaPassword"
                        ).value;

                    const confirmar =
                        document.getElementById(
                            "confirmarPassword"
                        ).value;


                    if (!actual) {

                        mostrarModalMensaje(
                            "Información incompleta",
                            "Ingresa tu contraseña actual.",
                            "error"
                        );

                        return;
                    }


                    if (!nueva) {

                        mostrarModalMensaje(
                            "Información incompleta",
                            "Ingresa la nueva contraseña.",
                            "error"
                        );

                        return;
                    }


                    if (nueva.length < 6) {

                        mostrarModalMensaje(
                            "Contraseña no válida",
                            "La nueva contraseña debe tener al menos 6 caracteres.",
                            "error"
                        );

                        return;
                    }


                    if (nueva !== confirmar) {

                        mostrarModalMensaje(
                            "Las contraseñas no coinciden",
                            "La nueva contraseña y su confirmación deben ser iguales.",
                            "error"
                        );

                        return;
                    }


                    if (!usuarioActual) {

                        mostrarModalMensaje(
                            "Error",
                            "No se encontró la información de tu cuenta.",
                            "error"
                        );

                        return;
                    }


                    if (
                        usuarioActual.contrasena !==
                        actual
                    ) {

                        mostrarModalMensaje(
                            "Contraseña incorrecta",
                            "La contraseña actual que ingresaste no es correcta.",
                            "error"
                        );

                        return;
                    }


                    usuarioActual.contrasena =
                        nueva;


                    const indiceUsuario =
                        usuarios.findIndex(
                            usuario =>
                                String(
                                    usuario.documento
                                ) ===
                                String(
                                    usuarioActual.documento
                                )
                        );


                    if (indiceUsuario !== -1) {

                        usuarios[indiceUsuario] =
                            usuarioActual;
                    }


                    localStorage.setItem(
                        "usuarios",
                        JSON.stringify(usuarios)
                    );


                    cerrar();


                    mostrarModalMensaje(
                        "¡Contraseña actualizada!",
                        "Tu contraseña se cambió correctamente.",
                        "success"
                    );

                }
            );
    }


    // =========================================================
    //  MODAL DE MENSAJES
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

                <div class="
                    modal-mensaje-icono
                    ${tipo}
                ">
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


        document.body.appendChild(modal);


        const cerrar =
            () => modal.remove();


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
            event => {

                if (
                    event.target === modal
                ) {
                    cerrar();
                }

            }
        );


        const cerrarConEscape =
            event => {

                if (
                    event.key === "Escape"
                ) {

                    cerrar();

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
    //  VALIDAR CORREO
    // =========================================================
    function validarCorreo(correo) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(correo);

    }


    // =========================================================
    //  FECHA PARA INPUT DATE
    // =========================================================
    function convertirFechaParaInput(fecha) {

        if (!fecha) {
            return "";
        }


        // YYYY-MM-DD
        if (
            /^\d{4}-\d{2}-\d{2}$/.test(fecha)
        ) {

            return fecha;
        }


        // DD/MM/YYYY
        if (
            /^\d{2}\/\d{2}\/\d{4}$/.test(fecha)
        ) {

            const partes =
                fecha.split("/");


            return (
                partes[2] +
                "-" +
                partes[1] +
                "-" +
                partes[0]
            );
        }


        return "";
    }

});



















