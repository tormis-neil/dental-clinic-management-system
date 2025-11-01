/**
 * main.js - Global Functions and Utilities
 *
 * Shared utilities and functions used across the application.
 *
 * Features:
 * - Sidebar toggle functionality
 * - Dashboard title updates
 * - Notification system
 * - Date formatting
 * - Loading indicators
 * - Common UI interactions
 *
 * @author Kit & Dom's Dental Clinic
 * @version 2.0
 * @date 2025-11-01
 */

/**
 * Initializes the application
 * Called on every page load
 */
function initializeApp() {
  // Setup sidebar if it exists
  if (document.querySelector('.sidebar')) {
    setupSidebar();
  }

  // Setup user dropdown if it exists
  if (document.querySelector('.user-dropdown')) {
    setupUserDropdown();
  }

  // Update page title based on role and current page
  updatePageTitle();
}

/**
 * Sets up the sidebar toggle functionality
 */
function setupSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  const toggleButton = document.querySelector('.sidebar-toggle');

  if (!sidebar || !mainContent || !toggleButton) {
    return;
  }

  // Add click event listener to toggle button
  toggleButton.addEventListener('click', toggleSidebar);
}

/**
 * Toggles the sidebar collapsed/expanded state
 */
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');

  if (!sidebar || !mainContent) {
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

  // Toggle dropdown on click
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');

    // Update aria-expanded
    const isOpen = dropdown.classList.contains('open');
    trigger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * Updates the page title based on user role and current page
 */
function updatePageTitle() {
  const user = getCurrentUser();
  const userRole = user ? user.role : 'staff';
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
 * Updates the dashboard title based on user role (deprecated, use updatePageTitle)
 */
function updateDashboardTitle() {
  updatePageTitle();
}

/**
 * Shows a notification message to the user
 * @param {string} message - The message to display
 * @param {string} type - Type of notification (success, error, warning, info)
 * @param {number} duration - Duration in milliseconds (default: 3000)
 */
function showNotification(message, type = 'info', duration = 3000) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Add styles
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

  // Add type-specific styling
  const colors = {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6'
  };

  notification.style.borderLeft = `4px solid ${colors[type] || colors.info}`;

  // Add to DOM
  document.body.appendChild(notification);

  // Remove after duration
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, duration);
}

/**
 * Formats a date string or Date object
 * @param {string|Date} date - The date to format
 * @param {string} format - Format type (default, short, long, time)
 * @returns {string} Formatted date string
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
 * Shows a loading indicator
 * @param {string} message - Optional loading message
 */
function showLoadingIndicator(message = 'Loading...') {
  // Remove existing loader if any
  hideLoadingIndicator();

  const loader = document.createElement('div');
  loader.id = 'global-loader';
  loader.innerHTML = `
    <div style="
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    ">
      <div style="
        background: white;
        padding: 30px 40px;
        border-radius: 12px;
        text-align: center;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
      ">
        <div style="
          width: 40px;
          height: 40px;
          border: 3px solid #E2E8F0;
          border-top-color: #E8B4BC;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 16px;
        "></div>
        <p style="
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: #64748B;
          margin: 0;
        ">${message}</p>
      </div>
    </div>
  `;

  document.body.appendChild(loader);
}

/**
 * Hides the loading indicator
 */
function hideLoadingIndicator() {
  const loader = document.getElementById('global-loader');
  if (loader) {
    loader.remove();
  }
}

/**
 * Escapes HTML to prevent XSS attacks
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Debounces a function call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Updates greeting based on time of day
 * @param {string} name - User's name
 * @returns {string} Greeting message
 */
function getGreeting(name) {
  const hour = new Date().getHours();
  let greet = 'Good Morning';

  if (hour >= 12 && hour < 18) {
    greet = 'Good Afternoon';
  } else if (hour >= 18) {
    greet = 'Good Evening';
  }

  return `${greet}, ${name} 👋`;
}

/**
 * Updates the user greeting on the page
 */
function updateGreeting() {
  const greetingElement = document.querySelector('#greetingText, .greeting-title');
  if (!greetingElement) return;

  const userName = getUserName();
  if (userName) {
    const parts = userName.split(' ');
    // Skip titles like "Dr.", "Mr.", "Ms.", etc.
    const titles = ['Dr.', 'Mr.', 'Ms.', 'Mrs.', 'Miss'];
    let firstName = parts[0];
    if (titles.includes(parts[0]) && parts.length > 1) {
      firstName = parts[1];
    }
    greetingElement.textContent = getGreeting(firstName);
  }
}

/**
 * Navigate to different pages with correct paths
 * @param {string} page - Page identifier
 */
function navigateTo(page) {
  const baseUrl = window.location.origin;
  const currentPath = window.location.pathname;

  // Determine if we're in templates/ root or templates/pages/
  const inPagesFolder = currentPath.includes('/pages/');

  const routes = {
    'dashboard': inPagesFolder ? '../dashboard.html' : 'dashboard.html',
    'patients': inPagesFolder ? '../patients.html' : 'patients.html',
    'staff': inPagesFolder ? 'staff-management.html' : 'pages/staff-management.html',
    'logs': inPagesFolder ? 'audit-logs.html' : 'pages/audit-logs.html',
    'backup': inPagesFolder ? 'backup-restore.html' : 'pages/backup-restore.html',
    'settings': inPagesFolder ? 'settings.html' : 'pages/settings.html'
  };

  const path = routes[page];
  if (path) {
    window.location.href = path;
  } else {
    console.error('Page not found:', page);
    alert('Page not found: ' + page);
  }
}

// Make function globally accessible
window.navigateTo = navigateTo;

/**
 * Toggle user dropdown menu
 */
function toggleDropdown() {
  const dropdown = document.getElementById('userDropdown');
  if (dropdown) {
    dropdown.classList.toggle('open');
  }
}

// Make function globally accessible
window.toggleDropdown = toggleDropdown;

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
  const dropdown = document.getElementById('userDropdown');
  const trigger = event.target.closest('.user-trigger');

  if (!trigger && dropdown && dropdown.classList.contains('open')) {
    dropdown.classList.remove('open');
  }
});

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // DOM is already loaded
  initializeApp();
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideOut {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }
`;
document.head.appendChild(style);
