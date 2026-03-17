import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'https://mvm.trendia.co/product/api',
  // baseURL: 'http://192.168.0.79:3000/api',
  baseURL:process.env.REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
