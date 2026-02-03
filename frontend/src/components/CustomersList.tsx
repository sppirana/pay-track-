import { useState } from 'react';
import { Search, Eye, Plus, Phone, Mail, Filter, Pencil } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CustomersList() {
  const { customers, transactions, getCustomerBalance, setCurrentView, setSelectedCustomerId, updateCustomer } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [minBalance, setMinBalance] = useState('');
  const [maxBalance, setMaxBalance] = useState('');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', contact: '', email: '' });
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [editingCustomer, setEditingCustomer] = useState({ name: '', contact: '', email: '' });

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.contact.includes(searchQuery);

    if (!matchesSearch) return false;

    const balance = getCustomerBalance(customer.id);
    const min = minBalance ? parseFloat(minBalance) : -Infinity;
    const max = maxBalance ? parseFloat(maxBalance) : Infinity;

    return balance >= min && balance <= max;
  });

  const getBalanceStatus = (balance: number) => {
    if (balance === 0) return { color: 'bg-gray-100 text-gray-700 border-gray-200', label: 'Paid' };
    if (balance > 0 && balance < 2000) return { color: 'bg-green-100 text-green-700 border-green-200', label: 'Low' };
    if (balance >= 2000 && balance < 5000) return { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: 'Medium' };
    return { color: 'bg-red-100 text-red-700 border-red-200', label: 'High' };
  };

  const getLastTransactionDate = (customerId: string) => {
    const customerTransactions = transactions.filter(t => t.customerId === customerId);
    if (customerTransactions.length === 0) return 'No transactions';
    const lastTxn = customerTransactions.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
    return new Date(lastTxn.date).toLocaleDateString();
  };

  const handleViewCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setCurrentView('customer-detail');
  };

  const handleEditCustomer = (customer: any) => {
    setEditingCustomerId(customer.id);
    setEditingCustomer({
      name: customer.name,
      contact: customer.contact,
      email: customer.email || ''
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomerId) {
      await updateCustomer(editingCustomerId, editingCustomer);
      setEditingCustomerId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingCustomerId(null);
  };

  const { addCustomer } = useApp();

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCustomer.name && newCustomer.contact) {
      addCustomer(newCustomer);
      setNewCustomer({ name: '', contact: '', email: '' });
      setShowAddCustomer(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Customers</h2>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Manage your customer accounts</p>
          </div>
          <button
            onClick={() => setShowAddCustomer(!showAddCustomer)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </button>
        </div>
      </div>

      {showAddCustomer && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Customer</h3>
          <form onSubmit={handleAddCustomer} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Customer Name *"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
              required
            />
            <input
              type="tel"
              placeholder="Contact Number *"
              value={newCustomer.contact}
              onChange={(e) => setNewCustomer({ ...newCustomer, contact: e.target.value })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
              required
            />
            <input
              type="email"
              placeholder="Email (optional)"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
            />
            <div className="md:col-span-3 flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Customer
              </button>
              <button
                type="button"
                onClick={() => setShowAddCustomer(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {editingCustomerId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Edit Customer</h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <input
                type="text"
                placeholder="Customer Name *"
                value={editingCustomer.name}
                onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
              <input
                type="tel"
                placeholder="Contact Number *"
                value={editingCustomer.contact}
                onChange={(e) => setEditingCustomer({ ...editingCustomer, contact: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={editingCustomer.email}
                onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search customers by name or contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
        <div className="flex space-x-4">
          <div className="relative flex-1">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="number"
              placeholder="Min Balance"
              value={minBalance}
              onChange={(e) => setMinBalance(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <div className="relative flex-1">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="number"
              placeholder="Max Balance"
              value={maxBalance}
              onChange={(e) => setMaxBalance(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Current Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCustomers.map((customer) => {
                const balance = getCustomerBalance(customer.id);
                const status = getBalanceStatus(balance);
                return (
                  <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                            <span className="text-blue-700 dark:text-blue-300 font-semibold">
                              {customer.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{customer.name}</div>
                          {customer.email && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {customer.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900 dark:text-gray-300">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {customer.contact}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          Rs {balance.toLocaleString()}
                        </span>
                        <span className={`ml-3 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {getLastTransactionDate(customer.id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewCustomer(customer.id)}
                          className="flex items-center px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => handleEditCustomer(customer)}
                          className="flex items-center px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
