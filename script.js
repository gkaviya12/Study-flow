// Global State Variables
const APP_STORAGE_KEY = 'studyPlannerData';
const PRIORITY_MAPPING = {
    'High': 3,
    'Medium': 2,
    'Low': 1
};
const STREAK_MILESTONES = [5, 10, 20, 50, 100];

let state = {
    tasks: [],
    notes: '',
    theme: 'light',
    goals: {},
    streak: { count: 0, lastCompletionDate: null, lastRewardedDay: null }, // Added lastRewardedDay
    pomodoro: {
        time: 1500, // 25 minutes in seconds
        mode: 'study',
        running: false,
        intervalId: null
    },
    currentCalendarDate: new Date(),
    selectedDate: new Date().toDateString(),
    userName: '', 
    academicProfile: { major: '', level: 'undergrad' } // New: Academic Profile
};

// DOM Element References
const taskForm = document.getElementById('task-form');
const tasksList = document.getElementById('tasks-list');
const notesTextarea = document.getElementById('notes-textarea');
const themeToggle = document.getElementById('theme-toggle');
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');
const modalOverlay = document.getElementById('message-modal-overlay');
const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');

// --- Utility Functions ---

/**
 * Generates a YYYY-MM-DD string from a Date object using local components 
 * to prevent timezone shifting issues.
 * @param {Date} date - The date object.
 * @returns {string} Date string in YYYY-MM-DD format.
 */
function formatDateToISOString(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}


/**
 * Loads state from Local Storage or initializes with defaults.
 */
function loadState() {
    try {
        const storedData = localStorage.getItem(APP_STORAGE_KEY);
        if (storedData) {
            const loadedState = JSON.parse(storedData);
            // Merge loaded state with defaults
            state.tasks = loadedState.tasks || [];
            state.notes = loadedState.notes || '';
            state.theme = loadedState.theme || 'light';
            state.goals = loadedState.goals || {};
            state.userName = loadedState.userName || ''; 
            state.streak = loadedState.streak || { count: 0, lastCompletionDate: null, lastRewardedDay: null }; // Load streak
            state.academicProfile = loadedState.academicProfile || { major: '', level: 'undergrad' }; // Load profile
        }
    } catch (error) {
        console.error('Error loading state from localStorage:', error);
    }
}

/**
 * Saves the current state to Local Storage.
 */
function saveState() {
    try {
        const dataToStore = {
            tasks: state.tasks,
            notes: state.notes,
            theme: state.theme,
            goals: state.goals,
            userName: state.userName,
            streak: state.streak,
            academicProfile: state.academicProfile
        };
        localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (error) {
        console.error('Error saving state to localStorage:', error);
    }
}

/**
 * Generates a unique ID for new tasks.
 * @returns {number} The next available ID.
 */
function getNextTaskId() {
    return state.tasks.length > 0
        ? Math.max(...state.tasks.map(t => t.id)) + 1
        : 1;
}

/**
 * Shows a custom modal message (replaces alert()).
 * @param {string} title - Modal title.
 * @param {string} body - Modal content.
 * @param {string} accentColor - Optional color for the title
 */
function showModal(title, body, accentColor = 'var(--accent-main)') {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-title').style.color = accentColor;
    document.getElementById('modal-body').innerHTML = body;
    modalOverlay.classList.add('active');
}

/**
 * Closes the custom modal.
 */
function closeModal() {
    modalOverlay.classList.remove('active');
}


// --- Theme Management ---

/**
 * Toggles between light and dark themes.
 */
function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', state.theme);
    // Re-apply pomodoro color when theme changes
    setPomodoroMode(state.pomodoro.mode); 
    saveState();
}

/**
 * Applies the theme on load.
 */
function applyTheme() {
    document.body.setAttribute('data-theme', state.theme);
}

themeToggle.addEventListener('click', toggleTheme);


// --- Navigation and View Management ---

/**
 * Shows the selected content section and updates navigation highlights.
 * @param {string} sectionId - ID of the section to show (e.g., 'planner').
 */
function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });

    // Close mobile menu if open
    navLinks.classList.remove('open');

    // Specific updates on section switch
    if (sectionId === 'calendar-view') {
        renderCalendar();
    } else if (sectionId === 'dashboard') {
        checkUrgentReminders();
        updateMotivationMessage();
    } else if (sectionId === 'settings') {
        loadSettingsToForm();
    }
}

/**
 * Handles navigation links and mobile menu toggle.
 */
function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            showSection(sectionId);
        });
    });

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    // Handle initial view
    showSection('dashboard');
}


// --- Task Planner Logic ---

/**
 * Renders the list of tasks based on the current search and filter.
 */
function renderTasks() {
    const searchQuery = document.getElementById('task-search').value.toLowerCase();
    const filterStatus = document.getElementById('task-filter').value;
    let filteredTasks = state.tasks;

    // 1. Filter by Status
    if (filterStatus !== 'all') {
        filteredTasks = filteredTasks.filter(t => t.status === filterStatus);
    }

    // 2. Filter by Search Query (Subject or Title)
    if (searchQuery) {
        filteredTasks = filteredTasks.filter(t =>
            t.subject.toLowerCase().includes(searchQuery) ||
            t.title.toLowerCase().includes(searchQuery)
        );
    }

    // 3. Sorting Logic: Priority (High > Medium > Low) then Deadline (earliest first)
    const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
    
    filteredTasks.sort((a, b) => {
        // Completed tasks always go last
        if (a.status === 'pending' && b.status === 'completed') return -1;
        if (a.status === 'completed' && b.status === 'pending') return 1;

        // For tasks with the same status, sort by priority
        const priorityA = priorityOrder[a.priority] || 0;
        const priorityB = priorityOrder[b.priority] || 0;

        if (priorityB !== priorityA) {
            return priorityB - priorityA; // Descending priority (High first)
        }

        // If priority is equal, sort by deadline
        return new Date(a.deadline) - new Date(b.deadline);
    });


    tasksList.innerHTML = ''; // Clear the task list container

    if (filteredTasks.length === 0) {
        // Inject the message directly into the list.
        tasksList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No tasks found. Time to plan!</p>';
        document.getElementById('total-tasks-count').textContent = '0';
    } else {
        document.getElementById('total-tasks-count').textContent = filteredTasks.length;
    
        filteredTasks.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.className = `task-item task-status-${task.status}`;
            
            // Set border color based on priority if task is PENDING
            if (task.status === 'pending') {
                 taskDiv.style.borderLeftColor = `var(--priority-${task.priority.toLowerCase()})`;
            }
            
            const priorityClass = task.priority ? `priority-${task.priority.toLowerCase()}` : 'priority-medium';

            taskDiv.innerHTML = `
                <div class="task-info" style="display: flex; align-items: center;">
                    <span class="task-priority-indicator ${priorityClass}">${task.priority}</span>
                    <div>
                        <div class="task-title">${task.title}</div>
                        <div class="task-details">
                            Subject: ${task.subject} | Category: ${task.category} | Deadline: ${task.deadline}
                        </div>
                    </div>
                </div>
                <div class="task-actions">
                    <button onclick="toggleTaskStatus(${task.id})" title="${task.status === 'pending' ? 'Mark Complete' : 'Mark Pending'}">
                        ${task.status === 'pending' ? '✓' : '⟲'}
                    </button>
                    <button onclick="editTask(${task.id})" title="Edit Task">
                        ✎
                    </button>
                    <button onclick="deleteTask(${task.id})" title="Delete Task">
                        🗑
                    </button>
                </div>
            `;
            tasksList.appendChild(taskDiv);
        });
    }

    // Ensure these updates always run, regardless of task list length
    updateDashboardStats();
    updateProgressTracker();
}

/**
 * Handles task form submission (Add or Edit).
 */
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const taskId = document.getElementById('task-id').value;
    const title = document.getElementById('title').value;
    const subject = document.getElementById('subject').value;
    const category = document.getElementById('category').value;
    const deadline = document.getElementById('deadline').value;
    const priority = document.getElementById('priority').value; // Get priority

    if (taskId) {
        // Edit existing task
        const taskIndex = state.tasks.findIndex(t => t.id === parseInt(taskId));
        if (taskIndex !== -1) {
            state.tasks[taskIndex].title = title;
            state.tasks[taskIndex].subject = subject;
            state.tasks[taskIndex].category = category;
            state.tasks[taskIndex].deadline = deadline;
            state.tasks[taskIndex].priority = priority; // Save priority
            showModal('Task Updated', `Task "${title}" has been successfully updated.`);
        }
    } else {
        // Add new task
        const newTask = {
            id: getNextTaskId(),
            title,
            subject,
            category,
            deadline,
            priority, // Save priority
            status: 'pending'
        };
        state.tasks.push(newTask);
        showModal('Task Added', `New task "${title}" scheduled for ${deadline}.`);
    }

    taskForm.reset();
    document.getElementById('task-id').value = '';
    document.getElementById('task-submit-btn').textContent = 'Add Task';
    document.getElementById('task-cancel-btn').style.display = 'none';
    document.getElementById('priority').value = 'Medium'; // Reset priority to default
    saveState();
    renderTasks();
    renderCalendar();
});

/**
 * Pre-fills the form for editing.
 * @param {number} id - ID of the task to edit.
 */
function editTask(id) {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;

    showSection('planner');
    document.getElementById('task-id').value = task.id;
    document.getElementById('title').value = task.title;
    document.getElementById('subject').value = task.subject;
    document.getElementById('category').value = task.category;
    document.getElementById('deadline').value = task.deadline;
    document.getElementById('priority').value = task.priority || 'Medium'; // Load priority

    document.getElementById('task-submit-btn').textContent = 'Save Changes';
    document.getElementById('task-cancel-btn').style.display = 'inline-block';
    document.getElementById('task-cancel-btn').onclick = () => {
        taskForm.reset();
        document.getElementById('task-id').value = '';
        document.getElementById('task-submit-btn').textContent = 'Add Task';
        document.getElementById('task-cancel-btn').style.display = 'none';
        document.getElementById('priority').value = 'Medium'; // Reset priority to default
    };
}

/**
 * Deletes a task by ID.
 * @param {number} id - ID of the task to delete.
 */
function deleteTask(id) {
    state.tasks = state.tasks.filter(t => t.id !== id);
    saveState();
    renderTasks();
    renderCalendar();
    showModal('Task Deleted', 'The task has been permanently removed from your schedule.');
}

/**
 * Toggles the status of a task (pending/completed).
 * @param {number} id - ID of the task.
 */
function toggleTaskStatus(id) {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;

    const wasPending = task.status === 'pending';
    task.status = wasPending ? 'completed' : 'pending';
    
    if (task.status === 'completed') {
        updateStreak(true); // Call update streak if a task was marked complete
    }

    saveState();
    renderTasks();
    updateProgressTracker();
    showModal('Status Update', `Task "${task.title}" marked as ${task.status}.`);
}

// Event listeners for search and filter
document.getElementById('task-search').addEventListener('input', renderTasks);
document.getElementById('task-filter').addEventListener('change', renderTasks);


// --- Dashboard & Settings Logic ---

/**
 * Saves user name or academic profile details.
 * @param {string} type - 'name' or 'profile'
 */
function saveSettings(type) {
    if (type === 'name') {
        const nameInput = document.getElementById('user-name-input');
        const newName = nameInput.value.trim();
        if (newName) {
            state.userName = newName;
            updateWelcomeMessage();
            showModal('Profile Updated', `Welcome message personalized for ${newName}!`);
        } else {
            showModal('Error', 'Please enter a valid name.');
        }
    } else if (type === 'profile') {
        state.academicProfile.major = document.getElementById('student-major').value.trim();
        state.academicProfile.level = document.getElementById('student-level').value;
        showModal('Profile Saved', 'Your academic details have been saved.');
    }
    saveState();
}

/**
 * Loads settings data into the form fields.
 */
function loadSettingsToForm() {
    const nameInput = document.getElementById('user-name-input');
    const majorInput = document.getElementById('student-major');
    const levelSelect = document.getElementById('student-level');
    
    if (nameInput) nameInput.value = state.userName;
    if (majorInput) majorInput.value = state.academicProfile.major;
    if (levelSelect) levelSelect.value = state.academicProfile.level;
}


/**
 * Updates the welcome message on load.
 */
function updateWelcomeMessage() {
    const name = state.userName || 'Student';
    document.getElementById('welcome-message').textContent = `Welcome Back, ${name}!`;
}

/**
 * Updates the current time and date on the dashboard.
 */
function updateDateTime() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    document.getElementById('stat-current-date').textContent = dateStr.split(',')[0];
    document.getElementById('stat-current-time').textContent = timeStr;
}

/**
 * Updates dashboard stats (e.g., pending task count).
 */
function updateDashboardStats() {
    const pendingCount = state.tasks.filter(t => t.status === 'pending').length;
    document.getElementById('stat-pending-tasks').textContent = pendingCount;
    updateMotivationMessage();
}

/**
 * Updates the motivation message based on the current streak.
 */
function updateMotivationMessage() {
    const streakCount = state.streak.count;
    let message = `Your current streak is **${streakCount} 🔥**. Keep the flame alive!`;

    if (streakCount === 0) {
        message = "Let's complete your first task today and start a great streak!";
    } else if (streakCount > 0 && streakCount < 5) {
        message = `You're on a ${streakCount}-day run! Consistency is key.`;
    } else if (streakCount >= 5 && streakCount < 10) {
        message = `**Fantastic!** You hit a ${streakCount}-day milestone. Celebrate this win!`;
    } else if (streakCount >= 10) {
        message = `**You're a Study Machine!** ${streakCount} days of focused progress!`;
    }

    document.getElementById('motivation-message').innerHTML = message;
}

/**
 * Checks for tasks due within the next 24 hours and shows a reminder.
 */
function checkUrgentReminders() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const urgentTasks = state.tasks.filter(t =>
        t.status === 'pending' &&
        new Date(t.deadline).getTime() <= tomorrow.getTime()
    );

    const reminderDisplay = document.getElementById('reminder-display');

    if (urgentTasks.length > 0) {
        const dueToday = urgentTasks.filter(t => t.deadline === new Date().toISOString().slice(0, 10));
        const message = dueToday.length > 0
            ? `Heads up! You have **${dueToday.length} task${dueToday.length > 1 ? 's' : ''} due today**!`
            : `You have ${urgentTasks.length} pending task${urgentTasks.length > 1 ? 's' : ''} due soon.`;

        reminderDisplay.innerHTML = message;
        reminderDisplay.style.color = '#e74c3c'; // Red/Warning color
    } else {
        reminderDisplay.textContent = 'No urgent tasks today. Stay ahead!';
        reminderDisplay.style.color = 'var(--text-secondary)';
    }
}

/**
 * Updates the daily completion streak and checks for milestones.
 * @param {boolean} isTaskCompleted - True if the function is called immediately after a task completion.
 */
function updateStreak(isTaskCompleted) {
    const today = new Date().toISOString().slice(0, 10);
    const lastDate = state.streak.lastCompletionDate;

    if (isTaskCompleted) {
        let streakIncremented = false;
        if (lastDate === today) {
            // Already logged a completion today
        } else if (lastDate) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayString = yesterday.toISOString().slice(0, 10);

            if (lastDate === yesterdayString) {
                // Continued streak
                state.streak.count += 1;
                streakIncremented = true;
            } else {
                // Streak broken, start new streak of 1
                state.streak.count = 1;
                streakIncremented = true;
            }
        } else {
            // First ever task completion, start streak of 1
            state.streak.count = 1;
            streakIncremented = true;
        }
        
        state.streak.lastCompletionDate = today;

        // Check for milestone reward only if streak was incremented and a milestone was hit
        if (streakIncremented) {
            checkStreakMilestones(state.streak.count, today);
        }

    } else if (lastDate) {
        // Check for broken streak on app load (if no task completed today)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().slice(0, 10);
        
        // If the last completion was before yesterday, reset the streak
        if (lastDate < yesterdayString) {
             state.streak.count = 0;
             state.streak.lastCompletionDate = null;
             state.streak.lastRewardedDay = null; // Reset reward tracking too
        }
    }

    document.getElementById('stat-streak').textContent = `${state.streak.count} 🔥`;
    saveState();
}

/**
 * Checks if the current streak hits a milestone and triggers a reward modal.
 * @param {number} count - The current streak count.
 * @param {string} today - Today's date (YYYY-MM-DD).
 */
function checkStreakMilestones(count, today) {
    const lastRewarded = state.streak.lastRewardedDay;
    
    // Only reward if today is different from the last rewarded day
    if (lastRewarded !== today) {
        const milestone = STREAK_MILESTONES.find(m => m === count);

        if (milestone) {
            showModal(
                `⭐ MILESTONE REACHED! ⭐`,
                `You have maintained your study streak for an incredible **${milestone} days**! Your dedication is inspiring. Keep crushing those goals!`,
                'var(--priority-medium)' // Orange color for celebration
            );
            state.streak.lastRewardedDay = today;
        }
    }
}


// --- Calendar Logic ---

/**
 * Changes the displayed month and re-renders the calendar.
 * @param {number} offset - -1 for previous month, 1 for next month.
 */
function changeMonth(offset) {
    state.currentCalendarDate.setMonth(state.currentCalendarDate.getMonth() + offset);
    renderCalendar();
}

/**
 * Renders the calendar grid and marks days with tasks.
 */
function renderCalendar() {
    const date = state.currentCalendarDate;
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthName = date.toLocaleDateString('en-US', { month: 'long' });

    document.getElementById('current-month-year').textContent = `${monthName} ${year}`;
    const calendarDaysEl = document.getElementById('calendar-days');
    calendarDaysEl.innerHTML = ''; // Clear previous days cells

    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Task lookup map for the current month
    const tasksByDate = state.tasks
        .filter(t => new Date(t.deadline).getFullYear() === year && new Date(t.deadline).getMonth() === month)
        .reduce((acc, task) => {
            if (task.deadline) {
                // IMPORTANT: We use the local date components for the day index, 
                // but the task filtering in displayTasksForDate relies on the string.
                const deadlineDate = new Date(task.deadline);
                const day = deadlineDate.getDate(); 
                if (!acc[day]) acc[day] = [];
                acc[day].push(task);
            }
            return acc;
        }, {});

    // Add leading empty days
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'calendar-day empty-day';
        calendarDaysEl.appendChild(emptyDiv);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        dayDiv.textContent = day;

        const currentDate = new Date(year, month, day);
        // FIX: Use the timezone-safe helper function to generate the ISO string
        const isoDate = formatDateToISOString(currentDate); 

        if (currentDate.toDateString() === new Date().toDateString()) {
            dayDiv.classList.add('current-day');
        }

        if (tasksByDate[day]) {
            dayDiv.classList.add('has-task');
            dayDiv.title = `${tasksByDate[day].length} task(s) due`;
        }

        dayDiv.onclick = () => displayTasksForDate(isoDate);
        calendarDaysEl.appendChild(dayDiv);
    }

    // Display tasks for the currently selected date or today
    displayTasksForDate(formatDateToISOString(new Date(state.selectedDate)));
}

/**
 * Displays tasks for a specific date in the calendar task list.
 * @param {string} isoDate - The date in YYYY-MM-DD format.
 */
function displayTasksForDate(isoDate) {
    state.selectedDate = new Date(isoDate + 'T00:00:00').toDateString(); // Use T00:00:00 for reliable date string
    document.getElementById('selected-date-display').textContent = state.selectedDate;

    const tasksForDateEl = document.getElementById('tasks-for-date');
    const tasks = state.tasks
        .filter(t => t.deadline === isoDate)
        .sort((a, b) => a.status.localeCompare(b.status));

    tasksForDateEl.innerHTML = '';

    if (tasks.length === 0) {
        tasksForDateEl.innerHTML = `<p style="text-align: center; color: var(--text-secondary);">No tasks scheduled for ${state.selectedDate}.</p>`;
        return;
    }

    tasks.forEach(task => {
        const item = document.createElement('div');
        const priorityClass = task.priority ? `priority-${task.priority.toLowerCase()}` : 'priority-medium';

        item.className = `task-item task-status-${task.status}`;
        item.style.padding = '0.75rem';
         // Set border color based on priority if task is PENDING
        if (task.status === 'pending') {
             item.style.borderLeftColor = `var(--priority-${task.priority.toLowerCase()})`;
        }
        
        item.innerHTML = `
            <div class="task-info" style="display: flex; align-items: center;">
                <span class="task-priority-indicator ${priorityClass}" style="margin-right: 1rem;">${task.priority}</span>
                <div>
                    <div class="task-title">${task.title}</div>
                    <div class="task-details">${task.subject} (${task.category}) - ${task.status}</div>
                </div>
            </div>
        `;
        tasksForDateEl.appendChild(item);
    });
}


// --- Progress and Goal Tracker Logic ---

/**
 * Updates the overall task completion progress bar.
 */
function updateProgressTracker() {
    const totalTasks = state.tasks.length;
    const completedTasks = state.tasks.filter(t => t.status === 'completed').length;
    const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    document.getElementById('overall-progress-bar').style.width = `${percentage}%`;
    document.getElementById('progress-text').textContent = `${percentage}% Completed (${completedTasks} of ${totalTasks} tasks)`;
}

/**
 * Renders the subject-wise goals.
 */
function renderGoals() {
    const goalsListEl = document.getElementById('goals-list');
    goalsListEl.innerHTML = '';
    const goalKeys = Object.keys(state.goals);

    if (goalKeys.length === 0) {
        goalsListEl.innerHTML = `<p style="text-align: center; color: var(--text-secondary);">Set a goal above to track it.</p>`;
        return;
    }

    goalKeys.forEach(subject => {
        const goal = state.goals[subject];
        const percentage = goal.totalGoal > 0 ? Math.min(100, Math.round((goal.hoursLogged / goal.totalGoal) * 100)) : 0;
        const item = document.createElement('div');
        item.className = 'goal-item';
        item.innerHTML = `
            <div>
                <strong>${subject} Goal: ${goal.totalGoal} Hrs</strong>
                <p style="font-size: 0.9rem; color: var(--text-secondary);">Logged: ${goal.hoursLogged} Hrs (${percentage}%)</p>
            </div>
            <div class="progress-bar-container" style="width: 50%;">
                <div class="progress-bar" style="width: ${percentage}%;"></div>
            </div>
        `;
        goalsListEl.appendChild(item);
    });
}

/**
 * Handles the goal setting form submission.
 */
document.getElementById('goal-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const subject = document.getElementById('goal-subject').value;
    const hours = parseInt(document.getElementById('goal-hours').value);

    if (subject && hours > 0) {
        if (!state.goals[subject]) {
            state.goals[subject] = { totalGoal: hours, hoursLogged: 0 };
        } else {
            state.goals[subject].totalGoal = hours;
        }
        saveState();
        renderGoals();
        showModal('Goal Set', `Your study goal for ${subject} is now ${hours} hours.`);
    }
});

/**
 * Mock function to simulate logging progress.
 * @param {string} subject - The subject to log time against.
 * @param {number} hours - The hours to log.
 */
function mockLogProgress(subject, hours) {
    if (state.goals[subject]) {
        state.goals[subject].hoursLogged = (state.goals[subject].hoursLogged || 0) + hours;
        saveState();
        renderGoals();
        showModal('Progress Logged', `Successfully logged ${hours} hours for ${subject}.`);
    } else {
        showModal('Error', `Please set a goal for ${subject} first.`);
    }
}

// --- Pomodoro Timer Logic ---

/**
 * Updates the timer display (MM:SS).
 */
function updateTimerDisplay() {
    const minutes = Math.floor(state.pomodoro.time / 60);
    const seconds = state.pomodoro.time % 60;
    timerDisplay.textContent =
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Starts or resumes the Pomodoro timer.
 */
function startTimer() {
    if (state.pomodoro.running) return;
    state.pomodoro.running = true;
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';
    document.getElementById('reset-btn').textContent = 'Reset';

    state.pomodoro.intervalId = setInterval(() => {
        state.pomodoro.time--;
        updateTimerDisplay();

        if (state.pomodoro.time <= 0) {
            clearInterval(state.pomodoro.intervalId);
            state.pomodoro.running = false;
            startBtn.style.display = 'inline-block';
            pauseBtn.style.display = 'none';
            document.getElementById('reset-btn').textContent = 'Next Mode';
            handleTimerEnd();
        }
    }, 1000);
}

/**
 * Pauses the Pomodoro timer.
 */
function pauseTimer() {
    clearInterval(state.pomodoro.intervalId);
    state.pomodoro.running = false;
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
}

/**
 * Resets the timer to the current mode's default time.
 */
function resetTimer() {
    pauseTimer();
    if (document.getElementById('reset-btn').textContent === 'Next Mode') {
        handleTimerEnd(true); // Automatically switch to the next mode
    } else {
        setPomodoroMode(state.pomodoro.mode);
        document.getElementById('reset-btn').textContent = 'Reset';
    }
}

/**
 * Sets the timer to a specific mode (study, short, long) and updates color.
 * Pomodoro color changed: Study is now a strong focus color (Red/Dark Purple), breaks are distinct.
 * @param {string} mode - The new mode.
 */
function setPomodoroMode(mode) {
    pauseTimer();
    state.pomodoro.mode = mode;
    let timeInSeconds = 0;
    let modeText = '';
    let backgroundColor = '';

    const isDark = document.body.getAttribute('data-theme') === 'dark';

    switch (mode) {
        case 'study':
            timeInSeconds = 1500; // 25 min
            modeText = 'Study Time';
            // Alizarin Red for light mode focus, Amethyst Purple for dark mode focus
            backgroundColor = isDark ? '#8e44ad' : '#e74c3c'; 
            break;
        case 'short':
            timeInSeconds = 300; // 5 min
            modeText = 'Short Break';
            // Emerald Green for short break
            backgroundColor = isDark ? '#27ae60' : '#2ecc71'; 
            break;
        case 'long':
            timeInSeconds = 900; // 15 min
            modeText = 'Long Break';
            // Peter River Blue for long break
            backgroundColor = isDark ? '#3498db' : '#3498db'; 
            break;
    }

    state.pomodoro.time = timeInSeconds;
    document.getElementById('pomodoro-timer').style.backgroundColor = backgroundColor;
    document.getElementById('timer-mode').textContent = modeText;
    updateTimerDisplay();
}

/**
 * Handles logic when the timer reaches zero.
 * @param {boolean} manualSwitch - If true, skip modal and just switch mode.
 */
function handleTimerEnd(manualSwitch = false) {
    let nextMode = '';
    let message = '';

    if (state.pomodoro.mode === 'study') {
        nextMode = 'short';
        message = 'Study session complete! Time for a short break. You earned it!';
    } else if (state.pomodoro.mode === 'short' || state.pomodoro.mode === 'long') {
        nextMode = 'study';
        message = 'Break over. Time to focus on the next task!';
    }

    if (!manualSwitch) {
        showModal('Timer Done!', message);
    }
    setPomodoroMode(nextMode);
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
document.getElementById('reset-btn').addEventListener('click', resetTimer);


// --- Notes Logic ---

/**
 * Saves notes to Local Storage automatically on input.
 */
function saveNotes() {
    state.notes = notesTextarea.value;
    saveState();
}

/**
 * Loads notes from state into the textarea.
 */
function loadNotes() {
    notesTextarea.value = state.notes;
}


// --- Initialization ---

/**
 * Initializes the application by loading data and setting up views.
 */
function initializeApp() {
    loadState();
    applyTheme();
    loadNotes();
    
    // Call setPomodoroMode early to apply the correct initial color
    setPomodoroMode('study'); 

    setupNavigation();
    updateDateTime();
    setInterval(updateDateTime, 1000); // Update time every second

    updateWelcomeMessage(); 
    updateStreak(false); // Check and display streak on load

    renderTasks();
    renderCalendar();
    renderGoals();
    checkUrgentReminders();
}

// Run initialization on window load
window.onload = initializeApp;