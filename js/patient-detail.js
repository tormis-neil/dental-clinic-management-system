// Demo patient data
const patient = {
  id: "PT-0002",
  name: "Peter Dela Cruz",
  gender: "Male",
  dob: "1980-02-01",
  contact: "09179876543",
  address: "Quezon City, PH",
  status: "active",
  lastVisit: "2025-10-10",
  visits: [
    { date: "2025-10-10", provider: "Dr. Santos", service: "Filling", notes: "Tooth #24 filling" },
    { date: "2025-06-14", provider: "Dr. Santos", service: "Cleaning", notes: "Routine cleaning" }
  ],
  medical: {
    allergies: "Penicillin",
    conditions: "Hypertension",
    dentistNotes: "Monitor blood pressure prior to operative procedures",
    assignedDentist: "Dr. Maria Santos"
  }
};

const role = "staff"; // change to "manager" to preview
const deleteBtn = document.getElementById("btnDeletePatient");

// Role-based button
if (role === "manager") {
  deleteBtn.textContent = "Delete";
} else {
  const requests = JSON.parse(localStorage.getItem("deleteRequests") || "[]");
  const pending = requests.some(r => r.patientId === patient.id && r.status === "pending");

  if (pending) {
    deleteBtn.textContent = "Pending Approval";
    deleteBtn.disabled = true;
    deleteBtn.style.opacity = "0.6";
    deleteBtn.style.cursor = "not-allowed";
  } else {
    deleteBtn.textContent = "Request Delete";
  }
}

// Populate profile
document.getElementById("ptName").textContent = patient.name;
document.getElementById("ptId").textContent = patient.id;
document.getElementById("ptGender").textContent = patient.gender;
document.getElementById("ptDOB").textContent = patient.dob;
document.getElementById("ptContact").textContent = patient.contact;
document.getElementById("ptAddress").textContent = patient.address;
document.getElementById("ptLastVisit").textContent = patient.lastVisit;

const age = Math.floor((Date.now() - new Date(patient.dob)) / (1000 * 60 * 60 * 24 * 365.25));
document.getElementById("ptAge").textContent = age;

const statusEl = document.getElementById("ptStatus");
statusEl.textContent = patient.status === "active" ? "Active" : "Inactive";
statusEl.classList.add(patient.status === "active" ? "status-active" : "status-inactive");

// Security: HTML escape helper
function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

// Visit table
let rows = "";
patient.visits.forEach(v => {
  rows += `<tr>
    <td>${escapeHtml(v.date)}</td><td>${escapeHtml(v.provider)}</td><td>${escapeHtml(v.service)}</td><td>${escapeHtml(v.notes)}</td>
  </tr>`;
});
document.getElementById("visitRows").innerHTML = rows;

// Medical info
document.getElementById("medAllergies").textContent = patient.medical.allergies || "—";
document.getElementById("medConditions").textContent = patient.medical.conditions || "—";
document.getElementById("medDentistNotes").textContent = patient.medical.dentistNotes || "—";
document.getElementById("medAssignedDentist").textContent = patient.medical.assignedDentist || "—";

// Tab logic
function switchTab(tab) {
  document.getElementById("visitsPanel").style.display = tab === "visits" ? "" : "none";
  document.getElementById("medicalPanel").style.display = tab === "medical" ? "" : "none";
  document.getElementById("tabVisits").classList.toggle("active", tab === "visits");
  document.getElementById("tabMedical").classList.toggle("active", tab === "medical");
}

// Placeholder buttons
function goBack() { alert("Go back to patient list"); }
function editPatient() { alert("Edit Patient"); }
function addVisit() { alert("Add Visit Form"); }

function deletePatient() {
  if (role === "manager") {
    if (confirm("Are you sure you want to delete this patient record?")) {
      alert("✅ Patient record deleted (demo)");
    }
    return;
  }

  const requests = JSON.parse(localStorage.getItem("deleteRequests") || "[]");
  const exists = requests.some(r => r.patientId === patient.id && r.status === "pending");
  if (exists) return alert("🕓 Delete request already pending approval.");

  if (!confirm("Send delete request to Manager for approval?")) return;

  const request = {
    patientId: patient.id,
    patientName: patient.name,
    requestedBy: "Staff User",
    date: new Date().toISOString(),
    status: "pending"
  };

  requests.push(request);
  localStorage.setItem("deleteRequests", JSON.stringify(requests));
  alert("✅ Delete request submitted to manager.");
  deleteBtn.disabled = true;
  deleteBtn.textContent = "Pending Approval";
  deleteBtn.style.opacity = "0.6";
  deleteBtn.style.cursor = "not-allowed";
}
