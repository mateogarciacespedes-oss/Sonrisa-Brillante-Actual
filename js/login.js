document.addEventListener("DOMContentLoaded", function () {

    const formulario =
        document.querySelector(".login-card form");

    if (!formulario) {
        return;
    }


    formulario.addEventListener("submit", function (evento) {

        evento.preventDefault();


        // ==========================================
        // OBTENER DATOS DEL FORMULARIO
        // ==========================================
        const usuarioIngresado =
            document
                .getElementById("usuario")
                .value
                .trim()
                .toLowerCase();


        const contrasenaIngresada =
            document.getElementById("contrasena").value;


        if (
            usuarioIngresado === "" ||
            contrasenaIngresada === ""
        ) {

            alert(
                "Por favor, ingresa tu usuario y contraseña."
            );

            return;
        }


        // ==========================================
        // OBTENER USUARIOS
        // =========================================
        const usuarios =
            JSON.parse(
                localStorage.getItem("usuarios")
            ) || [];


        // ==========================================
        // BUSCAR USUARIO
        // ==========================================
        const usuarioEncontrado =
            usuarios.find(function (usuario) {

                return (
                    usuario.usuario &&
                    usuario.usuario
                        .toLowerCase() ===
                        usuarioIngresado &&

                    usuario.contrasena ===
                        contrasenaIngresada
                );

            });


        if (!usuarioEncontrado) {

            alert(
                "Usuario o contraseña incorrectos."
            );

            return;
        }


        // ==========================================
        // VALIDAR ESTADO
        // ==========================================
        if (
            !usuarioEncontrado.estado ||
            usuarioEncontrado.estado.toLowerCase() !==
                "activo"
        ) {

            alert(
                "Este usuario se encuentra inactivo y no puede ingresar al sistema."
            );

            return;
        }


        // ==========================================
        // GUARDAR SESIÓN
        // ==========================================
        localStorage.setItem(
            "usuarioSesion",
            JSON.stringify(usuarioEncontrado)
        );


        // ==========================================
        // REDIRECCIONAR SEGÚN EL ROL
        // ==========================================

        if (
            usuarioEncontrado.rol ===
            "Administrador"
        ) {

            window.location.href =
                "paginas/dashboard.html";

            return;
        }


        if (
            usuarioEncontrado.rol ===
            "Odontólogo"
        ) {

            window.location.href =
                "paginas/dashboard-odontologo.html";

            return;
        }


        if (
            usuarioEncontrado.rol ===
            "Recepcionista"
        ) {

            window.location.href =
                "paginas/dashboard-recepcionista.html";

            return;
        }
        if (
            usuarioEncontrado.rol ===
            "Paciente"
        ) {

            window.location.href =
                "paginas/dashboard-paciente.html";

            return;
        }


        // ==========================================
        // ROL NO CONFIGURADO
        // ==========================================
        alert(
            "El rol de este usuario no está configurado."
        );

    });

});







