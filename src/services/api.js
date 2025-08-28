const API_BASE_URL = 'http://192.168.50.154:3001/api';

console.log('API_BASE_URL:', API_BASE_URL);
console.log('import.meta.env.VITE_API_URL:', import.meta.env.VITE_API_URL);

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    console.log('ApiService initialized with baseURL:', this.baseURL);
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

  // Admin endpoints
  async getPendingUsers() {
    return this.request('/auth/pending-users');
  }

  async approveUser(userId) {
    return this.request(`/auth/approve-user/${userId}`, {
      method: 'POST',
    });
  }

  async rejectUser(userId) {
    return this.request(`/auth/reject-user/${userId}`, {
      method: 'DELETE',
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
    console.log('API service: Creating fabric with data:', fabricData);
    const response = await this.request('/fabrics', {
      method: 'POST',
      body: JSON.stringify(fabricData),
    });
    console.log('API service: Fabric creation response:', response);
    return response;
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

  // Upload endpoints
  async uploadFabricImage(formData) {
    const baseUrl = this.baseURL.replace('/api', '');
    const url = `${baseUrl}/api/upload/fabric`;
    const token = this.getAuthToken();

    const config = {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    };

    try {
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        this.setAuthToken(null);
        window.location.href = '/login';
        throw new Error('Authentication required');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Upload request failed:', error);
      throw error;
    }
  }

  async uploadProjectImage(formData) {
    const baseUrl = this.baseURL.replace('/api', '');
    const url = `${baseUrl}/api/upload/project`;
    const token = this.getAuthToken();

    const config = {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    };

    try {
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        this.setAuthToken(null);
        window.location.href = '/login';
        throw new Error('Authentication required');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Upload request failed:', error);
      throw error;
    }
  }

  async deleteImage(filename, type) {
    return this.request('/upload/file', {
      method: 'DELETE',
      body: JSON.stringify({ filename, type }),
    });
  }
}

export const apiService = new ApiService();
