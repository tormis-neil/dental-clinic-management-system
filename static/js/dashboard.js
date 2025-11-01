/**
 * dashboard.js - Dashboard Overview Module
 *
 * Displays clinic overview with summary cards and recent activity.
 *
 * Features:
 * - Role-based dashboard views (manager vs staff)
 * - Summary statistics cards
 * - Recent activity timeline
 * - Quick action buttons
 *
 * @author Kit & Dom's Dental Clinic
 * @version 2.0
 * @date 2025-11-01
 */

// --- Elements ---
const summaryCards = document.getElementById('summaryCards');
const activityTable = document.getElementById('activityTable');

// --- Sample data for testing ---
const demoData = {
  manager: {
    user: { name: 'Maria Santos', role: 'Manager / Dentist', avatar: 'MS' },
    greeting: 'Maria',
    subtitle: "Here's your clinic overview.",
    cards: [
      { value: 152, label: 'Total Patients', trend: '↑ 12 this month', type: 'positive' },
      { value: 6, label: 'Total Staff', trend: '↑ 1 new user', type: 'positive', admin: true },
      { value: 145, label: 'Active Patients', trend: '95.4 % active rate', type: 'neutral' },
      { value: 12, label: 'Recent Activities', trend: 'Last 24 hours', type: 'neutral' },
    ],
    table: [
      { user: 'Dr. Maria Santos (Manager)', action: 'create', desc: "Added Patient 'Jane Cruz'", time: '10/22/2025 10:03 AM', id: '#P-014' },
      { user: 'Carla Reyes (Staff)', action: 'update', desc: 'Modified Treatment Plan', time: '10/22/2025 09:45 AM', id: '#P-013' },
      { user: 'Maria Santos (Manager)', action: 'backup', desc: 'Performed System Backup', time: '10/19/2025 06:00 PM', id: '#BK-023' },
    ],
  },

  staff: {
    user: { name: 'Carla Reyes', role: 'Staff', avatar: 'CR' },
    greeting: 'Carla',
    subtitle: "Here's a quick overview of today's patient records.",
    cards: [
      { value: 152, label: 'Total Patients', trend: '↑ 12 this month', type: 'positive' },
      { value: 145, label: 'Active Patients', trend: '95.4 % active rate', type: 'neutral' },
      { value: 8, label: 'Recent Updates', trend: "Today's changes", type: 'neutral' },
    ],
    table: [
      { user: 'Carla Reyes (Staff)', action: 'update', desc: 'Updated record of Jane Cruz', time: '10/22/2025 10:30 AM', id: '#P-014' },
      { user: 'Carla Reyes (Staff)', action: 'view', desc: 'Viewed patient John Doe', time: '10/21/2025 02:30 PM', id: '#P-011' },
      { user: 'Carla Reyes (Staff)', action: 'create', desc: 'Added new patient Anna Garcia', time: '10/20/2025 09:15 AM', id: '#P-010' },
    ],
  },
};

/**
 * Security: HTML escape helper
 * @param {string} s - String to escape
 * @returns {string} Escaped string
 */
function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

/**
 * Renders summary cards based on user role
 * @param {Array} cards - Array of card data
 */
function renderCards(cards) {
  if (!summaryCards) return;

  summaryCards.innerHTML = '';
  cards.forEach((c) => {
    const card = document.createElement('div');
    card.className = `card${c.admin ? ' admin-only' : ''}`;
    card.innerHTML = `
      <div class="card-value">${c.value}</div>
      <div class="card-label">${escapeHtml(c.label)}</div>
      <div class="card-trend ${c.type}">${escapeHtml(c.trend)}</div>
    `;
    summaryCards.appendChild(card);
  });
}

/**
 * Renders activity table
 * @param {Array} rows - Array of activity data
 */
function renderTable(rows) {
  if (!activityTable) return;

  activityTable.innerHTML = `
    <thead>
      <tr>
        <th>User</th>
        <th>Action</th>
        <th>Date & Time</th>
        <th>Record ID</th>
      </tr>
    </thead>
    <tbody>
      ${rows
        .map(
          (r) => `
          <tr>
            <td><strong>${escapeHtml(r.user)}</strong></td>
            <td>${actionBadge(r.action)} ${escapeHtml(r.desc)}</td>
            <td>${escapeHtml(r.time)}</td>
            <td class="record-id">${escapeHtml(r.id)}</td>
          </tr>
        `
        )
        .join('')}
    </tbody>
  `;
}

/**
 * Action badge helper
 * @param {string} type - Action type
 * @returns {string} HTML for action badge
 */
function actionBadge(type) {
  const map = {
    create: 'create',
    update: 'update',
    delete: 'delete',
    view: 'view',
    backup: 'backup',
  };
  if (!map[type]) return '';
  const label = type.charAt(0).toUpperCase() + type.slice(1);
  return `<span class="action-badge ${type}">${label}</span>`;
}

/**
 * Gets user initials from name
 * @param {string} name - Full name
 * @returns {string} Initials (e.g., "Maria Santos" -> "MS")
 */
function getUserInitials(name) {
  if (!name) return '??';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

/**
 * Gets user role display text
 * @param {string} role - User role (manager/staff)
 * @param {string} name - User name for additional context
 * @returns {string} Role display text
 */
function getUserRoleDisplay(role, name) {
  if (role === 'manager') {
    // Check if user is a doctor
    if (name && name.toLowerCase().includes('dr.')) {
      return 'Manager / Dentist';
    }
    return 'Manager';
  }
  return 'Staff';
}

/**
 * Updates the user info in the header
 * @param {object} userData - User data object from sessionStorage
 */
function updateUserInfo(userData) {
  const userNameEl = document.getElementById('userName');
  const userRoleEl = document.getElementById('userRole');
  const userAvatarEl = document.getElementById('userAvatar');

  if (!userData) return;

  const initials = getUserInitials(userData.name);
  const roleDisplay = getUserRoleDisplay(userData.role, userData.name);

  if (userNameEl) userNameEl.textContent = userData.name;
  if (userRoleEl) userRoleEl.textContent = roleDisplay;
  if (userAvatarEl) userAvatarEl.textContent = initials;
}

/**
 * Updates the greeting subtitle
 * @param {string} subtitle - Subtitle text
 */
function updateSubtitle(subtitle) {
  const subtitleEl = document.getElementById('greetingSubtitle');
  if (subtitleEl) {
    subtitleEl.textContent = subtitle;
  }
}

/**
 * Initializes the dashboard based on user role
 */
function initDashboard() {
  // Get current user from sessionStorage
  const currentUser = getCurrentUser();

  if (!currentUser || !currentUser.role) {
    // No user found, redirect to login
    window.location.href = 'login.html';
    return;
  }

  const userRole = currentUser.role;

  // Set data-role attribute on body for CSS styling
  document.body.dataset.role = userRole;

  // Update page title based on role
  if (typeof updatePageTitle === 'function') {
    updatePageTitle();
  }

  // Update user info in header with actual logged-in user data
  updateUserInfo(currentUser);

  // Update greeting (using main.js function)
  if (typeof updateGreeting === 'function') {
    updateGreeting();
  }

  // Get demo data for current role (for cards and table)
  const data = demoData[userRole];

  if (!data) {
    console.error('No data found for role:', userRole);
    return;
  }

  // Update subtitle
  updateSubtitle(data.subtitle);

  // Render dashboard content
  renderCards(data.cards);
  renderTable(data.table);
}

/**
 * Sets up quick action buttons
 */
function setupQuickActions() {
  const addPatientBtn = document.getElementById('addPatientBtn');
  const viewAllBtn = document.getElementById('viewAllBtn');
  const addStaffBtn = document.getElementById('addStaffBtn');

  if (addPatientBtn) {
    addPatientBtn.addEventListener('click', () => {
      if (typeof showNotification === 'function') {
        showNotification('Add Patient feature coming soon!', 'info');
      }
    });
  }

  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
      alert('Feature coming soon!');
    });
  }

  if (addStaffBtn) {
    addStaffBtn.addEventListener('click', () => {
      if (typeof showNotification === 'function') {
        showNotification('Add Staff feature coming soon!', 'info');
      }
    });
  }
}

/**
 * Sets up sidebar navigation
 */
function setupNavigation() {
  const sidebarItems = document.querySelectorAll('.sidebar-item');

  sidebarItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.dataset.page;

      // Map page names to file names
      const pageMap = {
        'dashboard': 'dashboard.html',
        'patients': 'patients.html',
        'staff': 'staff-management.html',
        'logs': 'audit-logs.html',
        'backup': 'backup-restore.html',
        'settings': 'settings.html'
      };

      const targetPage = pageMap[page];

      if (targetPage === 'dashboard.html' || targetPage === 'patients.html') {
        window.location.href = targetPage;
      } else {
        // For unimplemented pages, show coming soon
        window.location.href = 'pages/coming-soon.html';
      }
    });
  });
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initDashboard();
  setupQuickActions();
  setupNavigation();
});
