import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { JeeHub } from '../jee/JeeHub';
import { JeeBlueprint } from '../blueprint/JeeBlueprint';
import { NeetHub } from '../neet/NeetHub';
import { TestHub } from '../tests/TestHub';
import { MistakeNotebook } from '../shared/MistakeNotebook';
import { FormulaSheetViewer } from '../shared/FormulaSheetViewer';
import { DailyStudyPlanner } from '../shared/DailyStudyPlanner';
import { NotesWorkspace } from '../notes/NotesWorkspace';
import { FlashcardHub } from '../flashcards/FlashcardHub';
import { AITutorChat } from '../ai/AITutorChat';
import { AnalyticsDashboard } from '../analytics/AnalyticsDashboard';
import { AiQuizGeneratorModal } from '../modals/AiQuizGeneratorModal';
import { AiFlashcardGeneratorModal } from '../modals/AiFlashcardGeneratorModal';

const Screen: React.FC = () => {
  const { activeTab } = useWorkspace();
  switch (activeTab) {
    case 'jee':
      return <JeeHub />;
    case 'blueprint':
      return <JeeBlueprint />;
    case 'neet':
      return <NeetHub />;
    case 'tests':
      return <TestHub />;
    case 'mistakes':
      return <MistakeNotebook />;
    case 'formulas':
      return <FormulaSheetViewer />;
    case 'planner':
      return <DailyStudyPlanner />;
    case 'notes':
      return <NotesWorkspace />;
    case 'flashcards':
      return <FlashcardHub />;
    case 'tutor':
      return <AITutorChat />;
    case 'analytics':
      return <AnalyticsDashboard />;
    default:
      return <JeeHub />;
  }
};

export const AppShell: React.FC = () => {
  const { resetToSampleData } = useWorkspace();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  return (
    <div className="h-screen flex bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-amber-950">
      {/* Desktop / tablet persistent sidebar */}
      <Sidebar onRequestReset={() => setIsResetConfirmOpen(true)} />

      {/* Mobile slide-over drawer */}
      {isNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsNavOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 animate-rise">
            <Sidebar
              mobile
              onNavigate={() => setIsNavOpen(false)}
              onClose={() => setIsNavOpen(false)}
              onRequestReset={() => {
                setIsNavOpen(false);
                setIsResetConfirmOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onOpenNav={() => setIsNavOpen(true)} />
        <main className="flex-1 min-h-0">
          <Screen />
        </main>
      </div>

      {/* Global modals */}
      <AiQuizGeneratorModal />
      <AiFlashcardGeneratorModal />

      {/* Reset confirmation */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
            <h3 className="font-display text-base font-bold text-white">Reset Preparation Workspace?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              This will restore all authentic JEE and NEET syllabus mock tests, formula cards, chapter weightages, and notes to fresh status.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetToSampleData();
                  setIsResetConfirmOpen(false);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl shadow-md cursor-pointer"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
