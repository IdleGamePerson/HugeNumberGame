// --- DOM Elements ---
const mainNumberElem = document.getElementById("main-number");
const leftStringElem = document.getElementById("left-string");
const menuContent = document.getElementById("menu-content");
const menuButtons = Array.from(document.querySelectorAll("#menu-selection .menu-btn"));

// --- Game State ---
let mainNumber = 0;
let gen1 = 0;        // amount owned
let gen1Bought = 0;  // amount bought (for cost calculation)

// Generator 1 constants
const GEN1_BASE_COST = 10;
const GEN1_COST_MULT = 1.15;
const GEN1_PROD_PER = 0.1;

// --- Options State ---
let deleteClickCount = 0;

// --- Utility Functions ---
function formatNumber(num) {
  if (typeof num !== "number") return num;
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
  return num.toFixed(2);
}

// Cost function: gc(floor(ab/10), 1)
function gc(tier, base) {
  // Example: cost = base * 10 * (1.15^tier)
  // You can adjust this formula as needed
  return Math.floor(base * 10 * Math.pow(GEN1_COST_MULT, tier));
}
function getGen1Cost() {
  // ab = gen1Bought
  const tier = Math.floor(gen1Bought / 10);
  return gc(tier, 1);
}
function getGen1Multiplier() {
  return GEN1_PROD_PER;
}

// --- Display Function ---
function updateDisplay() {
  if (mainNumberElem) mainNumberElem.textContent = formatNumber(mainNumber);
  if (leftStringElem) leftStringElem.textContent = `Generators: ${gen1}`;
}

// --- Generators Menu ---
function renderGeneratorsMenu() {
  const gen1Cost = getGen1Cost();
  const gen1Mult = getGen1Multiplier();
  menuContent.innerHTML = `
    <h3>Generators</h3>
    <div>
      <span>Generator 1: </span>
      <span id="gen1-count">${gen1}</span><br>
      <span>Bought: <b>${gen1Bought}</b></span><br>
      <span>Multiplier: <b>${formatNumber(gen1Mult)}</b> / tick</span><br>
      <span>Next cost: <b>${formatNumber(gen1Cost)}</b></span><br>
      <button id="buy-gen1" ${mainNumber < gen1Cost ? "disabled" : ""}>Buy (${formatNumber(gen1Cost)})</button>
    </div>
  `;
  // Re-attach event handler after rendering
  const buyBtn = document.getElementById("buy-gen1");
  if (buyBtn) {
    buyBtn.onclick = () => {
      const cost = getGen1Cost();
      if (mainNumber >= cost) {
        mainNumber -= cost;
        gen1 += 1;
        gen1Bought += 1;
        updateDisplay();
        renderGeneratorsMenu(); // Re-render to update numbers and button state
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
    gen1Bought,
  }));
  showOptionsMessage("Game saved!");
}

function deleteSave() {
  localStorage.removeItem("incremental-game-save");
  mainNumber = 0;
  gen1 = 0;
  gen1Bought = 0;
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
  mainNumber += gen1 * getGen1Multiplier();
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
    if (typeof save.gen1Bought === "number") gen1Bought = save.gen1Bought;
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
