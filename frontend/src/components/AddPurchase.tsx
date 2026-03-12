/* import { Plus, Trash2 } from 'lucide-react';  <- Ensure these are imported (Plus is already used elsewhere, Trash2 needs checking) */
/* Actually, let me just rewrite the component content correctly, assuming imports will be fixed or are sufficient */

import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Plus, Trash2, UserPlus, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PurchaseItem } from '../types';

export default function AddPurchase() {
  const { customers, addTransaction, addCustomer, setCurrentView, selectedCustomerId } = useApp();
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
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', contact: '', email: '' });
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);

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

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCustomer.name && newCustomer.contact) {
      setIsCreatingCustomer(true);
      await addCustomer(newCustomer);
      
      // Find the newly created customer (it should be the last one added)
      const allCustomers = customers;
      // We need to wait a moment for the customer to be added to the list
      setTimeout(() => {
        const createdCustomer = customers.find(c => 
          c.name === newCustomer.name && c.contact === newCustomer.contact
        );
        if (createdCustomer) {
          setFormData({ ...formData, customerId: createdCustomer.id });
          setSearchTerm(createdCustomer.name);
        }
      }, 300);

      setNewCustomer({ name: '', contact: '', email: '' });
      setShowNewCustomerModal(false);
      setIsCreatingCustomer(false);
    }
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
            <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Select Customer *
            </label>
            <div className="space-y-3">
              {/* Modern Search Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by name or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 dark:focus:border-blue-600 transition-all shadow-sm hover:shadow-md font-medium"
                />
              </div>
              
              {/* Modern Dropdown */}
              <div className="relative">
                <select
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="w-full px-4 py-4 pr-10 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 dark:focus:border-blue-600 transition-all shadow-sm hover:shadow-md font-medium text-base appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%233b82f6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.5rem'
                  }}
                  required
                >
                  <option value="" className="text-gray-500">
                    {filteredCustomers.length === 0 ? '🔍 No matching customers found' : '👤 Choose a customer...'}
                  </option>
                  {filteredCustomers.map((customer) => (
                    <option key={customer.id} value={customer.id} className="py-3">
                      {customer.name} • {customer.contact}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Quick Add Customer Button */}
              <button
                type="button"
                onClick={() => setShowNewCustomerModal(true)}
                className="w-full px-4 py-3.5 border-2 border-dashed border-green-400 dark:border-green-600 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 text-green-700 dark:text-green-300 rounded-xl hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 hover:border-green-500 dark:hover:border-green-500 transition-all flex items-center justify-center gap-2 font-semibold shadow-sm hover:shadow-md"
              >
                <UserPlus className="w-5 h-5" />
                <span>New Customer? Click here to add</span>
              </button>
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

      {/* New Customer Modal */}
      {showNewCustomerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-lg">
                  <UserPlus className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white ml-3">Add New Customer</h3>
              </div>
              <button
                onClick={() => {
                  setShowNewCustomerModal(false);
                  setNewCustomer({ name: '', contact: '', email: '' });
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                type="button"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter customer name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={newCustomer.contact}
                  onChange={(e) => setNewCustomer({ ...newCustomer, contact: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isCreatingCustomer}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingCustomer ? 'Creating...' : 'Create Customer'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewCustomerModal(false);
                    setNewCustomer({ name: '', contact: '', email: '' });
                  }}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
