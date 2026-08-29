import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Point this at your deployed backend, e.g. https://payanam-api.onrender.com/api.
// Expo reads EXPO_PUBLIC_* values at bundle time; localhost remains convenient for an emulator.
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('payanam_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
