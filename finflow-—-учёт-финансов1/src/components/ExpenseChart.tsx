import React, { useState, useMemo } from 'react';
import { PieChart as PieIcon, BarChart3, ChevronRight } from 'lucide-react';
import { Transaction, Currency } from '../types/finance';
import { CATEGORIES, getCategoryById } from '../data/categories';
import { formatCurrency } from '../utils/format';
import { CategoryIcon } from './CategoryIcon';

interface ExpenseChartProps {
  transactions: Transaction[];
  currency: Currency;
  hideAmounts: boolean;
  onSelectCategory?: (categoryId: string) => void;
}

export const ExpenseChart: React.FC<ExpenseChartProps> = ({
  transactions,
  currency,
  hideAmounts,
  onSelectCategory,
}) => {
  const [chartMode, setChartMode] = useState<'donut' | 'bar'>('donut');
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);

  // Filter only expenses
  const expenseTransactions = useMemo(
    () => transactions.filter((t) => t.type === 'expense'),
    [transactions]
  );

  const totalExpense = useMemo(
    () => expenseTransactions.reduce((sum, t) => sum + t.amount, 0),
    [expenseTransactions]
  );

  // Group by category
  const categoryStats = useMemo(() => {
    const map = new Map<string, number>();
    expenseTransactions.forEach((t) => {
      const prev = map.get(t.categoryId) || 0;
      map.set(t.categoryId, prev + t.amount);
    });

    const items = Array.from(map.entries())
      .map(([catId, amount]) => {
        const cat = getCategoryById(catId);
        const percent = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
        return {
          id: catId,
          name: cat.name,
          icon: cat.icon,
          color: cat.color,
          bgClass: cat.bgClass,
          amount,
          percent,
        };
      })
      .sort((a, b) => b.amount - a.amount);

    return items;
  }, [expenseTransactions, totalExpense]);

  // Donut SVG calculations
  const donutSegments = useMemo(() => {
    let accumulatedPercent = 0;
    const radius = 68;
    const strokeWidth = 22;
    const circumference = 2 * Math.PI * radius;

    return categoryStats.map((item) => {
      const strokeDasharray = `${(item.percent / 100) * circumference} ${circumference}`;
      const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
      accumulatedPercent += item.percent;

      return {
        ...item,
        radius,
        strokeWidth,
        circumference,
        strokeDasharray,
        strokeDashoffset,
      };
    });
  }, [categoryStats]);

  const activeCategory = useMemo(() => {
    if (!selectedCatId) return null;
    return categoryStats.find((c) => c.id === selectedCatId) || null;
  }, [selectedCatId, categoryStats]);

  if (categoryStats.length === 0) {
    return (
      <div className="px-5 py-2">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-center">
          <p className="text-slate-400 text-sm">Пока нет расходов для отображения диаграммы</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-2">
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 relative">
        {/* Header with Title and Mode Switcher */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Аналитика расходов
            </span>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Распределение по категориям
            </h2>
          </div>

          {/* Toggle buttons: Donut vs Bar */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setChartMode('donut')}
              className={`p-1.5 rounded-lg transition-all ${
                chartMode === 'donut'
                  ? 'bg-white text-purple-600 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Круговая диаграмма"
              aria-label="Круговая диаграмма"
            >
              <PieIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartMode('bar')}
              className={`p-1.5 rounded-lg transition-all ${
                chartMode === 'bar'
                  ? 'bg-white text-teal-600 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Столбчатая диаграмма"
              aria-label="Столбчатая диаграмма"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chart View */}
        {chartMode === 'donut' ? (
          <div className="flex flex-col items-center">
            {/* SVG Circular Donut Chart */}
            <div className="relative w-48 h-48 my-2 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 180 180">
                {/* Background Track */}
                <circle
                  cx="90"
                  cy="90"
                  r="68"
                  fill="transparent"
                  stroke="#F1F5F9"
                  strokeWidth="20"
                />

                {/* Slices */}
                {donutSegments.map((segment) => {
                  const isSelected = selectedCatId === segment.id;
                  return (
                    <circle
                      key={segment.id}
                      cx="90"
                      cy="90"
                      r={segment.radius}
                      fill="transparent"
                      stroke={segment.color}
                      strokeWidth={isSelected ? 26 : 22}
                      strokeDasharray={segment.strokeDasharray}
                      strokeDashoffset={segment.strokeDashoffset}
                      strokeLinecap="round"
                      className="cursor-pointer transition-all duration-300 hover:opacity-90"
                      onClick={() =>
                        setSelectedCatId(selectedCatId === segment.id ? null : segment.id)
                      }
                    />
                  );
                })}
              </svg>

              {/* Center Info in Donut Hole */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 cursor-pointer"
                onClick={() => setSelectedCatId(null)}
              >
                {activeCategory ? (
                  <>
                    <span className="text-[11px] font-semibold text-slate-400 truncate max-w-[100px]">
                      {activeCategory.name}
                    </span>
                    <span className="text-base font-extrabold text-slate-900 tabular-nums">
                      {hideAmounts ? '••••' : formatCurrency(activeCategory.amount, currency)}
                    </span>
                    <span
                      className="text-[11px] font-bold px-1.5 py-0.5 rounded-full mt-0.5 text-white shadow-xs"
                      style={{ backgroundColor: activeCategory.color }}
                    >
                      {activeCategory.percent.toFixed(1)}%
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[11px] font-medium text-slate-400">Всего расходов</span>
                    <span className="text-lg font-extrabold text-slate-900 tabular-nums">
                      {hideAmounts ? '••••' : formatCurrency(totalExpense, currency)}
                    </span>
                    <span className="text-[10px] text-purple-600 font-semibold mt-0.5">
                      Нажмите на сектор
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Bar Chart Mode */
          <div className="space-y-3 py-2">
            {categoryStats.slice(0, 5).map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedCatId(selectedCatId === item.id ? null : item.id)}
                className={`p-2 rounded-2xl cursor-pointer transition-all ${
                  selectedCatId === item.id ? 'bg-slate-50 ring-1 ring-purple-300' : 'hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-semibold text-slate-700">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-bold tabular-nums">
                    <span className="text-slate-900">
                      {hideAmounts ? '••••' : formatCurrency(item.amount, currency)}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      {item.percent.toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Bar line */}
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percent}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Category breakdown pills / list */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
          {categoryStats.slice(0, 4).map((item) => {
            const isSelected = selectedCatId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedCatId(selectedCatId === item.id ? null : item.id);
                  onSelectCategory?.(item.id);
                }}
                className={`flex items-center justify-between p-2 rounded-2xl border transition-all text-left ${
                  isSelected
                    ? 'border-purple-400 bg-purple-50/50 shadow-xs'
                    : 'border-slate-100 bg-slate-50/60 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                    style={{ backgroundColor: `${item.color}20`, color: item.color }}
                  >
                    <CategoryIcon name={item.icon} className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {item.percent.toFixed(0)}%
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
