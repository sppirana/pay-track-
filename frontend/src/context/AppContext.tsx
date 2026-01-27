import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Customer, Transaction, View, ShopSettings } from '../types';
import { useAuth } from './AuthContext';

interface AppContextType {
  customers: Customer[];
  transactions: Transaction[];
  currentView: View;
  selectedCustomerId: string | null;
  setCurrentView: (view: View) => void;
  setSelectedCustomerId: (id: string | null) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>, token?: string) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  getCustomerBalance: (customerId: string) => number;
  getCustomerTransactions: (customerId: string) => Transaction[];
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  shopSettings: ShopSettings;
  updateShopSettings: (settings: ShopSettings) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const API_URL = '/api';

export function AppProvider({ children }: { children: ReactNode }) {
  const { token, isAuthenticated } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentView, setCurrentView] = useState<View>(() => {
    return (localStorage.getItem('currentView') as View) || 'landing';
  });
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(() => {
    return localStorage.getItem('selectedCustomerId') || null;
  });
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [shopSettings, setShopSettings] = useState<ShopSettings>(() => {
    const saved = localStorage.getItem('shopSettings');
    return saved ? JSON.parse(saved) : {
      name: 'PayTrack',
      address: 'Shop Address',
      contact: 'Contact Number'
    };
  });

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  // Save navigation state
  useEffect(() => {
    localStorage.setItem('currentView', currentView);
    if (selectedCustomerId) {
      localStorage.setItem('selectedCustomerId', selectedCustomerId);
    } else {
      localStorage.removeItem('selectedCustomerId');
    }
  }, [currentView, selectedCustomerId]);

  // Load theme from local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const updateShopSettings = (settings: ShopSettings) => {
    setShopSettings(settings);
    localStorage.setItem('shopSettings', JSON.stringify(settings));
  };

  // Fetch initial data when authentication is available
  useEffect(() => {
    if (!token || !isAuthenticated) {
      setCustomers([]);
      setTransactions([]);
      return;
    }

    const fetchData = async () => {
      try {
        const [custRes, txRes] = await Promise.all([
          fetch(`${API_URL}/customers`, { headers: getAuthHeaders() }),
          fetch(`${API_URL}/transactions`, { headers: getAuthHeaders() })
        ]);

        if (custRes.ok && txRes.ok) {
          const custData = await custRes.json();
          const txData = await txRes.json();

          // Map _id to id for frontend compatibility
          setCustomers(custData.map((c: any) => ({ ...c, id: c._id })));
          setTransactions(txData.map((t: any) => ({ ...t, id: t._id })));
        } else if (custRes.status === 401 || txRes.status === 401) {
          setCurrentView('login');
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [token, isAuthenticated]);

  const addCustomer = async (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    try {
      const res = await fetch(`${API_URL}/customers`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(customer),
      });

      if (res.ok) {
        const newCustomer = await res.json();
        setCustomers([...customers, { ...newCustomer, id: newCustomer._id }]);
      } else if (res.status === 401) {
        setCurrentView('login');
      }
    } catch (error) {
      console.error('Failed to add customer:', error);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const res = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(transaction),
      });

      if (res.ok) {
        const newTransaction = await res.json();
        setTransactions([...transactions, { ...newTransaction, id: newTransaction._id }]);
      } else if (res.status === 401) {
        setCurrentView('login');
      }
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      const res = await fetch(`${API_URL}/transactions/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        const updatedTx = await res.json();
        setTransactions(transactions.map(t => t.id === id ? { ...updatedTx, id: updatedTx._id } : t));
      } else if (res.status === 401) {
        setCurrentView('login');
      }
    } catch (error) {
      console.error('Failed to update transaction:', error);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/transactions/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        setTransactions(transactions.filter(t => t.id !== id));
      } else if (res.status === 401) {
        setCurrentView('login');
      }
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/customers/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        setCustomers(customers.filter(c => c.id !== id));
        setTransactions(transactions.filter(t => t.customerId !== id));
        if (selectedCustomerId === id) {
          setSelectedCustomerId(null);
          setCurrentView('dashboard');
        }
      } else if (res.status === 401) {
        setCurrentView('login');
      }
    } catch (error) {
      console.error('Failed to delete customer:', error);
    }
  };

  const getCustomerBalance = (customerId: string): number => {
    const customerTransactions = transactions.filter(t => t.customerId === customerId);
    return customerTransactions.reduce((balance, transaction) => {
      if (transaction.type === 'purchase') {
        return balance + transaction.amount;
      } else {
        return balance - transaction.amount;
      }
    }, 0);
  };

  const getCustomerTransactions = (customerId: string): Transaction[] => {
    return transactions
      .filter(t => t.customerId === customerId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return (
    <AppContext.Provider
      value={{
        customers,
        transactions,
        currentView,
        selectedCustomerId,
        setCurrentView,
        setSelectedCustomerId,
        addCustomer,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        deleteCustomer,
        getCustomerBalance,
        getCustomerTransactions,
        theme,
        toggleTheme,
        shopSettings,
        updateShopSettings
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
