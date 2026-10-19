import { Transaction, SavingsGoal } from '../types/finance';

const getFormattedDate = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 't-1',
    amount: 18500,
    type: 'expense',
    categoryId: 'food',
    note: 'Супермаркет «Азбука Вкуса»',
    date: getFormattedDate(0), // today
    createdAt: Date.now() - 3600000 * 2,
  },
  {
    id: 't-2',
    amount: 3200,
    type: 'expense',
    categoryId: 'transport',
    note: 'Такси Яндекс Go & Топливо',
    date: getFormattedDate(0), // today
    createdAt: Date.now() - 3600000 * 5,
  },
  {
    id: 't-3',
    amount: 14500,
    type: 'expense',
    categoryId: 'shopping',
    note: 'Кроссовки и одежда для зала',
    date: getFormattedDate(1), // yesterday
    createdAt: Date.now() - 3600000 * 24,
  },
  {
    id: 't-4',
    amount: 6800,
    type: 'expense',
    categoryId: 'cafe',
    note: 'Ужин с коллегами в ресторане',
    date: getFormattedDate(2),
    createdAt: Date.now() - 3600000 * 48,
  },
  {
    id: 't-5',
    amount: 240000,
    type: 'income',
    categoryId: 'salary',
    note: 'Основная зарплата за месяц',
    date: getFormattedDate(3),
    createdAt: Date.now() - 3600000 * 72,
  },
  {
    id: 't-6',
    amount: 70000,
    type: 'income',
    categoryId: 'freelance',
    note: 'Дизайн веб-платформы (аванс)',
    date: getFormattedDate(4),
    createdAt: Date.now() - 3600000 * 96,
  },
  {
    id: 't-7',
    amount: 8400,
    type: 'expense',
    categoryId: 'entertainment',
    note: 'Билеты на концерт и театр',
    date: getFormattedDate(5),
    createdAt: Date.now() - 3600000 * 120,
  },
  {
    id: 't-8',
    amount: 5200,
    type: 'expense',
    categoryId: 'health',
    note: 'Витамины и абонемент в бассейн',
    date: getFormattedDate(6),
    createdAt: Date.now() - 3600000 * 144,
  },
  {
    id: 't-9',
    amount: 9800,
    type: 'expense',
    categoryId: 'home',
    note: 'Коммунальные услуги и интернет',
    date: getFormattedDate(8),
    createdAt: Date.now() - 3600000 * 192,
  },
  {
    id: 't-10',
    amount: 10000,
    type: 'income',
    categoryId: 'investments',
    note: 'Дивиденды по акциям',
    date: getFormattedDate(9),
    createdAt: Date.now() - 3600000 * 216,
  },
  {
    id: 't-11',
    amount: 5100,
    type: 'expense',
    categoryId: 'food',
    note: 'Фермерские продукты и кофе',
    date: getFormattedDate(10),
    createdAt: Date.now() - 3600000 * 240,
  },
];

export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'goal-1',
    name: 'Новый MacBook Pro M3',
    targetAmount: 220000,
    currentAmount: 165000,
    color: '#8B5CF6',
    icon: 'Laptop',
  },
  {
    id: 'goal-2',
    name: 'Отпуск в горах',
    targetAmount: 120000,
    currentAmount: 75000,
    color: '#06B6D4',
    icon: 'Palmtree',
  },
  {
    id: 'goal-3',
    name: 'Подушка безопасности',
    targetAmount: 300000,
    currentAmount: 240000,
    color: '#F97316',
    icon: 'ShieldCheck',
  },
];
