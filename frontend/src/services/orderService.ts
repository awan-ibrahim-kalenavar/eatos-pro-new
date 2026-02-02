import api from '../utils/api';
import { Order, ApiResponse, OrderFilters } from '../types';

export const orderService = {
  // Get all orders with filters
  getOrders: async (filters: OrderFilters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/orders?${params.toString()}`);
    return response.data;
  },

  // Get single order
  getOrderById: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Create new order
  createOrder: async (order: Partial<Order>) => {
    const response = await api.post('/orders', order);
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (id: string, status: string) => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  // Get order statistics
  getOrderStats: async () => {
    const response = await api.get('/orders/stats');
    return response.data;
  },

  // Get top selling items
  getTopSellingItems: async () => {
    const response = await api.get('/orders/top-items');
    return response.data;
  }
};
