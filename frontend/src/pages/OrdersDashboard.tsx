import React, { useState, useEffect } from 'react';
import { Order, OrderFilters } from '../types';
import { orderService } from '../services/orderService';
import Toast from '../components/Toast';
import { 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  ChefHat,
  Truck,
  ShoppingCart,
  Calendar
} from 'lucide-react';

const OrdersDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<OrderFilters>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  } | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [filters, pagination.page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await orderService.getOrders({ 
        ...filters, 
        page: pagination.page, 
        limit: pagination.limit 
      });
      
      setOrders(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<OrderFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId);
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setToast({ message: 'Order status updated successfully', type: 'success' });
      fetchOrders();
    } catch (err) {
      setToast({ message: 'Failed to update order status', type: 'error' });
      console.error('Error updating order status:', err);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-4 h-4" />;
      case 'Preparing':
        return <ChefHat className="w-4 h-4" />;
      case 'Ready':
        return <CheckCircle className="w-4 h-4" />;
      case 'Delivered':
        return <Truck className="w-4 h-4" />;
      case 'Cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'badge-warning';
      case 'Preparing':
        return 'badge-info';
      case 'Ready':
        return 'badge-success';
      case 'Delivered':
        return 'badge-primary';
      case 'Cancelled':
        return 'badge-error';
      default:
        return 'badge-primary';
    }
  };

  const getNextStatusOptions = (currentStatus: string) => {
    const statusFlow: Record<string, string[]> = {
      'Pending': ['Preparing', 'Cancelled'],
      'Preparing': ['Ready', 'Cancelled'],
      'Ready': ['Delivered'],
      'Delivered': [],
      'Cancelled': []
    };
    return statusFlow[currentStatus] || [];
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Orders Dashboard</h1>
        <p className="page-subtitle">Track and manage customer orders in real-time</p>
      </div>

      {/* Filters */}
      <div className="filters-section slide-up">
        <div className="filters-container">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-gray-500" />
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange({ status: e.target.value || undefined })}
              className="filter-select"
            >
              <option value="">All Orders</option>
              <option value="Pending">⏳ Pending</option>
              <option value="Preparing">👨‍🍳 Preparing</option>
              <option value="Ready">✅ Ready</option>
              <option value="Delivered">🚚 Delivered</option>
              <option value="Cancelled">❌ Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="table-container slide-up">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="mt-2">Loading customer orders...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <div className="empty-state-icon">⚠️</div>
            <h3 className="text-lg font-semibold mb-2">Oops! Something went wrong</h3>
            <p className="mb-4">{error}</p>
            <button
              onClick={fetchOrders}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <ShoppingCart className="w-16 h-16" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No orders found</h3>
            <p className="mb-4">No orders match your current filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {orders.map((order) => (
              <div key={order._id} className="hover:bg-gray-50 transition-colors">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => toggleOrderExpansion(order._id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {expandedOrders.has(order._id) ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                          #{order.orderNumber.slice(-3)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-900">
                              {order.orderNumber}
                            </span>
                            <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(order.status)}
                                {order.status}
                              </div>
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-4 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {order.customerName}
                            </span>
                            <span>Table {order.tableNumber}</span>
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          ${order.totalAmount.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.items.length} items
                        </div>
                      </div>

                      {getNextStatusOptions(order.status).length > 0 && (
                        <div className="relative">
                          <select
                            value=""
                            onChange={(e) => {
                              if (e.target.value) {
                                handleStatusUpdate(order._id, e.target.value);
                              }
                            }}
                            disabled={updatingStatus === order._id}
                            className="filter-select"
                          >
                            <option value="">Update Status</option>
                            {getNextStatusOptions(order.status).map(status => (
                              <option key={status} value={status}>
                                {status === 'Preparing' && '👨‍🍳 Start Preparing'}
                                {status === 'Ready' && '✅ Mark Ready'}
                                {status === 'Delivered' && '🚚 Mark Delivered'}
                                {status === 'Cancelled' && '❌ Cancel Order'}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expanded Order Details */}
                  {expandedOrders.has(order._id) && (
                    <div className="mt-4 pl-9 border-t border-gray-100 pt-4 slide-up">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        Order Items
                      </h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                                {item.quantity}
                              </div>
                              <div>
                                <span className="font-medium text-gray-900">{item.menuItem.name}</span>
                                <span className="text-gray-500 ml-2">×{item.quantity}</span>
                              </div>
                            </div>
                            <span className="font-semibold text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="pagination">
          <div className="pagination-info">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} orders
          </div>
          <div className="pagination-controls">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm font-medium">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default OrdersDashboard;
