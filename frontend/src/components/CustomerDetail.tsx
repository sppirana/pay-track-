import { useState } from 'react';
import { ArrowLeft, Phone, Mail, Calendar, Plus, Wallet, Pencil, Trash2, X, Save, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Transaction } from '../types';

interface EditCustomerState {
  name: string;
  contact: string;
  email?: string;
}

export default function CustomerDetail() {
  const { customers, selectedCustomerId, getCustomerBalance, getCustomerTransactions, setCurrentView, updateTransaction, deleteTransaction, deleteCustomer, updateCustomer } = useApp();
  const [editingCustomer, setEditingCustomer] = useState<EditCustomerState | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!selectedCustomerId) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-600 dark:text-gray-400">No customer selected</p>
      </div>
    );
  }

  const customer = customers.find(c => c.id === selectedCustomerId);
  if (!customer) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-600 dark:text-gray-400">Customer not found</p>
      </div>
    );
  }

  const balance = getCustomerBalance(customer.id);
  const transactions = getCustomerTransactions(customer.id);

    const handleEditCustomer = () => {
      setEditingCustomer({
        name: customer.name,
        contact: customer.contact,
        email: customer.email || ''
      });
    };

    const handleEditCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!editingCustomer) return;
      setEditingCustomer({ ...editingCustomer, [e.target.name]: e.target.value });
    };

    const handleEditCustomerSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingCustomer) return;
      setEditLoading(true);
      await updateCustomer(customer.id, editingCustomer);
      setEditLoading(false);
      setEditingCustomer(null);
    };

  const handleUpdateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, {
        amount: editingTransaction.amount,
        description: editingTransaction.description,
        date: editingTransaction.date,
        dueDate: editingTransaction.dueDate,
      });
      setEditingTransaction(null);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    setDeletingTransactionId(id);
  };

  const confirmDelete = async () => {
    if (deletingTransactionId) {
      await deleteTransaction(deletingTransactionId);
      setDeletingTransactionId(null);
    }
  };

  const handleDeleteCustomer = async () => {
    if (selectedCustomerId) {
      await deleteCustomer(selectedCustomerId);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentView('customers')}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Customers
        </button>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all flex items-center gap-2"
          title="Remove customer"
        >
          <Trash2 className="w-5 h-5" />
          <span className="text-sm font-medium">Remove Customer</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">{customer.name.charAt(0)}</span>
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{customer.name}</h2>
              <div className="mt-2 space-y-1">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{customer.contact}</span>
                </div>
                {customer.email && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>{customer.email}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Customer since {new Date(customer.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={handleEditCustomer}
                className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all flex items-center gap-2"
                title="Edit customer details"
              >
                <Pencil className="w-5 h-5" />
                <span className="text-sm font-medium">Edit</span>
              </button>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Balance</p>
              <p className={`text-4xl font-bold ${balance > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                Rs {balance.toLocaleString()}
              </p>
              {balance > 0 && (
                <span className="inline-block mt-2 px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 text-sm font-medium rounded-full">
                  Outstanding
                </span>
              )}
              {balance === 0 && (
                <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-sm font-medium rounded-full">
                  Paid in Full
                </span>
              )}
            </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Balance</p>
            <p className={`text-4xl font-bold ${balance > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
              Rs {balance.toLocaleString()}
            </p>
            {balance > 0 && (
              <span className="inline-block mt-2 px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 text-sm font-medium rounded-full">
                Outstanding
              </span>
            )}
            {balance === 0 && (
              <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-sm font-medium rounded-full">
                Paid in Full
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setCurrentView('add-purchase')}
          className="bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group flex items-center"
        >
          <div className="bg-blue-500 p-3 rounded-lg group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <div className="ml-4 text-left">
            <h3 className="font-semibold text-gray-900 dark:text-white">Add Purchase</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Record new sale</p>
          </div>
        </button>

        <button
          onClick={() => setCurrentView('add-payment')}
          className="bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-800 rounded-xl p-4 hover:border-green-400 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all group flex items-center"
        >
          <div className="bg-green-500 p-3 rounded-lg group-hover:scale-110 transition-transform">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div className="ml-4 text-left">
            <h3 className="font-semibold text-gray-900 dark:text-white">Record Payment</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Log payment received</p>
          </div>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Transaction History</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{transactions.length} total transactions</p>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {transactions.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
              No transactions yet
            </div>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${transaction.type === 'purchase'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                        }`}>
                        {transaction.type}
                      </span>
                      <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(transaction.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                        {transaction.type === 'purchase' && transaction.dueDate && (
                          <span className="ml-2 text-xs text-red-500 dark:text-red-400">
                            (Due: {new Date(transaction.dueDate).toLocaleDateString()})
                          </span>
                        )}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-900 dark:text-white font-medium">{transaction.description}</p>
                    {transaction.paymentMethod && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Payment method: {transaction.paymentMethod}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <div className="text-right mr-4">
                      <p className={`text-2xl font-bold ${transaction.type === 'purchase' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                        }`}>
                        {transaction.type === 'purchase' ? '+' : '-'}Rs {transaction.amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditingTransaction(transaction)}
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Edit transaction"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Delete transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {editingTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit Transaction</h3>
              <button
                onClick={() => setEditingTransaction(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount (Rs)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editingTransaction.amount}
                  onChange={(e) => setEditingTransaction({ ...editingTransaction, amount: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={editingTransaction.description}
                  onChange={(e) => setEditingTransaction({ ...editingTransaction, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={new Date(editingTransaction.date).toISOString().split('T')[0]}
                  onChange={(e) => setEditingTransaction({ ...editingTransaction, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {editingTransaction.type === 'purchase' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={editingTransaction.dueDate ? new Date(editingTransaction.dueDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setEditingTransaction({ ...editingTransaction, dueDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTransaction(null)}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleEditCustomerSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit Customer Details</h3>
              <button
                type="button"
                onClick={() => setEditingCustomer(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingCustomer.name}
                  onChange={handleEditCustomerChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact</label>
                <input
                  type="text"
                  name="contact"
                  value={editingCustomer.contact}
                  onChange={handleEditCustomerChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editingCustomer.email}
                  onChange={handleEditCustomerChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingCustomer(null)}
                className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={editLoading}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
                Delete
              </button>
              <button
                onClick={() => setDeletingTransactionId(null)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full p-6 text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Remove Customer?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to remove <strong>{customer.name}</strong>? All associated transactions will be permanently deleted. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteCustomer}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
              >
                Yes, Remove
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
              >
                No, Keep
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
