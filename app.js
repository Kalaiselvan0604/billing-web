// Main Application Logic

// Initialize application
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize database
        await initDB();
        
        // Load menu items if on main page
        if (typeof loadMenuItems === 'function') {
            await loadMenuItems();
        }
        
        // Load cart if on main page
        if (typeof loadCart === 'function') {
            loadCart();
        }
        
        // Setup category tabs if on main page
        if (typeof setupCategoryTabs === 'function') {
            setupCategoryTabs();
        }
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
    }
});

// Global functions are already defined in their respective modules
// These are just fallbacks if modules haven't loaded

window.loadDailyReport = function() {
    if (typeof loadDailyTurnover === 'function') {
        const date = document.getElementById('reportDate').value;
        loadDailyTurnover(date);
    }
};

window.loadMonthlyReport = function() {
    if (typeof loadMonthlyTurnover === 'function') {
        const month = document.getElementById('reportMonth').value;
        loadMonthlyTurnover(month);
    }
};

window.downloadDailyPDF = function() {
    if (typeof downloadDailyPDF === 'function') {
        downloadDailyPDF();
    }
};

window.downloadMonthlyPDF = function() {
    if (typeof downloadMonthlyPDF === 'function') {
        downloadMonthlyPDF();
    }
};

// Admin functions
window.showAddItemForm = function() {
    if (typeof showAddItemForm === 'function') {
        showAddItemForm();
    }
};

window.closeAddItemForm = function() {
    if (typeof closeAddItemForm === 'function') {
        closeAddItemForm();
    }
};

window.saveMenuItem = function(event) {
    if (typeof saveMenuItem === 'function') {
        saveMenuItem(event);
    }
};

window.editMenuItem = function(id) {
    if (typeof editMenuItem === 'function') {
        editMenuItem(id);
    }
};

window.deleteMenuItem = function(id) {
    if (typeof deleteMenuItem === 'function') {
        deleteMenuItem(id);
    }
};

window.setGlobalOffer = function() {
    if (typeof setGlobalOffer === 'function') {
        setGlobalOffer();
    }
};

window.logout = function() {
    if (typeof clearAuth === 'function') {
        clearAuth();
    }
    window.location.href = 'login.html';
};

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('addItemForm');
    if (event.target === modal) {
        if (typeof closeAddItemForm === 'function') {
            closeAddItemForm();
        }
    }
};

