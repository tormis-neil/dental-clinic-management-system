/**
 * auth.js - Authentication Module
 *
 * Handles user authentication, session management, and authorization.
 *
 * Features:
 * - Login/logout functionality
 * - Session validation
 * - User role management
 * - Redirect handling
 *
 * @author Kit & Dom's Dental Clinic
 * @version 2.0
 * @date 2025-11-01
 */

/**
 * Logs out the current user
 * Clears all session data and redirects to login page
 */
function logout() {
  // Clear all session data from sessionStorage
  sessionStorage.removeItem('clinic_user');

  // Clear any localStorage session flags if they exist
  localStorage.removeItem('currentUser');
  localStorage.removeItem('userRole');
  localStorage.removeItem('isLoggedIn');

  // Redirect to login page
  window.location.href = 'login.html';
}

/**
 * Checks if user is currently logged in
 * @returns {boolean} True if user is logged in, false otherwise
 */
function isLoggedIn() {
  const user = sessionStorage.getItem('clinic_user');
  return user !== null && user !== undefined;
}

/**
 * Gets the current user data from session
 * @returns {object|null} User object or null if not logged in
 */
function getCurrentUser() {
  const userJson = sessionStorage.getItem('clinic_user');
  if (!userJson) return null;

  try {
    return JSON.parse(userJson);
  } catch (e) {
    console.error('Error parsing user data:', e);
    return null;
  }
}

/**
 * Gets the current user's role
 * @returns {string|null} User role (manager/staff) or null if not logged in
 */
function getUserRole() {
  const user = getCurrentUser();
  return user ? user.role : null;
}

/**
 * Gets the current user's name
 * @returns {string|null} User name or null if not logged in
 */
function getUserName() {
  const user = getCurrentUser();
  return user ? user.name : null;
}

/**
 * Gets the current user's username
 * @returns {string|null} Username or null if not logged in
 */
function getUsername() {
  const user = getCurrentUser();
  return user ? user.username : null;
}

/**
 * Validates session and redirects to login if not authenticated
 * Should be called on every protected page
 */
function checkSession() {
  const currentPage = window.location.pathname;

  // Don't check session on login page
  if (currentPage.includes('login.html')) {
    return;
  }

  // Check if user is logged in
  if (!isLoggedIn()) {
    // Not logged in, redirect to login page
    window.location.href = 'login.html';
  }
}

/**
 * Redirects user to login page if not logged in
 * Alternative to checkSession with custom redirect path
 * @param {string} redirectPath - Path to redirect to if not logged in
 */
function redirectIfNotLoggedIn(redirectPath = 'login.html') {
  if (!isLoggedIn()) {
    window.location.href = redirectPath;
  }
}

/**
 * Checks if current user has admin/manager privileges
 * @returns {boolean} True if user is a manager, false otherwise
 */
function isManager() {
  const role = getUserRole();
  return role === 'manager';
}

/**
 * Checks if current user has staff privileges
 * @returns {boolean} True if user is a staff member, false otherwise
 */
function isStaff() {
  const role = getUserRole();
  return role === 'staff';
}

/**
 * Saves user session data
 * @param {object} userData - User data to save
 * @param {string} userData.username - User's username
 * @param {string} userData.role - User's role (manager/staff)
 * @param {string} userData.name - User's full name
 */
function saveUserSession(userData) {
  sessionStorage.setItem('clinic_user', JSON.stringify(userData));
}

/**
 * Initialize authentication system
 * Automatically called when DOM is loaded
 */
function initAuth() {
  // Check session on page load
  checkSession();

  // Attach logout handlers to any logout buttons
  const logoutButtons = document.querySelectorAll('#logoutBtn, [data-action="logout"]');
  logoutButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  });
}

// Initialize auth when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuth);
} else {
  // DOM is already loaded
  initAuth();
}
