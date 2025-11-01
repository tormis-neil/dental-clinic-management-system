/**
 * dashboard.js - Dashboard Overview Module
 *
 * Displays clinic overview with summary cards and recent activity.
 *
 * Features:
 * - Role-based dashboard views (manager vs staff)
 * - Summary statistics cards
 * - Recent activity timeline
 * - Role switching for demonstration
 *
 * @author Kit & Dom's Dental Clinic
 * @version 1.1
 * @date 2025-10-31
 */

// --- Elements ---
const sidebar = document.getElementById("sidebar");
const dropdown = document.getElementById("userDropdown");
const greetingText = document.getElementById("greetingText");
const greetingSubtitle = document.getElementById("greetingSubtitle");
const summaryCards = document.getElementById("summaryCards");
const activityTable = document.getElementById("activityTable");

// --- Sidebar toggle ---
document.querySelector(".sidebar-toggle").addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});

// --- Dropdown toggle ---
dropdown.querySelector(".user-trigger").addEventListener("click", () => {
  dropdown.classList.toggle("open");
});

// --- Close dropdown when clicking outside ---
document.addEventListener("click", (e) => {
  if (!dropdown.contains(e.target)) dropdown.classList.remove("open");
});

// --- Role switch buttons ---
document.getElementById("managerBtn").addEventListener("click", () => switchRole("manager"));
document.getElementById("staffBtn").addEventListener("click", () => switchRole("staff"));

// --- Sample data for testing ---
const demoData = {
  manager: {
    user: { name: "Maria Santos", role: "Manager / Dentist", avatar: "MS" },
    greeting: "Maria",
    subtitle: "Here's your clinic overview.",
    cards: [
      { value: 152, label: "Total Patients", trend: "↑ 12 this month", type: "positive" },
      { value: 6, label: "Total Staff", trend: "↑ 1 new user", type: "positive", admin: true },
      { value: 145, label: "Active Patients", trend: "95.4 % active rate", type: "neutral" },
      { value: 12, label: "Recent Activities", trend: "Last 24 hours", type: "neutral" },
    ],
    table: [
      { user: "Dr. Maria Santos (Manager)", action: "create", desc: "Added Patient 'Jane Cruz'", time: "10/22/2025 10:03 AM", id: "#P-014" },
      { user: "Carla Reyes (Staff)", action: "update", desc: "Modified Treatment Plan", time: "10/22/2025 09:45 AM", id: "#P-013" },
      { user: "Maria Santos (Manager)", action: "backup", desc: "Performed System Backup", time: "10/19/2025 06:00 PM", id: "#BK-023" },
    ],
  },

  staff: {
    user: { name: "Carla Reyes", role: "Staff", avatar: "CR" },
    greeting: "Carla",
    subtitle: "Here's a quick overview of today's patient records.",
    cards: [
      { value: 152, label: "Total Patients", trend: "↑ 12 this month", type: "positive" },
      { value: 145, label: "Active Patients", trend: "95.4 % active rate", type: "neutral" },
      { value: 8, label: "Recent Updates", trend: "Today's changes", type: "neutral" },
    ],
    table: [
      { user: "Carla Reyes (Staff)", action: "update", desc: "Updated record of Jane Cruz", time: "10/22/2025 10:30 AM", id: "#P-014" },
      { user: "Carla Reyes (Staff)", action: "view", desc: "Viewed patient John Doe", time: "10/21/2025 02:30 PM", id: "#P-011" },
      { user: "Carla Reyes (Staff)", action: "create", desc: "Added new patient Anna Garcia", time: "10/20/2025 09:15 AM", id: "#P-010" },
    ],
  },
};

// --- Switch role ---
function switchRole(role) {
  document.body.dataset.role = role;

  // Update button highlights
  document.getElementById("managerBtn").classList.toggle("active", role === "manager");
  document.getElementById("staffBtn").classList.toggle("active", role === "staff");

  const data = demoData[role];

  // Update user info
  document.getElementById("userName").textContent = data.user.name;
  document.getElementById("userRole").textContent = data.user.role;
  document.getElementById("userAvatar").textContent = data.user.avatar;

  // Update greeting
  updateGreeting(data.greeting);
  greetingSubtitle.textContent = data.subtitle;

  // Rebuild dashboard content
  renderCards(data.cards);
  renderTable(data.table);
}

// --- Security: HTML escape helper ---
function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

// --- Render summary cards ---
function renderCards(cards) {
  summaryCards.innerHTML = "";
  cards.forEach((c) => {
    const card = document.createElement("div");
    card.className = `card${c.admin ? " admin-only" : ""}`;
    card.innerHTML = `
      <div class="card-value">${c.value}</div>
      <div class="card-label">${escapeHtml(c.label)}</div>
      <div class="card-trend ${c.type}">${escapeHtml(c.trend)}</div>
    `;
    summaryCards.appendChild(card);
  });
}

// --- Render activity table ---
function renderTable(rows) {
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
        .join("")}
    </tbody>
  `;
}

// --- Action badge helper ---
function actionBadge(type) {
  const map = {
    create: "create",
    update: "update",
    delete: "delete",
    view: "view",
    backup: "backup",
  };
  if (!map[type]) return "";
  const label = type.charAt(0).toUpperCase() + type.slice(1);
  return `<span class="action-badge ${type}">${label}</span>`;
}

// --- Dynamic greeting ---
function updateGreeting(name) {
  const hour = new Date().getHours();
  let greet = "Good Morning";
  if (hour >= 12 && hour < 18) greet = "Good Afternoon";
  else if (hour >= 18) greet = "Good Evening";
  greetingText.textContent = `${greet}, ${name} 👋`;
}

// --- Search (demo only) ---
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const q = e.target.value.trim();
    if (q.length > 2) console.log(`Searching for: ${q}`);
  });
}

// --- Logout handler (demo) ---
document.getElementById("logoutBtn").addEventListener("click", () => {
  if (confirm("Are you sure you want to logout?")) {
    alert("Logging out... Redirecting to login page.");
    // In production: window.location.href = "/login/index.html";
  }
});

// --- Initialize dashboard ---
updateGreeting("Maria");
renderCards(demoData.manager.cards);
renderTable(demoData.manager.table);
