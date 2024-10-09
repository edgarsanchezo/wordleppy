function construirGameBoard() {
  const gameBoard = document.getElementById("game-board");
  for (let i = 0; i < 6; i++) {
    let row = document.createElement("div");
    row.className = "row";

    for (let j = 0; j < 5; j++) {
      let tile = document.createElement("div");
      tile.className = "tile";
      row.appendChild(tile);
    }

    gameBoard.appendChild(row);
  }
}

construirGameBoard();

function construirKeyboard() {
  // Definición del teclado QWERTY con ñ
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
    ['↵', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
  ];

  // Selección del contenedor del teclado
  const keyboardDiv = document.getElementById("keyboard");

  // Generar cada fila y tecla del teclado
  rows.forEach((row) => {
    // Crear un contenedor para cada fila
    const rowDiv = document.createElement("div");
    rowDiv.className = "keyboard-row";

    // Crear cada tecla como un botón
    row.forEach((key) => {
      const button = document.createElement("button");

      if (key === "↵" || key === "⌫") {
        button.className = "key wide";
      } else {
        button.className = "key";
      }
      button.textContent = key;
      rowDiv.appendChild(button);
    });

    // Añadir la fila al contenedor principal
    keyboardDiv.appendChild(rowDiv);
  });
}

construirKeyboard();
