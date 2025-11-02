# 🦷 Dental Clinic Patient Information System
## **Front-End Prototype Implementation Plan (v1.1)**
**Version Date:** November 2025  
**Author:** Enil  
**Purpose:**  
This plan defines the front-end–only prototype for *Kit & Dom’s Dental Clinic Management System*. It focuses on creating static UI pages for all modules with working navigation, demo data, and “Feature coming soon!” alerts for all action buttons.  

All code is client-side (HTML, CSS, JS) — **no backend or database integration**.  
Role-based UIs (Manager and Staff) must remain consistent with the current design and dashboard layout.  

---

## ✅ Current Status
Working features (as of v1.0):  
- Login System (Manager & Staff)  
- Dashboard (Role-based UI)  
- Logout functionality  
- Session management  
- Role-based UI control  
- Notification system (`showNotification(message, type)`)

---

## 🧭 Core Goal
Implement **static UI** pages for all system modules with correct navigation links, consistent layout, and unique “coming soon” messages on all quick-action buttons.  
All data will be static and loaded from demo arrays.

---

## 🗂️ Features to Implement (Front-End Prototype Only)

### 🧑‍⚕️ Manager Module
1. Dashboard ✅ (already working)  
2. Patients — static table + quick actions  
3. Staff Management — static table + quick actions  
4. Backup & Restore — static cards/buttons + alerts  
5. Account Settings — static profile + password section + alerts  

### 👩‍💼 Staff Module
1. Dashboard ✅ (already working)  
2. Patients — static table + limited quick actions  
3. Account Settings — static profile + password section + alerts  

---

## 🗓 Implementation Roadmap

### **Phase 1: Patients Module**
**Files:**  
- `templates/patients.html`  
- `static/css/patients.css`  
- `static/js/patients.js`

**Features:**  
- Header + sidebar consistent with Dashboard  
- Static patient table (10 demo rows)  
- Columns: Patient ID, Full Name, Gender, Age, Contact, Last Visit, Status, Actions  
- Search bar (non-functional placeholder)  
- Quick action buttons:  
  - `Add New Patient` → shows `showNotification('Add New Patient feature coming soon!', 'info')`  
  - `Edit Patient` → shows `showNotification('Edit Patient feature coming soon!', 'info')`  
  - `Delete Patient` → shows `showNotification('Delete Patient feature coming soon!', 'warning')`  
  - `Export to CSV` (Manager only) → shows `showNotification('Export Patients feature coming soon!', 'info')`
- Ensure sidebar navigation works:
  - Dashboard → `/templates/dashboard.html`
  - Staff Management → `/templates/pages/staff-management.html`
  - Backup & Restore → `/templates/pages/backup-restore.html`
  - Account Settings → `/templates/pages/settings.html`

---

### **Phase 2: Staff Management Module (Manager Only)**
**Files:**  
- `templates/pages/staff-management.html`  
- `static/css/staff.css`  
- `static/js/staff.js`

**Features:**  
- Header and sidebar same as Dashboard  
- Static table with columns: Staff ID, Full Name, Username, Role, Status, Last Login  
- 3–4 static demo staff rows  
- Quick action buttons:  
  - `Add New Staff` → `showNotification('Add New Staff feature coming soon!', 'info')`  
  - `Edit Staff` → `showNotification('Edit Staff feature coming soon!', 'info')`  
  - `Delete Staff` → `showNotification('Delete Staff feature coming soon!', 'warning')`  
  - `Reset Password` → `showNotification('Reset Password feature coming soon!', 'info')`  
  - `Export Staff List` → `showNotification('Export Staff feature coming soon!', 'info')`  
- Sidebar navigation must remain fully functional.

---

### **Phase 3: Backup & Restore Module (Manager Only)**
**Files:**  
- `templates/pages/backup-restore.html`  
- `static/css/backup.css`  
- `static/js/backup.js`

**Features:**  
- Static layout with sections: Create Backup, Backup History, Restore Backup  
- No real file operations, only buttons with alerts  
- Buttons & notifications:  
  - `Create Backup` → `showNotification('Backup creation feature coming soon!', 'info')`  
  - `Download Backup` → `showNotification('Download Backup feature coming soon!', 'info')`  
  - `Upload Backup File` → `showNotification('Upload feature coming soon!', 'info')`  
  - `Restore Backup` → `showNotification('Restore Backup feature coming soon!', 'warning')`  
- Add a simple table showing backup history (3 demo rows).

---

### **Phase 4: Account Settings (Both Roles)**
**Files:**  
- `templates/pages/settings.html`  
- `static/css/settings.css`  
- `static/js/settings.js`

**Features:**  
- Split into two sections:  
  1. **Profile Information** (static data)  
     - Name, Email, Phone Number, Role  
  2. **Security Settings**  
     - Current Password, New Password, Confirm Password (no real validation)  
- Buttons & notifications:  
  - `Update Profile` → `showNotification('Update Profile feature coming soon!', 'info')`  
  - `Change Password` → `showNotification('Change Password feature coming soon!', 'warning')`  
- Add footer text with version:  
  > © 2025 Kit & Dom’s Dental Clinic | Version 1.1

---

### **Phase 5: Navigation Verification**
**Goal:** Ensure navigation between all modules is functional.

**Requirements:**  
- Sidebar links and header dropdowns navigate to correct pages.  
- Each page has a consistent layout (header, sidebar, footer).  
- The `logout` button remains functional and clears the session.  
- Use `data-role` attributes to toggle visibility for Manager vs Staff.

---

## 🎨 Design & Structure Guidelines

**Keep existing structure and aesthetics:**  
- Font: *Poppins* (Headings), *Inter* (Body)  
- Colors:  
  - Primary Pink: `#E8B4BC`  
  - Text Dark: `#1A1A1A`  
  - Info: `#3B82F6`  
  - Warning: `#F59E0B`  
  - Error: `#EF4444`  
- Rounded corners, shadows, and padding consistent with Dashboard.  
- Sidebar and header reused across all pages.  
- Maintain the existing CSS organization:  
  - `/static/css/style.css` for globals  
  - `/static/css/[page].css` for page-specific styles  
- Maintain JS structure under `/static/js/[page].js`.

---

## 🧩 Demo Data Specification

**Patients (10 sample entries)**  
```js
const demoPatients = [
  { id: 'PT-0001', name: 'John Doe', gender: 'Male', age: 35, contact: '09171234567', lastVisit: '2025-10-12', status: 'Active' },
  { id: 'PT-0002', name: 'Maria Lopez', gender: 'Female', age: 29, contact: '09271239876', lastVisit: '2025-10-05', status: 'Active' },
];
```

**Staff (3 sample entries)**  
```js
const demoStaff = [
  { id: 'ST-0001', name: 'Carla Reyes', username: 'creyes', role: 'Staff', status: 'Active', lastLogin: '2025-10-28' },
  { id: 'ST-0002', name: 'Dr. Maria Santos', username: 'msantos', role: 'Manager', status: 'Active', lastLogin: '2025-10-30' },
];
```

**Backups (3 sample entries)**  
```js
const demoBackups = [
  { id: 1, date: '2025-10-20', size: '2MB', actions: 'Download' },
  { id: 2, date: '2025-10-25', size: '2.3MB', actions: 'Download' },
];
```

---

## 🧱 File Structure (Final)

```
dental-clinic-management-system/
│
├── index.html
├── templates/
│   ├── login.html
│   ├── dashboard.html
│   ├── patients.html
│   └── pages/
│       ├── staff-management.html
│       ├── backup-restore.html
│       └── settings.html
│
├── static/
│   ├── css/
│   │   ├── style.css
│   │   ├── dashboard.css
│   │   ├── patients.css
│   │   ├── staff.css
│   │   ├── backup.css
│   │   └── settings.css
│   └── js/
│       ├── main.js
│       ├── dashboard.js
│       ├── patients.js
│       ├── staff.js
│       ├── backup.js
│       └── settings.js
│
└── docs/
    └── Dental Clinic Patient Information System.docx
```

---

## 🚀 Final Notes for AI Implementation

- Maintain full **role-based rendering** using `data-role` attributes.  
- Each page must use **existing layout components** for consistency.  
- No real CRUD or database interaction — UI only.  
- All **quick action buttons** should trigger unique “coming soon” notifications as listed.  
- Ensure **navigation links work** across all modules.  
- Preserve responsive layout for desktop view.
