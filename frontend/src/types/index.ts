export interface Customer {
  id: string;
  name: string;
  contact: string;
  email?: string;
  createdAt: string;
}

export interface PurchaseItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Transaction {
  id: string;
  customerId: string;
  type: 'purchase' | 'payment';
  amount: number;
  description: string;
  date: string;
  dueDate?: string;
  paymentMethod?: string;
  items?: PurchaseItem[];
}

export interface CustomerBalance {
  customerId: string;
  balance: number;
  lastTransactionDate: string;
}

export interface ShopSettings {
  name: string;
  address: string;
  contact: string;
}

export type View = 'welcome' | 'login' | 'dashboard' | 'customers' | 'customer-detail' | 'add-purchase' | 'add-payment' | 'reminders' | 'settings';
