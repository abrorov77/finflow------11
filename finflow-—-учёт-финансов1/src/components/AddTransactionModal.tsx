import React, { useState } from 'react';
import { X, Calendar, FileText, Check, Plus, Sparkles } from 'lucide-react';
import { TransactionType, Currency, Transaction } from '../types/finance';
import { CATEGORIES } from '../data/categories';
import { CURRENCIES } from '../data/categories';
import { CategoryIcon } from './CategoryIcon';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  currency: Currency;
  initialType?: TransactionType;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currency,
  initialType = 'expense',
}) => {
  const [type, setType] = useState<TransactionType>(initialType);
  const [amountStr, setAmountStr] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('food');
  const [note, setNote] = useState<string>('');
  const [date, setDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentCurrency = CURRENCIES[currency] || CURRENCIES.RUB;
  const filteredCategories = CATEGORIES.filter((c) => c.type === type);

  // If switched type and selected category is no longer valid, pick first valid
  const currentCategory = filteredCategories.find((c) => c.id === selectedCategoryId) || filteredCategories[0];
  if (currentCategory && currentCategory.id !== selectedCategoryId && !filteredCategories.some(c => c.id === selectedCategoryId)) {
    setSelectedCategoryId(currentCategory.id);
  }

  const handleQuickAdd = (value: number) => {
    const current = parseFloat(amountStr) || 0;
    setAmountStr((current + value).toString());
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setHasSubmitted(true);

    const numericAmount = parseFloat(amountStr.replace(/\s+/g, ''));
    if (!numericAmount || numericAmount <= 0) {
      return;
    }

    onSave({
      amount: numericAmount,
      type,
      categoryId: selectedCategoryId,
      note: note.trim() || currentCategory.name,
      date,
    });

    // Reset fields
    setAmountStr('');
    setNote('');
    setHasSubmitted(false);
    onClose();
  };

  const isExpense = type === 'expense';
  const accentTheme = isExpense
    ? {
        gradient: 'from-orange-500 via-rose-500 to-pink-500',
        ring: 'focus-within:ring-orange-400 focus-within:border-orange-500 text-orange-600',
        glow: 'shadow-orange-500/20',
        activeTab: 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md shadow-orange-500/25',
        buttonGradient: 'bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-orange-500/30',
      }
    : {
        gradient: 'from-teal-500 via-cyan-500 to-emerald-500',
        ring: 'focus-within:ring-teal-400 focus-within:border-teal-500 text-teal-600',
        glow: 'shadow-teal-500/20',
        activeTab: 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md shadow-teal-500/25',
        buttonGradient: 'bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-teal-500/30',
      };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-md max-h-[92vh] sm:max-h-[88vh] bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-slate-100 animate-in slide-in-from-bottom duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Top Drag Handle / Header */}
        <div className="pt-3 px-6 pb-2">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-3 sm:hidden" />
          <div className="flex items-center justify-between">
            <h2 id="modal-title" className="text-lg font-bold text-slate-900 tracking-tight">
              Новая операция
            </h2>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
              aria-label="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto px-6 py-2 space-y-5 no-scrollbar flex-1">
          {/* Top Switcher: "Доход" and "Расход" in bright tab buttons */}
          <div className="p-1.5 bg-slate-100 rounded-2xl flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                setSelectedCategoryId('food');
              }}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                isExpense
                  ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md shadow-orange-500/25 scale-[1.01]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Расход</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                setSelectedCategoryId('salary');
              }}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                !isExpense
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md shadow-teal-500/25 scale-[1.01]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Доход</span>
            </button>
          </div>

          {/* Large Centered Amount Input with glowing colored accent highlight */}
          <div className="text-center py-2">
            <label htmlFor="amount-input" className="text-xs font-semibold text-slate-400 block mb-1">
              Сумма операции
            </label>
            <div
              className={`relative inline-flex items-center justify-center px-4 py-2 rounded-2xl border-2 transition-all duration-200 ${
                hasSubmitted && (!amountStr || parseFloat(amountStr) <= 0)
                  ? 'border-red-400 bg-red-50/30'
                  : 'border-slate-200 bg-slate-50/50 focus-within:bg-white focus-within:shadow-lg ' +
                    accentTheme.ring
              }`}
            >
              <span className="text-3xl sm:text-4xl font-extrabold mr-1 text-slate-400 select-none">
                {currentCurrency.symbol}
              </span>
              <input
                id="amount-input"
                type="number"
                inputMode="decimal"
                step="any"
                placeholder="0"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                autoFocus
                className="w-48 sm:w-56 text-center text-4xl sm:text-5xl font-extrabold text-slate-900 bg-transparent focus:outline-none tracking-tight tabular-nums placeholder:text-slate-300"
              />
            </div>
            {hasSubmitted && (!amountStr || parseFloat(amountStr) <= 0) && (
              <p className="text-xs text-rose-500 mt-1.5 font-medium">Пожалуйста, укажите сумму</p>
            )}

            {/* Quick Amount Suggestion Chips */}
            <div className="flex items-center justify-center gap-1.5 mt-3 flex-wrap">
              {(currency === 'TJS'
                ? [50, 100, 250, 500]
                : currency === 'USD' || currency === 'EUR'
                ? [10, 25, 50, 100]
                : currency === 'UZS'
                ? [50000, 100000, 250000, 500000]
                : currency === 'KZT'
                ? [2000, 5000, 10000, 20000]
                : [500, 1000, 2500, 5000]
              ).map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAdd(val)}
                  className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors active:scale-95"
                >
                  +{val} {currentCurrency.symbol}
                </button>
              ))}
              {amountStr && (
                <button
                  type="button"
                  onClick={() => setAmountStr('')}
                  className="px-2 py-1 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-600"
                >
                  Сброс
                </button>
              )}
            </div>
          </div>

          {/* Category Icons Grid in Colorful Circles */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Категория
              </span>
              <span className="text-xs font-medium text-purple-600">
                {currentCategory?.name || 'Выберите категорию'}
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {filteredCategories.map((cat) => {
                const isSelected = selectedCategoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className="flex flex-col items-center gap-1.5 group focus:outline-none"
                  >
                    <div
                      className={`relative w-13 h-13 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                        isSelected
                          ? 'scale-110 shadow-lg ring-3 ring-offset-2'
                          : 'opacity-85 hover:opacity-100 hover:scale-105'
                      }`}
                      style={{
                        backgroundColor: isSelected ? cat.color : `${cat.color}20`,
                        color: isSelected ? '#FFFFFF' : cat.color,
                        boxShadow: isSelected ? `0 8px 16px ${cat.color}40` : undefined,
                      }}
                    >
                      <CategoryIcon name={cat.icon} className="w-6 h-6" />
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-xs">
                          <Check className="w-2.5 h-2.5 text-slate-900 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <span
                      className={`text-[11px] font-medium text-center line-clamp-1 w-full transition-colors ${
                        isSelected ? 'font-bold text-slate-900' : 'text-slate-500'
                      }`}
                    >
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note & Date Fields */}
          <div className="space-y-3 pt-1">
            {/* Note Input */}
            <div>
              <label htmlFor="note-input" className="text-xs font-semibold text-slate-500 block mb-1">
                Заметка или комментарий
              </label>
              <div className="relative flex items-center">
                <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  id="note-input"
                  type="text"
                  placeholder="Например: Супермаркет, Такси, Кофе"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200/90 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition-all"
                />
              </div>
            </div>

            {/* Date Input with Calendar Icon */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="date-input" className="text-xs font-semibold text-slate-500">
                  Дата операции
                </label>
                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setDate(new Date().toISOString().split('T')[0])}
                    className="text-purple-600 font-semibold hover:underline"
                  >
                    Сегодня
                  </button>
                  <span className="text-slate-300">·</span>
                  <button
                    type="button"
                    onClick={() => {
                      const y = new Date();
                      y.setDate(y.getDate() - 1);
                      setDate(y.toISOString().split('T')[0]);
                    }}
                    className="text-slate-500 font-medium hover:underline"
                  >
                    Вчера
                  </button>
                </div>
              </div>

              <div className="relative flex items-center">
                <Calendar className="w-4 h-4 text-purple-500 absolute left-3.5 pointer-events-none" />
                <input
                  id="date-input"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200/90 text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Full-Width Bright Gradient "Сохранить" Button */}
        <div className="p-5 pt-3 border-t border-slate-100 bg-white">
          <button
            type="button"
            onClick={() => handleSubmit()}
            className={`w-full py-4 rounded-2xl font-bold text-white text-base shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${accentTheme.buttonGradient}`}
          >
            <Sparkles className="w-5 h-5 text-white/90" />
            <span>Сохранить {isExpense ? 'расход' : 'доход'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
