# Dental Clinic Patient Information System

A front-end only web application for managing patient records in a dental clinic. Built with pure HTML, CSS, and JavaScript.

## Project Overview

This system provides a secure, organized, and user-friendly internal platform for dental clinic staff and managers to manage patient data efficiently. It features role-based access with two user types:

- **Manager/Dentist**: Full system access including patient management, staff accounts, audit logs, and backup/restore
- **Staff**: Patient management features for daily operations

## Project Structure

```
dental-clinic-management-system/
├── index.html              # Login page (entry point)
├── dashboard.html          # Manager/Staff dashboard
├── patients.html           # Patient records listing & management
├── patient-detail.html     # Individual patient profile view
├── css/                    # Stylesheets
│   ├── login.css
│   ├── dashboard.css
│   ├── patients.css
│   └── patient-detail.css
├── js/                     # JavaScript files
│   ├── login.js
│   ├── dashboard.js
│   ├── patients.js
│   └── patient-detail.js
├── docs/                   # Documentation
│   └── Dental Clinic Patient Information System.docx
├── archive/                # Old project structure (for reference)
│   ├── login/
│   ├── dashboard/
│   ├── patients/
│   ├── patient_details/
│   └── templates/
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

Then open your browser and navigate to `http://localhost:8000`

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

### Login System
- Secure authentication for staff and managers
- "Remember me" functionality
- Caps Lock warning
- Password visibility toggle
- Desktop-optimized experience warning

### Dashboard
- Quick overview of clinic statistics
- Recent system activity
- Role-based UI (Manager vs Staff views)
- Quick actions for common tasks

### Patient Management
- Add, view, edit, and delete patient records
- Advanced search and filtering
- Export patient data (Manager only)
- Bulk operations (Manager only)
- Patient status tracking (Active/Inactive)

### Patient Details
- Comprehensive patient profile view
- Visit history tracking
- Medical history and notes
- Assigned dentist information

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

## File Organization Notes

- **patients.html**: Contains inline CSS and JavaScript for easier deployment. External files exist in `css/` and `js/` directories but are not currently used by this page.
- **Other pages**: Use external CSS and JS files for better separation of concerns.
- **Archive folder**: Contains the old project structure before reorganization.

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

## Future Enhancements

- Backend API integration
- Real database integration
- Appointment scheduling module
- Billing and invoicing
- Treatment planning tools
- Prescription management
- Reporting and analytics
- Mobile responsive design
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
