import axios from 'axios';
import { Platform } from 'react-native';

const baseURL = Platform.select({
  android: 'http://10.0.2.2:3000',
  ios: 'http://localhost:3000',
}) as string;

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptor para logar as requisições
api.interceptors.request.use(request => {
  console.log('API Request:', {
    method: request.method,
    url: request.url,
    data: request.data,
    headers: request.headers,
  });
  return request;
});

// Interceptor para logar as respostas
api.interceptors.response.use(
  response => {
    console.log('API Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers,
    });
    return response;
  },
  error => {
    console.error('API Error:', {
      message: error.message,
      response: {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      },
      request: {
        method: error.config?.method,
        url: error.config?.url,
        data: error.config?.data,
        headers: error.config?.headers,
      },
    });
    return Promise.reject(error);
  },
);

export default api;
