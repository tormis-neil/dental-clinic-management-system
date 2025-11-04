# Dental Clinic Patient Information System

A front-end only web application for managing patient records in a dental clinic. Built with pure HTML, CSS, and JavaScript.

## Project Overview

This system provides a secure, organized, and user-friendly internal platform for dental clinic staff and managers to manage patient data efficiently. It features role-based access with two user types:

- **Manager/Dentist**: Full system access including patient management, staff accounts, audit logs, and backup/restore
- **Staff**: Patient management features for daily operations

## Project Structure

```
dental-clinic-management-system/
├── index.html              # Redirects to login page
├── templates/              # HTML templates
│   ├── login.html          # Login page
│   ├── dashboard.html      # Manager/Staff dashboard
│   ├── patients.html       # ✅ Patient management (Phase 1)
│   └── pages/              # Application pages
│       └── coming-soon.html # Placeholder for upcoming features
├── static/                 # Static assets
│   ├── css/                # Stylesheets
│   │   ├── style.css       # Global styles
│   │   ├── login.css       # Login page styles
│   │   ├── dashboard.css   # Dashboard styles
│   │   └── patients.css    # ✅ Patient management styles (Phase 1)
│   └── js/                 # JavaScript files
│       ├── auth.js         # Authentication module
│       ├── main.js         # Global utilities
│       ├── login.js        # Login functionality
│       ├── dashboard.js    # Dashboard functionality
│       └── patients.js     # ✅ Patient management (Phase 1)
├── docs/                   # Documentation
│   ├── Dental Clinic Patient Information System.docx
│   └── IMPLEMENTATION_PLAN.md.pdf
└── README.md

```

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional but recommended for testing)

### Running the Application

#### Option 1: Using Python's Built-in Server

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open your browser and navigate to `http://localhost:8000` (will auto-redirect to login page)

#### Option 2: Using Node.js http-server

```bash
npx http-server -p 8000
```

#### Option 3: Open Directly in Browser

Simply open `index.html` in your web browser. Note: Some features may not work properly without a web server.

### Demo Credentials

The system includes demo accounts for testing:

**Manager Account:**
- Username: `manager`
- Password: `manager123`

**Staff Account:**
- Username: `staff`
- Password: `staff123`

## Features

### ✅ Login System (Phase 0 - Completed)
- Secure authentication for staff and managers
- "Remember me" functionality
- Caps Lock warning
- Password visibility toggle
- Desktop-optimized experience warning

### ✅ Dashboard (Phase 0 - Completed)
- Quick overview of clinic statistics
- Recent system activity
- Role-based UI (Manager vs Staff views)
- Quick actions for common tasks

### ✅ Patient Management (Phase 1 - Completed)
- **Full CRUD Operations**: Add, view, edit, and delete patient records
- **Advanced Search & Filtering**: Search by name/ID, filter by gender and status
- **Role-Based Access Control**: Different permissions for Manager vs Staff
- **Patient Details Modal**: View comprehensive patient information with tabbed interface
  - Personal Information
  - Medical History (Manager only)
  - Visit History
- **Manager-Only Features**:
  - Export patient data to CSV
  - Bulk delete operations
  - Access to medical history
  - Full delete permissions
- **Staff Features**:
  - Add and update patient records
  - View patient information
  - Limited access (no delete, no medical history)
- **Demo Data**: Pre-populated with 10 sample patients
- **Responsive Design**: Works on desktop and adapts to different screen sizes
- **Data Persistence**: All data stored in LocalStorage
- **Audit Logging**: All actions logged for accountability

## Role-Based Features

### Manager Features
- Full CRUD access to patient records
- Staff account management
- System audit logs
- Data backup and restore
- Export patient data to CSV
- Bulk delete operations

### Staff Features
- Add and update patient records
- View patient information
- View personal activity logs
- Limited access (cannot manage staff or system settings)

## Technical Details

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with responsive design
- **Fonts**: Google Fonts (Poppins, Inter)
- **Icons**: Inline SVG icons
- **Storage**: LocalStorage for demo purposes (client-side only)
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)

## Design Features

- Clean, modern interface with dental clinic branding (pink/rose theme: #E8B4BC)
- Fully responsive for desktop environments
- Accessible design with ARIA labels
- Smooth transitions and animations
- Consistent UI patterns across pages

## Design & UI Refinements

The application features a polished, professional design with:

- **Modern Typography**: Clear hierarchy using Poppins (headings) and Inter (body text)
- **Refined Spacing**: Consistent padding and margins throughout
- **Enhanced Visual Elements**:
  - Gradient buttons with smooth hover effects
  - Subtle shadows and borders
  - Improved card designs with better visual weight
  - Cleaner table layouts with hover states
- **Better Font Sizing**: Optimized for readability across all pages
- **Consistent Color Scheme**: Rose/pink theme (#E8B4BC) with professional grays
- **Smooth Transitions**: 200ms ease transitions for interactive elements
- **Improved Form Elements**: Better input field styling with focus states

## File Organization Notes

- **Templates Structure**: HTML files organized into `auth/` and `pages/` subdirectories
- **patients.html**: Contains inline CSS and JavaScript for self-contained deployment
- **Other pages**: Use external CSS and JS files for better maintainability
- **Archive folder**: Contains the old project structure before reorganization
- **CSS Files**: Refined with professional spacing, typography, and visual polish

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development Notes

This is a **front-end only** application. In a production environment, you would need to:

1. Implement a backend API for authentication and data persistence
2. Use a proper database (SQLite, PostgreSQL, MySQL)
3. Implement secure session management
4. Add HTTPS/TLS encryption
5. Implement proper access control and authorization
6. Add server-side validation
7. Implement proper audit logging
8. Add backup/restore functionality with backend support

## Implementation Status

### ✅ Phase 1: Patient Management (COMPLETED)
- Full CRUD operations for patient records
- Search and filtering functionality
- Role-based access control
- Export to CSV (Manager only)
- Bulk operations (Manager only)
- Tabbed patient detail view
- Demo data with 10 sample patients

### 🔧 Phase 2: Staff Management (To Be Implemented)
- Staff list table
- Add/Edit/Delete staff accounts
- Reset staff password
- View staff activity
- Manager-only access

### 🔧 Phase 3: Audit Logs (To Be Implemented)
- Activity log table
- Filter by user/action/date
- Export logs to CSV
- Role-based log visibility

### 🔧 Phase 4: Backup & Restore (To Be Implemented)
- Create backup (JSON format)
- Download backup file
- Upload and restore from backup
- Backup history
- Manager-only access

### 🔧 Phase 5: Account Settings (To Be Implemented)
- Change password
- Update profile information
- Notification preferences
- System information display

## Future Enhancements

- Backend API integration
- Real database integration
- Appointment scheduling module
- Billing and invoicing
- Treatment planning tools
- Prescription management
- Reporting and analytics
- Multi-language support

## Project Information

- **Version**: 1.0
- **Clinic Name**: Kit & Dom's Dental Clinic
- **System Type**: Internal Use Only
- **Desktop Optimized**: Yes
- **Offline Capable**: Yes (with proper backend implementation)

## License

Internal use only - Kit & Dom's Dental Clinic

## Support

For issues or questions, contact the clinic administrator.

---

**Note**: This system is optimized for desktop use. For the best experience, please access from a desktop computer.
