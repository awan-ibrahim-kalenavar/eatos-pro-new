import api from '../utils/api';
import { MenuItem, ApiResponse, MenuFilters } from '../types';

export const menuService = {
  // Get all menu items with filters
  getMenuItems: async (filters: MenuFilters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.availability !== undefined) params.append('availability', filters.availability.toString());
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/menu?${params.toString()}`);
    return response.data;
  },

  // Search menu items
  searchMenuItems: async (query: string, page = 1, limit = 10) => {
    const response = await api.get(`/menu/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get single menu item
  getMenuItemById: async (id: string) => {
    const response = await api.get(`/menu/${id}`);
    return response.data;
  },

  // Create new menu item
  createMenuItem: async (menuItem: Partial<MenuItem>) => {
    const response = await api.post('/menu', menuItem);
    return response.data;
  },

  // Update menu item
  updateMenuItem: async (id: string, menuItem: Partial<MenuItem>) => {
    const response = await api.put(`/menu/${id}`, menuItem);
    return response.data;
  },

  // Delete menu item
  deleteMenuItem: async (id: string) => {
    const response = await api.delete(`/menu/${id}`);
    return response.data;
  },

  // Toggle availability
  toggleAvailability: async (id: string) => {
    const response = await api.patch(`/menu/${id}/availability`);
    return response.data;
  }
};
