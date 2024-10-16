// Configuración del teclado
const filas = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
    ["↵", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

// Variables de control del tablero
const tablero = document.getElementById("tablero");
const tecladoDiv = document.getElementById("teclado");
let intentos = 6;                // Número máximo de intentos
let palabra = "EDGAR";           // Palabra a adivinar
let filaActual = 0;
let columnaActual = 0;
let palabraActual = "";

// Crear tablero de 6 filas y 5 columnas
for (let i = 0; i < 6; i++) {
    let fila = document.createElement("div");
    fila.className = "fila";
    fila.setAttribute("data-row", i);

    for (let j = 0; j < 5; j++) {
        let celda = document.createElement("div");
        celda.classList.add("celda");
        celda.setAttribute("data-col", j);
        fila.appendChild(celda);
    }
    tablero.appendChild(fila);
}

// Generar teclado dinámicamente
filas.forEach((fila) => {
    const filaDiv = document.createElement("div");
    filaDiv.className = "teclado-fila";

    fila.forEach((tecla) => {
        const button = document.createElement("button");
        if (tecla === "↵" || tecla === "⌫") {
            button.className = "tecla ancha";
        } else {
            button.className = "tecla";
        }
        button.textContent = tecla;
        button.value = tecla;

        // Asignar eventos de clic a cada tecla
        button.addEventListener("click", () => handleKeyClick(tecla));
        filaDiv.appendChild(button);
    });

    // Añadir la fila al contenedor principal
    tecladoDiv.appendChild(filaDiv);
});

// Función que maneja las teclas presionadas
function handleKeyClick(tecla) {
	if (filaActual >= intentos) return; // No permitir más entradas si se alcanzó el máximo de intentos

    if (tecla === "⌫") {
        deleteLetter();
    } else if (tecla === "↵") {
        submitWord();
    } else if (columnaActual < 5) {
        addLetter(tecla);
    }
}

// Agregar una letra al tablero
function addLetter(letter) {
    const fila = document.querySelector(`[data-row='${filaActual}']`);
    const celda = fila.querySelector(`[data-col='${columnaActual}']`);
    celda.textContent = letter;
    palabraActual += letter;
    columnaActual++;
}

// Borrar la última letra
function deleteLetter() {
    if (columnaActual > 0) {
        columnaActual--;
        const fila = document.querySelector(`[data-row='${filaActual}']`);
        const celda = fila.querySelector(`[data-col='${columnaActual}']`);
        celda.textContent = "";
        palabraActual = palabraActual.slice(0, -1);
    }
}

// Enviar palabra
function submitWord() {
    if (columnaActual === 5) {
		// Validación de la palabra
		if (palabraActual.toUpperCase() === palabra) {
            alert(`¡Felicidades! La palabra es "${palabra}".`);
            ReiniciarJuego();
        } else {
            alert(`Intenta de nuevo. Palabra ingresada: "${palabraActual}".`);
			filaActual++;
			columnaActual = 0;
			palabraActual = "";
            
            if (filaActual >= intentos) {
                alert(`Lo siento, has agotado tus intentos. La palabra era "${palabra}".`);
                ReiniciarJuego();
            }
        }
    } else {
        alert("La palabra debe tener 5 letras.");
    }
}

// Reiniciar el juego
function ReiniciarJuego() {
    filaActual = 0;
    columnaActual = 0;
    palabraActual = "";

    // Limpiar el tablero
    const celdas = document.querySelectorAll(".celda");
    celdas.forEach(celda => {
        celda.textContent = "";
    });
}