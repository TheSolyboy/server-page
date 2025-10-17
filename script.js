// Load configuration and update the page
async function loadConfig() {
    try {
        const response = await fetch('config.json');
        const config = await response.json();
        updateDashboard(config);
    } catch (error) {
        console.error('Error loading config:', error);
        showError();
    }
}

// Update all dashboard elements with config data
function updateDashboard(config) {
    // Update header info
    document.getElementById('serverName').textContent = config.serverName || 'Server Status';
    document.getElementById('location').textContent = config.location || 'Unknown Location';
    
    // Update last updated time
    const lastUpdated = new Date(config.lastUpdated);
    document.getElementById('lastUpdated').textContent = formatDateTime(lastUpdated);
    
    // Update services
    renderServices(config.services);
}

// Render all services
function renderServices(services) {
    const servicesList = document.getElementById('servicesList');
    servicesList.innerHTML = '';
    
    services.forEach(service => {
        const serviceItem = createServiceElement(service);
        servicesList.appendChild(serviceItem);
    });
}

// Create a single service element
function createServiceElement(service) {
    const item = document.createElement('div');
    item.className = 'service-item';
    
    const statusIcon = getStatusIcon(service.status);
    const statusClass = service.status.toLowerCase();
    const statusText = service.status.charAt(0).toUpperCase() + service.status.slice(1);
    
    item.innerHTML = `
        <div class="service-main">
            <div class="service-status ${statusClass}">
                ${statusIcon}
            </div>
            <div>
                <div class="service-name">${service.name}</div>
                ${service.description ? `<div class="service-description">${service.description}</div>` : ''}
            </div>
        </div>
        <div class="service-badge ${statusClass}">
            ${statusText}
        </div>
    `;
    
    return item;
}

// Get SVG icon based on status
function getStatusIcon(status) {
    switch(status.toLowerCase()) {
        case 'online':
            return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
        case 'offline':
            return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
        case 'maintenance':
            return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
        default:
            return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }
}

// Format date and time
function formatDateTime(date) {
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

// Show error message if config fails to load
function showError() {
    document.getElementById('serverName').textContent = 'Error Loading Configuration';
    document.getElementById('location').textContent = 'Please check config.json';
    document.getElementById('lastUpdated').textContent = 'Failed to load';
}

// Auto-refresh every 30 seconds (optional)
function startAutoRefresh(intervalSeconds = 30) {
    setInterval(() => {
        loadConfig();
    }, intervalSeconds * 1000);
}

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    // Uncomment to enable auto-refresh
    // startAutoRefresh(30);
});
