import { Category, CURRENCIES } from '../types/finance';

export { CURRENCIES };

export const CATEGORIES: Category[] = [
  // Expenses - vibrant purple, teal, orange palette + accents
  {
    id: 'food',
    name: 'Еда и продукты',
    icon: 'Utensils',
    color: '#F97316', // Orange
    bgClass: 'bg-orange-500/15 text-orange-600',
    borderClass: 'border-orange-500',
    textClass: 'text-orange-500',
    type: 'expense',
  },
  {
    id: 'transport',
    name: 'Транспорт',
    icon: 'Car',
    color: '#0D9488', // Teal
    bgClass: 'bg-teal-500/15 text-teal-600',
    borderClass: 'border-teal-500',
    textClass: 'text-teal-500',
    type: 'expense',
  },
  {
    id: 'shopping',
    name: 'Покупки',
    icon: 'ShoppingBag',
    color: '#8B5CF6', // Purple
    bgClass: 'bg-purple-500/15 text-purple-600',
    borderClass: 'border-purple-500',
    textClass: 'text-purple-500',
    type: 'expense',
  },
  {
    id: 'entertainment',
    name: 'Развлечения',
    icon: 'Gamepad2',
    color: '#EC4899', // Pink / Rose
    bgClass: 'bg-pink-500/15 text-pink-600',
    borderClass: 'border-pink-500',
    textClass: 'text-pink-500',
    type: 'expense',
  },
  {
    id: 'health',
    name: 'Здоровье',
    icon: 'HeartPulse',
    color: '#10B981', // Emerald
    bgClass: 'bg-emerald-500/15 text-emerald-600',
    borderClass: 'border-emerald-500',
    textClass: 'text-emerald-500',
    type: 'expense',
  },
  {
    id: 'cafe',
    name: 'Кафе и бары',
    icon: 'Coffee',
    color: '#FB923C', // Warm Orange
    bgClass: 'bg-amber-500/15 text-amber-600',
    borderClass: 'border-amber-500',
    textClass: 'text-amber-500',
    type: 'expense',
  },
  {
    id: 'home',
    name: 'Дом и счета',
    icon: 'Home',
    color: '#6366F1', // Indigo
    bgClass: 'bg-indigo-500/15 text-indigo-600',
    borderClass: 'border-indigo-500',
    textClass: 'text-indigo-500',
    type: 'expense',
  },
  {
    id: 'travel',
    name: 'Путешествия',
    icon: 'Plane',
    color: '#06B6D4', // Cyan
    bgClass: 'bg-cyan-500/15 text-cyan-600',
    borderClass: 'border-cyan-500',
    textClass: 'text-cyan-500',
    type: 'expense',
  },
  {
    id: 'education',
    name: 'Образование',
    icon: 'GraduationCap',
    color: '#7C3AED', // Deep Violet
    bgClass: 'bg-violet-500/15 text-violet-600',
    borderClass: 'border-violet-500',
    textClass: 'text-violet-500',
    type: 'expense',
  },

  // Income categories
  {
    id: 'salary',
    name: 'Зарплата',
    icon: 'Briefcase',
    color: '#0D9488', // Teal
    bgClass: 'bg-teal-500/15 text-teal-600',
    borderClass: 'border-teal-500',
    textClass: 'text-teal-500',
    type: 'income',
  },
  {
    id: 'freelance',
    name: 'Фриланс',
    icon: 'Laptop',
    color: '#8B5CF6', // Purple
    bgClass: 'bg-purple-500/15 text-purple-600',
    borderClass: 'border-purple-500',
    textClass: 'text-purple-500',
    type: 'income',
  },
  {
    id: 'investments',
    name: 'Инвестиции',
    icon: 'TrendingUp',
    color: '#F97316', // Orange
    bgClass: 'bg-orange-500/15 text-orange-600',
    borderClass: 'border-orange-500',
    textClass: 'text-orange-500',
    type: 'income',
  },
  {
    id: 'cashback',
    name: 'Кэшбэк & Бонусы',
    icon: 'Sparkles',
    color: '#10B981', // Emerald
    bgClass: 'bg-emerald-500/15 text-emerald-600',
    borderClass: 'border-emerald-500',
    textClass: 'text-emerald-500',
    type: 'income',
  },
  {
    id: 'gift',
    name: 'Подарки',
    icon: 'Gift',
    color: '#EC4899', // Pink
    bgClass: 'bg-pink-500/15 text-pink-600',
    borderClass: 'border-pink-500',
    textClass: 'text-pink-500',
    type: 'income',
  },
  {
    id: 'other_income',
    name: 'Прочий доход',
    icon: 'Coins',
    color: '#06B6D4', // Cyan
    bgClass: 'bg-cyan-500/15 text-cyan-600',
    borderClass: 'border-cyan-500',
    textClass: 'text-cyan-500',
    type: 'income',
  },
];

export const getCategoryById = (id: string): Category => {
  const cat = CATEGORIES.find((c) => c.id === id);
  if (cat) return cat;
  return {
    id: 'other',
    name: 'Другое',
    icon: 'CircleDot',
    color: '#64748B',
    bgClass: 'bg-slate-500/15 text-slate-600',
    borderClass: 'border-slate-500',
    textClass: 'text-slate-500',
    type: 'expense',
  };
};
