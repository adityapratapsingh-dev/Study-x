/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext';
import { Navbar } from './components/layout/Navbar';
import { JeeHub } from './components/jee/JeeHub';
import { JeeBlueprint } from './components/blueprint/JeeBlueprint';
import { NeetHub } from './components/neet/NeetHub';
import { TestHub } from './components/tests/TestHub';
import { MistakeNotebook } from './components/shared/MistakeNotebook';
import { FormulaSheetViewer } from './components/shared/FormulaSheetViewer';
import { DailyStudyPlanner } from './components/shared/DailyStudyPlanner';
import { NotesWorkspace } from './components/notes/NotesWorkspace';
import { FlashcardHub } from './components/flashcards/FlashcardHub';
import { AITutorChat } from './components/ai/AITutorChat';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { AiQuizGeneratorModal } from './components/modals/AiQuizGeneratorModal';
import { AiFlashcardGeneratorModal } from './components/modals/AiFlashcardGeneratorModal';

const WorkspaceContent: React.FC = () => {
  const { activeTab } = useWorkspace();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      <Navbar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'jee' && <JeeHub />}
        {activeTab === 'blueprint' && <JeeBlueprint />}
        {activeTab === 'neet' && <NeetHub />}
        {activeTab === 'tests' && <TestHub />}
        {activeTab === 'mistakes' && <MistakeNotebook />}
        {activeTab === 'formulas' && <FormulaSheetViewer />}
        {activeTab === 'planner' && <DailyStudyPlanner />}
        {activeTab === 'notes' && <NotesWorkspace />}
        {activeTab === 'flashcards' && <FlashcardHub />}
        {activeTab === 'tutor' && <AITutorChat />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
      </main>

      {/* Global Modals */}
      <AiQuizGeneratorModal />
      <AiFlashcardGeneratorModal />
    </div>
  );
};

export default function App() {
  return (
    <WorkspaceProvider>
      <WorkspaceContent />
    </WorkspaceProvider>
  );
}
