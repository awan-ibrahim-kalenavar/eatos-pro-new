export interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  category: 'Appetizer' | 'Main Course' | 'Dessert' | 'Beverage';
  price: number;
  ingredients: string[];
  isAvailable: boolean;
  preparationTime?: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled';
  customerName: string;
  tableNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface MenuFilters {
  category?: string;
  availability?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface OrderFilters {
  status?: string;
  page?: number;
  limit?: number;
}
