import React, { useState, useMemo } from 'react';
import { TrendingUp, ArrowDownLeft, ArrowUpRight, Award, Zap, Sparkles } from 'lucide-react';
import { Transaction, Currency } from '../types/finance';
import { getCategoryById } from '../data/categories';
import { formatCurrency } from '../utils/format';
import { CategoryIcon } from './CategoryIcon';

interface StatsViewProps {
  transactions: Transaction[];
  currency: Currency;
  hideAmounts: boolean;
}

export const StatsView: React.FC<StatsViewProps> = ({
  transactions,
  currency,
  hideAmounts,
}) => {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  const totalIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalExpense = useMemo(
    () =>
      transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

  // Category rankings
  const categoryRanking = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense');
    const map = new Map<string, number>();
    expenses.forEach((t) => {
      map.set(t.categoryId, (map.get(t.categoryId) || 0) + t.amount);
    });

    return Array.from(map.entries())
      .map(([id, amount]) => {
        const cat = getCategoryById(id);
        const percent = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
        return {
          id,
          name: cat.name,
          icon: cat.icon,
          color: cat.color,
          amount,
          percent,
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, totalExpense]);

  // Top spending category
  const topCategory = categoryRanking[0];

  return (
    <div className="px-5 pt-3 pb-24 space-y-5 animate-in fade-in duration-200">
      {/* Header & Period Switch */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Финансовая аналитика
          </span>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Статистика
          </h1>
        </div>

        {/* Period Tabs */}
        <div className="flex items-center p-1 bg-slate-100 rounded-2xl">
          {(['week', 'month', 'year'] as const).map((p) => {
            const labels = { week: 'Неделя', month: 'Месяц', year: 'Год' };
            const isActive = period === p;
            return (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-white text-purple-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {labels[p]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs relative overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-2">
            <ArrowDownLeft className="w-4 h-4 text-teal-600" />
          </div>
          <span className="text-xs text-slate-400 font-medium">Доходы за период</span>
          <p className="text-lg font-bold text-slate-900 tabular-nums mt-0.5">
            {hideAmounts ? '••••••' : formatCurrency(totalIncome, currency)}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs relative overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
            <ArrowUpRight className="w-4 h-4 text-rose-600" />
          </div>
          <span className="text-xs text-slate-400 font-medium">Расходы за период</span>
          <p className="text-lg font-bold text-slate-900 tabular-nums mt-0.5">
            {hideAmounts ? '••••••' : formatCurrency(totalExpense, currency)}
          </p>
        </div>
      </div>

      {/* Savings Rate Card */}
      <div className="bg-gradient-to-tr from-violet-600 via-purple-600 to-teal-500 rounded-3xl p-5 text-white shadow-lg shadow-purple-500/20 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-purple-100 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Норма накоплений</span>
            </div>
            <p className="text-3xl font-extrabold tracking-tight mt-1 tabular-nums">
              {savingsRate}%
            </p>
            <p className="text-xs text-purple-100 mt-1 max-w-[200px]">
              Вы откладываете {hideAmounts ? '•••' : formatCurrency(Math.max(0, netSavings), currency)} в этом месяце. Отличный темп!
            </p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
            <Award className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Comparison Monthly Bar Chart */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Сравнение: Доходы vs Расходы
          </h2>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
              <span className="text-slate-600 font-medium">Доход</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              <span className="text-slate-600 font-medium">Расход</span>
            </div>
          </div>
        </div>

        {/* 4 Periods Mock Bar Comparison with Real Proportions */}
        <div className="grid grid-cols-4 gap-2 h-36 items-end pt-4 pb-2 border-b border-slate-100">
          {[
            { label: 'Нед 1', income: 75, expense: 45 },
            { label: 'Нед 2', income: 90, expense: 50 },
            { label: 'Нед 3', income: 60, expense: 65 },
            { label: 'Нед 4', income: 100, expense: 40 },
          ].map((bar, i) => (
            <div key={i} className="flex flex-col items-center gap-1 h-full justify-end">
              <div className="w-full flex items-end justify-center gap-1.5 h-28">
                {/* Income Bar (Teal) */}
                <div
                  className="w-3.5 bg-gradient-to-t from-teal-500 to-cyan-400 rounded-t-md transition-all duration-500 hover:brightness-110"
                  style={{ height: `${bar.income}%` }}
                  title={`Доход: ${bar.income}%`}
                />
                {/* Expense Bar (Orange) */}
                <div
                  className="w-3.5 bg-gradient-to-t from-orange-500 to-rose-400 rounded-t-md transition-all duration-500 hover:brightness-110"
                  style={{ height: `${bar.expense}%` }}
                  title={`Расход: ${bar.expense}%`}
                />
              </div>
              <span className="text-[11px] font-semibold text-slate-400 mt-1">{bar.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown Full Ranking */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 tracking-tight">
          Полная структура расходов
        </h2>

        <div className="space-y-3.5">
          {categoryRanking.map((cat, idx) => (
            <div key={cat.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                    style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                  >
                    <CategoryIcon name={cat.icon} className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-slate-800">{cat.name}</span>
                </div>
                <div className="flex items-center gap-2 tabular-nums">
                  <span className="font-extrabold text-slate-900">
                    {hideAmounts ? '••••' : formatCurrency(cat.amount, currency)}
                  </span>
                  <span className="text-slate-400 text-[11px] font-semibold">
                    {cat.percent.toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${cat.percent}%`, backgroundColor: cat.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
