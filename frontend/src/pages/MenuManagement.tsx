import React, { useState, useEffect } from 'react';
import { MenuItem, MenuFilters } from '../types';
import { menuService } from '../services/menuService';
import { useDebounce } from '../hooks/useDebounce';
import Modal from '../components/Modal';
import MenuItemForm from '../components/MenuItemForm';
import Toast from '../components/Toast';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  ToggleLeft, 
  ToggleRight,
  ChevronLeft,
  ChevronRight,
  Utensils,
  Clock
} from 'lucide-react';

const MenuManagement: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<MenuFilters>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | undefined>();
  const [formLoading, setFormLoading] = useState(false);
  
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  } | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    fetchMenuItems();
  }, [debouncedSearch, filters, pagination.page]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (debouncedSearch) {
        response = await menuService.searchMenuItems(debouncedSearch, pagination.page, pagination.limit);
      } else {
        response = await menuService.getMenuItems({ ...filters, page: pagination.page, limit: pagination.limit });
      }
      
      setMenuItems(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError('Failed to fetch menu items');
      console.error('Error fetching menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<MenuFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleCreate = () => {
    setEditingItem(undefined);
    setShowModal(true);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    try {
      await menuService.deleteMenuItem(id);
      setToast({ message: 'Menu item deleted successfully', type: 'success' });
      fetchMenuItems();
    } catch (err) {
      setToast({ message: 'Failed to delete menu item', type: 'error' });
      console.error('Error deleting menu item:', err);
    }
  };

  const handleToggleAvailability = async (id: string) => {
    try {
      await menuService.toggleAvailability(id);
      setToast({ message: 'Availability updated successfully', type: 'success' });
      fetchMenuItems();
    } catch (err) {
      setToast({ message: 'Failed to update availability', type: 'error' });
      console.error('Error toggling availability:', err);
    }
  };

  const handleFormSubmit = async (data: Partial<MenuItem>) => {
    setFormLoading(true);
    try {
      if (editingItem) {
        await menuService.updateMenuItem(editingItem._id, data);
        setToast({ message: 'Menu item updated successfully', type: 'success' });
      } else {
        await menuService.createMenuItem(data);
        setToast({ message: 'Menu item created successfully', type: 'success' });
      }
      setShowModal(false);
      fetchMenuItems();
    } catch (err) {
      setToast({ 
        message: `Failed to ${editingItem ? 'update' : 'create'} menu item`, 
        type: 'error' 
      });
      console.error('Error saving menu item:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Menu Management</h1>
        <p className="page-subtitle">Manage your restaurant's menu items, pricing, and availability</p>
      </div>

      {/* Search and Filters */}
      <div className="filters-section slide-up">
        <div className="filters-container">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search menu items by name or ingredients..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filters.category || ''}
              onChange={(e) => handleFilterChange({ category: e.target.value || undefined })}
              className="filter-select"
            >
              <option value="">All Categories</option>
              <option value="Appetizer">Appetizer</option>
              <option value="Main Course">Main Course</option>
              <option value="Dessert">Dessert</option>
              <option value="Beverage">Beverage</option>
            </select>

            <select
              value={filters.availability === undefined ? '' : filters.availability.toString()}
              onChange={(e) => handleFilterChange({ 
                availability: e.target.value === '' ? undefined : e.target.value === 'true' 
              })}
              className="filter-select"
            >
              <option value="">All Items</option>
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>

            <button
              onClick={handleCreate}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4" />
              Add New Item
            </button>
          </div>
        </div>
      </div>

      {/* Menu Items Table */}
      <div className="table-container slide-up">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="mt-2">Loading delicious menu items...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <div className="empty-state-icon">⚠️</div>
            <h3 className="text-lg font-semibold mb-2">Oops! Something went wrong</h3>
            <p className="mb-4">{error}</p>
            <button
              onClick={fetchMenuItems}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Utensils className="w-16 h-16" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No menu items found</h3>
            <p className="mb-4">Start by adding your first menu item to get your restaurant running!</p>
            <button
              onClick={handleCreate}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4" />
              Add First Item
            </button>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Menu Item</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="relative group">
                        <img
                          src={item.imageUrl || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=80&h=80&fit=crop&crop=center`}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105"
                          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=6366f1&color=fff&size=48`;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                          {item.description || 'No description available'}
                        </div>
                        {item.preparationTime && (
                          <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.preparationTime} min
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-primary">
                      {item.category}
                    </span>
                  </td>
                  <td>
                    <span className="font-semibold text-gray-900">
                      ${item.price.toFixed(2)}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleAvailability(item._id)}
                      className={`flex items-center gap-2 font-medium transition-colors ${
                        item.isAvailable ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {item.isAvailable ? (
                        <>
                          <ToggleRight className="w-5 h-5" />
                          <span>Available</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-5 h-5" />
                          <span>Unavailable</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="btn btn-sm btn-secondary"
                        title="Edit item"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="btn btn-sm btn-danger"
                        title="Delete item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="pagination">
          <div className="pagination-info">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} menu items
          </div>
          <div className="pagination-controls">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="pagination-btn"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-sm font-medium">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="pagination-btn"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
      >
        <MenuItemForm
          menuItem={editingItem}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowModal(false)}
          isLoading={formLoading}
        />
      </Modal>

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

export default MenuManagement;
