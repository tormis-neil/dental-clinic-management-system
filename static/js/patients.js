/**
 * patients.js - Patients Management Module
 *
 * Displays and manages patient records.
 *
 * Features:
 * - Patient table with search functionality
 * - Add/Edit/Delete patient actions
 * - Export patient data to CSV
 * - Role-based visibility
 *
 * @author Kit & Dom's Dental Clinic
 * @version 1.0
 * @date 2025-11-04
 */

// --- Demo Patient Data (10 rows) ---
const demoPatients = [
  {
    id: 'P-001',
    fullName: 'Juan dela Cruz',
    gender: 'Male',
    age: 34,
    contact: '0912-345-6789',
    lastVisit: '10/28/2025',
    status: 'Active'
  },
  {
    id: 'P-002',
    fullName: 'Maria Santos',
    gender: 'Female',
    age: 28,
    contact: '0923-456-7890',
    lastVisit: '10/25/2025',
    status: 'Active'
  },
  {
    id: 'P-003',
    fullName: 'Jose Rizal',
    gender: 'Male',
    age: 45,
    contact: '0934-567-8901',
    lastVisit: '09/15/2025',
    status: 'Inactive'
  },
  {
    id: 'P-004',
    fullName: 'Ana Reyes',
    gender: 'Female',
    age: 31,
    contact: '0945-678-9012',
    lastVisit: '10/30/2025',
    status: 'Active'
  },
  {
    id: 'P-005',
    fullName: 'Pedro Garcia',
    gender: 'Male',
    age: 52,
    contact: '0956-789-0123',
    lastVisit: '10/20/2025',
    status: 'Active'
  },
  {
    id: 'P-006',
    fullName: 'Carmen Hernandez',
    gender: 'Female',
    age: 39,
    contact: '0967-890-1234',
    lastVisit: '08/10/2025',
    status: 'Inactive'
  },
  {
    id: 'P-007',
    fullName: 'Roberto Aquino',
    gender: 'Male',
    age: 41,
    contact: '0978-901-2345',
    lastVisit: '10/27/2025',
    status: 'Active'
  },
  {
    id: 'P-008',
    fullName: 'Isabella Torres',
    gender: 'Female',
    age: 26,
    contact: '0989-012-3456',
    lastVisit: '10/29/2025',
    status: 'Active'
  },
  {
    id: 'P-009',
    fullName: 'Miguel Lopez',
    gender: 'Male',
    age: 37,
    contact: '0991-123-4567',
    lastVisit: '10/22/2025',
    status: 'Active'
  },
  {
    id: 'P-010',
    fullName: 'Sofia Ramirez',
    gender: 'Female',
    age: 29,
    contact: '0902-234-5678',
    lastVisit: '10/26/2025',
    status: 'Active'
  }
];

/**
 * Security: HTML escape helper
 * @param {string} s - String to escape
 * @returns {string} Escaped string
 */
function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

/**
 * Renders the patients table with demo data
 */
function renderPatientsTable() {
  const tableBody = document.getElementById('patientsTableBody');
  const patientCount = document.getElementById('patientCount');

  if (!tableBody) return;

  // Clear existing rows
  tableBody.innerHTML = '';

  // Render each patient row
  demoPatients.forEach(patient => {
    const row = document.createElement('tr');

    // Gender badge class
    const genderClass = patient.gender.toLowerCase() === 'male' ? 'gender-male' : 'gender-female';

    // Status badge class
    const statusClass = patient.status.toLowerCase() === 'active' ? 'status-active' : 'status-inactive';

    row.innerHTML = `
      <td><span class="patient-id">${escapeHtml(patient.id)}</span></td>
      <td><strong>${escapeHtml(patient.fullName)}</strong></td>
      <td><span class="gender-badge ${genderClass}">${escapeHtml(patient.gender)}</span></td>
      <td>${escapeHtml(patient.age)}</td>
      <td>${escapeHtml(patient.contact)}</td>
      <td>${escapeHtml(patient.lastVisit)}</td>
      <td><span class="status-badge ${statusClass}">${escapeHtml(patient.status)}</span></td>
      <td>
        <div class="action-icons">
          <button class="action-icon edit" title="Edit Patient" onclick="handleEditPatient('${escapeHtml(patient.id)}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="action-icon delete" title="Delete Patient" onclick="handleDeletePatient('${escapeHtml(patient.id)}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </td>
    `;

    tableBody.appendChild(row);
  });

  // Update patient count
  if (patientCount) {
    patientCount.textContent = demoPatients.length;
  }
}

/**
 * Handle Add New Patient button click
 */
function handleAddPatient() {
  if (typeof showNotification === 'function') {
    showNotification('Add New Patient feature coming soon!', 'info');
  }
}

/**
 * Handle Edit Patient button click
 * @param {string} patientId - Patient ID (optional)
 */
function handleEditPatient(patientId) {
  if (typeof showNotification === 'function') {
    showNotification('Edit Patient feature coming soon!', 'info');
  }
}

/**
 * Handle Delete Patient button click
 * @param {string} patientId - Patient ID (optional)
 */
function handleDeletePatient(patientId) {
  if (typeof showNotification === 'function') {
    showNotification('Delete Patient feature coming soon!', 'warning');
  }
}

/**
 * Handle Export to CSV button click
 */
function handleExportPatients() {
  if (typeof showNotification === 'function') {
    showNotification('Export Patients feature coming soon!', 'info');
  }
}

/**
 * Sets up button event listeners
 */
function setupButtons() {
  const addPatientBtn = document.getElementById('addPatientBtn');
  const editPatientBtn = document.getElementById('editPatientBtn');
  const deletePatientBtn = document.getElementById('deletePatientBtn');
  const exportPatientBtn = document.getElementById('exportPatientBtn');

  if (addPatientBtn) {
    addPatientBtn.addEventListener('click', handleAddPatient);
  }

  if (editPatientBtn) {
    editPatientBtn.addEventListener('click', () => handleEditPatient());
  }

  if (deletePatientBtn) {
    deletePatientBtn.addEventListener('click', () => handleDeletePatient());
  }

  if (exportPatientBtn) {
    exportPatientBtn.addEventListener('click', handleExportPatients);
  }
}

/**
 * Updates the page title
 */
function updatePatientsPageTitle() {
  const userRole = localStorage.getItem('userRole') || 'staff';
  const roleText = userRole === 'manager' ? 'Manager' : 'Staff';

  // Update HTML title tag
  document.title = `Patients – Kit & Dom's Dental Clinic`;

  // Update page header title
  const headerTitle = document.getElementById('pageTitle');
  if (headerTitle) {
    headerTitle.textContent = `Kit & Dom's Dental Clinic`;
  }
}

/**
 * Updates the user info in the header
 */
function updateUserInfo() {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    console.error('No user data in sessionStorage');
    return;
  }

  const userNameEl = document.getElementById('userName');
  const userRoleEl = document.getElementById('userRole');
  const userAvatarEl = document.getElementById('userAvatar');

  if (userNameEl) {
    userNameEl.textContent = currentUser.name;
  }

  if (userRoleEl) {
    const roleDisplay = currentUser.role === 'manager' ? 'Manager / Dentist' : 'Staff';
    userRoleEl.textContent = roleDisplay;
  }

  if (userAvatarEl) {
    // Get user initials
    const nameParts = currentUser.name.split(' ');
    let initials = '??';
    if (nameParts.length >= 2) {
      initials = (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    } else if (nameParts.length === 1) {
      initials = nameParts[0].substring(0, 2).toUpperCase();
    }
    userAvatarEl.textContent = initials;
  }
}

/**
 * Initializes the patients module
 */
function initPatientsModule() {
  // Read userRole from localStorage (set during login)
  const userRole = localStorage.getItem('userRole');

  if (!userRole) {
    console.error('No userRole found in localStorage, redirecting to login');
    window.location.href = 'login.html';
    return;
  }

  // Get current user from sessionStorage for display data
  const currentUser = getCurrentUser();

  if (!currentUser) {
    console.error('No user data in sessionStorage, redirecting to login');
    window.location.href = 'login.html';
    return;
  }

  // Set data-role attribute on body for CSS styling
  document.body.setAttribute('data-role', userRole);
  console.log('Patients module initialized for role:', userRole);

  // Update user info in header
  updateUserInfo();

  // Update page title
  updatePatientsPageTitle();

  // Render the patients table
  renderPatientsTable();

  // Setup button event listeners
  setupButtons();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initPatientsModule();
});

// Make functions globally accessible for inline onclick handlers
window.handleEditPatient = handleEditPatient;
window.handleDeletePatient = handleDeletePatient;
