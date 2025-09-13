// import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
// import {navigationRef} from './Navigation';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/eatsoo/',
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('loginToken');
console.log('token', token)
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`,
    };

    // Ensure Content-Type is set if not already present
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// axiosInstance.interceptors.response.use(
//   response => {
//     console.log('response', response)
//     return response;
//   },
//   async error => {
//     // console.log('erroewr', error.response);
//     if (error.response.status === 401) {
//       await AsyncStorage.removeItem('loginToken');
//       return navigationRef.navigate('AuthStack');
//     }
//     return Promise.reject(error);
//   },
// );

export default axiosInstance;
