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
                migrated[key] = { moods: [migrated[key]], summary: "" };
            }
            else if (migrated[key].mood !== undefined) {
                let moodArray = migrated[key].mood ? [migrated[key].mood] : [];
                migrated[key] = { moods: moodArray, summary: migrated[key].summary || "" };
                delete migrated[key].mood; // Clean up old property
            }
            if (!migrated[key].moods) {
                migrated[key].moods = [];
            }
        });
        return migrated;
    }

    loadData() {
        let rawData = JSON.parse(localStorage.getItem(this.storageKey)) || {};
        return this.migrateRawData(rawData);
    }

    saveData(key, moodIdsArray, summary) {
        if (moodIdsArray.length === 0 && summary === "") {
            delete this.data[key];
        } else {
            this.data[key] = { moods: moodIdsArray, summary: summary };
        }
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    getEntry(key) {
        return this.data[key] || { moods: [], summary: "" };
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
                this.data = this.migrateRawData(parsed);
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