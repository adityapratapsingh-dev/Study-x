/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext';
import { Navbar } from './components/layout/Navbar';
import { NotesWorkspace } from './components/notes/NotesWorkspace';
import { TestHub } from './components/tests/TestHub';
import { FlashcardHub } from './components/flashcards/FlashcardHub';
import { FocusHub } from './components/focus/FocusHub';
import { AITutorChat } from './components/ai/AITutorChat';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { AiQuizGeneratorModal } from './components/modals/AiQuizGeneratorModal';
import { AiFlashcardGeneratorModal } from './components/modals/AiFlashcardGeneratorModal';

const WorkspaceContent: React.FC = () => {
  const { activeTab } = useWorkspace();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'notes' && <NotesWorkspace />}
        {activeTab === 'tests' && <TestHub />}
        {activeTab === 'flashcards' && <FlashcardHub />}
        {activeTab === 'focus' && <FocusHub />}
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
