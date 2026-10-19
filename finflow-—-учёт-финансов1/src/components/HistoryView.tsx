import React, { useState, useMemo } from 'react';
import { Search, Filter, Trash2, Calendar, Sparkles } from 'lucide-react';
import { Transaction, Currency, TransactionType } from '../types/finance';
import { getCategoryById, CATEGORIES } from '../data/categories';
import { formatCurrency, formatRelativeDate } from '../utils/format';
import { CategoryIcon } from './CategoryIcon';

interface HistoryViewProps {
  transactions: Transaction[];
  currency: Currency;
  hideAmounts: boolean;
  onDeleteTransaction: (id: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  transactions,
  currency,
  hideAmounts,
  onDeleteTransaction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Type match
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;

      // Category match
      if (selectedCategory !== 'all' && t.categoryId !== selectedCategory) return false;

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const cat = getCategoryById(t.categoryId);
        const matchNote = t.note.toLowerCase().includes(query);
        const matchCategory = cat.name.toLowerCase().includes(query);
        const matchAmount = t.amount.toString().includes(query);
        if (!matchNote && !matchCategory && !matchAmount) return false;
      }

      return true;
    });
  }, [transactions, typeFilter, selectedCategory, searchQuery]);

  // Group by date
  const groupedByDate = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    filteredTransactions.forEach((t) => {
      if (!groups[t.date]) {
        groups[t.date] = [];
      }
      groups[t.date].push(t);
    });

    // Sort dates descending
    return Object.entries(groups).sort(
      ([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime()
    );
  }, [filteredTransactions]);

  return (
    <div className="px-5 pt-3 pb-24 space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          Лента операций
        </span>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          История транзакций
        </h1>
      </div>

      {/* Search Bar */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          placeholder="Поиск по заметке, сумме или категории..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 text-xs text-slate-400 hover:text-slate-600 font-semibold"
          >
            Очистить
          </button>
        )}
      </div>

      {/* Type Filter Segmented Control */}
      <div className="flex items-center p-1 bg-slate-100 rounded-2xl">
        {(['all', 'expense', 'income'] as const).map((t) => {
          const labels = { all: 'Все', expense: 'Расходы', income: 'Доходы' };
          const isActive = typeFilter === t;
          return (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? t === 'expense'
                    ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-xs'
                    : t === 'income'
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-xs'
                    : 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {labels[t]}
            </button>
          );
        })}
      </div>

      {/* Grouped Transactions List */}
      {groupedByDate.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm mt-4">
          <p className="text-slate-500 font-medium">Ничего не найдено</p>
          <p className="text-xs text-slate-400 mt-1">Попробуйте изменить параметры поиска или фильтры</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedByDate.map(([dateKey, items]) => {
            const dayTotal = items.reduce(
              (acc, item) => (item.type === 'income' ? acc + item.amount : acc - item.amount),
              0
            );

            return (
              <div key={dateKey} className="space-y-2">
                {/* Date header */}
                <div className="flex items-center justify-between px-1 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-purple-500" />
                    <span>{formatRelativeDate(dateKey)}</span>
                  </div>
                  <span
                    className={`font-bold tabular-nums ${
                      dayTotal >= 0 ? 'text-teal-600' : 'text-slate-500'
                    }`}
                  >
                    {hideAmounts
                      ? '••••'
                      : `${dayTotal >= 0 ? '+' : ''}${formatCurrency(dayTotal, currency)}`}
                  </span>
                </div>

                {/* Items in this date */}
                <div className="space-y-2">
                  {items.map((tx) => {
                    const category = getCategoryById(tx.categoryId);
                    const isExpense = tx.type === 'expense';

                    return (
                      <div
                        key={tx.id}
                        className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs flex items-center justify-between group hover:border-purple-200 transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs"
                            style={{
                              backgroundColor: `${category.color}18`,
                              color: category.color,
                            }}
                          >
                            <CategoryIcon name={category.icon} className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">
                              {tx.note || category.name}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">{category.name}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0 pl-2">
                          <p
                            className={`text-sm font-extrabold tabular-nums ${
                              isExpense ? 'text-slate-900' : 'text-teal-600'
                            }`}
                          >
                            {hideAmounts
                              ? '••••'
                              : `${isExpense ? '-' : '+'}${formatCurrency(tx.amount, currency)}`}
                          </p>
                          <button
                            onClick={() => onDeleteTransaction(tx.id)}
                            className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                            title="Удалить"
                            aria-label="Удалить"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
