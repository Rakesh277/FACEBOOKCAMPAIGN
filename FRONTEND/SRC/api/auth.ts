import axios from 'axios';
import type { AxiosResponse } from 'axios';

const BASE_URL = 'http://localhost:5000/api/auth';

axios.defaults.withCredentials = true; // Ensures cookies/session are sent

// 🔐 Types
export interface AuthPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user?: {
    email: string;
    // Add more fields as needed
  };
}

// 🧠 Centralized error handler
const handleRequest = async <T>(request: Promise<AxiosResponse<T>>): Promise<T> => {
  try {
    const response = await request;
    return response.data; // ✅ Extract only the data
  } catch (error: any) {
    throw error.response?.data || { message: 'Unexpected error' };
  }
};

// 🚀 Login API
export const login = async (payload: AuthPayload): Promise<AuthResponse> => {
  return handleRequest(
    axios.post<AuthResponse>(`${BASE_URL}/login`, payload)
  );
};

// 📝 Register API
export const register = async (payload: AuthPayload): Promise<AuthResponse> => {
  return handleRequest(
    axios.post<AuthResponse>(`${BASE_URL}/register`, payload)
  );
};