// frontend/src/services/api.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true, // IMPORTANT: Required for CSRF and session cookies
});

// Helper to get a cookie value
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Request interceptor to attach CSRF token for unsafe methods
api.interceptors.request.use(
  (config) => {
    console.log('Making API request to:', config.url);
    // Add CSRF token for POST, PUT, DELETE, PATCH
    if (['post', 'put', 'delete', 'patch' , 'get'].includes(config.method)) {
      const csrftoken = getCookie('csrftoken');
      if (csrftoken) {
        config.headers['X-CSRFToken'] = csrftoken;
      }
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 404) {
      console.error('API endpoint not found');
    }
    return Promise.reject(error);
  }
);

// Employee API calls
export const employeeAPI = {
  getEmployees: () => api.get('/employees/'),
  getEmployee: (id) => api.get(`/employees/${id}/`),
  createEmployee: (data) => api.post('/employees/', data),
  updateEmployee: (id, data) => api.put(`/employees/${id}/`, data),
  deleteEmployee: (id) => api.delete(`/employees/${id}/`),
  getEmployeeReviews: (id) => api.get(`/employees/${id}/reviews/`),
  getDepartments: () => api.get('/employees/departments/'),
  getEmployeeStats: () => api.get('/employees/statistics/'),
};

// Performance Review API calls
export const reviewAPI = {
  getReviews: (employeeId = null) => {
    const params = employeeId ? { employee: employeeId } : {};
    return api.get('/reviews/', { params });
  },
  getReview: (id) => api.get(`/reviews/${id}/`),
  createReview: (data) => api.post('/reviews/', data),
  updateReview: (id, data) => api.put(`/reviews/${id}/`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}/`),
  getReviewPeriods: () => api.get('/reviews/periods/'),
  getReviewStats: () => api.get('/reviews/statistics/'),
};

// Authentication API calls
export const authAPI = {
  // Get CSRF token - Django will set the csrftoken cookie
  getCSRFToken: () => api.get('/auth/csrf-token/'),
  
  // Check if user is authenticated
  checkAuth: () => api.get('/auth/user/'),
  
  // User signup
  signup: (userData) => api.post('/auth/signup/', userData),
  
  // User login
  login: (credentials) => api.post('/auth/login/', credentials),
  
  // User logout
  logout: () => api.post('/auth/logout/'),
};

export default api;