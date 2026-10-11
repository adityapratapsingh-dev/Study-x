import React from 'react';
import { GraduationCap, Flame, Download, RotateCcw, Atom, Stethoscope, X } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { ActiveTab } from '../../types';
import { NAV_GROUPS, NAV_ITEMS, getNavItem } from './navConfig';

interface SidebarProps {
  /** Render as a full-width mobile drawer (labels always visible). */
  mobile?: boolean;
  onNavigate?: () => void;
  onRequestReset: () => void;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobile = false, onNavigate, onRequestReset, onClose }) => {
  const {
    activeTab,
    setActiveTab,
    examMode,
    setExamMode,
    studyStreakDays,
    exportWorkspaceData,
    mistakeLogs,
  } = useWorkspace();

  const unresolvedMistakes = mistakeLogs.filter((m) => !m.isResolved).length;
  const badgeFor = (id: ActiveTab) => (id === 'mistakes' && unresolvedMistakes ? unresolvedMistakes : undefined);

  const handleSelect = (id: ActiveTab) => {
    setActiveTab(id);
    onNavigate?.();
  };

  return (
    <aside
      className={`${
        mobile ? 'flex w-72' : 'hidden md:flex md:w-16 lg:w-64'
      } shrink-0 flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-100`}
    >
      {/* Brand */}
      <div className={`flex items-center gap-3 h-16 px-3 lg:px-5 border-b border-slate-800 shrink-0 ${mobile ? '' : 'justify-center lg:justify-start'}`}>
        <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-blue-500 flex items-center justify-center glow-ember text-slate-950">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div className={`min-w-0 ${mobile ? 'block' : 'hidden lg:block'}`}>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-base text-white tracking-tight">RankForge</span>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">
              JEE • NEET
            </span>
          </div>
          <p className="text-[11px] text-slate-400 truncate">All-in-One Exam Prep Hub</p>
        </div>
        {mobile && (
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="ml-auto p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Grouped navigation */}
      <nav className="flex-1 overflow-y-auto no-scrollbar px-2 lg:px-3 py-4 space-y-5">
        {NAV_GROUPS.map((group) => {
          const items = NAV_ITEMS.filter((item) => item.group === group.id);
          if (!items.length) return null;
          return (
            <div key={group.id} className="space-y-1">
              <p className={`px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 ${mobile ? 'block' : 'hidden lg:block'}`}>
                {group.label}
              </p>
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const badge = badgeFor(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    title={item.label}
                    aria-current={isActive ? 'page' : undefined}
                    className={`group w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition cursor-pointer ${
                      mobile ? '' : 'justify-center lg:justify-start'
                    } ${
                      isActive
                        ? 'bg-blue-500/15 text-white ring-1 ring-inset ring-blue-500/30'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon
                      className={`w-[18px] h-[18px] shrink-0 ${
                        isActive ? 'text-blue-300' : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                    />
                    <span className={`truncate ${mobile ? 'block' : 'hidden lg:block'}`}>{item.short}</span>
                    {badge !== undefined && (
                      <span
                        className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          isActive ? 'bg-white text-blue-700' : 'bg-rose-500/30 text-rose-300'
                        } ${mobile ? 'block' : 'hidden lg:block'}`}
                      >
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer: exam mode, streak, actions */}
      <div className="shrink-0 border-t border-slate-800 p-2 lg:p-3 space-y-3">
        <div className={`flex ${mobile ? 'flex-row gap-1' : 'flex-col lg:flex-row gap-1'} bg-slate-950 p-1 rounded-xl border border-slate-800`}>
          <button
            onClick={() => setExamMode('jee')}
            title="JEE Main/Adv"
            className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              examMode === 'jee' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Atom className="w-3.5 h-3.5" />
            <span className={mobile ? 'inline' : 'hidden lg:inline'}>JEE</span>
          </button>
          <button
            onClick={() => setExamMode('neet')}
            title="NEET UG"
            className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              examMode === 'neet' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span className={mobile ? 'inline' : 'hidden lg:inline'}>NEET</span>
          </button>
        </div>

        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold ${
            mobile ? '' : 'justify-center lg:justify-start'
          }`}
          title="Consecutive daily study streak"
        >
          <Flame className="w-4 h-4 fill-current shrink-0" />
          <span className={`${mobile ? 'inline' : 'hidden lg:inline'}`}>{studyStreakDays}d Streak</span>
        </div>

        <div className={`flex gap-2 ${mobile ? '' : 'flex-col lg:flex-row'}`}>
          <button
            onClick={exportWorkspaceData}
            title="Backup your notes, mock scores & mistake diary"
            className="flex-1 flex items-center justify-center gap-2 p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition cursor-pointer text-xs font-medium"
          >
            <Download className="w-4 h-4" />
            <span className={mobile ? 'inline' : 'hidden lg:inline'}>Backup</span>
          </button>
          <button
            onClick={onRequestReset}
            title="Reset to fresh JEE & NEET starter packs"
            className="flex-1 flex items-center justify-center gap-2 p-2 text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition cursor-pointer text-xs font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            <span className={mobile ? 'inline' : 'hidden lg:inline'}>Reset</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export { getNavItem };
