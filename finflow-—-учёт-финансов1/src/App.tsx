/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Smartphone,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Wifi,
  Battery,
  Sparkles,
} from 'lucide-react';
import { Transaction, Currency, SavingsGoal, TransactionType } from './types/finance';
import { INITIAL_TRANSACTIONS, INITIAL_SAVINGS_GOALS } from './data/initialData';
import { Header } from './components/Header';
import { BalanceCard } from './components/BalanceCard';
import { ExpenseChart } from './components/ExpenseChart';
import { RecentTransactions } from './components/RecentTransactions';
import { AddTransactionModal } from './components/AddTransactionModal';
import { StatsView } from './components/StatsView';
import { HistoryView } from './components/HistoryView';
import { ProfileView } from './components/ProfileView';
import { BottomNav, NavTab } from './components/BottomNav';

const STORAGE_KEYS = {
  TRANSACTIONS: 'finflow_transactions_v1',
  GOALS: 'finflow_goals_v1',
  CURRENCY: 'finflow_currency_v1',
  BUDGET: 'finflow_budget_v1',
  HIDE_AMOUNTS: 'finflow_hide_amounts_v1',
};

export default function App() {
  // State initialization with localStorage fallback
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
      return saved ? JSON.parse(saved) : INITIAL_SAVINGS_GOALS;
    } catch {
      return INITIAL_SAVINGS_GOALS;
    }
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENCY) as Currency;
      return saved || 'RUB';
    } catch {
      return 'RUB';
    }
  });

  const [monthlyBudget, setMonthlyBudget] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BUDGET);
      return saved ? parseFloat(saved) : 90000;
    } catch {
      return 90000;
    }
  });

  const [hideAmounts, setHideAmounts] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.HIDE_AMOUNTS) === 'true';
    } catch {
      return false;
    }
  });

  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalInitialType, setAddModalInitialType] = useState<TransactionType>('expense');
  const [activeHomeFilter, setActiveHomeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [previewDeviceMode, setPreviewDeviceMode] = useState<'mobile' | 'wide'>('mobile');
  const [currentTime, setCurrentTime] = useState<string>('09:41');

  // Time simulation for mobile status bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error(e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(savingsGoals));
    } catch (e) {
      console.error(e);
    }
  }, [savingsGoals]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENCY, currency);
    } catch (e) {
      console.error(e);
    }
  }, [currency]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BUDGET, monthlyBudget.toString());
    } catch (e) {
      console.error(e);
    }
  }, [monthlyBudget]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HIDE_AMOUNTS, hideAmounts.toString());
    } catch (e) {
      console.error(e);
    }
  }, [hideAmounts]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Financial aggregates
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

  const totalBalance = totalIncome - totalExpense;

  // Filtered transactions for home screen if user taps on Income or Expense card
  const filteredHomeTransactions = useMemo(() => {
    if (activeHomeFilter === 'all') return transactions;
    return transactions.filter((t) => t.type === activeHomeFilter);
  }, [transactions, activeHomeFilter]);

  // Actions
  const handleAddTransaction = (newTx: Omit<Transaction, 'id' | 'createdAt'>) => {
    const tx: Transaction = {
      ...newTx,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now(),
    };
    setTransactions((prev) => [tx, ...prev]);
    showToast(tx.type === 'expense' ? 'Расход успешно записан! 💸' : 'Доход успешно зачислен! 🚀');
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Транзакция удалена');
  };

  const handleAddFundsToGoal = (goalId: string, amount: number) => {
    setSavingsGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const newCurrent = Math.min(g.targetAmount, g.currentAmount + amount);
          return { ...g, currentAmount: newCurrent };
        }
        return g;
      })
    );
    showToast('Копилка успешно пополнена! 🎉');
  };

  const handleResetData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setSavingsGoals(INITIAL_SAVINGS_GOALS);
    setMonthlyBudget(90000);
    showToast('Данные восстановлены');
  };

  const openAddModalWithType = (type: TransactionType) => {
    setAddModalInitialType(type);
    setIsAddModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-800 flex flex-col items-center justify-start">
      {/* Desktop Mode Toggle Bar (Visible on large screens) */}
      <div className="hidden lg:flex items-center justify-between w-full max-w-5xl px-6 py-2.5 mt-2 mb-1 bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-600"></div>
          <span className="text-xs font-bold text-slate-800 tracking-tight">FinFlow Mobile Engine</span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-slate-500">Интерфейс мобильного учёта личных финансов</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewDeviceMode('mobile')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              previewDeviceMode === 'mobile'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Смартфон (390px)</span>
          </button>
          <button
            onClick={() => setPreviewDeviceMode('wide')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              previewDeviceMode === 'wide'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Широкий экран</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main
        className={`w-full transition-all duration-300 relative ${
          previewDeviceMode === 'mobile'
            ? 'max-w-[420px] lg:my-4 bg-white lg:rounded-[44px] lg:shadow-[0_20px_50px_rgba(124,58,237,0.12)] lg:border-[8px] lg:border-slate-800/95 overflow-hidden min-h-screen lg:min-h-[844px]'
            : 'max-w-4xl bg-white rounded-3xl shadow-md border border-slate-200 my-4 overflow-hidden'
        }`}
      >
        {/* Mobile Status Bar Simulation (Only in Mobile Frame) */}
        {previewDeviceMode === 'mobile' && (
          <div className="pt-2 px-6 pb-1 flex items-center justify-between text-xs font-semibold text-slate-800 select-none bg-white">
            <span>{currentTime}</span>
            {/* Dynamic Island pill */}
            <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto hidden sm:block shadow-xs" />
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-xl animate-in slide-in-from-top-4 duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* App Content Based on Active Tab */}
        {activeTab === 'home' && (
          <div className="pb-24 animate-in fade-in duration-200">
            {/* Top Bar Header */}
            <Header
              hideAmounts={hideAmounts}
              onToggleHideAmounts={() => setHideAmounts(!hideAmounts)}
              currency={currency}
              onChangeCurrency={setCurrency}
              onOpenAdd={() => openAddModalWithType('expense')}
            />

            {/* Big Bold Balance & Bright Gradient Cards */}
            <BalanceCard
              totalBalance={totalBalance}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              currency={currency}
              hideAmounts={hideAmounts}
              activeFilter={activeHomeFilter}
              onFilterType={setActiveHomeFilter}
            />

            {/* Saturated Expense Chart (Donut & Bar) with Purple, Teal & Orange */}
            <ExpenseChart
              transactions={transactions}
              currency={currency}
              hideAmounts={hideAmounts}
              onSelectCategory={(catId) => {
                setActiveTab('history');
              }}
            />

            {/* Recent Transactions Feed */}
            <RecentTransactions
              transactions={filteredHomeTransactions}
              currency={currency}
              hideAmounts={hideAmounts}
              onViewAll={() => setActiveTab('history')}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </div>
        )}

        {activeTab === 'stats' && (
          <StatsView
            transactions={transactions}
            currency={currency}
            hideAmounts={hideAmounts}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            transactions={transactions}
            currency={currency}
            hideAmounts={hideAmounts}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            currency={currency}
            onChangeCurrency={setCurrency}
            monthlyBudget={monthlyBudget}
            onUpdateBudget={setMonthlyBudget}
            totalExpenseThisMonth={totalExpense}
            savingsGoals={savingsGoals}
            onAddFundsToGoal={handleAddFundsToGoal}
            onResetData={handleResetData}
            hideAmounts={hideAmounts}
          />
        )}

        {/* Fixed Ergonomic Bottom Navigation Bar */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          onOpenAddModal={() => openAddModalWithType('expense')}
        />

        {/* Dedicated Add Transaction Screen / Modal */}
        <AddTransactionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddTransaction}
          currency={currency}
          initialType={addModalInitialType}
        />
      </main>
    </div>
  );
}
