document.addEventListener("DOMContentLoaded", function () {
  // Seleccionar elementos del DOM de elementos
  const formulario = document.querySelector("form");
  const inputMessage = document.querySelector("input");
  const contenedorConfirmacion = document.getElementById("confirmacion");
  const botonSiDescencriptar = document.getElementById("si-descencriptar");
  const botonNoDescencriptar = document.getElementById("no-descencriptar");
  const contenedorSalida = document.getElementById("salida");

  const llaveMatriz = [
    [6, 24, 1],
    [13, 16, 10],
    [20, 17, 15],
  ];

  // Matriz inversa de la clave en módulo 26
  const llaveMatrizInversa = [
    [8, 5, 10],
    [21, 8, 21],
    [21, 12, 8],
  ];

  // Función para convertir caracteres en valores numéricos (A=0, B=1, ..., Z=25)
  function convertirTextoANumero(mensaje) {
    return mensaje
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .split("")
      .map((c) => c.charCodeAt(0) - 65);
  }

  // Función para convertir números en texto
  function convertirNumeroATexto(listaNumeros) {
    return listaNumeros
      .map((cantidadEspacios) =>
        String.fromCharCode((cantidadEspacios % 26) + 65)
      )
      .join("");
  }

  // Función para multiplicar una matriz por un vector
  function multiplicarMatriz(matriz, listaEspacios) {
    return matriz.map(
      (fila) =>
        fila.reduce((sum, value, i) => sum + value * listaEspacios[i], 0) % 26
    );
  }

  // Función de cifrado Hill
  function EncriptadoHill(mensaje) {
    let numeros = convertirTextoANumero(mensaje);
    if (numeros.length % 3 !== 0) {
      while (numeros.length % 3 !== 0) {
        numeros.push(23); // Rellenar con 'X' con (23 en el alfabeto)
      }
    }
    let numeroEncriptados = [];
    for (let index = 0; index < numeros.length; index += 3) {
      numeroEncriptados.push(
        ...multiplicarMatriz(llaveMatriz, numeros.slice(index, index + 3))
      );
    }

    return convertirNumeroATexto(numeroEncriptados);
  }

  // Función de descifrado Hill
  function DescencriptadoHill(mensaje) {
    let listaNumeros = convertirTextoANumero(mensaje);
    let numerosDesencriptados = [];

    for (let index = 0; index < listaNumeros.length; index += 3) {
      numerosDesencriptados.push(
        ...multiplicarMatriz(
          llaveMatrizInversa,
          listaNumeros.slice(index, index + 3)
        )
      );
    }
    return convertirNumeroATexto(numerosDesencriptados);
  }
  // Manejo del evento submit.
  formulario.addEventListener("submit", function (event) {
    event.preventDefault(); // Evita el envió del formulario por defecto.

    let mensaje = inputMessage.value.trim();
    if (mensaje === "") {
      contenedorSalida.innerHTML =
        "<p class='text-danger'>Por favor ingrese un mensaje</p>";
      return;
    }

    let mensajeEncriptado = EncriptadoHill(mensaje);
    contenedorSalida.innerHTML = `<p class="fs-4">Mensaje cifrado: <strong>${mensajeEncriptado}</strong></p>`;

    // Muestra el mensaje de confirmación
    contenedorConfirmacion.classList.remove("d-none");
    /*let confirmarDescencriptacion = confirm("¿Desea descifrar el mensaje cifrado?");
        if (confirmarDescencriptacion) {
            let mensajeDescencriptado = DescencriptadoHill(mensajeEncriptado);
            alert(`Mensaje descifrado: ${mensajeDescencriptado}`);
        }*/

    // Manejo del botón "Si" para descifrar.
    botonSiDescencriptar.addEventListener("click", function () {
      let mensajeDescencriptado = DescencriptadoHill(mensajeEncriptado);
      contenedorSalida.innerHTML += `<p class="fs-4 text-dark">Mensaje descifrado: <strong>${mensajeDescencriptado}</strong></p>`;

      // Ocultar la confirmacion depués de elegir.
      contenedorConfirmacion.classList.add("d-none");
    });

    // Manejo del botón "No" para descifrar.
    botonNoDescencriptar.addEventListener("click", function () {
      contenedorSalida.innerHTML += `<p class="fs-4 text-dark ">Decición: No descifrar el mensaje</p>`;

      // Ocultar la confirmacion depués de elegir.
      contenedorConfirmacion.classList.add("d-none");
    });
  });
});
