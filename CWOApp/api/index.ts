import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  // GANTI PAKE IP 'ipconfig' LO
  baseURL: 'http://192.168.0.117:3000/api', 
});

api.interceptors.request.use(
  async (config) => {
    const tokenString = await AsyncStorage.getItem('cwo-app-auth-storage');
    if (tokenString) {
      const authData = JSON.parse(tokenString);
      const token = authData?.state?.token;
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;