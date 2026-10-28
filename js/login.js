document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.querySelector(".login-card form");

    if (!formulario) {
        return;
    }

    // ==========================================
    // CONFIGURACIÓN DEL BOTÓN DE GOOGLE
    // ==========================================
    const configurarBotonGoogle = () => {
        const contenedorGoogle = document.getElementById("googleSignInButton");

        if (!contenedorGoogle || !window.google?.accounts?.id) {
            console.error("No se pudo cargar Google Identity Services.");
            return;
        }

        window.google.accounts.id.initialize({
            client_id: "749357248512-883reue99u4pevpivfiklc8uoiq17n9f.apps.googleusercontent.com",

            callback: async function (respuestaGoogle) {
                try {
                    if (!respuestaGoogle.credential) {
                        alert("Google no proporcionó una credencial válida.");
                        return;
                    }

                    const respuesta = await fetch(
                        "https://sonrisa-brillante-backend.onrender.com/api/auth/google",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                credential: respuestaGoogle.credential
                            })
                        }
                    );

                    const datos = await respuesta.json();

                    if (!respuesta.ok) {
                        alert(
                            datos.error ||
                            "No fue posible iniciar sesión con Google."
                        );
                        return;
                    }

                    const roles = {
                        1: {
                            nombre: "Administrador",
                            ruta: "paginas/dashboard.html"
                        },
                        2: {
                            nombre: "Recepcionista",
                            ruta: "paginas/dashboard-recepcionista.html"
                        },
                        3: {
                            nombre: "Odontólogo",
                            ruta: "paginas/dashboard-odontologo.html"
                        },
                        4: {
                            nombre: "Paciente",
                            ruta: "paginas/dashboard-paciente.html"
                        }
                    };

                    const rol = roles[datos.rolId];

                    if (!rol) {
                        alert("El rol de este usuario no está configurado.");
                        return;
                    }

                    const usuarioSesion = {
                        idUsuario: datos.idUsuario,
                        nombre: datos.nombre,
                        apellido: datos.apellido,
                        correo: datos.correo,
                        rol: rol.nombre,
                        estado: "activo"
                    };

                    localStorage.setItem(
                        "usuarioSesion",
                        JSON.stringify(usuarioSesion)
                    );

                    window.location.href = rol.ruta;

                } catch (error) {
                    console.error(
                        "Error al iniciar sesión con Google:",
                        error
                    );

                    alert(
                        "No fue posible conectar con el servidor. " +
                        "Verifica que el backend Java esté funcionando."
                    );
                }
            }
        });

        window.google.accounts.id.renderButton(
            contenedorGoogle,
            {
                type: "standard",
                theme: "outline",
                size: "large",
                text: "continue_with",
                shape: "rectangular",
                width: 300
            }
        );
    };

    // Esperar a que cargue la biblioteca de Google.
    const scriptGoogle = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]'
    );

    if (window.google?.accounts?.id) {
        configurarBotonGoogle();
    } else if (scriptGoogle) {
        scriptGoogle.addEventListener(
            "load",
            configurarBotonGoogle,
            { once: true }
        );

        scriptGoogle.addEventListener(
            "error",
            function () {
                console.error("No se pudo cargar la biblioteca de Google.");
            },
            { once: true }
        );
    }

    // ==========================================
    // INICIO DE SESIÓN TRADICIONAL
    // ==========================================
    formulario.addEventListener("submit", async function (evento) {
        evento.preventDefault();

        const campoCorreo = document.getElementById("usuario");
        const campoContrasena = document.getElementById("contrasena");

        const correo = campoCorreo.value.trim().toLowerCase();
        const contrasena = campoContrasena.value;

        if (!correo || !contrasena) {
            alert("Por favor, ingresa tu correo y contraseña.");
            return;
        }

        try {
            const respuesta = await fetch(
                "https://sonrisa-brillante-backend.onrender.com/api/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        correo: correo,
                        contrasena: contrasena
                    })
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                alert(
                    datos.error ||
                    "No fue posible iniciar sesión."
                );
                return;
            }

            const roles = {
                1: {
                    nombre: "Administrador",
                    ruta: "paginas/dashboard.html"
                },
                2: {
                    nombre: "Recepcionista",
                    ruta: "paginas/dashboard-recepcionista.html"
                },
                3: {
                    nombre: "Odontólogo",
                    ruta: "paginas/dashboard-odontologo.html"
                },
                4: {
                    nombre: "Paciente",
                    ruta: "paginas/dashboard-paciente.html"
                }
            };

            const rol = roles[datos.rolId];

            if (!rol) {
                alert("El rol de este usuario no está configurado.");
                return;
            }

            const usuarioSesion = {
                idUsuario: datos.idUsuario,
                nombre: datos.nombre,
                apellido: datos.apellido,
                correo: datos.correo,
                rol: rol.nombre,
                estado: "activo"
            };

            localStorage.setItem(
                "usuarioSesion",
                JSON.stringify(usuarioSesion)
            );

            window.location.href = rol.ruta;

        } catch (error) {
            console.error(
                "Error al iniciar sesión:",
                error
            );

            alert(
                "No fue posible conectar con el servidor. " +
                "Verifica que el backend Java esté funcionando."
            );
        }
    });

});
                  