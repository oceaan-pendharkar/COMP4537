//This file was created with the help of github copilot and chatGPT

import UserMessages from "../lang/messages/en/user.js"; // Import user messages

class GameButton {
  constructor(color, id, width = 10, height = 5) {
    this.color = color; // Button color
    this.id = id; //button id for removing
  }

  // Method to create the button element and set its properties
  createElement(idHidden = false) {
    const button = document.createElement("button");
    button.id = this.id;
    button.style.backgroundColor = this.color;
    button.style.color = getContrastingColor(this.color);
    if (!idHidden) {
      button.innerHTML = this.id;
    }
    button.addEventListener("click", () => {
      button.disabled = true;
      button.innerHTML = this.id;
    });
    return button;
  }
}

class ShuffleGameRow {
  constructor() {
    this.justifyValues = ["flex-start", "flex-end", "center", "space-between"];
    // Create a <div> to act as a flex row
    this.rowElement = document.createElement("div");
    this.rowElement.style.display = "flex";
    this.rowElement.style.flexWrap = "wrap";
    this.rowElement.style.justifyContent =
      this.justifyValues[Math.floor(Math.random() * this.justifyValues.length)];
    this.rowElement.style.gap = "1rem";
    this.rowElement.style.height = "80px";
    this.gameButtons = []; // store references to GameButton instances
  }

  addButton(gameButton) {
    // Keep track of the GameButton instance
    this.gameButtons.push(gameButton);
    // Create the DOM button and append
    const domBtn = gameButton.createElement(true);
    this.rowElement.appendChild(domBtn);
  }
}

class ShuffleGameBoard {
  constructor(containerId) {
    this.containerId = containerId;
    this.boardElement = document.getElementById(containerId);
    this.rowContainers = [];
  }

  addShuffleRows() {
    for (let i = 0; i < 6; i++) {
      const row = new ShuffleGameRow();
      this.addRow(row);
    }
  }

  addRow(rowContainer) {
    this.rowContainers.push(rowContainer);
    // Append the row’s element to the board
    this.boardElement.appendChild(rowContainer.rowElement);
  }

  addButton(gameButton) {
    this.boardElement.appendChild(gameButton);
  }

  addButtonsToRandomShuffleRows(buttons) {
    for (let i = 0; i < buttons.length; i++) {
      const row =
        this.rowContainers[
          Math.floor(Math.random() * this.rowContainers.length)
        ];
      row.addButton(buttons[i]);
    }
  }

  // show all the ids of the buttons in place on the board
  // this function will keep the buttons where they are and the rows as they are but change each innerHTML to the button's id
  showButtonIds() {
    this.rowContainers.forEach((rc) => {
      rc.gameButtons.forEach((gb) => {
        const button = document.getElementById(gb.id);
        button.innerHTML = gb.id;
      });
    });
  }

  clearBoard() {
    this.rowContainers = [];
    while (this.boardElement.firstChild) {
      this.boardElement.removeChild(this.boardElement.firstChild);
    }
    this.boardElement.style.flexDirection = "row";
  }

  /**
   * Shuffle the buttons among the rows.
   * This takes all buttons from all rows, shuffles them, then redistributes them.
   */
  shuffleButtons() {
    this.boardElement.style.flexDirection = "column";
    // Gather all GameButtons from all rows
    const allButtons = [];

    this.rowContainers.forEach((rc) => {
      allButtons.push(...rc.gameButtons);
      // clear the row visually
      rc.rowElement.innerHTML = "";
      // clear the row’s internal array
      rc.gameButtons = [];
      // change the row's justify
      rc.rowElement.style.justifyContent =
        rc.justifyValues[Math.floor(Math.random() * rc.justifyValues.length)];
    });

    // Shuffle the big array
    for (let i = allButtons.length - 1; i > 0; i--) {
      //picks a random index between 0 and i inclusive
      const j = Math.floor(Math.random() * (i + 1));
      //swaps the buttons at i and j
      [allButtons[i], allButtons[j]] = [allButtons[j], allButtons[i]];
    }

    // Redistribute (round-robin style)
    let currentRowIndex = 0;
    for (let i = 0; i < allButtons.length; i++) {
      const currentRow = this.rowContainers[currentRowIndex];
      currentRow.addButton(allButtons[i]);

      // Move to the next row
      currentRowIndex = (currentRowIndex + 1) % 6;
    }
  }
}

// This function was generated with the help of Github Copilot
const startGame = function () {
  const textField = document.getElementById("btnCount");
  textField.disabled = true;
  const board = new ShuffleGameBoard("btnContainer");
  board.clearBoard();

  const n = parseInt(document.getElementById("btnCount").value);
  // validation for input
  if (isNaN(n) || n < 3 || n > 7) {
    alert(UserMessages.invalidInput);
    textField.disabled = false;
    return;
  }

  let buttonArray = [];
  for (let i = 1; i <= n; i++) {
    const button = new GameButton(getRandomColor(), i);
    buttonArray.push(button);
  }

  // Display the buttons
  for (let i = 0; i < buttonArray.length; i++) {
    board.addButton(buttonArray[i].createElement());
  }

  // Disable pointer events on the container
  document.getElementById("btnContainer").style.pointerEvents = "none";

  // Wait n seconds for initial display, then shuffle
  setTimeout(() => {
    board.clearBoard();
    board.addShuffleRows();
    board.addButtonsToRandomShuffleRows(buttonArray);
    board.shuffleButtons();

    // Additional shuffling for n rounds
    for (let i = 0; i < n; i++) {
      setTimeout(() => {
        board.shuffleButtons();
      }, i * 2000);
    }
    // Enable pointer events and add click event listeners after shuffling
    setTimeout(() => {
      document.getElementById("btnContainer").style.pointerEvents = "auto";

      // Add click event listeners for the buttons
      const clickedOrder = [];
      let gameEnded = false;

      const resetGame = (message) => {
        if (gameEnded) return;
        gameEnded = true;
        const msgElement = document.getElementById("gameMsg");
        msgElement.innerHTML = message;
        board.showButtonIds();
        setTimeout(() => {
          board.clearBoard();
          textField.disabled = false;
          msgElement.innerHTML = "";
        }, n * 1000);
      };

      const isCorrectOrder = () => {
        for (let i = 0; i < clickedOrder.length; i++) {
          if (clickedOrder[i] !== buttonArray[i].id) {
            return false;
          }
        }
        return true;
      };

      document.getElementById("btnContainer").addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") {
          clickedOrder.push(parseInt(e.target.innerHTML));

          if (!isCorrectOrder()) {
            resetGame(UserMessages.wrongOrder);
            return;
          }

          if (clickedOrder.length === buttonArray.length) {
            resetGame(UserMessages.excellentMemory);
          }
        }
      });
    }, n * 2000); // Delay matches the total shuffle time
  }, n * 1000);
};

//this function generated with Github Copilot
//it creates hex color codes
const getRandomColor = function () {
  let letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    //get us a number between 0 and 15, to index into letters
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const getContrastingColor = function (hex) {
  // Remove the '#' if it exists
  hex = hex.replace("#", "");

  // Parse the color components
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate brightness
  const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

  // Return white or black based on brightness
  return brightness > 128 ? "#000000" : "#FFFFFF";
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("numBtnsText").innerHTML =
    UserMessages.numberOfButtonsText;
  document.getElementById("startGameBtn").addEventListener("click", startGame);
  document.getElementById("startGameBtn").innerHTML = UserMessages.go;
  document.getElementsByTagName("title")[0].innerHTML = UserMessages.title;
  document
    .getElementById("btnCount")
    .setAttribute("placeholder", UserMessages.placeholder);
});
