import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Target,
  Plus,
  RotateCcw,
  Sparkles,
  CreditCard,
  Edit2,
  Check,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { Currency, SavingsGoal, CURRENCIES } from '../types/finance';
import { formatCurrency } from '../utils/format';
import { CategoryIcon } from './CategoryIcon';

interface ProfileViewProps {
  currency: Currency;
  onChangeCurrency: (currency: Currency) => void;
  monthlyBudget: number;
  onUpdateBudget: (newBudget: number) => void;
  totalExpenseThisMonth: number;
  savingsGoals: SavingsGoal[];
  onAddFundsToGoal: (goalId: string, amount: number) => void;
  onResetData: () => void;
  hideAmounts: boolean;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currency,
  onChangeCurrency,
  monthlyBudget,
  onUpdateBudget,
  totalExpenseThisMonth,
  savingsGoals,
  onAddFundsToGoal,
  onResetData,
  hideAmounts,
}) => {
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetValue, setBudgetValue] = useState(monthlyBudget.toString());
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const budgetPercent = Math.min(100, Math.round((totalExpenseThisMonth / monthlyBudget) * 100));
  const remainingBudget = Math.max(0, monthlyBudget - totalExpenseThisMonth);

  const handleSaveBudget = () => {
    const val = parseFloat(budgetValue);
    if (val && val > 0) {
      onUpdateBudget(val);
    }
    setIsEditingBudget(false);
  };

  return (
    <div className="px-5 pt-3 pb-24 space-y-5 animate-in fade-in duration-200">
      {/* Profile Header */}
      <div>
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          Личный кабинет
        </span>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Профиль и Настройки
        </h1>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex items-center gap-4 relative overflow-hidden">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-violet-600 via-purple-600 to-teal-400 p-[2px] shadow-md shadow-purple-500/20 shrink-0">
          <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center">
            <span className="font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-tr from-violet-600 to-teal-500">
              AF
            </span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h2 className="text-base font-bold text-slate-900 truncate">Алекс Федоров</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
              PRO
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">alex.fedorov@gmail.com</p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-teal-600 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
            <span>Аккаунт защищен</span>
          </div>
        </div>
      </div>

      {/* Monthly Budget Management Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Месячный бюджет</h3>
              <p className="text-[11px] text-slate-400">Лимит трат на месяц</p>
            </div>
          </div>

          {!isEditingBudget ? (
            <button
              onClick={() => {
                setBudgetValue(monthlyBudget.toString());
                setIsEditingBudget(true);
              }}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title="Изменить лимит"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSaveBudget}
              className="p-1.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              title="Сохранить"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {isEditingBudget ? (
          <div className="flex items-center gap-2 pt-1">
            <input
              type="number"
              value={budgetValue}
              onChange={(e) => setBudgetValue(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-purple-300 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Сумма бюджета"
            />
            <button
              onClick={handleSaveBudget}
              className="px-3 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
            >
              Готово
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-baseline justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-500">
                Потрачено: {hideAmounts ? '••••' : formatCurrency(totalExpenseThisMonth, currency)}
              </span>
              <span className="font-extrabold text-slate-900 tabular-nums">
                из {hideAmounts ? '••••' : formatCurrency(monthlyBudget, currency)}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  budgetPercent > 90
                    ? 'bg-gradient-to-r from-rose-500 to-red-600'
                    : budgetPercent > 70
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500'
                    : 'bg-gradient-to-r from-teal-500 to-emerald-500'
                }`}
                style={{ width: `${budgetPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
              <span>Использовано: {budgetPercent}%</span>
              <span className="text-emerald-600 font-bold">
                Осталось: {hideAmounts ? '••••' : formatCurrency(remainingBudget, currency)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Savings Goals / Piggy Banks ("Копилки") */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Копилки и цели</h3>
              <p className="text-[11px] text-slate-400">Накопления на мечту</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {savingsGoals.map((goal) => {
            const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            const goalIncrement =
              currency === 'TJS'
                ? 500
                : currency === 'USD' || currency === 'EUR'
                ? 50
                : currency === 'UZS'
                ? 500000
                : 5000;

            return (
              <div key={goal.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs"
                      style={{ backgroundColor: goal.color }}
                    >
                      <CategoryIcon name={goal.icon} className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{goal.name}</h4>
                      <p className="text-[10px] text-slate-500">
                        {hideAmounts ? '••••' : formatCurrency(goal.currentAmount, currency)} из{' '}
                        {hideAmounts ? '••••' : formatCurrency(goal.targetAmount, currency)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onAddFundsToGoal(goal.id, goalIncrement)}
                    className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-purple-700 shadow-xs hover:bg-purple-50 hover:border-purple-300 transition-all active:scale-95 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+{formatCurrency(goalIncrement, currency)}</span>
                  </button>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: goal.color }}
                  />
                </div>

                <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                  <span>Прогресс</span>
                  <span>{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Currency Switcher Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Основная валюта</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.values(CURRENCIES).map((c) => {
            const isSelected = currency === c.code;
            return (
              <button
                key={c.code}
                onClick={() => onChangeCurrency(c.code)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50/50 text-purple-900 ring-2 ring-purple-400/20 font-bold'
                    : 'border-slate-100 bg-slate-50 text-slate-700 hover:bg-slate-100 font-medium'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span>{c.label}</span>
                  <span className="font-extrabold text-sm">{c.symbol}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset Demo Data Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Демо-данные</h3>
            <p className="text-xs text-slate-400 mt-0.5">Восстановить исходные примеры транзакций</p>
          </div>

          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Сбросить</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  onResetData();
                  setShowResetConfirm(false);
                }}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 transition-colors"
              >
                Да, сбросить
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-2 py-1.5 rounded-xl text-xs font-semibold text-slate-500 bg-slate-100"
              >
                Отмена
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
