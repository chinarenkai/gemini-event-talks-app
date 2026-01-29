document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule');
    const searchInput = document.getElementById('searchInput');
    const themeToggle = document.getElementById('themeToggle');
    
    let allScheduleItems = [];

    // --- Theme Logic ---
    // Check localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
        document.body.classList.add('light-mode');
        themeToggle.textContent = '🌙'; // Icon for switching TO dark
    } else {
        themeToggle.textContent = '☀️'; // Icon for switching TO light
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        
        themeToggle.textContent = isLight ? '🌙' : '☀️';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
    // -------------------

    // Configuration
    const START_TIME = "10:00"; // 24h format
    const TRANSITION_MINUTES = 10;
    const LUNCH_DURATION = 60;
    const LUNCH_AFTER_TALK_INDEX = 1; // 0-based index (After 2nd talk)

    fetch('/api/talks')
        .then(response => response.json())
        .then(talks => {
            allScheduleItems = generateSchedule(talks);
            renderSchedule(allScheduleItems);
        })
        .catch(err => {
            scheduleContainer.innerHTML = '<div class="loading">Failed to load schedule. Please try again.</div>';
            console.error(err);
        });

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        filterSchedule(term);
    });

    function generateSchedule(talks) {
        let items = [];
        let currentTime = parseTime(START_TIME);

        talks.forEach((talk, index) => {
            // 1. Add Talk
            const startTimeStr = formatTime(currentTime);
            currentTime = addMinutes(currentTime, talk.duration);
            const endTimeStr = formatTime(currentTime);

            items.push({
                type: 'talk',
                timeRange: `${startTimeStr} - ${endTimeStr}`,
                data: talk
            });

            // 2. Add Lunch Break if specific index reached
            if (index === LUNCH_AFTER_TALK_INDEX) {
                const lunchStart = formatTime(currentTime);
                currentTime = addMinutes(currentTime, LUNCH_DURATION);
                const lunchEnd = formatTime(currentTime);

                items.push({
                    type: 'break',
                    title: 'Lunch Break',
                    timeRange: `${lunchStart} - ${lunchEnd}`
                });
            } 
            // 3. Add Transition (if not last talk)
            else if (index < talks.length - 1) {
                // We don't necessarily need to display 10 min transitions as separate cards,
                // but we must account for the time.
                // Optionally we can just add the time silently.
                // Let's silently add time to keep UI clean, or show small divider?
                // The requirements say "Keep a 10 minute transition".
                // I will add it to the time calculation but not display a "Transition" card 
                // to keep the visual list focused on content, as is standard for conferences.
                // The gap between times implies the transition.
                currentTime = addMinutes(currentTime, TRANSITION_MINUTES);
            }
        });

        return items;
    }

    function renderSchedule(items) {
        scheduleContainer.innerHTML = '';
        
        if (items.length === 0) {
            scheduleContainer.innerHTML = '<div class="loading">No talks found matching criteria.</div>';
            return;
        }

        items.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = item.type === 'break' ? 'schedule-item break' : 'schedule-item';
            // Stagger animation
            itemDiv.style.animationDelay = `${index * 0.1}s`;

            if (item.type === 'break') {
                itemDiv.innerHTML = `
                    <div class="time-slot">${item.timeRange}</div>
                    <div class="card break-card">
                        <span class="break-title">🍽️ ${item.title}</span>
                    </div>
                `;
            } else {
                const talk = item.data;
                const tagsHtml = talk.category.map(tag => `<span class="tag">${tag}</span>`).join('');
                
                // Highlight search term logic could go here, but simple rendering for now
                itemDiv.innerHTML = `
                    <div class="time-slot">${item.timeRange}</div>
                    <div class="card">
                        <h3 class="talk-title">${talk.title}</h3>
                        <span class="speakers">by ${talk.speakers.join(', ')}</span>
                        <p class="description">${talk.description}</p>
                        <div class="tags">${tagsHtml}</div>
                    </div>
                `;
            }
            scheduleContainer.appendChild(itemDiv);
        });
    }

    function filterSchedule(term) {
        if (!term) {
            renderSchedule(allScheduleItems);
            return;
        }

        const filtered = allScheduleItems.filter(item => {
            if (item.type === 'break') return true; // Always show breaks? Or hide? 
            // Usually nice to keep context, but strict filtering is better.
            // Let's filter strictly based on user request "search talks".
            
            // Check title, speaker, or category
            const t = item.data;
            return t.title.toLowerCase().includes(term) || 
                   t.speakers.some(s => s.toLowerCase().includes(term)) ||
                   t.category.some(c => c.toLowerCase().includes(term));
        });
        
        renderSchedule(filtered);
    }

    // Time Utilities
    function parseTime(timeStr) {
        const [h, m] = timeStr.split(':').map(Number);
        return new Date(2026, 0, 1, h, m); // Arbitrary date
    }

    function addMinutes(dateObj, minutes) {
        return new Date(dateObj.getTime() + minutes * 60000);
    }

    function formatTime(dateObj) {
        let h = dateObj.getHours();
        let m = dateObj.getMinutes();
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        h = h ? h : 12; // 0 should be 12
        m = m < 10 ? '0' + m : m;
        return `${h}:${m} ${ampm}`;
    }
});