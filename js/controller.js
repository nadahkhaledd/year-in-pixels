import { CURRENT_YEAR } from './config.js';
import { dataStore } from './data.js';
import { UI } from './ui_logic.js';

let activeModalDateKey = null;
let tempSelectedMoods = [];

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
    tempSelectedMoods = [...existingData.moods];
    UI.elements.dailySummary.value = existingData.summary;
    
    UI.renderMoodOptions(tempSelectedMoods, handleMoodSelection);
    UI.elements.moodModal.style.display = 'flex';
}

function handleMoodSelection(moodId) {
    if (moodId === null) {
        tempSelectedMoods = [];
    } else {
        const index = tempSelectedMoods.indexOf(moodId);
        if (index > -1) {
            tempSelectedMoods.splice(index, 1);
        } else {
            tempSelectedMoods.push(moodId);
        }
    }
    UI.renderMoodOptions(tempSelectedMoods, handleMoodSelection); 
}

function closeMoodModal() {
    UI.elements.moodModal.style.display = 'none';
    activeModalDateKey = null;
    tempSelectedMoods = [];
}

function saveMoodData() {
    if (!activeModalDateKey) return;
    const summaryText = UI.elements.dailySummary.value.trim();
    
    dataStore.saveData(activeModalDateKey, tempSelectedMoods, summaryText);
    UI.renderGrid(dataStore, openMoodModal);
    closeMoodModal();
}

function setupEventListeners() {
    document.getElementById('btnSaveMood').addEventListener('click', saveMoodData);
    document.getElementById('btnCancelMood').addEventListener('click', closeMoodModal);

    document.getElementById('btnOpenData').addEventListener('click', () => {
        UI.elements.dataInput.value = dataStore.exportJSONText(); 
        UI.elements.dataModal.style.display = 'flex';
    });
    
    document.getElementById('btnCloseData').addEventListener('click', () => {
        UI.elements.dataModal.style.display = 'none';
    });

    document.getElementById('btnCopyData').addEventListener('click', () => {
        UI.elements.dataInput.select();
        UI.elements.dataInput.setSelectionRange(0, 99999); 
        navigator.clipboard.writeText(UI.elements.dataInput.value).then(() => {
            alert('Copied JSON text to clipboard!');
        });
    });

    document.getElementById('btnLoadTextData').addEventListener('click', () => {
        const success = dataStore.importJSONText(UI.elements.dataInput.value);
        if (success) {
            UI.renderGrid(dataStore, openMoodModal);
            alert("Data restored from text!");
            UI.elements.dataModal.style.display = 'none';
        } else {
            alert("Invalid JSON text data. Please check what you pasted.");
        }
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
                alert("Data restored from file!");
                UI.elements.dataModal.style.display = 'none';
            } else {
                alert("Invalid JSON file.");
            }
        });
        event.target.value = ''; 
    });
}

document.addEventListener('DOMContentLoaded', initializeApp);