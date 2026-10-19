import { Currency, CURRENCIES } from '../types/finance';

export const formatCurrency = (amount: number, currencyCode: Currency = 'RUB'): string => {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.RUB;
  const convertedAmount = currency.code === 'RUB' ? amount : Math.round(amount / currency.rateToRub);

  const formattedNumber = new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 0,
  }).format(convertedAmount);

  return `${formattedNumber} ${currency.symbol}`;
};

export const formatRelativeDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (dateStr === todayStr) {
    return 'Сегодня';
  }
  if (dateStr === yesterdayStr) {
    return 'Вчера';
  }

  const [year, month, day] = dateStr.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);

  return dateObj.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
  });
};
