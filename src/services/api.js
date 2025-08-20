const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('auth-token');
  }

  // Set auth token in localStorage
  setAuthToken(token) {
    if (token) {
      localStorage.setItem('auth-token', token);
    } else {
      localStorage.removeItem('auth-token');
    }
  }

  // Make HTTP request with authentication
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle 401 Unauthorized
      if (response.status === 401) {
        this.setAuthToken(null);
        window.location.href = '/login';
        throw new Error('Authentication required');
      }

      // Handle other errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async signup(userData) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(updates) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Fabric endpoints
  async getFabrics() {
    return this.request('/fabrics');
  }

  async getFabric(id) {
    return this.request(`/fabrics/${id}`);
  }

  async createFabric(fabricData) {
    return this.request('/fabrics', {
      method: 'POST',
      body: JSON.stringify(fabricData),
    });
  }

  async updateFabric(id, updates) {
    return this.request(`/fabrics/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteFabric(id) {
    return this.request(`/fabrics/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleFabricPin(id) {
    return this.request(`/fabrics/${id}/pin`, {
      method: 'PATCH',
    });
  }

  async recordFabricUsage(fabricId, usageData) {
    return this.request(`/fabrics/${fabricId}/usage`, {
      method: 'POST',
      body: JSON.stringify(usageData),
    });
  }

  async getUsageHistory() {
    return this.request('/fabrics/usage/history');
  }
}

export const apiService = new ApiService();
