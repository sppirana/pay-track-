import { DollarSign, Users, TrendingUp, AlertCircle, Plus, Wallet } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Dashboard() {
  const { customers, transactions, getCustomerBalance, setCurrentView } = useApp();

  const totalOutstanding = customers.reduce((total, customer) => {
    return total + getCustomerBalance(customer.id);
  }, 0);

  const customersWithPending = customers.filter(customer => getCustomerBalance(customer.id) > 0).length;

  const todayDateOnly = new Date().toISOString().split('T')[0];

  const todayTransactions = transactions.filter(t => {
    const txnDateOnly = new Date(t.date).toISOString().split('T')[0];
    return txnDateOnly === todayDateOnly;
  }).length;

  const overdueCustomers = customers.filter(customer => {
    const balance = getCustomerBalance(customer.id);
    if (balance <= 0) return false;

    const hasOverduePurchase = transactions.some(t => {
      if (t.customerId !== customer.id || t.type !== 'purchase' || !t.dueDate) return false;
      const dueDateOnly = new Date(t.dueDate).toISOString().split('T')[0];
      return dueDateOnly < todayDateOnly;
    });

    return hasOverduePurchase;
  }).length;

  const stats = [
    {
      label: 'Total Outstanding',
      value: `Rs ${totalOutstanding.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      label: 'Customers with Balance',
      value: customersWithPending,
      icon: Users,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      label: "Today's Transactions",
      value: todayTransactions,
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      label: 'Overdue Accounts',
      value: overdueCustomers,
      icon: AlertCircle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
    },
  ];

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Overview of your credit management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className={`${stat.bgColor} dark:bg-opacity-20 p-3 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor} dark:text-opacity-90`} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
              <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <button
          onClick={() => setCurrentView('add-purchase')}
          className="bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-500 p-4 rounded-full group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8 text-white" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Sale</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Record new purchase</p>
        </button>

        <button
          onClick={() => setCurrentView('add-payment')}
          className="bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-800 rounded-xl p-6 hover:border-green-400 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all group"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-500 p-4 rounded-full group-hover:scale-110 transition-transform">
              <Wallet className="w-8 h-8 text-white" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Record Payment</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Log customer payment</p>
        </button>

        <button
          onClick={() => setCurrentView('customers')}
          className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gray-700 dark:bg-gray-600 p-4 rounded-full group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">View Customers</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage customer list</p>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentTransactions.map((transaction) => {
            const customer = customers.find(c => c.id === transaction.customerId);
            return (
              <div key={transaction.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{customer?.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{transaction.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{new Date(transaction.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${transaction.type === 'purchase' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                      }`}>
                      {transaction.type === 'purchase' ? '+' : '-'}Rs {transaction.amount.toLocaleString()}
                    </p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${transaction.type === 'purchase'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                      {transaction.type}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
