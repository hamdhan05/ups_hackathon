import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: `${BASE_URL}/api`,
      timeout: 30000,
    });

    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('ch_token') || localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem('ch_token');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
        return Promise.reject(err);
      }
    );
  }

  async login(email, password) {
    const res = await this.client.post('/auth/login', { email, password });
    return res.data;
  }

  async getHealth() {
    const res = await this.client.get('/health');
    return res.data;
  }

  async getDashboard(params) {
    const res = await this.client.get('/dashboard', { params });
    return res.data;
  }

  async getOperations(params) {
    const res = await this.client.get('/operations', { params });
    return res.data;
  }

  async getForecast(params) {
    const res = await this.client.get('/forecast', { params });
    return res.data;
  }

  async getCapacity(params) {
    const res = await this.client.get('/capacity', { params });
    return res.data;
  }

  async getBottlenecks(params) {
    const res = await this.client.get('/bottlenecks', { params });
    return res.data;
  }

  async getRecommendations(params) {
    const res = await this.client.get('/recommendations', { params });
    return res.data;
  }

  async updateRecommendation(id, status) {
    const res = await this.client.patch(`/recommendations/${id}`, { status });
    return res.data;
  }

  async getAnalytics() {
    const res = await this.client.get('/analytics');
    return res.data;
  }

  async simulateScenario(params) {
    const res = await this.client.post('/simulation/simulate', params);
    return res.data;
  }
}

export const api = new ApiService();
