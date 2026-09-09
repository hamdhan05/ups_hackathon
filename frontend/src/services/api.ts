import axios, { AxiosInstance } from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || '';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${BASE_URL}/api`,
      timeout: 30000,
    });

    // Attach JWT to every request
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle 401 globally
    this.client.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(err);
      }
    );
  }

  async login(email: string, password: string) {
    const res = await this.client.post('/auth/login', { email, password });
    return res.data;
  }

  async getHealth() {
    const res = await this.client.get('/health');
    return res.data;
  }

  async getDashboard(params?: { startDate?: string; endDate?: string }) {
    const res = await this.client.get('/dashboard', { params });
    return res.data;
  }

  async getOperations(params?: {
    startDate?: string;
    endDate?: string;
    operationType?: string;
    operationalArea?: string;
    status?: string;
  }) {
    const res = await this.client.get('/operations', { params });
    return res.data;
  }

  async getForecast(params?: {
    startDate?: string;
    endDate?: string;
    operationType?: string;
    operationalArea?: string;
  }) {
    const res = await this.client.get('/forecast', { params });
    return res.data;
  }

  async getCapacity(params?: {
    startDate?: string;
    endDate?: string;
    operationType?: string;
    operationalArea?: string;
    status?: string;
    riskLevel?: string;
  }) {
    const res = await this.client.get('/capacity', { params });
    return res.data;
  }

  async getBottlenecks(params?: {
    startDate?: string;
    endDate?: string;
    operationType?: string;
    operationalArea?: string;
    severity?: string;
    status?: string;
  }) {
    const res = await this.client.get('/bottlenecks', { params });
    return res.data;
  }

  async getRecommendations(params?: {
    startDate?: string;
    endDate?: string;
    status?: string;
    priority?: string;
    targetArea?: string;
  }) {
    const res = await this.client.get('/recommendations', { params });
    return res.data;
  }

  async updateRecommendation(id: string, status: string) {
    const res = await this.client.patch(`/recommendations/${id}`, { status });
    return res.data;
  }

  async getAnalytics() {
    const res = await this.client.get('/analytics');
    return res.data;
  }

  async simulateScenario(params: {
    targetArea: string;
    workloadChangePercent: number;
    workerTransferCount: number;
    sourceArea: string;
  }) {
    const res = await this.client.post('/simulation/simulate', params);
    return res.data;
  }
}

export const api = new ApiService();
