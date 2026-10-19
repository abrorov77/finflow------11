export type TransactionType = 'expense' | 'income';

export type Currency = 'RUB' | 'TJS' | 'USD' | 'EUR' | 'KZT' | 'UZS';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  label: string;
  rateToRub: number; // For multi-currency display
}

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  RUB: { code: 'RUB', symbol: '₽', label: 'Рубль (₽)', rateToRub: 1 },
  TJS: { code: 'TJS', symbol: 'смн', label: 'Сомони (смн)', rateToRub: 8.6 },
  USD: { code: 'USD', symbol: '$', label: 'Доллар ($)', rateToRub: 92 },
  EUR: { code: 'EUR', symbol: '€', label: 'Евро (€)', rateToRub: 100 },
  KZT: { code: 'KZT', symbol: '₸', label: 'Тенге (₸)', rateToRub: 0.2 },
  UZS: { code: 'UZS', symbol: 'сум', label: 'Сум (UZS)', rateToRub: 0.0073 },
};

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string; // Tailwind color class or hex
  bgClass: string;
  borderClass: string;
  textClass: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  note: string;
  date: string; // YYYY-MM-DD
  createdAt: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  color: string;
  icon: string;
}
