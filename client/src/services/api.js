import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// 请求拦截器 - 自动附带 JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器 - 处理 401
api.interceptors.response.use(
  (res) => {
    if (res.data && typeof res.data.code === 'number' && res.data.code === 0) {
      res.data = res.data.data;
    }
    return res;
  },
  (err) => {
    if (err.response?.data?.message) {
      err.message = err.response.data.message;
    }
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(err);
  }
);

// ── Auth ──
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// ── Teas ──
/** @unused — UI uses static data (demoTeas.js) */
export const teaAPI = {
  getAll: () => api.get('/teas'),
  getById: (id) => api.get(`/teas/${id}`),
  getBySeason: (season) => api.get(`/teas/season/${season}`),
  getByMonth: (month) => api.get(`/teas/month/${month}`),
  getStats: () => api.get('/teas/stats/cities'),
};

// ── Favorites ──
/** @unused — UI uses localStorage */
export const favAPI = {
  getAll: () => api.get('/favorites'),
  add: (tea_id) => api.post('/favorites', { tea_id }),
  remove: (tea_id) => api.delete(`/favorites/${tea_id}`),
  check: (tea_id) => api.get(`/favorites/check/${tea_id}`),
};

// ── Checkins ──
/** @unused — no checkin UI in client */
export const checkinAPI = {
  getAll: () => api.get('/checkins'),
  add: (city_name) => api.post('/checkins', { city_name }),
  remove: (id) => api.delete(`/checkins/${id}`),
};

// ── Admin ──
/** @unused — no admin UI in client */
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getTeas: () => api.get('/admin/teas'),
  getTea: (id) => api.get(`/admin/teas/${id}`),
  createTea: (data) => api.post('/admin/teas', data),
  updateTea: (id, data) => api.put(`/admin/teas/${id}`, data),
  deleteTea: (id) => api.delete(`/admin/teas/${id}`),
  getUsers: () => api.get('/admin/users'),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export default api;
