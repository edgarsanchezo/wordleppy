class APIManager {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    async getPosts() {
        try {
            const respuesta = await fetch(`${this.baseUrl}`);
            if (respuesta.ok) {
                const posts = await respuesta.json();
                return posts;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    }
}

// Configuración del teclado
const filas = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
    ["↵", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

// Variables de control del tablero
const tableroDiv = document.getElementById("tablero");
const tecladoDiv = document.getElementById("teclado");
const verde = "#6aaa64";
const amarillo = "#c9b458";
const gris = "#787c7e";

let intentos = 6; // Número máximo de intentos
let palabras = [];
let palabra = "";
let filaActual = 0;
let columnaActual = 0;
let palabraActual = "";

const testAPIManager = new APIManager(
    "https://edgarsanchezo.github.io/api.wordleppy/"
);

const processPosts = async () => {
    const posts = await testAPIManager.getPosts();
    if (posts.diccionario.length > 0) {
        posts.diccionario.forEach((post) => {
            //console.log(`Post > ${post}`);
            palabras.push(post.texto.toUpperCase());
        });
        crearTablero();
        crearTeclado();
    }
};
processPosts();

// Crear tablero de 6 filas y 5 columnas
function crearTablero() {
    palabra =
        palabras[Math.floor(Math.random() * palabras.length)].toUpperCase(); // Palabra al azar
    console.log("Palabra a adivinar: ", palabra);
    for (let i = 0; i < 6; i++) {
        let fila = document.createElement("div");
        fila.className = "fila";
        fila.setAttribute("data-row", i);

        for (let j = 0; j < 5; j++) {
            let celda = document.createElement("div");
            celda.className = "celda";
            celda.setAttribute("data-col", j);
            fila.appendChild(celda);
        }
        tableroDiv.appendChild(fila);
    }
}

// Generar teclado dinámicamente
function crearTeclado() {
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
}

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
        if (!palabras.includes(palabraActual.toUpperCase())) {
            alert("La palabra no se encuentra en el diccionario.");
            return;
        }
        ComprobarPalabra();

        if (palabraActual.toUpperCase() === palabra) {
            alert(`¡Felicidades! La palabra es "${palabra}".`);
            ReiniciarJuego();
        } else {
            alert(`Intenta de nuevo. Palabra ingresada: "${palabraActual}".`);
            filaActual++;
            columnaActual = 0;
            palabraActual = "";

            if (filaActual >= intentos) {
                alert(
                    `Lo siento, has agotado tus intentos. La palabra era "${palabra}".`
                );
                ReiniciarJuego();
            }
        }
    } else {
        alert("La palabra debe tener 5 letras.");
    }
}

// Comprobar la palabra ingresada y colorear el tablero y teclado
function ComprobarPalabra() {
    const row = document.querySelector(`[data-row='${filaActual}']`);
    const wordArray = palabra.split(""); // Convertir la palabra a un array
    const letterCount = {};

    for (let i = 0; i < 5; i++) {
        const cell = row.querySelector(`[data-col='${i}']`);
        const letter = palabraActual[i];

        // Contar las apariciones de cada letra en la palabra objetivo
        wordArray.forEach((letter) => {
            letterCount[letter] = (letterCount[letter] || 0) + 1;
        });

        const result = Array(5).fill(gris);

        // Primera pasada: encontrar letras correctas (verde)
        for (let i = 0; i < 5; i++) {
            if (palabraActual[i] === wordArray[i]) {
                result[i] = verde;
                letterCount[palabraActual[i]]--;
            }
        }

        // Segunda pasada: letras correctas en posición incorrecta (amarillo)
        for (let i = 0; i < 5; i++) {
            if (result[i] === gris && letterCount[palabraActual[i]] > 0) {
                result[i] = amarillo;
                letterCount[palabraActual[i]]--;
            }
        }

        // Pintar el tablero y teclado
        for (let i = 0; i < 5; i++) {
            const cell = row.querySelector(`[data-col='${i}']`);
            cell.style.backgroundColor = result[i];
            TeclaColor(palabraActual[i], result[i]);
        }
    }
}

// Cambiar el color del botón del teclado
function TeclaColor(letter, newColor) {
    const button = Array.from(document.querySelectorAll(".tecla")).find(
        (btn) => btn.textContent === letter
    );

    if (button) {
        let currentColor = button.style.backgroundColor;
        if (currentColor !== "") {
            currentColor = convertRgbToHex(currentColor);
        }
        if (currentColor === verde) return; // No cambiar si ya es verde
        if (currentColor === amarillo && newColor === gris) return; // No cambiar de amarillo a gris
        button.style.backgroundColor = newColor;
    }
}

// Reiniciar el juego
function ReiniciarJuego() {
    filaActual = 0;
    columnaActual = 0;
    palabraActual = "";

    tableroDiv.innerHTML = "";
    crearTablero();

    tecladoDiv.innerHTML = "";
    crearTeclado();
}

// Convertir RGB a Hex
function convertRgbToHex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

    function hexCode(i) {
        return ("0" + parseInt(i).toString(16)).slice(-2);
    }
    return "#" + hexCode(rgb[1]) + hexCode(rgb[2]) + hexCode(rgb[3]);
}
