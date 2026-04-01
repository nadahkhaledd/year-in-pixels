import { CURRENT_YEAR } from './config.js';

class DataService {
    constructor() {
        this.storageKey = 'moodYearData';
        this.data = this.loadData();
    }


    migrateRawData(rawData) {
        let migrated = { ...rawData };
        Object.keys(migrated).forEach(key => {
            if (typeof migrated[key] === 'string') {
                migrated[key] = { mood: migrated[key], summary: "" };
            }
        });
        return migrated;
    }

    loadData() {
        let rawData = JSON.parse(localStorage.getItem(this.storageKey)) || {};
        return this.migrateRawData(rawData); // Upgrade upon loading
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
                let parsed = JSON.parse(e.target.result);
                this.data = this.migrateRawData(parsed); // Upgrade upon file import
                localStorage.setItem(this.storageKey, JSON.stringify(this.data));
                callback(true);
            } catch (err) {
                callback(false);
            }
        };
        reader.readAsText(file);
    }

    exportJSONText() {
        return JSON.stringify(this.data, null, 2);
    }

    importJSONText(jsonString) {
        try {
            if (!jsonString) return false;
            let parsed = JSON.parse(jsonString);
            this.data = this.migrateRawData(parsed);
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            return true;
        } catch (err) {
            return false; 
        }
    }
}

export const dataStore = new DataService();