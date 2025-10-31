/* patients.js — standalone demo logic (no CSV export) */

/* -------------------------
   Demo data + state
   ------------------------- */
let currentRole = 'manager';
document.body.setAttribute('data-role', currentRole);

let demoPatients = [
  { id: 'PT-0001', lastName:'Cruz', firstName:'Jane', gender:'Female', birth:'1995-06-12', contact:'09171234567', lastVisit:'2025-10-18', status:'active', notes:'Routine cleaning' },
  { id: 'PT-0002', lastName:'Dela Cruz', firstName:'Peter', gender:'Male', birth:'1980-02-01', contact:'09179876543', lastVisit:'2025-10-10', status:'active', notes:'Filling' },
  { id: 'PT-0003', lastName:'Garcia', firstName:'Anna', gender:'Female', birth:'2004-11-20', contact:'09170001111', lastVisit:'2024-12-05', status:'inactive', notes:'Moved away' },
  { id: 'PT-0004', lastName:'Doe', firstName:'John', gender:'Male', birth:'1972-08-08', contact:'09171112222', lastVisit:'2025-09-01', status:'active', notes:'Root canal' }
];

let patients = demoPatients.slice(); // working copy
let selectedIds = new Set();

/* -------------------------
   Utilities
   ------------------------- */
function ageFromDOB(dob){
  if(!dob) return '';
  const b = new Date(dob);
  const diff = Date.now() - b.getTime();
  const age = Math.floor(diff / (1000*60*60*24*365.25));
  return age;
}
function generateId(){
  const n = Math.floor(Math.random()*9000)+1000;
  return `PT-${n}`;
}

/* -------------------------
   Rendering
   ------------------------- */
function renderTable(){
  const table = document.getElementById('patientsTable');
  const cols = currentRole==='manager'
    ? ['Select','Patient ID','Full Name','Gender','Age','Contact','Last Visit','Status','Actions']
    : ['Patient ID','Full Name','Gender','Age','Contact','Last Visit','Status','Actions'];

  // header
  const thead = `<thead><tr>${cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead>`;

  // body
  const bodyRows = patients.map(p=>{
    const fullName = `${p.firstName} ${p.lastName}`;
    const age = ageFromDOB(p.birth);
    const rowSelect = `<td style="width:56px"><input type="checkbox" onchange="toggleSelect('${p.id}',this)" ${selectedIds.has(p.id)?'checked':''} aria-label="Select ${p.id}" /></td>`;
    const idCell = `<td class="record-id">${p.id}</td>`;
    const nameCell = `<td><strong>${p.firstName} ${p.lastName}</strong></td>`;
    const genderCell = `<td>${p.gender}</td>`;
    const ageCell = `<td>${age}</td>`;
    const contactCell = `<td>${p.contact}</td>`;
    const visitCell = `<td>${p.lastVisit || '—'}</td>`;
    const statusCell = `<td><span class="badge ${p.status==='active'?'active':'inactive'}">${p.status==='active'?'Active':'Inactive'}</span></td>`;

    const viewBtn = `<button class="icon-view" title="View" onclick="openViewModal('${p.id}')" aria-label="View ${p.id}">
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
    </button>`;

    const editBtn = `<button class="icon-edit" title="Edit" onclick="openEditModal('${p.id}')" aria-label="Edit ${p.id}">
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
    </button>`;

    const deleteBtn = `<button class="icon-delete manager-only" title="Delete" onclick="confirmDelete('${p.id}')" aria-label="Delete ${p.id}">
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
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

/* -------------------------
   Selection
   ------------------------- */
function toggleSelect(id, checkbox){
  if(checkbox.checked) selectedIds.add(id); else selectedIds.delete(id);
}

/* -------------------------
   Filters + Search
   ------------------------- */
document.getElementById('searchInput').addEventListener('input', applyFilters);
document.getElementById('genderFilter').addEventListener('change', applyFilters);
document.getElementById('statusFilter').addEventListener('change', applyFilters);
document.getElementById('globalSearch').addEventListener('input', function(e){
  const q = e.target.value.trim().toLowerCase();
  if(q.length < 3){ patients = demoPatients.slice(); renderTable(); return; }
  const hits = demoPatients.filter(p => (`${p.firstName} ${p.lastName} ${p.id} ${p.contact}`).toLowerCase().includes(q));
  patients = hits;
  selectedIds.clear();
  renderTable();
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

function resetFilters(){
  document.getElementById('searchInput').value = '';
  document.getElementById('genderFilter').value = '';
  document.getElementById('statusFilter').value = '';
  patients = demoPatients.slice();
  selectedIds.clear();
  renderTable();
}

/* -------------------------
   Modals: View / Add / Edit
   ------------------------- */
const backdrop = document.getElementById('modalBackdrop');
const modalEl = document.getElementById('modal');

function openViewModal(id){
  const p = patients.find(x=>x.id===id) || demoPatients.find(x=>x.id===id);
  if(!p) return alert('Patient not found');
  modalEl.innerHTML = `
    <h3 id="modalTitle">Patient Details</h3>
    <div class="row">
      <div><label>Patient ID</label><div class="muted">${p.id}</div></div>
      <div><label>Full Name</label><div><strong>${p.firstName} ${p.lastName}</strong></div></div>
    </div>
    <div class="row">
      <div><label>Gender</label><div class="muted">${p.gender}</div></div>
      <div><label>Age</label><div class="muted">${ageFromDOB(p.birth)}</div></div>
    </div>
    <div class="row">
      <div><label>Contact</label><div class="muted">${p.contact}</div></div>
      <div><label>Last Visit</label><div class="muted">${p.lastVisit || '—'}</div></div>
    </div>
    <div style="margin-top:8px"><label>Notes</label><div class="muted">${p.notes || '—'}</div></div>
    <div class="modal-footer">
      <button class="secondary-btn" onclick="closeModal()">Close</button>
      ${currentRole==='manager' ? `<button class="secondary-btn" onclick="openEditModal('${p.id}')">Edit</button>` : ''}
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
        <select id="m_gender"><option>Female</option><option>Male</option><option>Other</option></select>
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
      <div><label>Diagnosis / Notes</label><textarea id="m_notes" placeholder="e.g. Requires crown"></textarea></div>
    </div>
    <div class="row">
      <div><label>Assigned Dentist</label><input id="m_assigned" value="Dr. Maria Santos" /></div>
      <div><label>Last Visit</label><input id="m_lastVisit" type="date" /></div>
      <div><label>Status</label>
        <select id="m_status"><option value="active">Active</option><option value="inactive">Inactive</option></select>
      </div>
    </div>
    ` : `
    <div class="row">
      <div><label>Intake Notes</label><textarea id="m_notes" placeholder="Optional notes"></textarea></div>
    </div>
    `}

    <div class="modal-footer">
      <button class="secondary-btn" onclick="closeModal()">Cancel</button>
      <button class="primary-btn" onclick="${isManager ? 'saveNewPatient()' : 'submitForReview()'}">${isManager ? 'Save' : 'Submit for Review'}</button>
    </div>
  `;
  openBackdrop();
}

function openEditModal(id){
  const p = demoPatients.find(x=>x.id===id);
  if(!p) return alert('Patient not found');
  const isManager = currentRole === 'manager';
  modalEl.innerHTML = `
    <h3 id="modalTitle">Edit Patient</h3>
    <div class="row">
      <div><label>First Name</label><input id="m_firstName" value="${p.firstName}" required /></div>
      <div><label>Last Name</label><input id="m_lastName" value="${p.lastName}" required /></div>
    </div>
    <div class="row">
      <div><label>Gender</label>
        <select id="m_gender">
          <option ${p.gender==='Female'?'selected':''}>Female</option>
          <option ${p.gender==='Male'?'selected':''}>Male</option>
          <option ${p.gender==='Other'?'selected':''}>Other</option>
        </select>
      </div>
      <div><label>Date of Birth</label><input id="m_dob" type="date" value="${p.birth || ''}" /></div>
    </div>
    <div class="row">
      <div><label>Contact</label><input id="m_contact" value="${p.contact || ''}" /></div>
      <div><label>Address</label><input id="m_address" value="${p.address || ''}" /></div>
      <div><label>Last Visit</label><input id="m_lastVisit" type="date" value="${p.lastVisit || ''}" /></div>
    </div>

    ${isManager ? `
    <div class="row">
      <div><label>Medical History</label><textarea id="m_medical">${p.medical || ''}</textarea></div>
      <div><label>Diagnosis / Notes</label><textarea id="m_notes">${p.notes || ''}</textarea></div>
    </div>
    <div class="row">
      <div><label>Assigned Dentist</label><input id="m_assigned" value="${p.assigned || 'Dr. Maria Santos'}" /></div>
      <div><label>Status</label>
        <select id="m_status">
          <option value="active" ${p.status==='active'?'selected':''}>Active</option>
          <option value="inactive" ${p.status==='inactive'?'selected':''}>Inactive</option>
        </select>
      </div>
    </div>
    ` : `
    <div class="row">
      <div><label>Notes</label><textarea id="m_notes">${p.notes || ''}</textarea></div>
    </div>
    `}

    <div class="modal-footer">
      <button class="secondary-btn" onclick="closeModal()">Cancel</button>
      <button class="primary-btn" onclick="saveEditPatient('${p.id}')">Save Changes</button>
    </div>
  `;
  openBackdrop();
}

/* -------------------------
   Save & Submit
   ------------------------- */
function saveNewPatient(){
  const firstName = document.getElementById('m_firstName').value.trim();
  const lastName = document.getElementById('m_lastName').value.trim();
  if(!firstName || !lastName){ alert('Please fill out required fields'); return; }

  const newPatient = {
    id: generateId(),
    firstName,
    lastName,
    gender: document.getElementById('m_gender').value,
    birth: document.getElementById('m_dob').value,
    contact: document.getElementById('m_contact').value,
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
  alert('Patient record saved successfully.');
}

function submitForReview(){
  const firstName = document.getElementById('m_firstName').value.trim();
  const lastName = document.getElementById('m_lastName').value.trim();
  if(!firstName || !lastName){ alert('Please fill out required fields'); return; }

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
  alert('Patient submitted for review. A manager will verify and approve.');
}

function saveEditPatient(id){
  const p = demoPatients.find(x=>x.id===id);
  if(!p) return alert('Not found');
  p.firstName = document.getElementById('m_firstName').value.trim();
  p.lastName = document.getElementById('m_lastName').value.trim();
  p.gender = document.getElementById('m_gender').value;
  p.birth = document.getElementById('m_dob').value;
  p.contact = document.getElementById('m_contact').value;
  p.lastVisit = document.getElementById('m_lastVisit').value;
  p.notes = document.getElementById('m_notes').value;
  p.medical = document.getElementById('m_medical') ? document.getElementById('m_medical').value : p.medical;
  p.assigned = document.getElementById('m_assigned') ? document.getElementById('m_assigned').value : p.assigned;
  p.status = document.getElementById('m_status') ? document.getElementById('m_status').value : p.status;
  patients = demoPatients.slice();
  closeModal();
  renderTable();
}

/* -------------------------
   Delete
   ------------------------- */
function confirmDelete(id){
  if(currentRole !== 'manager'){ return alert('You do not have permission to delete records'); }
  if(!confirm('Delete this patient record? This action cannot be undone.')) return;
  demoPatients = demoPatients.filter(p=>p.id !== id);
  patients = demoPatients.slice();
  selectedIds.delete(id);
  renderTable();
}

function deleteSelected(){
  if(currentRole !== 'manager'){ return alert('Permission denied'); }
  if(selectedIds.size === 0) return alert('No rows selected');
  if(!confirm(`Delete ${selectedIds.size} selected record(s)?`)) return;
  demoPatients = demoPatients.filter(p => !selectedIds.has(p.id));
  patients = demoPatients.slice();
  selectedIds.clear();
  renderTable();
}

/* -------------------------
   Modal helpers
   ------------------------- */
function openBackdrop(){
  backdrop.style.display = 'flex';
  backdrop.setAttribute('aria-hidden','false');
}
function closeModal(){
  backdrop.style.display = 'none';
  backdrop.setAttribute('aria-hidden','true');
  modalEl.innerHTML = '';
}

/* -------------------------
   Misc: Navigation & User menu
   ------------------------- */
function navigateTo(page){ alert(`Demo: navigate to ${page}`); }
function toggleUserMenu(){ alert('User menu (demo)'); }

/* -------------------------
   Role switching
   ------------------------- */
function switchRole(role){
  currentRole = role;
  document.body.setAttribute('data-role', role);
  document.getElementById('managerBtn').classList.toggle('active', role==='manager');
  document.getElementById('staffBtn').classList.toggle('active', role==='staff');

  // UI updates
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

  // hide manager-only UI for staff
  document.querySelectorAll('.manager-only').forEach(el => {
    el.style.display = (role==='manager') ? '' : 'none';
  });

  renderTable();
}

/* -------------------------
   Initial render + wiring
   ------------------------- */
document.getElementById('sidebarToggle').addEventListener('click', ()=> {
  document.getElementById('sidebar').classList.toggle('collapsed');
  document.getElementById('mainContent').classList.toggle('expanded');
});

// event hooks for role buttons (provide also keyboard accessibility)
document.getElementById('managerBtn').addEventListener('click', ()=> switchRole('manager'));
document.getElementById('staffBtn').addEventListener('click', ()=> switchRole('staff'));

// global search already wired above
renderTable();

// expose for debugging
window._patients = patients;
window.switchRole = switchRole;
