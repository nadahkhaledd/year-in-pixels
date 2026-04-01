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
                    if (entry.moods && entry.moods.length > 0) {
                        const colors = entry.moods.map(id => MOODS.find(x => x.id === id)?.color).filter(c => c);
                        
                        if (colors.length === 1) {
                            cell.style.background = colors[0]; // Single color
                        } else if (colors.length > 1) {
                            // Multiple colors: Create sharp diagonal stripes
                            let gradientStops = [];
                            let percentage = 100 / colors.length;
                            for (let i = 0; i < colors.length; i++) {
                                gradientStops.push(`${colors[i]} ${i * percentage}%`);
                                gradientStops.push(`${colors[i]} ${(i + 1) * percentage}%`);
                            }
                            cell.style.background = `linear-gradient(135deg, ${gradientStops.join(', ')})`;
                        }
                    }
                    
                    cell.addEventListener('click', () => onCellClick(key, day, month));
                    this.elements.grid.appendChild(cell);
                } else {
                    this.elements.grid.appendChild(this.createDiv('', 'cell empty'));
                }
            }
        }
    },

    renderMoodOptions(selectedMoodsArray, onMoodSelect) {
        this.elements.moodOptions.innerHTML = '';
        
        const clearBtn = document.createElement('button');
        clearBtn.className = `mood-option ${selectedMoodsArray.length === 0 ? 'selected' : ''}`;
        clearBtn.innerHTML = `<div class="mood-dot" style="border:1px solid #555"></div> Clear`;
        clearBtn.addEventListener('click', () => onMoodSelect(null));
        this.elements.moodOptions.appendChild(clearBtn);

        MOODS.forEach(m => {
            const isSelected = selectedMoodsArray.includes(m.id);
            const btn = document.createElement('button');
            btn.className = `mood-option ${isSelected ? 'selected' : ''}`;
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