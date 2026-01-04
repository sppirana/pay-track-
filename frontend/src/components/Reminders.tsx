import { AlertCircle, Clock, TrendingUp, Eye, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Reminders() {
  const { customers, transactions, getCustomerBalance, setCurrentView, setSelectedCustomerId } = useApp();

  const handleViewCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setCurrentView('customer-detail');
  };

  const handleWhatsApp = (customer: any, balance: number, dueDate: string) => {
    const formattedDate = new Date(dueDate).toLocaleDateString();
    const message = `Hello ${customer.name}, gentle reminder: your balance of Rs ${balance.toLocaleString()} was due on ${formattedDate}. Please pay at your earliest convenience. Thank you!`;
    const whatsappUrl = `https://wa.me/${customer.contact.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getCustomerAlerts = () => {
    return customers
      .map(customer => {
        const balance = getCustomerBalance(customer.id);
        if (balance <= 0) return null;

        const customerTxns = transactions.filter(t => t.customerId === customer.id && t.type === 'purchase');
        if (customerTxns.length === 0) return null;

        const lastPurchase = customerTxns.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];

        // Ensure we calculate based on the specific due date of the transaction if it exists
        const dueDate = lastPurchase.dueDate ? new Date(lastPurchase.dueDate) : new Date(new Date(lastPurchase.date).getTime() + 30 * 24 * 60 * 60 * 1000);
        const daysOverdue = Math.floor((new Date().getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        const daysUntilDue = Math.floor((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

        let severity: 'high' | 'medium' | 'low' = 'low';
        let message = '';

        if (daysOverdue > 0) {
          severity = 'high';
          message = `Payment overdue by ${daysOverdue} days`;
        } else if (daysUntilDue <= 7) {
          severity = 'medium';
          message = `Payment due soon (${daysUntilDue} days remaining)`;
        } else if (balance > 5000) {
          severity = 'medium';
          message = 'High outstanding balance';
        } else {
          severity = 'low';
          message = 'Outstanding balance';
        }

        return {
          customer,
          balance,
          daysOverdue,
          dueDate: dueDate.toISOString(), // We now store dueDate instead of lastPurchaseDate
          lastPurchaseDate: lastPurchase.date, // Keep for reference
          severity,
          message,
        };
      })
      .filter(alert => alert !== null)
      .sort((a, b) => {
        const severityOrder = { high: 0, medium: 1, low: 2 };
        return severityOrder[a!.severity] - severityOrder[b!.severity];
      });
  };

  const alerts = getCustomerAlerts();
  const highPriority = alerts.filter(a => a?.severity === 'high').length;
  const mediumPriority = alerts.filter(a => a?.severity === 'medium').length;
  const lowPriority = alerts.filter(a => a?.severity === 'low').length;

  const getSeverityStyles = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return {
          bg: 'bg-red-50 dark:bg-red-900/30',
          border: 'border-red-200 dark:border-red-900/50',
          badge: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
          icon: 'text-red-600 dark:text-red-400',
        };
      case 'medium':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/30',
          border: 'border-yellow-200 dark:border-yellow-900/50',
          badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
          icon: 'text-yellow-600 dark:text-yellow-400',
        };
      case 'low':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/30',
          border: 'border-blue-200 dark:border-blue-900/50',
          badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
          icon: 'text-blue-600 dark:text-blue-400',
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Payment Reminders</h2>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Track overdue accounts and high balances</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="bg-red-100 dark:bg-red-900/50 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-3xl font-bold text-red-600 dark:text-red-400">{highPriority}</span>
          </div>
          <p className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-400">High Priority</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">Overdue payments</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="bg-yellow-100 dark:bg-yellow-900/50 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <span className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{mediumPriority}</span>
          </div>
          <p className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-400">Medium Priority</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">Due soon or high balance</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{lowPriority}</span>
          </div>
          <p className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-400">Low Priority</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">Regular balances</p>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="bg-green-100 dark:bg-green-900/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">All Clear!</h3>
            <p className="text-gray-600 dark:text-gray-400">No outstanding balances or overdue accounts</p>
          </div>
        ) : (
          alerts.map((alert) => {
            if (!alert) return null;
            const styles = getSeverityStyles(alert.severity);
            return (
              <div
                key={alert.customer.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 ${styles.border} p-6 hover:shadow-md transition-shadow`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between">
                  <div className="flex items-start flex-1 w-full">
                    <div className={`${styles.bg} p-3 rounded-lg flex-shrink-0`}>
                      <AlertCircle className={`w-6 h-6 ${styles.icon}`} />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{alert.customer.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles.badge}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{alert.message}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-500">
                        <span>Balance: Rs {alert.balance.toLocaleString()}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>Due: {new Date(alert.dueDate).toLocaleDateString()}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{alert.customer.contact}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 md:ml-4 flex flex-row md:flex-col gap-2 w-full md:w-auto">
                    <button
                      onClick={() => handleWhatsApp(alert.customer, alert.balance, alert.dueDate)}
                      className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors whitespace-nowrap"
                      title="Send WhatsApp Reminder"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Remind
                    </button>
                    <button
                      onClick={() => handleViewCustomer(alert.customer.id)}
                      className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors whitespace-nowrap"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
