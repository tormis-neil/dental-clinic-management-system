/**
 * main.js - Global Functions and Utilities
 */

/**
 * Initializes the application
 * Called on every page load
 */
function initializeApp() {
  // Setup user dropdown if it exists
  if (document.querySelector('.user-dropdown')) {
    setupUserDropdown();
  }

  // Update page title based on role and current page
  updatePageTitle();
}

/**
 * Toggles the sidebar collapsed/expanded state
 */
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');

  if (!sidebar || !mainContent) {
    console.error('Sidebar or main content not found');
    return;
  }

  // Toggle collapsed class on sidebar
  sidebar.classList.toggle('collapsed');

  // Toggle expanded class on main content
  mainContent.classList.toggle('expanded');

  // Update aria-expanded attribute for accessibility
  const toggleButton = document.querySelector('.sidebar-toggle');
  if (toggleButton) {
    const isExpanded = !sidebar.classList.contains('collapsed');
    toggleButton.setAttribute('aria-expanded', String(isExpanded));
  }
}

// Make it globally accessible
window.toggleSidebar = toggleSidebar;

/**
 * Sets up the user dropdown menu
 */
function setupUserDropdown() {
  const dropdown = document.querySelector('.user-dropdown');
  const trigger = dropdown?.querySelector('.user-trigger');

  if (!dropdown || !trigger) {
    return;
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
      }
    }
  });
}

/**
 * Updates the page title based on user role and current page
 */
function updatePageTitle() {
  const userRole = localStorage.getItem('userRole') || 'staff';
  const currentPage = window.location.pathname;
  const titleElement = document.getElementById('pageTitle');

  if (!titleElement) {
    return;
  }

  // Determine page name
  let pageName = 'Dashboard';
  if (currentPage.includes('patient')) {
    pageName = 'Patient Records';
  } else if (currentPage.includes('staff')) {
    pageName = 'Staff Management';
  } else if (currentPage.includes('settings')) {
    pageName = 'Settings';
  } else if (currentPage.includes('audit')) {
    pageName = 'Audit Logs';
  } else if (currentPage.includes('backup')) {
    pageName = 'Backup & Restore';
  }

  // Set title with role
  const roleText = userRole === 'manager' ? 'Manager' : 'Staff';
  titleElement.textContent = `Kit & Dom's Dental Clinic — ${roleText} ${pageName}`;
}

/**
 * Shows a notification message to the user
 */
function showNotification(message, type = 'info', duration = 3000) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    animation: slideIn 0.3s ease;
    max-width: 400px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
  `;

  const colors = {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6'
  };

  notification.style.borderLeft = `4px solid ${colors[type] || colors.info}`;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, duration);
}

/**
 * Formats a date string or Date object
 */
function formatDate(date, format = 'default') {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (!(d instanceof Date) || isNaN(d)) {
    return 'Invalid Date';
  }

  const options = {
    default: { year: 'numeric', month: '2-digit', day: '2-digit' },
    short: { month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    time: { hour: '2-digit', minute: '2-digit' },
    datetime: { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }
  };

  return new Intl.DateTimeFormat('en-US', options[format] || options.default).format(d);
}

/**
 * Navigate to different pages with correct paths
 */
function navigateTo(page) {
  const baseUrl = window.location.origin;
  
  const routes = {
    'dashboard': '/templates/pages/dashboard.html',
    'patients': '/templates/pages/patients.html',
    'staff': '/templates/pages/staff-management.html',
    'logs': '/templates/pages/audit-logs.html',
    'backup': '/templates/pages/backup-restore.html',
    'settings': '/templates/pages/settings.html'
  };

  const path = routes[page];
  if (path) {
    window.location.href = baseUrl + path;
  } else {
    console.error('Page not found:', page);
    alert('Page not found: ' + page);
  }
}

window.navigateTo = navigateTo;

/**
 * Toggle user dropdown menu
 */
function toggleDropdown(event) {
  if (event) {
    event.stopPropagation();
  }
  const dropdown = document.getElementById('userDropdown');
  if (dropdown) {
    dropdown.classList.toggle('open');
  }
}

window.toggleDropdown = toggleDropdown;

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(100%); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideOut {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(100%); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);