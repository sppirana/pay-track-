/* import { Plus, Trash2 } from 'lucide-react';  <- Ensure these are imported (Plus is already used elsewhere, Trash2 needs checking) */
/* Actually, let me just rewrite the component content correctly, assuming imports will be fixed or are sufficient */

import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PurchaseItem } from '../types';

export default function AddPurchase() {
  const { customers, addTransaction, setCurrentView, selectedCustomerId } = useApp();
  const [formData, setFormData] = useState({
    customerId: selectedCustomerId || '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const [items, setItems] = useState<Omit<PurchaseItem, 'id'>[]>([
    { name: '', quantity: 1, price: 0 }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  // Calculate total whenever items change
  useEffect(() => {
    const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    // automatically update the description based on items
    const itemDesc = items
      .filter(i => i.name.trim() !== '')
      .map(i => `${i.quantity}x ${i.name}`)
      .join(', ');

    setFormData(prev => ({
      ...prev,
      amount: total.toString(),
      description: itemDesc || prev.description // Only overwrite if items exist
    }));
  }, [items]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contact.includes(searchTerm)
  );

  const handleAddItem = () => {
    setItems([...items, { name: '', quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems.length > 0 ? newItems : [{ name: '', quantity: 1, price: 0 }]); // Keep at least one
  };

  const handleItemChange = (index: number, field: keyof Omit<PurchaseItem, 'id'>, value: string | number) => {
    const newItems = [...items];
    if (field === 'price' || field === 'quantity') {
      newItems[index] = { ...newItems[index], [field]: Number(value) };
    } else {
      newItems[index] = { ...newItems[index], [field]: value as string };
    }
    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.customerId && formData.amount) {
      // Filter out empty items
      const validItems = items.filter(i => i.name.trim() !== '' && i.price > 0).map(i => ({
        ...i,
        id: crypto.randomUUID()
      }));

      addTransaction({
        customerId: formData.customerId,
        type: 'purchase',
        amount: parseFloat(formData.amount),
        description: formData.description,
        date: formData.date,
        dueDate: formData.dueDate,
        items: validItems
      });

      setFormData({
        customerId: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      setItems([{ name: '', quantity: 1, price: 0 }]);
      setCurrentView('dashboard');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => setCurrentView('dashboard')}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg">
            <ShoppingCart className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Record New Purchase</h2>
            <p className="text-gray-600 dark:text-gray-400">Add a credit sale for a customer</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Customer *
            </label>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <select
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">{filteredCustomers.length === 0 ? 'No matching customers' : 'Choose a customer...'}</option>
                {filteredCustomers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.contact}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Itemized Entry Section */}
          <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6 my-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Purchased Items</h3>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                <div className="col-span-6">Item Details</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-3">Price</div>
                <div className="col-span-1"></div>
              </div>

              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-6">
                    <input
                      type="text"
                      placeholder="Item Name (e.g. Milk)"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-center"
                    />
                  </div>
                  <div className="col-span-3 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">Rs</span>
                    <input
                      type="number"
                      min="0"
                      value={item.price === 0 ? '' : item.price}
                      onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddItem}
                className="mt-2 flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Another Item
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Total Amount (Rs) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                readOnly
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-bold text-lg"
              />
              <p className="text-xs text-gray-500 mt-1">Calculated from items above</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="hidden">
            {/* Hidden description field still populated for backward compatibility/summary */}
            <input type="hidden" value={formData.description} />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Record Purchase
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('dashboard')}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
