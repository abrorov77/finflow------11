import React from 'react';
import { Home, PieChart, Plus, History, User } from 'lucide-react';

export type NavTab = 'home' | 'stats' | 'history' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  onOpenAddModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  onOpenAddModal,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
      <div className="max-w-md mx-auto px-4 h-18 flex items-center justify-between relative">
        {/* Tab 1: Home */}
        <button
          onClick={() => onChangeTab('home')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors min-w-[48px] ${
            activeTab === 'home' ? 'text-purple-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
          aria-label="Главная"
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] tracking-tight mt-1 font-semibold">Главная</span>
        </button>

        {/* Tab 2: Stats */}
        <button
          onClick={() => onChangeTab('stats')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors min-w-[48px] ${
            activeTab === 'stats' ? 'text-teal-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
          aria-label="Статистика"
        >
          <PieChart className={`w-5 h-5 ${activeTab === 'stats' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] tracking-tight mt-1 font-semibold">Статистика</span>
        </button>

        {/* Center Floating Action Button: Add Transaction */}
        <div className="flex-1 flex justify-center items-center">
          <button
            onClick={onOpenAddModal}
            className="w-13 h-13 -mt-6 rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-600 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/35 active:scale-90 hover:scale-105 transition-all cursor-pointer ring-4 ring-white"
            title="Добавить транзакцию"
            aria-label="Добавить новую транзакцию"
          >
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab 4: History */}
        <button
          onClick={() => onChangeTab('history')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors min-w-[48px] ${
            activeTab === 'history' ? 'text-orange-500 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
          aria-label="История"
        >
          <History className={`w-5 h-5 ${activeTab === 'history' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] tracking-tight mt-1 font-semibold">История</span>
        </button>

        {/* Tab 5: Profile */}
        <button
          onClick={() => onChangeTab('profile')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors min-w-[48px] ${
            activeTab === 'profile' ? 'text-purple-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
          aria-label="Профиль"
        >
          <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] tracking-tight mt-1 font-semibold">Профиль</span>
        </button>
      </div>
    </nav>
  );
};
