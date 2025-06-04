const API_URL = 'http://localhost:5000/api';

// Check if admin is logged in
const isAdminLoggedIn = () => {
  return !!localStorage.getItem('adminToken');
};

// Get admin token
const getAdminToken = () => {
  return localStorage.getItem('adminToken');
};

// Get admin user data
const getAdminUser = () => {
  const userData = localStorage.getItem('adminUser');
  return userData ? JSON.parse(userData) : null;
};

// Admin login
const adminLogin = async (username, password) => {
  const response = await fetch(`${API_URL}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }
  
  // Store token and user data
  localStorage.setItem('adminToken', data.token);
  localStorage.setItem('adminUser', JSON.stringify(data.user));
  
  return data;
};

// Admin logout
const adminLogout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
};

// Get authenticated fetch (with token)
const authFetch = async (url, options = {}) => {
  const token = getAdminToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  };
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    // If token is invalid or expired
    if (response.status === 401) {
      adminLogout();
    }
    throw new Error(data.message || 'Request failed');
  }
  
  return data;
};

export const authService = {
  isAdminLoggedIn,
  getAdminToken,
  getAdminUser,
  adminLogin,
  adminLogout,
  authFetch,
};

export default authService;