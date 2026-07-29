import axios from 'axios';

// Change this single variable to switch between local and production
// export const API_BASE_URL = 'http://localhost:3001';
export const API_BASE_URL = 'https://api-ur79.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
