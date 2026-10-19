import React from 'react';
import { ArrowRight, Trash2 } from 'lucide-react';
import { Transaction, Currency } from '../types/finance';
import { getCategoryById } from '../data/categories';
import { formatCurrency, formatRelativeDate } from '../utils/format';
import { CategoryIcon } from './CategoryIcon';

interface RecentTransactionsProps {
  transactions: Transaction[];
  currency: Currency;
  hideAmounts: boolean;
  onViewAll: () => void;
  onDeleteTransaction: (id: string) => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  currency,
  hideAmounts,
  onViewAll,
  onDeleteTransaction,
}) => {
  const displayItems = transactions.slice(0, 5);

  return (
    <div className="px-5 py-3">
      {/* Title & View All */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Последние операции
        </h2>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors"
        >
          <span>Все ({transactions.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Transaction List */}
      <div className="space-y-2.5">
        {displayItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 text-center border border-slate-100 shadow-sm">
            <p className="text-slate-400 text-sm">Операций пока нет</p>
          </div>
        ) : (
          displayItems.map((tx) => {
            const category = getCategoryById(tx.categoryId);
            const isExpense = tx.type === 'expense';

            return (
              <div
                key={tx.id}
                className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs flex items-center justify-between group hover:border-purple-200 transition-all"
              >
                {/* Left: Icon & Title/Note */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-105"
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
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span>{category.name}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatRelativeDate(tx.date)}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Quick Delete */}
                <div className="flex items-center gap-2.5 shrink-0 pl-2">
                  <div className="text-right">
                    <p
                      className={`text-sm font-extrabold tabular-nums ${
                        isExpense ? 'text-slate-900' : 'text-teal-600'
                      }`}
                    >
                      {hideAmounts
                        ? '••••'
                        : `${isExpense ? '-' : '+'}${formatCurrency(tx.amount, currency)}`}
                    </p>
                  </div>
                  <button
                    onClick={() => onDeleteTransaction(tx.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-all"
                    title="Удалить"
                    aria-label="Удалить транзакцию"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
