import React from 'react';
import { Eye, EyeOff, Bell, Sparkles } from 'lucide-react';
import { Currency, CURRENCIES } from '../types/finance';

interface HeaderProps {
  hideAmounts: boolean;
  onToggleHideAmounts: () => void;
  currency: Currency;
  onChangeCurrency: (currency: Currency) => void;
  onOpenAdd: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  hideAmounts,
  onToggleHideAmounts,
  currency,
  onChangeCurrency,
}) => {
  return (
    <header className="px-5 pt-4 pb-2 flex items-center justify-between">
      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-500 to-teal-400 p-[2px] shadow-md shadow-purple-500/20">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center overflow-hidden">
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-tr from-violet-600 to-teal-500 text-sm">
                AF
              </span>
            </div>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <span>FinFlow</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span className="text-teal-600 flex items-center gap-0.5">
              <Sparkles className="w-3 h-3 text-teal-500" /> PRO
            </span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
            Привет, Алекс 👋
          </h1>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        {/* Currency Selector */}
        <div className="relative">
          <select
            value={currency}
            onChange={(e) => onChangeCurrency(e.target.value as Currency)}
            className="text-xs font-semibold bg-white border border-slate-200/80 rounded-xl px-2.5 py-1.5 text-slate-700 shadow-sm appearance-none pr-6 cursor-pointer hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400/30 transition-all"
            aria-label="Выбрать валюту"
          >
            {Object.values(CURRENCIES).map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
            ▼
          </span>
        </div>

        {/* Hide Amounts Toggle */}
        <button
          onClick={onToggleHideAmounts}
          className="w-9 h-9 rounded-xl bg-white border border-slate-200/80 text-slate-600 flex items-center justify-center shadow-sm hover:text-purple-600 hover:border-purple-200 active:scale-95 transition-all"
          title={hideAmounts ? 'Показать суммы' : 'Скрыть баланс'}
          aria-label={hideAmounts ? 'Показать суммы' : 'Скрыть баланс'}
        >
          {hideAmounts ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>

        {/* Notification indicator */}
        <button
          className="w-9 h-9 rounded-xl bg-white border border-slate-200/80 text-slate-600 flex items-center justify-center shadow-sm relative hover:text-purple-600 hover:border-purple-200 active:scale-95 transition-all"
          title="Уведомления"
          aria-label="Уведомления"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-white"></span>
        </button>
      </div>
    </header>
  );
};
