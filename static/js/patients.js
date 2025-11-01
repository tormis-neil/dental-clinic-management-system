/**
 * patients.js - Patient Management Module
 *
 * Handles patient list display, CRUD operations, filtering, and role-based access control.
 *
 * Features:
 * - Display patient list with search and filters
 * - Add/Edit/Delete patient records (role-based permissions)
 * - Data validation and XSS protection
 * - CSV export functionality for managers
 * - Real-time notifications for user actions
 *
 * @author Kit & Dom's Dental Clinic
 * @version 1.1
 * @date 2025-10-31
 */

/* ========================
   INITIALIZATION & DATA
   ======================== */
let currentRole = 'manager'; // default (manager or staff)
document.body.setAttribute('data-role', currentRole);

const demoPatients = [
  { id: 'PT-0001', lastName:'Cruz', firstName:'Jane', gender:'Female', birth:'1995-06-12', contact:'09171234567', lastVisit:'2025-10-18', status:'active', notes:'Routine cleaning' },
  { id: 'PT-0002', lastName:'Dela Cruz', firstName:'Peter', gender:'Male', birth:'1980-02-01', contact:'09179876543', lastVisit:'2025-10-10', status:'active', notes:'Filling' },
  { id: 'PT-0003', lastName:'Garcia', firstName:'Anna', gender:'Female', birth:'2004-11-20', contact:'09170001111', lastVisit:'2024-12-05', status:'inactive', notes:'Moved away' },
  { id: 'PT-0004', lastName:'Doe', firstName:'John', gender:'Male', birth:'1972-08-08', contact:'09171112222', lastVisit:'2025-09-01', status:'active', notes:'Root canal' }
];

let patients = JSON.parse(JSON.stringify(demoPatients)); // working copy
let selectedIds = new Set();

/* ========================
   ROLE MANAGEMENT
   ======================== */

/**
 * Switches between manager and staff role views
 * Adjusts UI permissions and available features based on role
 * @param {string} role - 'manager' or 'staff'
 */
function switchRole(role){
  currentRole = role;
  document.body.setAttribute('data-role', role);
  document.getElementById('managerBtn').classList.toggle('active', role==='manager');
  document.getElementById('staffBtn').classList.toggle('active', role==='staff');

  // UI adjustments: hide manager-only elements for staff
  document.querySelectorAll('.manager-only').forEach(el=>{
    el.style.display = (role==='manager') ? '' : 'none';
  });

  // update user info
  if(role==='manager'){
    document.getElementById('userName').textContent = 'Dr. Maria Santos';
    document.getElementById('userRole').textContent = 'Manager / Dentist';
    document.getElementById('userAvatar').textContent = 'MS';
    document.getElementById('globalSearchWrap').style.display = '';
  } else {
    document.getElementById('userName').textContent = 'Carla Reyes';
    document.getElementById('userRole').textContent = 'Staff';
    document.getElementById('userAvatar').textContent = 'CR';
    document.getElementById('globalSearchWrap').style.display = 'none';
  }

  renderTable();
}

/**
 * Toggles sidebar collapsed/expanded state
 */
function toggleSidebar(){
  document.getElementById('sidebar').classList.toggle('collapsed');
  document.getElementById('mainContent').classList.toggle('expanded');
}

/* ========================
   UTILITY FUNCTIONS
   ======================== */

/**
 * Calculates age from date of birth
 * @param {string} dob - Date of birth in YYYY-MM-DD format
 * @returns {number} Age in years
 */
function ageFromDOB(dob){
  if(!dob) return '';
  const b = new Date(dob);
  const diff = Date.now() - b.getTime();
  const age = Math.floor(diff / (1000*60*60*24*365.25));
  return age;
}

/* ========================
   TABLE RENDERING
   ======================== */

/**
 * Renders the patient table with current data
 * Displays different columns based on user role
 * All user data is escaped to prevent XSS attacks
 */
function renderTable(){
  const table = document.getElementById('patientsTable');
  const cols = currentRole==='manager'
    ? ['Select','Patient ID','Full Name','Gender','Age','Contact','Last Visit','Status','Actions']
    : ['Patient ID','Full Name','Gender','Age','Contact','Last Visit','Status','Actions'];

  // header
  const thead = `<thead><tr>${cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead>`;

  // body
  const bodyRows = patients.map(p=>{
    const fullName = `${escapeHtml(p.firstName)} ${escapeHtml(p.lastName)}`;
    const age = ageFromDOB(p.birth);
    const rowSelect = `<td style="width:56px"><input type="checkbox" onchange="toggleSelect('${escapeHtml(p.id)}',this)" ${selectedIds.has(p.id)?'checked':''} /></td>`;
    const idCell = `<td class="record-id">${escapeHtml(p.id)}</td>`;
    const nameCell = `<td><strong>${escapeHtml(p.firstName)} ${escapeHtml(p.lastName)}</strong></td>`;
    const genderCell = `<td>${escapeHtml(p.gender)}</td>`;
    const ageCell = `<td>${age}</td>`;
    const contactCell = `<td>${escapeHtml(p.contact)}</td>`;
    const visitCell = `<td>${p.lastVisit ? escapeHtml(p.lastVisit) : '—'}</td>`;
    const statusCell = `<td><span class="badge ${p.status==='active'?'active':'inactive'}">${p.status==='active'?'Active':'Inactive'}</span></td>`;

    const viewBtn = `<button class="icon-view" title="View" onclick="openViewModal('${p.id}')">
      <!-- Lucide: eye -->
      <svg viewBox="0 0 24 24" stroke="#64748B" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    </button>`;

    const editBtn = `<button class="icon-edit" title="Edit" onclick="openEditModal('${p.id}')">
      <!-- Lucide: edit -->
      <svg viewBox="0 0 24 24" stroke="#64748B" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
    </button>`;

    const deleteBtn = `<button class="icon-delete manager-only" title="Delete" onclick="confirmDelete('${p.id}')">
      <!-- Lucide: trash-2 -->
      <svg viewBox="0 0 24 24" stroke="#EF4444" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
    </button>`;

    const actionCell = `<td class="action-icons">${viewBtn}${editBtn}${deleteBtn}</td>`;

    if(currentRole==='manager'){
      return `<tr>${rowSelect}${idCell}${nameCell}${genderCell}${ageCell}${contactCell}${visitCell}${statusCell}${actionCell}</tr>`;
    } else {
      return `<tr>${idCell}${nameCell}${genderCell}${ageCell}${contactCell}${visitCell}${statusCell}${actionCell}</tr>`;
    }
  }).join('');

  const tbody = `<tbody>${bodyRows || `<tr><td colspan="${cols.length}" class="empty-state">No patients found. Click Add New Patient to create one.</td></tr>`}</tbody>`;

  table.innerHTML = thead + tbody;
  document.getElementById('recordsCount').textContent = patients.length;
  // hide manager-only elements if staff
  document.querySelectorAll('.manager-only').forEach(el=>{
    el.style.display = (currentRole==='manager') ? '' : 'none';
  });
}

/* ========================
   SELECTION MANAGEMENT
   ======================== */

/**
 * Handles patient row selection/deselection
 * @param {string} id - Patient ID
 * @param {HTMLInputElement} checkbox - Checkbox element
 */
function toggleSelect(id, checkbox){
  if(checkbox.checked) selectedIds.add(id); else selectedIds.delete(id);
}

/* ========================
   FILTERING & SEARCH
   ======================== */
document.getElementById('searchInput').addEventListener('input', applyFilters);
document.getElementById('genderFilter').addEventListener('change', applyFilters);
document.getElementById('statusFilter').addEventListener('change', applyFilters);
document.getElementById('globalSearch').addEventListener('input', function(e){
  const q = e.target.value.trim().toLowerCase();
  if(q.length < 3){ renderTable(); return; }
  const hits = patients.filter(p => `${p.firstName} ${p.lastName} ${p.id} ${p.contact}`.toLowerCase().includes(q));
  renderFiltered(hits);
});

function applyFilters(){
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  const gender = document.getElementById('genderFilter').value;
  const status = document.getElementById('statusFilter').value;

  let results = demoPatients.slice();
  if(q) results = results.filter(p => (`${p.firstName} ${p.lastName} ${p.id}`).toLowerCase().includes(q));
  if(gender) results = results.filter(p => p.gender === gender);
  if(status) results = results.filter(p => p.status === status);
  patients = results;
  selectedIds.clear();
  renderTable();
}

function renderFiltered(list){
  patients = list;
  selectedIds.clear();
  renderTable();
}

function resetFilters(){ document.getElementById('searchInput').value=''; document.getElementById('genderFilter').value=''; document.getElementById('statusFilter').value=''; patients = demoPatients.slice(); selectedIds.clear(); renderTable(); }

/* ========================
   MODAL OPERATIONS
   ======================== */

/**
 * Opens modal to view patient details
 * @param {string} id - Patient ID
 */
const backdrop = document.getElementById('modalBackdrop');
const modalEl = document.getElementById('modal');

function openViewModal(id){
  const p = patients.find(x=>x.id===id) || demoPatients.find(x=>x.id===id);
  if(!p) return alert('Patient not found');
  modalEl.innerHTML = `
    <h3 id="modalTitle">Patient Details</h3>
    <div class="row">
      <div><label>Patient ID</label><div class="muted">${escapeHtml(p.id)}</div></div>
      <div><label>Full Name</label><div><strong>${escapeHtml(p.firstName)} ${escapeHtml(p.lastName)}</strong></div></div>
    </div>
    <div class="row">
      <div><label>Gender</label><div class="muted">${escapeHtml(p.gender)}</div></div>
      <div><label>Age</label><div class="muted">${ageFromDOB(p.birth)}</div></div>
    </div>
    <div class="row">
      <div><label>Contact</label><div class="muted">${escapeHtml(p.contact)}</div></div>
      <div><label>Last Visit</label><div class="muted">${p.lastVisit ? escapeHtml(p.lastVisit) : '—'}</div></div>
    </div>
    <div style="margin-top:8px"><label>Notes</label><div class="muted">${escapeHtml(p.notes || '—')}</div></div>
    <div class="modal-footer">
      <button class="secondary-btn" onclick="closeModal()">Close</button>
      ${currentRole==='manager' ? `<button class="secondary-btn" onclick="openEditModal('${escapeHtml(p.id)}')">Edit</button>` : ''}
    </div>
  `;
  openBackdrop();
}

 function openAddModal(){
  const isManager = currentRole === 'manager';
  modalEl.innerHTML = `
    <h3 id="modalTitle">Add New Patient</h3>
    <div class="row">
      <div><label>First Name</label><input id="m_firstName" required /></div>
      <div><label>Last Name</label><input id="m_lastName" required /></div>
    </div>
    <div class="row">
      <div><label>Gender</label>
        <select id="m_gender">
          <option>Female</option><option>Male</option><option>Other</option>
        </select>
      </div>
      <div><label>Date of Birth</label><input id="m_dob" type="date" /></div>
    </div>
    <div class="row">
      <div><label>Contact</label><input id="m_contact" /></div>
      <div><label>Address</label><input id="m_address" placeholder="e.g. Makati City" /></div>
    </div>

    ${isManager ? `
    <div class="row">
      <div><label>Medical History</label><textarea id="m_medical" placeholder="e.g. Allergic to anesthesia"></textarea></div>
      <div><label>Diagnosis / Notes</label><textarea id="m_notes" placeholder="e.g. Requires crown procedure"></textarea></div>
    </div>
    <div class="row">
      <div><label>Assigned Dentist</label><input id="m_assigned" value="Dr. Maria Santos" /></div>
      <div><label>Last Visit</label><input id="m_lastVisit" type="date" /></div>
      <div><label>Status</label>
        <select id="m_status">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>
    ` : `
    <div class="row">
      <div><label>Intake Notes</label><textarea id="m_notes" placeholder="Optional notes (e.g. New patient intake)"></textarea></div>
    </div>
    `}

    <div class="modal-footer">
      <button class="secondary-btn" onclick="closeModal()">Cancel</button>
      <button class="primary-btn" onclick="${isManager ? 'saveNewPatient()' : 'submitForReview()'}">
        ${isManager ? 'Save' : 'Submit for Review'}
      </button>
    </div>
  `;
  openBackdrop();
}


function openEditModal(id) {
  const p = patients.find(x => x.id === id);
  if (!p) return alert('Patient not found');

  const isManager = currentRole === 'manager';
  modalEl.innerHTML = `
    <h3 id="modalTitle">Edit Patient</h3>
    <div class="row">
      <div><label>First Name</label><input id="m_firstName" value="${escapeHtml(p.firstName)}" required /></div>
      <div><label>Last Name</label><input id="m_lastName" value="${escapeHtml(p.lastName)}" required /></div>
    </div>
    <div class="row">
      <div><label>Gender</label>
        <select id="m_gender">
          <option ${p.gender==='Female'?'selected':''}>Female</option>
          <option ${p.gender==='Male'?'selected':''}>Male</option>
          <option ${p.gender==='Other'?'selected':''}>Other</option>
        </select>
      </div>
      <div><label>Date of Birth</label><input id="m_dob" type="date" value="${escapeHtml(p.birth)}" /></div>
    </div>
    <div class="row">
      <div><label>Contact</label><input id="m_contact" value="${escapeHtml(p.contact)}" /></div>
      <div><label>Address</label><input id="m_address" value="${escapeHtml(p.address || '')}" /></div>
      <div><label>Last Visit</label><input id="m_lastVisit" type="date" value="${escapeHtml(p.lastVisit || '')}" /></div>
    </div>

    ${isManager ? `
    <div class="row">
      <div><label>Medical History</label><textarea id="m_medical">${escapeHtml(p.medical || '')}</textarea></div>
      <div><label>Diagnosis / Notes</label><textarea id="m_notes">${escapeHtml(p.notes || '')}</textarea></div>
    </div>
    <div class="row">
      <div><label>Assigned Dentist</label><input id="m_assigned" value="${escapeHtml(p.assigned || 'Dr. Maria Santos')}" /></div>
      <div><label>Status</label>
        <select id="m_status">
          <option value="active" ${p.status==='active'?'selected':''}>Active</option>
          <option value="inactive" ${p.status==='inactive'?'selected':''}>Inactive</option>
        </select>
      </div>
    </div>
    ` : `
    <div class="row">
      <div><label>Notes</label><textarea id="m_notes">${escapeHtml(p.notes || '')}</textarea></div>
    </div>
    `}

    <div class="modal-footer">
      <button class="secondary-btn" onclick="closeModal()">Cancel</button>
      <button class="primary-btn" onclick="saveEditPatient('${escapeHtml(p.id)}')">Save Changes</button>
    </div>
  `;
  openBackdrop();
}

/* ========================
   CRUD OPERATIONS - CREATE/UPDATE
   ======================== */

/**
 * Saves a new patient record (Manager only)
 * Validates all required fields and data formats
 */
function saveNewPatient(){
  const firstName = document.getElementById('m_firstName').value.trim();
  const lastName = document.getElementById('m_lastName').value.trim();
  const contact = document.getElementById('m_contact').value.trim();

  // Enhanced validation with specific messages
  if(!firstName && !lastName){
    showNotification('Please enter patient name (First Name and Last Name are required).', 'error');
    return;
  }
  if(!firstName){
    showNotification('First Name is required.', 'error');
    return;
  }
  if(!lastName){
    showNotification('Last Name is required.', 'error');
    return;
  }

  // Validate name format (letters, spaces, hyphens only)
  const namePattern = /^[a-zA-Z\s\-']+$/;
  if(!namePattern.test(firstName)){
    showNotification('First Name can only contain letters, spaces, hyphens, and apostrophes.', 'error');
    return;
  }
  if(!namePattern.test(lastName)){
    showNotification('Last Name can only contain letters, spaces, hyphens, and apostrophes.', 'error');
    return;
  }

  // Validate phone number format (optional but if provided, must be valid)
  if(contact && !/^[0-9\-\+\(\)\s]+$/.test(contact)){
    showNotification('Please enter a valid phone number.', 'error');
    return;
  }

  const newPatient = {
    id: generateId(),
    firstName,
    lastName,
    gender: document.getElementById('m_gender').value,
    birth: document.getElementById('m_dob').value,
    contact: contact,
    address: document.getElementById('m_address').value,
    medical: document.getElementById('m_medical') ? document.getElementById('m_medical').value : '',
    notes: document.getElementById('m_notes').value,
    assigned: document.getElementById('m_assigned') ? document.getElementById('m_assigned').value : '',
    status: document.getElementById('m_status') ? document.getElementById('m_status').value : 'active',
    lastVisit: document.getElementById('m_lastVisit') ? document.getElementById('m_lastVisit').value : ''
  };

  demoPatients.unshift(newPatient);
  patients = demoPatients.slice();
  closeModal();
  renderTable();
  showNotification(`✓ Patient "${firstName} ${lastName}" added successfully!`, 'success');
}


function submitForReview(){
  const firstName = document.getElementById('m_firstName').value.trim();
  const lastName = document.getElementById('m_lastName').value.trim();

  // Enhanced validation
  if(!firstName && !lastName){
    showNotification('Please enter patient name (First Name and Last Name are required).', 'error');
    return;
  }
  if(!firstName){
    showNotification('First Name is required.', 'error');
    return;
  }
  if(!lastName){
    showNotification('Last Name is required.', 'error');
    return;
  }

  // Validate name format
  const namePattern = /^[a-zA-Z\s\-']+$/;
  if(!namePattern.test(firstName) || !namePattern.test(lastName)){
    showNotification('Names can only contain letters, spaces, hyphens, and apostrophes.', 'error');
    return;
  }

  const newPatient = {
    id: generateId(),
    firstName,
    lastName,
    gender: document.getElementById('m_gender').value,
    birth: document.getElementById('m_dob').value,
    contact: document.getElementById('m_contact').value,
    address: document.getElementById('m_address').value,
    notes: document.getElementById('m_notes').value,
    status: 'pending-review'
  };

  demoPatients.unshift(newPatient);
  patients = demoPatients.slice();
  closeModal();
  renderTable();
  showNotification(`✓ Patient "${firstName} ${lastName}" submitted for manager review.`, 'success');
}


function saveEditPatient(id){
  const p = demoPatients.find(x=>x.id===id);
  if(!p){
    showNotification('Patient record not found.', 'error');
    return;
  }

  const firstName = document.getElementById('m_firstName').value.trim();
  const lastName = document.getElementById('m_lastName').value.trim();

  // Enhanced validation
  if(!firstName && !lastName){
    showNotification('Please enter patient name (First Name and Last Name are required).', 'error');
    return;
  }
  if(!firstName){
    showNotification('First Name is required.', 'error');
    return;
  }
  if(!lastName){
    showNotification('Last Name is required.', 'error');
    return;
  }

  // Validate name format
  const namePattern = /^[a-zA-Z\s\-']+$/;
  if(!namePattern.test(firstName) || !namePattern.test(lastName)){
    showNotification('Names can only contain letters, spaces, hyphens, and apostrophes.', 'error');
    return;
  }

  p.firstName = firstName;
  p.lastName = lastName;
  p.gender = document.getElementById('m_gender').value;
  p.birth = document.getElementById('m_dob').value;
  p.contact = document.getElementById('m_contact').value;
  p.lastVisit = document.getElementById('m_lastVisit').value;
  p.notes = document.getElementById('m_notes').value;
  patients = demoPatients.slice();
  closeModal();
  renderTable();
  showNotification(`✓ Changes saved for "${firstName} ${lastName}".`, 'success');
}

/* ========================
   CRUD OPERATIONS - DELETE
   ======================== */

/**
 * Deletes a single patient record with confirmation
 * Manager permission required
 * @param {string} id - Patient ID to delete
 */
function confirmDelete(id){
  if(currentRole !== 'manager'){
    showNotification('You do not have permission to delete records.', 'error');
    return;
  }

  const patient = demoPatients.find(p => p.id === id);
  if(!patient){
    showNotification('Patient record not found.', 'error');
    return;
  }

  const patientName = `${patient.firstName} ${patient.lastName}`;
  if(!confirm(`Are you sure you want to delete ${patientName}?\n\nThis action cannot be undone.`)){
    return;
  }

  demoPatients = demoPatients.filter(p=>p.id !== id);
  patients = demoPatients.slice();
  selectedIds.delete(id);
  renderTable();
  showNotification(`✓ Patient "${patientName}" deleted successfully.`, 'success');
}

function deleteSelected(){
  if(currentRole !== 'manager'){
    showNotification('You do not have permission to delete records.', 'error');
    return;
  }

  if(selectedIds.size === 0){
    showNotification('Please select at least one patient to delete.', 'error');
    return;
  }

  const count = selectedIds.size; // Save count before clearing
  if(!confirm(`Are you sure you want to delete ${count} selected patient(s)?\n\nThis action cannot be undone.`)){
    return;
  }

  demoPatients = demoPatients.filter(p => !selectedIds.has(p.id));
  patients = demoPatients.slice();
  selectedIds.clear();
  renderTable();
  showNotification(`✓ ${count} patient(s) deleted successfully.`, 'success');
}

/* ========================
   DATA EXPORT
   ======================== */

/**
 * Exports all patient data to CSV file
 * Manager permission required
 * File includes timestamp in filename
 */
function exportCSV(){
  if(currentRole !== 'manager'){
    showNotification('You do not have permission to export data.', 'error');
    return;
  }

  if(demoPatients.length === 0){
    showNotification('No patient records to export.', 'error');
    return;
  }

  try {
    const headers = ['Patient ID','First Name','Last Name','Gender','DOB','Contact','Last Visit','Status','Notes'];
    const rows = demoPatients.map(p => [p.id, p.firstName, p.lastName, p.gender, p.birth || '', p.contact || '', p.lastVisit || '', p.status, (p.notes||'')]);
    const csv = [headers, ...rows].map(r => r.map(field => `"${String(field).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patients_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showNotification(`✓ Exported ${demoPatients.length} patient records to CSV.`, 'success');
  } catch(error){
    showNotification('Failed to export data. Please try again.', 'error');
  }
}

/* ========================
   HELPER FUNCTIONS
   ======================== */

/**
 * Generates a unique patient ID
 * @returns {string} Patient ID in format PT-XXXX
 */
function generateId(){
  const n = Math.floor(Math.random()*9000)+1000;
  return `PT-${n}`;
}
/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param {string} s - String to escape
 * @returns {string} Escaped string safe for HTML insertion
 */
function escapeHtml(s){
  return String(s||'').replace(/[&<>"']/g, c=>({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#39;'
  })[c]);
}

/* ========================
   NAVIGATION
   ======================== */

/**
 * Navigates to different pages in the application
 * @param {string} page - Page identifier (dashboard, patients, team, etc.)
 */
function navigateTo(page){
  const pageMap = {
    'dashboard': '../pages/dashboard.html',
    'patients': '../pages/patients.html',
    'team': '../pages/staff-management.html',
    'logs': '../pages/audit-logs.html',
    'backup': '../pages/backup-restore.html',
    'settings': '../pages/settings.html'
  };

  if(pageMap[page]){
    window.location.href = pageMap[page];
  } else {
    window.location.href = '../pages/coming-soon.html';
  }
}

function toggleUserMenu(){
  // Future: implement user menu dropdown
  alert('User menu');
}

/* ========================
   MODAL CONTROLS
   ======================== */

/**
 * Opens the modal backdrop
 */
function openBackdrop() {
  backdrop.style.display = 'flex';
}

function closeModal(event) {
  if (!event || event.target === backdrop) {
    backdrop.style.display = 'none';
    modalEl.innerHTML = '';
  }
}

/* ========================
   NOTIFICATION SYSTEM
   ======================== */

/**
 * Displays a toast notification to the user
 * Success messages auto-dismiss after 4 seconds
 * @param {string} message - Message to display
 * @param {string} type - 'success', 'error', or 'info'
 */
function showNotification(message, type = 'info'){
  // Remove any existing notification
  const existing = document.querySelector('.notification-toast');
  if(existing) existing.remove();

  // Create notification element
  const toast = document.createElement('div');
  toast.className = `notification-toast notification-${type}`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');

  const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
  toast.innerHTML = `
    <span class="notification-icon">${icon}</span>
    <span class="notification-message">${escapeHtml(message)}</span>
    <button class="notification-close" onclick="this.parentElement.remove()" aria-label="Close notification">×</button>
  `;

  document.body.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);

  // Auto-dismiss success messages after 4 seconds
  if(type === 'success'){
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}

/* ========================
   INITIALIZATION
   ======================== */
renderTable();

// Expose for debugging in browser console
// Usage: window._patients to view current patient data
// Usage: window.switchRole('manager') or window.switchRole('staff')
window._patients = patients;
window.switchRole = switchRole;
