// --- DOM Elements ---
const mainNumberElem = document.getElementById("main-number");
const leftStringElem = document.getElementById("left-string");
const menuContent = document.getElementById("menu-content");
const menuButtons = Array.from(document.querySelectorAll("#menu-selection .menu-btn"));

// --- Game State ---
let mainNumber = 0;
let gen1 = 0;

// --- Options State ---
let deleteClickCount = 0;

// --- Display Function ---
function updateDisplay() {
  if (mainNumberElem) mainNumberElem.textContent = mainNumber.toFixed(2);
  if (leftStringElem) leftStringElem.textContent = `Generators: ${gen1}`;
}

// --- Generators Menu ---
function renderGeneratorsMenu() {
  menuContent.innerHTML = `
    <h3>Generators</h3>
    <div>
      <span>Generator 1: </span>
      <span id="gen1-count">${gen1}</span>
      <button id="buy-gen1">Buy (10)</button>
    </div>
  `;
  // Re-attach event handler after rendering
  const buyBtn = document.getElementById("buy-gen1");
  if (buyBtn) {
    buyBtn.onclick = () => {
      if (mainNumber >= 10) {
        mainNumber -= 10;
        gen1 += 1;
        updateDisplay();
        renderGeneratorsMenu(); // Re-render to update numbers
      }
    };
  }
}

// --- Options Menu ---
function showOptionsMessage(msg) {
  const msgElem = document.getElementById("options-message");
  if (msgElem) msgElem.textContent = msg;
  setTimeout(() => {
    if (msgElem) msgElem.textContent = "";
  }, 1500);
}

function saveGame() {
  localStorage.setItem("incremental-game-save", JSON.stringify({
    mainNumber,
    gen1,
  }));
  showOptionsMessage("Game saved!");
}

function deleteSave() {
  localStorage.removeItem("incremental-game-save");
  mainNumber = 0;
  gen1 = 0;
  updateDisplay();
  showOptionsMessage("Save deleted!");
}

function renderOptionsMenu() {
  menuContent.innerHTML = `
    <h3>Options</h3>
    <div style="display:flex;flex-direction:column;align-items:flex-start;gap:1em;">
      <button id="save-game-btn">Save Game</button>
      <button id="delete-save-btn">Delete Save (Click 50 times)</button>
      <span id="options-message" style="color:#ff9800;font-weight:bold;"></span>
      <span id="delete-progress" style="font-size:0.9em;color:#ccc;"></span>
    </div>
  `;
  deleteClickCount = 0;
  const progressElem = document.getElementById("delete-progress");

  document.getElementById("save-game-btn").onclick = () => {
    saveGame();
  };
  document.getElementById("delete-save-btn").onclick = () => {
    deleteClickCount++;
    progressElem.textContent = `Delete clicks: ${deleteClickCount}/50`;
    if (deleteClickCount >= 50) {
      deleteSave();
      deleteClickCount = 0;
      progressElem.textContent = "";
      renderOptionsMenu(); // Reset
    }
  };
}

// --- Menu Switching ---
menuButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    menuButtons.forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    const text = btn.textContent.trim();
    if (text === "Generators") {
      renderGeneratorsMenu();
    } else if (text === "Options") {
      renderOptionsMenu();
    } else {
      menuContent.innerHTML = `<h3>${text}</h3>`;
    }
  });
});

// --- Game Loop Example ---
function gameTick() {
  mainNumber += gen1 * 0.1;
  updateDisplay();
}

// --- Load/Save ---
function loadGame() {
  const data = localStorage.getItem("incremental-game-save");
  if (!data) return;
  try {
    const save = JSON.parse(data);
    if (typeof save.mainNumber === "number") mainNumber = save.mainNumber;
    if (typeof save.gen1 === "number") gen1 = save.gen1;
  } catch (e) {
    localStorage.removeItem("incremental-game-save");
  }
}

// --- Initialization ---
function init() {
  loadGame();
  updateDisplay();
  // Show Generators menu by default
  renderGeneratorsMenu();
  setInterval(gameTick, 100);
  setInterval(saveGame, 30000);
}
init();
