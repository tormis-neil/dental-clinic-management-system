/**
 * patients.js - Patient Management Module
 *
 * Handles all patient-related functionality including:
 * - CRUD operations (Create, Read, Update, Delete)
 * - Search and filtering
 * - Data persistence with LocalStorage
 * - Role-based access control
 * - CSV export
 * - Bulk operations
 *
 * @author Kit & Dom's Dental Clinic
 * @version 1.0
 * @date 2025-01-04
 */

// Global variables
let patients = [];
let filteredPatients = [];
let currentEditId = null;
let currentDeleteId = null;
let bulkDeleteMode = false;

/**
 * Initialize the patients module
 */
function initPatients() {
  // Load patients from localStorage
  loadPatients();

  // Update UI based on user role
  updateUIForRole();

  // Render patients table
  renderPatients();

  // Update user info in header
  updateUserInfo();

  // Add activity log
  logActivity('VIEW', 'Patients', null, 'Accessed patient records page');
}

/**
 * Load patients from localStorage or initialize with demo data
 */
function loadPatients() {
  const stored = localStorage.getItem('clinic_patients');

  if (stored) {
    try {
      patients = JSON.parse(stored);
    } catch (e) {
      console.error('Error loading patients:', e);
      patients = [];
      initializeDemoData();
    }
  } else {
    initializeDemoData();
  }

  filteredPatients = [...patients];
}

/**
 * Initialize demo patient data
 */
function initializeDemoData() {
  patients = [
    {
      id: 'PT-0001',
      firstName: 'Juan',
      lastName: 'Dela Cruz',
      gender: 'Male',
      dob: '1985-03-15',
      contact: '09171234567',
      email: 'juan.delacruz@email.com',
      address: 'Quezon City, Metro Manila',
      status: 'active',
      lastVisit: '2025-01-10',
      assignedDentist: 'Dr. Maria Santos',
      medicalHistory: {
        allergies: 'None',
        conditions: 'None',
        medications: 'None',
        notes: 'Regular patient, good dental hygiene'
      },
      visits: [
        {
          date: '2025-01-10',
          provider: 'Dr. Maria Santos',
          service: 'Teeth Cleaning',
          notes: 'Routine cleaning completed'
        },
        {
          date: '2024-12-05',
          provider: 'Dr. Maria Santos',
          service: 'Checkup',
          notes: 'General checkup, no issues found'
        }
      ],
      createdAt: '2024-06-15T10:30:00Z',
      createdBy: 'manager',
      updatedAt: '2025-01-10T14:20:00Z',
      updatedBy: 'staff'
    },
    {
      id: 'PT-0002',
      firstName: 'Maria',
      lastName: 'Santos',
      gender: 'Female',
      dob: '1990-07-22',
      contact: '09189876543',
      email: 'maria.santos@email.com',
      address: 'Makati City, Metro Manila',
      status: 'active',
      lastVisit: '2025-01-08',
      assignedDentist: 'Dr. John Reyes',
      medicalHistory: {
        allergies: 'Penicillin',
        conditions: 'None',
        medications: 'None',
        notes: 'Allergic to Penicillin - use alternative antibiotics'
      },
      visits: [
        {
          date: '2025-01-08',
          provider: 'Dr. John Reyes',
          service: 'Filling',
          notes: 'Cavity filled on lower left molar'
        }
      ],
      createdAt: '2024-07-20T09:15:00Z',
      createdBy: 'staff',
      updatedAt: '2025-01-08T11:30:00Z',
      updatedBy: 'manager'
    },
    {
      id: 'PT-0003',
      firstName: 'Pedro',
      lastName: 'Reyes',
      gender: 'Male',
      dob: '1978-11-30',
      contact: '09176543210',
      email: 'pedro.reyes@email.com',
      address: 'Pasig City, Metro Manila',
      status: 'active',
      lastVisit: '2025-01-05',
      assignedDentist: 'Dr. Maria Santos',
      medicalHistory: {
        allergies: 'None',
        conditions: 'Hypertension',
        medications: 'Losartan 50mg daily',
        notes: 'Monitor blood pressure during procedures'
      },
      visits: [
        {
          date: '2025-01-05',
          provider: 'Dr. Maria Santos',
          service: 'Root Canal',
          notes: 'Root canal treatment initiated'
        }
      ],
      createdAt: '2024-08-10T13:45:00Z',
      createdBy: 'manager',
      updatedAt: '2025-01-05T16:00:00Z',
      updatedBy: 'manager'
    },
    {
      id: 'PT-0004',
      firstName: 'Ana',
      lastName: 'Garcia',
      gender: 'Female',
      dob: '1995-05-18',
      contact: '09173456789',
      email: 'ana.garcia@email.com',
      address: 'Taguig City, Metro Manila',
      status: 'active',
      lastVisit: '2025-01-03',
      assignedDentist: 'Dr. Anna Cruz',
      medicalHistory: {
        allergies: 'Latex',
        conditions: 'None',
        medications: 'None',
        notes: 'Use non-latex gloves for all procedures'
      },
      visits: [
        {
          date: '2025-01-03',
          provider: 'Dr. Anna Cruz',
          service: 'Teeth Whitening',
          notes: 'Whitening treatment completed'
        }
      ],
      createdAt: '2024-09-05T10:00:00Z',
      createdBy: 'staff',
      updatedAt: '2025-01-03T14:30:00Z',
      updatedBy: 'staff'
    },
    {
      id: 'PT-0005',
      firstName: 'Carlos',
      lastName: 'Lopez',
      gender: 'Male',
      dob: '1982-09-12',
      contact: '09182345678',
      email: 'carlos.lopez@email.com',
      address: 'Mandaluyong City, Metro Manila',
      status: 'active',
      lastVisit: '2024-12-28',
      assignedDentist: 'Dr. John Reyes',
      medicalHistory: {
        allergies: 'None',
        conditions: 'Diabetes Type 2',
        medications: 'Metformin 500mg twice daily',
        notes: 'Monitor blood sugar, risk of slow healing'
      },
      visits: [
        {
          date: '2024-12-28',
          provider: 'Dr. John Reyes',
          service: 'Extraction',
          notes: 'Wisdom tooth extraction - healing well'
        }
      ],
      createdAt: '2024-10-15T11:20:00Z',
      createdBy: 'manager',
      updatedAt: '2024-12-28T15:45:00Z',
      updatedBy: 'manager'
    },
    {
      id: 'PT-0006',
      firstName: 'Luisa',
      lastName: 'Fernandez',
      gender: 'Female',
      dob: '2000-01-25',
      contact: '09191234567',
      email: 'luisa.fernandez@email.com',
      address: 'San Juan City, Metro Manila',
      status: 'active',
      lastVisit: '2024-12-20',
      assignedDentist: 'Dr. Anna Cruz',
      medicalHistory: {
        allergies: 'None',
        conditions: 'None',
        medications: 'None',
        notes: 'Young patient, good oral health'
      },
      visits: [
        {
          date: '2024-12-20',
          provider: 'Dr. Anna Cruz',
          service: 'Braces Adjustment',
          notes: 'Regular braces adjustment'
        }
      ],
      createdAt: '2024-11-01T09:30:00Z',
      createdBy: 'staff',
      updatedAt: '2024-12-20T13:00:00Z',
      updatedBy: 'staff'
    },
    {
      id: 'PT-0007',
      firstName: 'Roberto',
      lastName: 'Aquino',
      gender: 'Male',
      dob: '1970-04-08',
      contact: '09165432109',
      email: 'roberto.aquino@email.com',
      address: 'Parañaque City, Metro Manila',
      status: 'inactive',
      lastVisit: '2024-08-15',
      assignedDentist: 'Dr. Maria Santos',
      medicalHistory: {
        allergies: 'Iodine',
        conditions: 'Heart Disease',
        medications: 'Aspirin 81mg daily',
        notes: 'Requires antibiotic prophylaxis before procedures'
      },
      visits: [
        {
          date: '2024-08-15',
          provider: 'Dr. Maria Santos',
          service: 'Checkup',
          notes: 'Last checkup before moving to another city'
        }
      ],
      createdAt: '2024-03-10T14:15:00Z',
      createdBy: 'manager',
      updatedAt: '2024-08-15T16:45:00Z',
      updatedBy: 'manager'
    },
    {
      id: 'PT-0008',
      firstName: 'Sofia',
      lastName: 'Ramos',
      gender: 'Female',
      dob: '1988-12-03',
      contact: '09177654321',
      email: 'sofia.ramos@email.com',
      address: 'Las Piñas City, Metro Manila',
      status: 'active',
      lastVisit: '2024-12-15',
      assignedDentist: 'Dr. John Reyes',
      medicalHistory: {
        allergies: 'None',
        conditions: 'None',
        medications: 'None',
        notes: 'Pregnant - avoid X-rays'
      },
      visits: [
        {
          date: '2024-12-15',
          provider: 'Dr. John Reyes',
          service: 'Dental Cleaning',
          notes: 'Gentle cleaning, no X-rays taken'
        }
      ],
      createdAt: '2024-05-22T10:45:00Z',
      createdBy: 'staff',
      updatedAt: '2024-12-15T14:00:00Z',
      updatedBy: 'staff'
    },
    {
      id: 'PT-0009',
      firstName: 'Miguel',
      lastName: 'Torres',
      gender: 'Male',
      dob: '1992-08-17',
      contact: '09183456789',
      email: 'miguel.torres@email.com',
      address: 'Muntinlupa City, Metro Manila',
      status: 'active',
      lastVisit: '2024-12-10',
      assignedDentist: 'Dr. Anna Cruz',
      medicalHistory: {
        allergies: 'None',
        conditions: 'Asthma',
        medications: 'Albuterol inhaler as needed',
        notes: 'Keep inhaler nearby during appointments'
      },
      visits: [
        {
          date: '2024-12-10',
          provider: 'Dr. Anna Cruz',
          service: 'Cavity Filling',
          notes: 'Two cavities filled, upper right side'
        }
      ],
      createdAt: '2024-07-18T11:30:00Z',
      createdBy: 'manager',
      updatedAt: '2024-12-10T15:20:00Z',
      updatedBy: 'staff'
    },
    {
      id: 'PT-0010',
      firstName: 'Isabel',
      lastName: 'Cruz',
      gender: 'Female',
      dob: '1975-06-29',
      contact: '09198765432',
      email: 'isabel.cruz@email.com',
      address: 'Caloocan City, Metro Manila',
      status: 'active',
      lastVisit: '2024-12-05',
      assignedDentist: 'Dr. Maria Santos',
      medicalHistory: {
        allergies: 'Sulfa drugs',
        conditions: 'Osteoporosis',
        medications: 'Calcium supplements',
        notes: 'Caution with extractions due to osteoporosis'
      },
      visits: [
        {
          date: '2024-12-05',
          provider: 'Dr. Maria Santos',
          service: 'Denture Fitting',
          notes: 'Partial denture fitted and adjusted'
        }
      ],
      createdAt: '2024-04-12T09:00:00Z',
      createdBy: 'manager',
      updatedAt: '2024-12-05T13:45:00Z',
      updatedBy: 'manager'
    }
  ];

  savePatients();
  filteredPatients = [...patients];
}

/**
 * Save patients to localStorage
 */
function savePatients() {
  localStorage.setItem('clinic_patients', JSON.stringify(patients));
}

/**
 * Calculate age from date of birth
 */
function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

/**
 * Format date to readable string
 */
function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Update UI based on user role
 */
function updateUIForRole() {
  const userRole = getUserRole();
  const body = document.body;

  if (userRole === 'staff') {
    body.setAttribute('data-role', 'staff');
  } else {
    body.setAttribute('data-role', 'manager');
  }
}

/**
 * Update user info in header
 */
function updateUserInfo() {
  const user = getCurrentUser();
  if (!user) return;

  // Update user avatar
  const userAvatar = document.getElementById('userAvatar');
  if (userAvatar) {
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    userAvatar.textContent = initials;
  }

  // Update user name
  const userName = document.getElementById('userName');
  if (userName) {
    userName.textContent = user.name;
  }

  // Update user role
  const userRole = document.getElementById('userRole');
  if (userRole) {
    userRole.textContent = user.role === 'manager' ? 'Manager / Dentist' : 'Staff';
  }
}

/**
 * Render patients table
 */
function renderPatients() {
  const tbody = document.getElementById('patientTableBody');
  const tableInfo = document.getElementById('tableInfo');

  if (!tbody) return;

  // Clear existing rows
  tbody.innerHTML = '';

  // Check if there are patients to display
  if (filteredPatients.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="empty-state">
          <div class="empty-state-icon">👥</div>
          <div class="empty-state-title">No Patients Found</div>
          <div class="empty-state-text">Try adjusting your filters or add a new patient.</div>
        </td>
      </tr>
    `;

    if (tableInfo) {
      tableInfo.textContent = 'Showing 0 of 0 patients';
    }
    return;
  }

  // Render each patient
  filteredPatients.forEach(patient => {
    const row = document.createElement('tr');
    const age = calculateAge(patient.dob);
    const statusClass = patient.status === 'active' ? 'active' : 'inactive';

    row.innerHTML = `
      <td class="admin-only">
        <input type="checkbox" class="patient-checkbox" data-id="${patient.id}" style="display:none;">
      </td>
      <td><strong>${patient.id}</strong></td>
      <td>${patient.firstName} ${patient.lastName}</td>
      <td>${patient.gender}</td>
      <td>${age} years</td>
      <td>${patient.contact}</td>
      <td>${formatDate(patient.lastVisit)}</td>
      <td><span class="status-badge ${statusClass}">${patient.status}</span></td>
      <td>
        <div class="action-buttons">
          <button class="action-btn view" onclick="viewPatient('${patient.id}')" title="View Details">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
          <button class="action-btn edit" onclick="editPatient('${patient.id}')" title="Edit Patient">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="action-btn delete admin-only" onclick="deletePatient('${patient.id}')" title="Delete Patient">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </td>
    `;

    tbody.appendChild(row);
  });

  // Update table info
  if (tableInfo) {
    const total = patients.length;
    const showing = filteredPatients.length;
    tableInfo.textContent = `Showing ${showing} of ${total} patient${total !== 1 ? 's' : ''}`;
  }

  // Show bulk delete button if there are patients and user is manager
  const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
  if (bulkDeleteBtn && getUserRole() === 'manager' && filteredPatients.length > 0) {
    bulkDeleteBtn.style.display = 'inline-flex';
  }
}

/**
 * Filter patients based on search and filters
 */
function filterPatients() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const genderFilter = document.getElementById('genderFilter').value;
  const statusFilter = document.getElementById('statusFilter').value;

  filteredPatients = patients.filter(patient => {
    // Search filter
    const matchesSearch = !searchTerm ||
      patient.id.toLowerCase().includes(searchTerm) ||
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm) ||
      patient.contact.includes(searchTerm);

    // Gender filter
    const matchesGender = !genderFilter || patient.gender === genderFilter;

    // Status filter
    const matchesStatus = !statusFilter || patient.status === statusFilter;

    return matchesSearch && matchesGender && matchesStatus;
  });

  renderPatients();
}

/**
 * Reset all filters
 */
function resetFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('genderFilter').value = '';
  document.getElementById('statusFilter').value = '';

  filterPatients();
}

/**
 * Open Add Patient Modal
 */
function openAddPatientModal() {
  currentEditId = null;
  document.getElementById('modalTitle').textContent = 'Add New Patient';
  document.getElementById('patientForm').reset();
  document.getElementById('patientId').value = '';

  // Set default values for manager-only fields
  const userRole = getUserRole();
  if (userRole === 'manager') {
    document.getElementById('status').value = 'active';
  }

  // Show modal
  const modal = document.getElementById('patientModal');
  modal.setAttribute('aria-hidden', 'false');
}

/**
 * Close Patient Modal
 */
function closePatientModal() {
  const modal = document.getElementById('patientModal');
  modal.setAttribute('aria-hidden', 'true');
  document.getElementById('patientForm').reset();
  currentEditId = null;
}

/**
 * Generate new patient ID
 */
function generatePatientId() {
  if (patients.length === 0) {
    return 'PT-0001';
  }

  // Get the highest ID number
  const maxId = patients.reduce((max, patient) => {
    const num = parseInt(patient.id.split('-')[1]);
    return num > max ? num : max;
  }, 0);

  const newNum = maxId + 1;
  return `PT-${String(newNum).padStart(4, '0')}`;
}

/**
 * Save patient (Add or Edit)
 */
function savePatient(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const patientData = {
    id: currentEditId || generatePatientId(),
    firstName: formData.get('firstName').trim(),
    lastName: formData.get('lastName').trim(),
    gender: formData.get('gender'),
    dob: formData.get('dob'),
    contact: formData.get('contact').trim(),
    email: formData.get('email')?.trim() || '',
    address: formData.get('address')?.trim() || '',
    lastVisit: currentEditId ? (patients.find(p => p.id === currentEditId)?.lastVisit || '') : '',
    assignedDentist: formData.get('assignedDentist') || '',
    status: formData.get('status') || 'active',
    medicalHistory: {
      allergies: formData.get('allergies')?.trim() || 'None',
      conditions: formData.get('conditions')?.trim() || 'None',
      medications: formData.get('medications')?.trim() || 'None',
      notes: formData.get('notes')?.trim() || ''
    },
    visits: currentEditId ? (patients.find(p => p.id === currentEditId)?.visits || []) : [],
    createdAt: currentEditId ? (patients.find(p => p.id === currentEditId)?.createdAt) : new Date().toISOString(),
    createdBy: currentEditId ? (patients.find(p => p.id === currentEditId)?.createdBy) : getUsername(),
    updatedAt: new Date().toISOString(),
    updatedBy: getUsername()
  };

  if (currentEditId) {
    // Update existing patient
    const index = patients.findIndex(p => p.id === currentEditId);
    if (index !== -1) {
      patients[index] = patientData;
      showNotification('Patient updated successfully!', 'success');
      logActivity('UPDATE', 'Patient', patientData.id, `Updated patient: ${patientData.firstName} ${patientData.lastName}`);
    }
  } else {
    // Add new patient
    patients.push(patientData);
    showNotification('Patient added successfully!', 'success');
    logActivity('CREATE', 'Patient', patientData.id, `Created new patient: ${patientData.firstName} ${patientData.lastName}`);
  }

  savePatients();
  filterPatients();
  closePatientModal();
}

/**
 * View patient details
 */
function viewPatient(patientId) {
  const patient = patients.find(p => p.id === patientId);
  if (!patient) {
    showNotification('Patient not found!', 'error');
    return;
  }

  // Populate personal info tab
  document.getElementById('viewPatientId').textContent = patient.id;
  document.getElementById('viewFullName').textContent = `${patient.firstName} ${patient.lastName}`;
  document.getElementById('viewGender').textContent = patient.gender;
  document.getElementById('viewDob').textContent = formatDate(patient.dob);
  document.getElementById('viewAge').textContent = `${calculateAge(patient.dob)} years`;
  document.getElementById('viewContact').textContent = patient.contact;
  document.getElementById('viewEmail').textContent = patient.email || '-';
  document.getElementById('viewAddress').textContent = patient.address || '-';
  document.getElementById('viewDentist').textContent = patient.assignedDentist || '-';
  document.getElementById('viewStatus').innerHTML = `<span class="status-badge ${patient.status}">${patient.status}</span>`;

  // Populate medical history tab
  if (getUserRole() === 'manager') {
    document.getElementById('viewAllergies').textContent = patient.medicalHistory?.allergies || 'None';
    document.getElementById('viewConditions').textContent = patient.medicalHistory?.conditions || 'None';
    document.getElementById('viewMedications').textContent = patient.medicalHistory?.medications || 'None';
    document.getElementById('viewNotes').textContent = patient.medicalHistory?.notes || '-';
  }

  // Populate visit history tab
  const visitHistory = document.getElementById('visitHistory');
  if (patient.visits && patient.visits.length > 0) {
    visitHistory.innerHTML = patient.visits.map(visit => `
      <div style="padding: 16px; background: var(--bg-light); border-radius: 8px; margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <strong style="color: var(--primary-pink);">${visit.service}</strong>
          <span style="color: var(--text-muted); font-size: 13px;">${formatDate(visit.date)}</span>
        </div>
        <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 4px;">
          Provider: ${visit.provider}
        </div>
        <div style="font-size: 13px; color: var(--text-body);">
          ${visit.notes}
        </div>
      </div>
    `).join('');
  } else {
    visitHistory.innerHTML = '<p class="text-muted">No visit history available.</p>';
  }

  // Reset to personal tab
  switchTab('personal');

  // Store current patient ID for edit
  currentEditId = patient.id;

  // Show modal
  const modal = document.getElementById('viewPatientModal');
  modal.setAttribute('aria-hidden', 'false');

  // Log activity
  logActivity('VIEW', 'Patient', patient.id, `Viewed patient details: ${patient.firstName} ${patient.lastName}`);
}

/**
 * Close View Patient Modal
 */
function closeViewPatientModal() {
  const modal = document.getElementById('viewPatientModal');
  modal.setAttribute('aria-hidden', 'true');
  currentEditId = null;
}

/**
 * Edit patient from view modal
 */
function editPatientFromView() {
  if (!currentEditId) return;

  closeViewPatientModal();
  editPatient(currentEditId);
}

/**
 * Switch tabs in view modal
 */
function switchTab(tabName) {
  // Remove active class from all tabs and contents
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

  // Add active class to selected tab
  const tabBtn = event?.target || document.querySelector(`[onclick="switchTab('${tabName}')"]`);
  if (tabBtn) {
    tabBtn.classList.add('active');
  }

  // Show selected content
  const contentId = tabName + 'Tab';
  const content = document.getElementById(contentId);
  if (content) {
    content.classList.add('active');
  }
}

/**
 * Edit patient
 */
function editPatient(patientId) {
  const patient = patients.find(p => p.id === patientId);
  if (!patient) {
    showNotification('Patient not found!', 'error');
    return;
  }

  currentEditId = patientId;

  // Update modal title
  document.getElementById('modalTitle').textContent = 'Edit Patient';

  // Populate form fields
  document.getElementById('patientId').value = patient.id;
  document.getElementById('firstName').value = patient.firstName;
  document.getElementById('lastName').value = patient.lastName;
  document.getElementById('gender').value = patient.gender;
  document.getElementById('dob').value = patient.dob;
  document.getElementById('contact').value = patient.contact;
  document.getElementById('email').value = patient.email || '';
  document.getElementById('address').value = patient.address || '';

  // Populate manager-only fields if user is manager
  if (getUserRole() === 'manager') {
    document.getElementById('allergies').value = patient.medicalHistory?.allergies || '';
    document.getElementById('conditions').value = patient.medicalHistory?.conditions || '';
    document.getElementById('medications').value = patient.medicalHistory?.medications || '';
    document.getElementById('notes').value = patient.medicalHistory?.notes || '';
    document.getElementById('assignedDentist').value = patient.assignedDentist || '';
    document.getElementById('status').value = patient.status || 'active';
  }

  // Show modal
  const modal = document.getElementById('patientModal');
  modal.setAttribute('aria-hidden', 'false');
}

/**
 * Delete patient
 */
function deletePatient(patientId) {
  const patient = patients.find(p => p.id === patientId);
  if (!patient) {
    showNotification('Patient not found!', 'error');
    return;
  }

  // Only managers can delete
  if (getUserRole() !== 'manager') {
    showNotification('Only managers can delete patients!', 'error');
    return;
  }

  currentDeleteId = patientId;

  // Show patient name in delete modal
  document.getElementById('deletePatientName').textContent = `${patient.firstName} ${patient.lastName}`;

  // Show delete confirmation modal
  const modal = document.getElementById('deleteModal');
  modal.setAttribute('aria-hidden', 'false');
}

/**
 * Close Delete Modal
 */
function closeDeleteModal() {
  const modal = document.getElementById('deleteModal');
  modal.setAttribute('aria-hidden', 'true');
  currentDeleteId = null;
}

/**
 * Confirm delete
 */
function confirmDelete() {
  if (!currentDeleteId) return;

  const patient = patients.find(p => p.id === currentDeleteId);
  const patientName = patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown';

  // Remove patient from array
  patients = patients.filter(p => p.id !== currentDeleteId);

  savePatients();
  filterPatients();
  closeDeleteModal();

  showNotification('Patient deleted successfully!', 'success');
  logActivity('DELETE', 'Patient', currentDeleteId, `Deleted patient: ${patientName}`);

  currentDeleteId = null;
}

/**
 * Toggle bulk delete mode
 */
function toggleBulkDelete() {
  bulkDeleteMode = !bulkDeleteMode;

  const body = document.body;
  const selectAll = document.getElementById('selectAll');
  const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');

  if (bulkDeleteMode) {
    body.classList.add('bulk-delete-active');
    bulkDeleteBtn.textContent = 'Delete Selected';
    bulkDeleteBtn.style.background = 'var(--error)';
    bulkDeleteBtn.style.color = 'white';
  } else {
    body.classList.remove('bulk-delete-active');
    bulkDeleteBtn.textContent = 'Bulk Delete';
    bulkDeleteBtn.style.background = '';
    bulkDeleteBtn.style.color = '';
    selectAll.checked = false;

    // Uncheck all checkboxes
    document.querySelectorAll('.patient-checkbox').forEach(cb => cb.checked = false);
  }

  // If in bulk delete mode, delete selected patients
  if (bulkDeleteMode) {
    const selectedIds = Array.from(document.querySelectorAll('.patient-checkbox:checked'))
      .map(cb => cb.getAttribute('data-id'));

    if (selectedIds.length > 0) {
      if (confirm(`Are you sure you want to delete ${selectedIds.length} patient(s)?`)) {
        patients = patients.filter(p => !selectedIds.includes(p.id));
        savePatients();
        filterPatients();
        showNotification(`${selectedIds.length} patient(s) deleted successfully!`, 'success');
        logActivity('DELETE', 'Patients', null, `Bulk deleted ${selectedIds.length} patients`);
      }
    }

    bulkDeleteMode = false;
    body.classList.remove('bulk-delete-active');
    bulkDeleteBtn.textContent = 'Bulk Delete';
    bulkDeleteBtn.style.background = '';
    bulkDeleteBtn.style.color = '';
  }
}

/**
 * Toggle select all checkboxes
 */
function toggleSelectAll(checkbox) {
  const checkboxes = document.querySelectorAll('.patient-checkbox');
  checkboxes.forEach(cb => {
    cb.checked = checkbox.checked;
  });
}

/**
 * Export patients to CSV
 */
function exportPatientsToCSV() {
  // Only managers can export
  if (getUserRole() !== 'manager') {
    showNotification('Only managers can export patient data!', 'error');
    return;
  }

  if (patients.length === 0) {
    showNotification('No patients to export!', 'warning');
    return;
  }

  // Define CSV headers
  const headers = [
    'Patient ID',
    'First Name',
    'Last Name',
    'Gender',
    'Date of Birth',
    'Age',
    'Contact Number',
    'Email',
    'Address',
    'Status',
    'Last Visit',
    'Assigned Dentist',
    'Allergies',
    'Medical Conditions',
    'Current Medications',
    'Notes'
  ];

  // Convert patients to CSV rows
  const rows = filteredPatients.map(p => [
    p.id,
    p.firstName,
    p.lastName,
    p.gender,
    p.dob,
    calculateAge(p.dob),
    p.contact,
    p.email || '',
    p.address || '',
    p.status,
    p.lastVisit || '',
    p.assignedDentist || '',
    p.medicalHistory?.allergies || 'None',
    p.medicalHistory?.conditions || 'None',
    p.medicalHistory?.medications || 'None',
    p.medicalHistory?.notes || ''
  ]);

  // Combine headers and rows
  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `patients_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);

  showNotification('Patient data exported successfully!', 'success');
  logActivity('EXPORT', 'Patients', null, `Exported ${filteredPatients.length} patient records to CSV`);
}

/**
 * Log activity to audit logs
 */
function logActivity(action, target, targetId, details) {
  const logs = JSON.parse(localStorage.getItem('clinic_logs') || '[]');

  const user = getCurrentUser();
  if (!user) return;

  const log = {
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toISOString(),
    user: user.username,
    userName: user.name,
    action: action,
    target: target,
    targetId: targetId,
    targetName: target,
    details: details,
    ipAddress: null
  };

  logs.push(log);
  localStorage.setItem('clinic_logs', JSON.stringify(logs));
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPatients);
} else {
  initPatients();
}

// Make functions globally accessible
window.openAddPatientModal = openAddPatientModal;
window.closePatientModal = closePatientModal;
window.savePatient = savePatient;
window.viewPatient = viewPatient;
window.closeViewPatientModal = closeViewPatientModal;
window.editPatientFromView = editPatientFromView;
window.switchTab = switchTab;
window.editPatient = editPatient;
window.deletePatient = deletePatient;
window.closeDeleteModal = closeDeleteModal;
window.confirmDelete = confirmDelete;
window.filterPatients = filterPatients;
window.resetFilters = resetFilters;
window.toggleBulkDelete = toggleBulkDelete;
window.toggleSelectAll = toggleSelectAll;
window.exportPatientsToCSV = exportPatientsToCSV;
