import React from 'react';
import { ArrowUpRight, ArrowDownLeft, TrendingUp, ShieldAlert, Sparkles } from 'lucide-react';
import { Currency } from '../types/finance';
import { formatCurrency } from '../utils/format';

interface BalanceCardProps {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  currency: Currency;
  hideAmounts: boolean;
  onFilterType?: (type: 'all' | 'income' | 'expense') => void;
  activeFilter?: 'all' | 'income' | 'expense';
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  totalBalance,
  totalIncome,
  totalExpense,
  currency,
  hideAmounts,
  onFilterType,
  activeFilter = 'all',
}) => {
  // Savings rate calculation
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)) : 0;

  return (
    <div className="px-5 pt-3 pb-2 space-y-4">
      {/* Primary Balance Section */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
        {/* Soft atmospheric gradient glow behind balance */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-purple-400/20 via-teal-300/15 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-gradient-to-tr from-orange-400/15 via-pink-400/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Общий баланс
            </span>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-100/60">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <span>+{savingsRate}% сбережений</span>
            </div>
          </div>

          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight tabular-nums">
              {hideAmounts ? '••••••••' : formatCurrency(totalBalance, currency)}
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
              <span>Текущий период: Октябрь</span>
            </div>
            <span className="text-slate-400 font-medium">Обновлено только что</span>
          </div>
        </div>
      </div>

      {/* Bright Gradient Cards for Income and Expense */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* Income Card - Saturated Teal / Emerald Gradient */}
        <button
          onClick={() => onFilterType?.(activeFilter === 'income' ? 'all' : 'income')}
          className={`relative overflow-hidden rounded-3xl p-4 text-left transition-all duration-200 group active:scale-[0.98] ${
            activeFilter === 'income' ? 'ring-2 ring-teal-500 ring-offset-2' : ''
          } bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 shadow-md shadow-teal-500/20 text-white`}
        >
          {/* Subtle geometric circle decoration */}
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-sm pointer-events-none" />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Sparkles className="w-4 h-4 text-teal-200" />
          </div>

          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
              <ArrowDownLeft className="w-5 h-5 text-white" />
            </div>
            <span className="text-[11px] font-semibold text-teal-100 bg-white/15 px-2 py-0.5 rounded-full backdrop-blur-xs">
              +Доход
            </span>
          </div>

          <p className="text-xs font-medium text-teal-100 tracking-wide">Доходы</p>
          <p className="text-xl sm:text-2xl font-bold tracking-tight mt-0.5 tabular-nums text-white">
            {hideAmounts ? '••••••' : formatCurrency(totalIncome, currency)}
          </p>
        </button>

        {/* Expense Card - Saturated Orange / Coral / Pink Gradient */}
        <button
          onClick={() => onFilterType?.(activeFilter === 'expense' ? 'all' : 'expense')}
          className={`relative overflow-hidden rounded-3xl p-4 text-left transition-all duration-200 group active:scale-[0.98] ${
            activeFilter === 'expense' ? 'ring-2 ring-orange-500 ring-offset-2' : ''
          } bg-gradient-to-br from-orange-500 via-rose-500 to-pink-500 shadow-md shadow-orange-500/20 text-white`}
        >
          {/* Subtle geometric circle decoration */}
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-sm pointer-events-none" />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <ShieldAlert className="w-4 h-4 text-orange-200" />
          </div>

          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
              <ArrowUpRight className="w-5 h-5 text-white" />
            </div>
            <span className="text-[11px] font-semibold text-orange-100 bg-white/15 px-2 py-0.5 rounded-full backdrop-blur-xs">
              -Расход
            </span>
          </div>

          <p className="text-xs font-medium text-orange-100 tracking-wide">Расходы</p>
          <p className="text-xl sm:text-2xl font-bold tracking-tight mt-0.5 tabular-nums text-white">
            {hideAmounts ? '••••••' : formatCurrency(totalExpense, currency)}
          </p>
        </button>
      </div>
    </div>
  );
};
