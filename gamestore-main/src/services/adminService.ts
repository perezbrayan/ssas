import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

export interface RobloxProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  image_url?: string;
  amount?: number;
  type: 'vbucks' | 'gamepass' | 'item' | 'skin';
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  is_admin: number | boolean; // Puede ser 0/1 del backend o true/false en el frontend
  created_at: string;
}

export interface Admin {
  id: number;
  username: string;
  email: string;
  is_super_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  id: number;
  vbucks_rate: number;
  last_updated: string;
  created_at: string;
}

export interface VBucksHistoryItem {
  id: number;
  rate: string | number;
  created_at: string;
}

export interface VBucksRateResponse {
  success?: boolean;
  rate: string | number;
  timestamp: string;
}

export const adminService = {
  // Auth
  loginAdmin: async (credentials: { email: string; password: string }) => {
    const response = await axios.post(`${API_URL}/db/api/admin/login`, credentials);
    return response.data;
  },

  // Usuarios
  getUsers: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/db/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  updateUserAdmin: async (userId: number, isAdmin: boolean) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_URL}/db/api/admin/users/${userId}/role`,
      { is_admin: isAdmin },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Productos Roblox
  getProducts: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/db/api/admin/products`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  createProduct: async (formData: FormData) => {
    const token = localStorage.getItem('token');
    try {
      // Log the FormData contents for debugging
      console.log('FormData contents:');
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await axios.post(
        `${API_URL}/db/api/admin/products`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error details:', {
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      throw error;
    }
  },

  updateProduct: async (id: number, formData: FormData) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_URL}/db/api/admin/products/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  },

  deleteProduct: async (id: number) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(
      `${API_URL}/db/api/admin/products/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  },

  // VBucks Settings
  getVBucksRate: async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${API_URL}/db/api/admin/vbucks-rate/current`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting VBucks rate:', error);
      throw error;
    }
  },

  updateVBucksRate: async (rate: string | number) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `${API_URL}/db/api/admin/vbucks-rate`,
        { rate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating VBucks rate:', error);
      throw error;
    }
  },

  getVBucksHistory: async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${API_URL}/db/api/admin/vbucks-rate/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Si la respuesta viene en data.history, la retornamos, si no, asumimos que la respuesta es el array directamente
      return response.data.history || response.data || [];
    } catch (error) {
      console.error('Error getting VBucks history:', error);
      throw error;
    }
  }
};
