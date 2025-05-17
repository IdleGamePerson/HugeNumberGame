// --- Incremental Game main.js ---
// Assumes presence of elements:
// #main-number, #left-string, #menu-content, #menu-selection .menu-btn, etc.

// --- Game State (extend as needed) ---
let mainNumber = 0;
let gen1 = 0; // Example generator variable

// --- DOM Elements ---
const mainNumberElem = document.getElementById("main-number");
const leftStringElem = document.getElementById("left-string");
const menuContent = document.getElementById("menu-content");
const menuButtons = Array.from(document.querySelectorAll("#menu-selection .menu-btn"));

// --- Menu State ---
let currentMenu = "Generators";

// --- Options Menu State ---
let deleteClickCount = 0;

// --- Utility Functions ---
function formatNumber(num) {
  if (typeof num !== "number") return num;
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
  return num.toFixed(2);
}

// --- Game Functions (example logic) ---
function updateDisplay() {
  mainNumberElem.textContent = formatNumber(mainNumber);
  leftStringElem.textContent = `Generators: ${gen1}`;
}

// --- Menu Rendering ---
function renderGeneratorsMenu() {
  menuContent.innerHTML = `
    <h3>Generators</h3>
    <div>
      <span>Generator 1:</span>
      <span id="gen1-count">${gen1}</span>
      <button id="buy-gen1">Buy (10)</button>
    </div>
  `;
  document.getElementById("buy-gen1").onclick = () => {
    if (mainNumber >= 10) {
      mainNumber -= 10;
      gen1 += 1;
      updateDisplay();
      renderGeneratorsMenu();
    }
  };
}

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
    // Add further state here as needed
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
    const prevSelected = document.querySelector("#menu-selection .menu-btn.selected");
    if (prevSelected) prevSelected.classList.remove("selected");
    btn.classList.add("selected");
    currentMenu = btn.textContent;
    if (currentMenu === "Generators") {
      renderGeneratorsMenu();
    } else if (currentMenu === "Options") {
      renderOptionsMenu();
    } else {
      menuContent.innerHTML = `<h3>${currentMenu}</h3>`;
    }
  });
});

// --- Load/Save ---
function loadGame() {
  const data = localStorage.getItem("incremental-game-save");
  if (!data) return;
  try {
    const save = JSON.parse(data);
    if (typeof save.mainNumber === "number") mainNumber = save.mainNumber;
    if (typeof save.gen1 === "number") gen1 = save.gen1;
    // Add more fields as your game grows
  } catch (e) {
    // Corrupt save
    localStorage.removeItem("incremental-game-save");
  }
}

// --- Game Loop Example ---
function gameTick() {
  // Example: each generator gives 0.1 per tick
  mainNumber += gen1 * 0.1;
  updateDisplay();
}

// --- Initialization ---
function init() {
  loadGame();
  updateDisplay();
  // Default to Generators menu
  renderGeneratorsMenu();
  // Game loop
  setInterval(gameTick, 100); // 10 ticks per second
  // Optionally autosave
  setInterval(saveGame, 30000); // Save every 30 seconds
}

init();
