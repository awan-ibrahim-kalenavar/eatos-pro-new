import React, { useState, useEffect } from 'react';
import { MenuItem } from '../types';

interface MenuItemFormProps {
  menuItem?: MenuItem;
  onSubmit: (data: Partial<MenuItem>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({
  menuItem,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Appetizer' as MenuItem['category'],
    price: '',
    ingredients: '',
    isAvailable: true,
    preparationTime: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (menuItem) {
      setFormData({
        name: menuItem.name || '',
        description: menuItem.description || '',
        category: menuItem.category || 'Appetizer',
        price: menuItem.price?.toString() || '',
        ingredients: menuItem.ingredients?.join(', ') || '',
        isAvailable: menuItem.isAvailable ?? true,
        preparationTime: menuItem.preparationTime?.toString() || '',
        imageUrl: menuItem.imageUrl || ''
      });
    }
  }, [menuItem]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData: Partial<MenuItem> = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category,
      price: parseFloat(formData.price),
      ingredients: formData.ingredients
        .split(',')
        .map(ing => ing.trim())
        .filter(ing => ing.length > 0),
      isAvailable: formData.isAvailable,
      preparationTime: formData.preparationTime ? parseInt(formData.preparationTime) : undefined,
      imageUrl: formData.imageUrl.trim() || undefined
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="slide-up">
      <div className="form-group">
        <label className="form-label">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="form-input"
          placeholder="e.g., Caesar Salad"
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="form-textarea"
          placeholder="Describe your delicious menu item..."
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="form-select"
        >
          <option value="Appetizer">🥗 Appetizer</option>
          <option value="Main Course">🍽️ Main Course</option>
          <option value="Dessert">🍰 Dessert</option>
          <option value="Beverage">🥤 Beverage</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">
          Price <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="form-input"
          placeholder="12.99"
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Ingredients (comma-separated)
        </label>
        <input
          type="text"
          name="ingredients"
          value={formData.ingredients}
          onChange={handleChange}
          placeholder="e.g., tomatoes, cheese, basil, olive oil"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Preparation Time (minutes)
        </label>
        <input
          type="number"
          name="preparationTime"
          value={formData.preparationTime}
          onChange={handleChange}
          min="0"
          className="form-input"
          placeholder="15"
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Image URL
        </label>
        <input
          type="url"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="isAvailable"
            id="isAvailable"
            checked={formData.isAvailable}
            onChange={handleChange}
            className="form-checkbox"
          />
          <span className="ml-2 font-medium text-gray-900">
            Available for order
          </span>
        </label>
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="btn btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary"
        >
          {isLoading ? (
            <>
              <div className="spinner w-4 h-4"></div>
              {menuItem ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              {menuItem ? '✏️ Update Item' : '➕ Create Item'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default MenuItemForm;
