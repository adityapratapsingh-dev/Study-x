import React from 'react';
import { Menu, Search, Sparkles, ChevronRight } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { getNavItem, getNavGroup } from './navConfig';

interface TopbarProps {
  onOpenNav: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenNav }) => {
  const { activeTab, searchQuery, setSearchQuery, setIsAiQuizModalOpen } = useWorkspace();

  const item = getNavItem(activeTab);
  const group = getNavGroup(activeTab);

  return (
    <header className="shrink-0 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100">
      <div className="edge-ember h-px w-full" aria-hidden="true" />
      <div className="flex items-center gap-3 h-14 px-3 sm:px-5">
        <button
          onClick={onOpenNav}
          aria-label="Open navigation"
          className="md:hidden p-2 -ml-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 min-w-0 text-sm">
          <span className="hidden sm:inline text-slate-500 font-medium">{group.label}</span>
          <ChevronRight className="hidden sm:inline w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span className="font-display font-semibold text-white truncate">{item.label}</span>
        </nav>

        {/* Global search */}
        <div className="flex-1 max-w-sm ml-auto hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="global-search-input"
              placeholder="Search PYQs, formulas, mistakes, chapters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-12 py-1.5 text-xs sm:text-sm bg-slate-800/80 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto md:ml-0">
          <button
            onClick={() => setIsAiQuizModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/20 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">AI Drill Generator</span>
          </button>
        </div>
      </div>
    </header>
  );
};
