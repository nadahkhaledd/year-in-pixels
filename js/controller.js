import { CURRENT_YEAR } from './config.js';
import { dataStore } from './data.js';
import { UI } from './ui_logic.js';

let activeModalDateKey = null;
let tempSelectedMood = null;

function initializeApp() {
    UI.init();
    UI.renderSidebar();
    UI.renderGrid(dataStore, openMoodModal);
    setupEventListeners();
}


function openMoodModal(key, day, month) {
    activeModalDateKey = key;
    const monthName = new Date(CURRENT_YEAR, month).toLocaleString('default', { month: 'long' });
    UI.elements.modalDateDisplay.innerText = `${monthName} ${day}`;
    
    const existingData = dataStore.getEntry(key);
    tempSelectedMood = existingData.mood;
    UI.elements.dailySummary.value = existingData.summary;
    
    UI.renderMoodOptions(tempSelectedMood, handleMoodSelection);
    UI.elements.moodModal.style.display = 'flex';
}

function handleMoodSelection(moodId) {
    tempSelectedMood = moodId;
    UI.renderMoodOptions(tempSelectedMood, handleMoodSelection); // Re-render to show selection
}

function closeMoodModal() {
    UI.elements.moodModal.style.display = 'none';
    activeModalDateKey = null;
    tempSelectedMood = null;
}

function saveMoodData() {
    if (!activeModalDateKey) return;
    const summaryText = UI.elements.dailySummary.value.trim();
    
    dataStore.saveData(activeModalDateKey, tempSelectedMood, summaryText);
    UI.renderGrid(dataStore, openMoodModal);
    closeMoodModal();
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
    // Mood Modal
    document.getElementById('btnSaveMood').addEventListener('click', saveMoodData);
    document.getElementById('btnCancelMood').addEventListener('click', closeMoodModal);

    // Data Modal
    document.getElementById('btnOpenData').addEventListener('click', () => {
        UI.elements.dataModal.style.display = 'flex';
    });
    
    document.getElementById('btnCloseData').addEventListener('click', () => {
        UI.elements.dataModal.style.display = 'none';
    });

    document.getElementById('btnExportData').addEventListener('click', () => {
        dataStore.exportJSON();
    });

    const fileInput = document.getElementById('fileInput');
    document.getElementById('btnImportData').addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        dataStore.importJSON(file, (success) => {
            if (success) {
                UI.renderGrid(dataStore, openMoodModal);
                alert("Data restored successfully!");
                UI.elements.dataModal.style.display = 'none';
            } else {
                alert("Invalid JSON file.");
            }
        });
        event.target.value = ''; // Reset input
    });
}

document.addEventListener('DOMContentLoaded', initializeApp);