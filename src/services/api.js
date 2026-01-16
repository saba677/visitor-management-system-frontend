import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});


api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  getProfile: () => api.get('/auth/profile')
};

export const visitorAPI = {
  create: (data) => api.post('/api/visitors', data),
  getAll: (params) => api.get('/visitors', { params }),
  getToday: () => api.get('/visitors/today'),
  getById: (id) => api.get(`/visitors/${id}`),
  approve: (id) => api.put(`/visitors/${id}/approve`),
  markExit: (id) => api.put(`/visitors/${id}/exit`)
};


export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getReceptionistStats: () => api.get('/dashboard/receptionist-stats')
};

export default api;
