// Espera a que todo el contenido del HTML esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {

  // Obtiene el botón de inicio de sesión por su ID
  const btnLogin = document.getElementById("btnLogin");

  // Agrega un evento de clic al botón de inicio de sesión
  btnLogin.addEventListener("click", () => {

    // Obtiene los valores ingresados en los campos "usuario" y "contraseña"
    const usuario = document.getElementById("usuario").value.trim(); // .trim() elimina espacios al inicio y al final
    const contrasena = document.getElementById("contrasena").value.trim();
    const mensaje = document.getElementById("mensaje"); // Elemento donde se mostrará un posible error

    // Verifica si el usuario y la contraseña son "admin"
    if (usuario === "admin" && contrasena === "admin") {
      // Guarda el rol del usuario en localStorage (sirve para saber quién inició sesión)
      localStorage.setItem("rol", "admin");

      // Redirige al panel del administrador
      window.location.href = "admin.html";

    // Si el usuario y la contraseña son "preceptor"
    } else if (usuario === "preceptor" && contrasena === "preceptor") {
      // Guarda el rol en localStorage
      localStorage.setItem("rol", "preceptor");

      // Redirige al panel del preceptor
      window.location.href = "preceptor.html";

    // Si ninguna de las combinaciones coincide
    } else {
      // Muestra un mensaje de error en pantalla
      mensaje.textContent = "Usuario o contraseña incorrectos.";
    }
  });
});
