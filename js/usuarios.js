// ==========================================
// USUARIOS - CRUD COMPLETO
// ==========================================
// ELEMENTOS PRINCIPALES
// =========================
const buscador = document.getElementById("buscarUsuario");

const tablaUsuarios = document.querySelector(".users-table");

const botonNuevo = document.querySelector(".page-heading .btn-principal");


    // =========================
    // DATOS
    // =========================
    let usuarios =

        JSON.parse(
            localStorage.getItem("usuarios")
        ) || [];


    // =========================
    // MOSTRAR USUARIO ACTUAL
    // =========================
    const usuarioSesion =

        JSON.parse(
            localStorage.getItem("usuarioSesion")
        );


    const nombreUsuarioHeader =

        document.querySelector(
            ".user-info #nombreUsuario"
        );


    if (
        nombreUsuarioHeader &&
        usuarioSesion

    ) {

        nombreUsuarioHeader.textContent =
            usuarioSesion.nombre;

    }


    // ==========================================
    // GENERAR USUARIO
    // ==========================================
    function generarUsuario(correo) {


        if (!correo) {
            return "usuario";
        }


        return correo
            .split("@")[0]
            .toLowerCase()
            .replace(/\s/g, ""
        );


    }


    // ==========================================
    // GUARDAR USUARIOS
    // ==========================================
    function guardarUsuarios() {


        localStorage.setItem(
            "usuarios",
            JSON.stringify(usuarios)
        );


    }


    // ==========================================
    // OBTENER PACIENTES
    // ==========================================
    function obtenerPacientes() {


        return (

            JSON.parse(
                localStorage.getItem("pacientes")
            ) || []

        );


    }


    // ==========================================
    // GUARDAR PACIENTES
    // ==========================================
    function guardarPacientes(pacientes) {


        localStorage.setItem(
            "pacientes",
            JSON.stringify(pacientes)
        );


    }


    // ==========================================
    // SINCRONIZAR PACIENTE
    // ==========================================

    /*
        Cuando un usuario tiene rol Paciente,
        debe existir también en la colección de pacientes.

        La relación se hace mediante DOCUMENTO.
    */

    function sincronizarPaciente(usuario) {


        if (
            !usuario ||
            usuario.rol !== "Paciente"
        ) {

            return;

        }


        let pacientes =

            obtenerPacientes();

        const indice =

            pacientes.findIndex(

                function (paciente) {


                    return (
                        paciente.documento ===
                        usuario.documento
                    );


                }
            );

            
            const pacienteActualizado = {
            

            documento:
                usuario.documento,


            nombre:
                usuario.nombre,


            telefono:
                indice >= 0 &&
                pacientes[indice].telefono
                    ? pacientes[indice].telefono
                    : "",


            correo:
                usuario.correo

        };


        if (indice >= 0) {

            pacientes[indice] =
                pacienteActualizado;


        } else {


            pacientes.push(
                pacienteActualizado
            );

        }


        guardarPacientes(
            pacientes
        );

    }


    // ==========================================
    // SINCRONIZAR TODOS LOS PACIENTES
    // ==========================================
    function sincronizarPacientesIniciales() {


        usuarios.forEach(

            function (usuario) {

                sincronizarPaciente(
                    usuario
                );

            }

        );

    }


    // =========================
    // CARGAR DATOS INICIALES
    // =========================
    if (usuarios.length === 0) {


        const filasIniciales =

            document.querySelectorAll(
                ".users-table .table-row:not(.table-header)"
            );


        filasIniciales.forEach(

            function (fila) {


                const datos =

                    fila.querySelectorAll(
                        "span"
                    );


                const correo =

                    datos[2]
                        .textContent
                        .trim();


                usuarios.push({


                    documento:

                        datos[0]

                            .textContent

                            .trim(),



                    nombre:

                        datos[1]

                            .textContent

                            .trim(),



                    correo:

                        correo,



                    usuario:

                        generarUsuario(

                            correo

                        ),



                    contrasena:

                        "123456",



                    rol:

                        datos[3]

                            .textContent

                            .trim(),



                    estado:

                        datos[4]

                            .textContent

                            .trim()



                });



            }

        );





        guardarUsuarios();



    } else {



        // ==========================================

        // ACTUALIZAR USUARIOS EXISTENTES

        // ==========================================



        let huboCambios =

            false;





        usuarios.forEach(

            function (usuario) {



                if (!usuario.usuario) {



                    usuario.usuario =

                        generarUsuario(

                            usuario.correo

                        );



                    huboCambios = true;

                }





                if (!usuario.contrasena) {



                    usuario.contrasena =

                        "123456";



                    huboCambios = true;

                }



            }

        );





        if (huboCambios) {

            guardarUsuarios();

        }

    }





    // ==========================================

    // SINCRONIZAR PACIENTES EXISTENTES

    // ==========================================



    sincronizarPacientesIniciales();





    // =========================

    // MOSTRAR USUARIOS

    // =========================



    function mostrarUsuarios(

        lista = usuarios

    ) {



        const filas =

            tablaUsuarios.querySelectorAll(

                ".table-row:not(.table-header)"

            );





        filas.forEach(

            function (fila) {

                fila.remove();

            }

        );





        lista.forEach(

            function (usuario) {



                const fila =

                    document.createElement(

                        "div"

                    );



                fila.className =

                    "table-row";





                fila.innerHTML = `



                    <span>

                        ${usuario.documento}

                    </span>



                    <span>

                        ${usuario.nombre}

                    </span>



                    <span>

                        ${usuario.correo}

                    </span>



                    <span>

                        ${usuario.rol}

                    </span>



                    <span>

                        ${usuario.estado}

                    </span>



                    <span class="actions">



                        <button

                            class="btn-action btn-ver"

                        >

                            Ver

                        </button>



                        <button

                            class="btn-action btn-editar"

                        >

                            Editar

                        </button>



                        <button

                            class="btn-action btn-eliminar"

                        >

                            Eliminar

                        </button>



                    </span>



                `;





                tablaUsuarios.appendChild(

                    fila

                );



            }

        );





        agregarEventosBotones();

    }





    // =========================

    // BUSCADOR

    // =========================



    if (buscador) {



        buscador.addEventListener(

            "input",

            function () {



                const texto =

                    buscador.value

                        .toLowerCase()

                        .trim();





                const resultados =

                    usuarios.filter(

                        function (usuario) {



                            return (



                                usuario.documento

                                    .toLowerCase()

                                    .includes(texto)



                                ||



                                usuario.nombre

                                    .toLowerCase()

                                    .includes(texto)



                                ||



                                usuario.correo

                                    .toLowerCase()

                                    .includes(texto)



                                ||



                                usuario.usuario

                                    .toLowerCase()

                                    .includes(texto)



                                ||



                                usuario.rol

                                    .toLowerCase()

                                    .includes(texto)



                                ||



                                usuario.estado

                                    .toLowerCase()

                                    .includes(texto)



                            );



                        }

                    );





                mostrarUsuarios(

                    resultados

                );



            }

        );



    }





    // =========================

    // CREAR MODAL

    // =========================



    function crearModal(

        contenido

    ) {



        const modal =

            document.createElement(

                "div"

            );





        modal.className =

            "modal-usuario";





        modal.innerHTML =

            contenido;





        document.body.appendChild(

            modal

        );





        return modal;

    }





    // =========================

    // NUEVO USUARIO

    // =========================



    function abrirFormularioNuevo() {



        const modal =

            crearModal(`



                <div class="modal-contenido">



                    <div class="modal-header">



                        <div>



                            <h2>

                                Nuevo usuario

                            </h2>



                            <p>

                                Registra un nuevo usuario del sistema.

                            </p>



                        </div>



                        <button

                            type="button"

                            class="modal-cerrar"

                        >

                            ×

                        </button>



                    </div>





                    <form id="formUsuario">



                        <div class="form-group">



                            <label

                                for="documentoUsuario"

                            >

                                Documento

                            </label>



                            <input

                                type="text"

                                id="documentoUsuario"

                                required

                            >



                        </div>





                        <div class="form-group">



                            <label

                                for="nuevoNombreUsuario"

                            >

                                Nombre completo

                            </label>



                            <input

                                type="text"

                                id="nuevoNombreUsuario"

                                required

                            >



                        </div>





                        <div class="form-group">



                            <label

                                for="correoUsuario"

                            >

                                Correo electrónico

                            </label>



                            <input

                                type="email"

                                id="correoUsuario"

                                required

                            >



                        </div>





                        <div class="form-group">



                            <label

                                for="usuarioUsuario"

                            >

                                Usuario

                            </label>



                            <input

                                type="text"

                                id="usuarioUsuario"

                                placeholder="Ejemplo: mateo"

                                required

                            >



                        </div>





                        <div class="form-group">



                            <label

                                for="contrasenaUsuario"

                            >

                                Contraseña

                            </label>



                            <input

                                type="password"

                                id="contrasenaUsuario"

                                placeholder="Ingrese una contraseña"

                                required

                            >



                        </div>





                        <div class="form-group">



                            <label

                                for="rolUsuario"

                            >

                                Rol

                            </label>



                            <select

                                id="rolUsuario"

                                required

                            >



                                <option value="">

                                    Seleccione un rol

                                </option>



                                <option value="Administrador">

                                    Administrador

                                </option>



                                <option value="Recepcionista">

                                    Recepcionista

                                </option>



                                <option value="Odontólogo">

                                    Odontólogo

                                </option>



                                <option value="Paciente">

                                    Paciente

                                </option>



                            </select>



                        </div>





                        <div class="form-group">



                            <label

                                for="estadoUsuario"

                            >

                                Estado

                            </label>



                            <select

                                id="estadoUsuario"

                                required

                            >



                                <option value="Activo">

                                    Activo

                                </option>



                                <option value="Inactivo">

                                    Inactivo

                                </option>



                            </select>



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

                                Guardar usuario

                            </button>



                        </div>



                    </form>



                </div>



            `);





        // =========================
        // CERRAR
        // =========================
        modal

            .querySelector(".modal-cerrar")

            .addEventListener(

                "click",

                function () {
                    modal.remove();
                }

            );


        modal

            .querySelector(".modal-cancelar")

            .addEventListener(

                "click",

                function () {
                    modal.remove();
                }

            );


        // =========================
        // GUARDAR
        // =========================
        modal

            .querySelector("#formUsuario")

            .addEventListener(

                "submit",

                function (evento) {


                    evento.preventDefault();


                    /* 
                    IMPORTANTE:

                    Todos los campos se buscan dentro del modal para evitar conflictos
                    con elementos del HTML principal 
                    */
                    const documento =

                        modal

                            .querySelector(
                                "#documentoUsuario"
                            )

                            .value

                            .trim();


                    const nombre =

                        modal

                            .querySelector(
                                "#nuevoNombreUsuario"
                            )

                            .value

                            .trim();


                    const correo =

                        modal

                            .querySelector(
                                "#correoUsuario"
                            )

                            .value

                            .trim();


                    const usuarioLogin =

                        modal

                            .querySelector(
                                "#usuarioUsuario"
                            )

                            .value
                            
                            .trim()

                            .toLowerCase();


                    const contrasena =

                        modal

                            .querySelector(
                                "#contrasenaUsuario"
                            )

                            .value;


                    const rol =

                        modal

                            .querySelector(
                                "#rolUsuario"
                            )

                            .value;


                    const estado =

                        modal

                            .querySelector(
                                "#estadoUsuario"
                            )

                            .value;


                    // =========================
                    // VALIDAR DOCUMENTO
                    // =========================
                    const existeDocumento =

                        usuarios.some(

                            function (usuario) {


                                return (
                                    usuario.documento ===
                                    documento
                                );


                            }

                        );


                    if (existeDocumento) {


                        alert(
                            "Ya existe un usuario registrado con ese documento."
                        );


                        return;

                    }


                    // =========================
                    // VALIDAR USUARIO
                    // =========================
                    const existeUsuario =

                        usuarios.some(

                            function (usuario) {


                                return (

                                    usuario.usuario &&
                                    usuario.usuario
                                        .toLowerCase() ===
                                    usuarioLogin

                                );


                            }

                        );


                    if (existeUsuario) {


                        alert(
                            "Ya existe un usuario con ese nombre de usuario."
                        );


                        return;

                    }


                    // =========================
                    // CREAR USUARIO
                    // =========================
                    const nuevoUsuario = {


                        documento:
                            documento,


                        nombre:
                            nombre,


                        correo:
                            correo,


                        usuario:
                            usuarioLogin,


                        contrasena:
                            contrasena,


                        rol:
                            rol,

                        estado:
                            estado

                    };


                    usuarios.push(
                        nuevoUsuario
                    );


                    guardarUsuarios();


                    // ==========================================
                    // SI ES PACIENTE, CREAR SU REGISTRO
                    // ==========================================
                    if (

                        rol === "Paciente"

                    ) {


                        sincronizarPaciente(
                            nuevoUsuario
                        );


                    }


                    mostrarUsuarios();


                    modal.remove();


                    alert(
                        "Usuario registrado correctamente."
                    );

                }

            );

    }


    // =========================
    // VER USUARIO
    // =========================
    function verUsuario(

        documento

    ) {


        const usuario =

            usuarios.find(

                function (usuario) {


                    return (
                        usuario.documento ===
                        documento
                    );


                }

            );


        if (!usuario) {
            return;
        }


        const modal =

            crearModal(`


                <div class="modal-contenido">


                    <div class="modal-header">


                        <div>


                            <h2>
                                Información del usuario
                            </h2>


                            <p>
                                Datos registrados en el sistema.
                            </p>


                        </div>


                        <button

                            type="button"
                            class="modal-cerrar"

                        >
                            ×
                        </button>


                    </div>


                    <div class="datos-usuario">


                        <div class="dato">


                            <strong>
                                Documento
                            </strong>


                            <span>
                                ${usuario.documento}
                            </span>


                        </div>


                        <div class="dato">


                            <strong>
                                Nombre completo
                            </strong>


                            <span>
                                ${usuario.nombre}
                            </span>


                        </div>


                        <div class="dato">


                            <strong>
                                Correo electrónico
                            </strong>


                            <span>
                                ${usuario.correo}
                            </span>


                        </div>


                        <div class="dato">


                            <strong>
                                Usuario
                            </strong>


                            <span>
                                ${usuario.usuario}
                            </span>


                        </div>


                        <div class="dato">


                            <strong>
                                Contraseña
                            </strong>


                            <span>
                                ${usuario.contrasena}
                            </span>


                        </div>


                        <div class="dato">


                            <strong>
                                Rol
                            </strong>


                            <span>
                                ${usuario.rol}
                            </span>


                        </div>


                        <div class="dato">


                            <strong>
                                Estado
                            </strong>


                            <span>
                                ${usuario.estado}
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


        modal

            .querySelectorAll(
                ".modal-cerrar"
            )

            .forEach(

                function (boton) {


                    boton.addEventListener(

                        "click",

                        function () {
                            modal.remove();
                        }

                    );


                }

            );

    }


    // =========================
    // EDITAR USUARIO
    // =========================
    function editarUsuario(

        documento

    ) {


        const usuario =

            usuarios.find(

                function (usuario) {


                    return (
                        usuario.documento ===
                        documento
                    );


                }

            );


        if (!usuario) {
            return;
        }


        const modal =

            crearModal(`


                <div class="modal-contenido">


                    <div class="modal-header">


                        <div>


                            <h2>
                                Editar usuario
                            </h2>


                            <p>
                                Actualiza la información del usuario.
                            </p>


                        </div>


                        <button

                            type="button"
                            class="modal-cerrar"

                        >
                            ×
                        </button>


                    </div>


                    <form id="formEditarUsuario">


                        <div class="form-group">


                            <label>
                                Documento
                            </label>


                            <input
                                type="text"
                                value="${usuario.documento}"
                                disabled
                            >


                        </div>


                        <div class="form-group">


                            <label

                                for="editarNombreUsuario"

                            >
                                Nombre completo
                            </label>


                            <input
                                type="text"
                                id="editarNombreUsuario"
                                value="${usuario.nombre}"
                                required
                            >


                        </div>


                        <div class="form-group">


                            <label

                                for="editarCorreoUsuario"

                            >
                                Correo electrónico
                            </label>


                            <input
                                type="email"
                                id="editarCorreoUsuario"
                                value="${usuario.correo}"
                                required
                            >


                        </div>


                        <div class="form-group">


                            <label

                                for="editarUsuario"

                            >
                                Usuario
                            </label>


                            <input
                                type="text"
                                id="editarUsuario"
                                value="${usuario.usuario}"
                                required
                            >


                        </div>


                        <div class="form-group">


                            <label

                                for="editarContrasena"

                            >
                                Contraseña
                            </label>


                            <input
                                type="password"
                                id="editarContrasena"
                                value="${usuario.contrasena}"
                                required
                            >


                        </div>


                        <div class="form-group">


                            <label

                                for="editarRolUsuario"

                            >
                                Rol
                            </label>


                            <select

                                id="editarRolUsuario"

                                required

                            >


                                <option

                                    value="Administrador"

                                    ${usuario.rol === "Administrador"
                                        ? "selected"
                                        : ""}

                                >
                                    Administrador
                                </option>


                                <option

                                    value="Recepcionista"

                                    ${usuario.rol === "Recepcionista"
                                        ? "selected"
                                        : ""}

                                >
                                    Recepcionista
                                </option>


                                <option

                                    value="Odontólogo"

                                    ${usuario.rol === "Odontólogo"
                                        ? "selected"
                                        : ""}

                                >
                                    Odontólogo
                                </option>


                                <option

                                    value="Paciente"

                                    ${usuario.rol === "Paciente"
                                        ? "selected"
                                        : ""}

                                >
                                    Paciente
                                </option>


                            </select>


                        </div>


                        <div class="form-group">

                            <label
                                for="editarEstadoUsuario"
                            >
                                Estado
                            </label>



                            <select

                                id="editarEstadoUsuario"
                                required

                            >


                                <option

                                    value="Activo"

                                    ${usuario.estado === "Activo"
                                        ? "selected"
                                        : ""}

                                >
                                    Activo
                                </option>


                                <option

                                    value="Inactivo"

                                    ${usuario.estado === "Inactivo"
                                        ? "selected"
                                        : ""}

                                >
                                    Inactivo
                                </option>


                            </select>


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


        // =========================
        // CERRAR
        // =========================
        modal

            .querySelector(".modal-cerrar")

            .addEventListener(

                "click",

                function () {
                    modal.remove();
                }

            );


        modal

            .querySelector(".modal-cancelar")

            .addEventListener(

                "click",

                function () {
                    modal.remove();
                }

            );


        // =========================
        // GUARDAR CAMBIOS
        // =========================
        modal

            .querySelector("#formEditarUsuario")

            .addEventListener(

                "submit",

                function (evento) {


                    evento.preventDefault();


                    const nuevoUsuario =

                        modal

                            .querySelector(
                                "#editarUsuario"
                            )

                            .value

                            .trim()

                            .toLowerCase();


                    const existeUsuario =

                        usuarios.some(

                            function (otroUsuario) {


                                return (


                                    otroUsuario.documento !==

                                    usuario.documento


                                    &&


                                    otroUsuario.usuario


                                    &&


                                    otroUsuario.usuario
                                        .toLowerCase() ===
                                    nuevoUsuario


                                );


                            }

                        );


                    if (existeUsuario) {

                        alert(
                            "Ya existe otro usuario con ese nombre de usuario."
                        );


                        return;

                    }


                    usuario.nombre =

                        modal

                            .querySelector(
                                "#editarNombreUsuario"
                            )

                            .value

                            .trim();


                    usuario.correo =

                        modal

                            .querySelector(
                                "#editarCorreoUsuario"
                            )

                            .value

                            .trim();


                    usuario.usuario =

                        nuevoUsuario;


                    usuario.contrasena =

                        modal

                            .querySelector(
                                "#editarContrasena"
                            )

                            .value;


                    usuario.rol =

                        modal

                            .querySelector(
                                "#editarRolUsuario"
                            )

                            .value;


                    usuario.estado =

                        modal

                            .querySelector(
                                "#editarEstadoUsuario"
                            )

                            .value;


                    guardarUsuarios();


                    // ==========================================
                    // SI ES PACIENTE, SINCRONIZAR SUS DATOS
                    // ==========================================
                    if (
                        usuario.rol === "Paciente"
                    ) {

                        sincronizarPaciente(
                            usuario
                        );

                    }


                    mostrarUsuarios();


                    modal.remove();


                    alert(
                        "Usuario actualizado correctamente."
                    );


                }

            );

    }


    // =========================
    // ELIMINAR USUARIO
    // =========================
    function eliminarUsuario(

        documento

    ) {

        const usuario =

            usuarios.find(

                function (usuario) {


                    return (
                        usuario.documento ===
                        documento
                    );

                }

            );


        if (!usuario) {
            return;
        }


        const confirmar =

            confirm(
                "¿Está seguro de eliminar este usuario?\n\n" +
                "Usuario: " +
                usuario.nombre +
                "\n" +
                "Documento: " +
                usuario.documento
            );


        if (!confirmar) {
            return;
        }


        usuarios =

            usuarios.filter(

                function (usuario) {

                    return (
                        usuario.documento !==
                        documento
                    );

                }

            );


        guardarUsuarios();


        mostrarUsuarios();


        alert(
            "Usuario eliminado correctamente."
        );

    }


    // =========================
    // EVENTOS DE LOS BOTONES
    // =========================
    function agregarEventosBotones() {


        const botonesVer =

            document.querySelectorAll(
                ".btn-ver"
            );


        const botonesEditar =

            document.querySelectorAll(
                ".btn-editar"
            );


        const botonesEliminar =

            document.querySelectorAll(
                ".btn-eliminar"
            );


        // =========================
        // VER
        // =========================
        botonesVer.forEach(

            function (boton) {


                boton.addEventListener(

                    "click",

                    function () {


                        const fila =

                            boton.closest(
                                ".table-row"
                            );


                        const documento =

                            fila
                                .querySelector("span")
                                .textContent
                                .trim();


                        verUsuario(
                            documento
                        );

                    }

                );

            }

        );


        // =========================
        // EDITAR
        // =========================
        botonesEditar.forEach(

            function (boton) {


                boton.addEventListener(

                    "click",

                    function () {


                        const fila =

                            boton.closest(
                                ".table-row"
                            );


                        const documento =

                            fila
                                .querySelector("span")
                                .textContent
                                .trim();


                        editarUsuario(
                            documento
                        );


                    }

                );

            }

        );


        // =========================
        // ELIMINAR
        // =========================
        botonesEliminar.forEach(

            function (boton) {


                boton.addEventListener(

                    "click",

                    function () {


                        const fila =

                            boton.closest(
                                ".table-row"
                            );


                        const documento =

                            fila
                                .querySelector("span")
                                .textContent
                                .trim();



                        eliminarUsuario(
                            documento
                        );

                    }

                );

            }

        );

    }


    // =========================
    // BOTÓN NUEVO USUARIO
    // =========================
    if (botonNuevo) {


        botonNuevo.addEventListener(

            "click",

            function () {
                abrirFormularioNuevo();
            }

        );

}


// =========================
// MOSTRAR AL CARGAR
// =========================
mostrarUsuarios();











