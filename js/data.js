import { CURRENT_YEAR } from './config.js';

class DataService {
    constructor() {
        this.storageKey = 'moodYearData';
        this.data = this.loadData();
    }

    loadData() {
        let rawData = JSON.parse(localStorage.getItem(this.storageKey)) || {};
        // Data Migration: Ensure old string formats become objects
        Object.keys(rawData).forEach(key => {
            if (typeof rawData[key] === 'string') {
                rawData[key] = { mood: rawData[key], summary: "" };
            }
        });
        return rawData;
    }

    saveData(key, moodId, summary) {
        if (!moodId && summary === "") {
            delete this.data[key];
        } else {
            this.data[key] = { mood: moodId, summary: summary };
        }
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    getEntry(key) {
        return this.data[key] || { mood: null, summary: "" };
    }

    exportJSON() {
        const json = JSON.stringify(this.data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `year-in-pixels-${CURRENT_YEAR}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    importJSON(file, callback) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                this.data = JSON.parse(e.target.result);
                localStorage.setItem(this.storageKey, JSON.stringify(this.data));
                callback(true);
            } catch (err) {
                callback(false);
            }
        };
        reader.readAsText(file);
    }
}

export const dataStore = new DataService();