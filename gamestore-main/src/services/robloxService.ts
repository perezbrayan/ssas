import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

export interface RobloxProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  image_url?: string;
  amount?: number;
  type: string;
  created_at: string;
  updated_at: string;
}

export const robloxService = {
  getProducts: async () => {
    try {
      const response = await axios.get(`${API_URL}/db/api/admin/public/products`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos de Roblox:', error);
      throw error;
    }
  }
}; 