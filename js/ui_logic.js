import { CURRENT_YEAR, MONTHS, MOODS } from './config.js';

export const UI = {
    elements: {
        grid: document.getElementById('grid'),
        sidebar: document.getElementById('sidebar'),
        moodModal: document.getElementById('moodModal'),
        dataModal: document.getElementById('dataModal'),
        dataInput: document.getElementById('dataInput'),
        modalDateDisplay: document.getElementById('modalDateDisplay'),
        moodOptions: document.getElementById('moodOptions'),
        dailySummary: document.getElementById('dailySummary')
    },

    init() {
        document.getElementById('yearLabel').innerText = CURRENT_YEAR;
    },

    renderSidebar() {
        this.elements.sidebar.innerHTML = '';
        MOODS.forEach(m => {
            const item = document.createElement('div');
            item.className = 'legend-item';
            item.innerHTML = `<div class="legend-color" style="background:${m.color}"></div><span>${m.name}</span>`;
            this.elements.sidebar.appendChild(item);
        });
    },

    renderGrid(dataStore, onCellClick) {
        this.elements.grid.innerHTML = '';
        this.elements.grid.appendChild(this.createDiv('')); 
        
        MONTHS.forEach(m => this.elements.grid.appendChild(this.createDiv(m, 'month-label')));

        for (let day = 1; day <= 31; day++) {
            this.elements.grid.appendChild(this.createDiv(day, 'day-label'));
            for (let month = 0; month < 12; month++) {
                if (this.isValidDate(day, month)) {
                    const cell = document.createElement('div');
                    cell.className = 'cell';
                    const key = `${month}-${day}`;
                    
                    const entry = dataStore.getEntry(key);
                    if (entry.mood) {
                        const m = MOODS.find(x => x.id === entry.mood);
                        if (m) cell.style.backgroundColor = m.color;
                    }
                    
                    cell.addEventListener('click', () => onCellClick(key, day, month));
                    this.elements.grid.appendChild(cell);
                } else {
                    this.elements.grid.appendChild(this.createDiv('', 'cell empty'));
                }
            }
        }
    },

    renderMoodOptions(selectedMood, onMoodSelect) {
        this.elements.moodOptions.innerHTML = '';
        
        // Clear Button
        const clearBtn = document.createElement('button');
        clearBtn.className = `mood-option ${selectedMood === null ? 'selected' : ''}`;
        clearBtn.innerHTML = `<div class="mood-dot" style="border:1px solid #555"></div> Clear`;
        clearBtn.addEventListener('click', () => onMoodSelect(null));
        this.elements.moodOptions.appendChild(clearBtn);

        // Mood Buttons
        MOODS.forEach(m => {
            const btn = document.createElement('button');
            btn.className = `mood-option ${selectedMood === m.id ? 'selected' : ''}`;
            btn.innerHTML = `<div class="mood-dot" style="background:${m.color}"></div> ${m.name}`;
            btn.addEventListener('click', () => onMoodSelect(m.id));
            this.elements.moodOptions.appendChild(btn);
        });
    },

    createDiv(content, className) {
        const div = document.createElement('div');
        if (className) div.className = className;
        div.innerText = content;
        return div;
    },

    isValidDate(day, month) {
        return day <= new Date(CURRENT_YEAR, month + 1, 0).getDate();
    }
};