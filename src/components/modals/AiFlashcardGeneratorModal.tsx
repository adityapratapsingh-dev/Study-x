import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { requestAiFlashcards } from '../../lib/geminiApi';
import { Sparkles, X, Layers, BookOpen } from 'lucide-react';

export const AiFlashcardGeneratorModal: React.FC = () => {
  const {
    isAiFlashcardModalOpen,
    setIsAiFlashcardModalOpen,
    aiFlashcardPresetNote,
    setAiFlashcardPresetNote,
    notes,
    subjects,
    selectedSubjectId,
    addDeck,
    setActiveTab,
    setSelectedDeckId,
  } = useWorkspace();

  const [selectedSubject, setSelectedSubject] = useState<string>(
    aiFlashcardPresetNote?.subjectId || selectedSubjectId || subjects[0]?.id || 'cs-algo'
  );
  const [selectedNoteId, setSelectedNoteId] = useState<string>(
    aiFlashcardPresetNote?.id || 'none'
  );
  const [customTopic, setCustomTopic] = useState<string>(
    aiFlashcardPresetNote ? aiFlashcardPresetNote.title : ''
  );
  const [cardCount, setCardCount] = useState<number>(6);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (aiFlashcardPresetNote) {
      setSelectedSubject(aiFlashcardPresetNote.subjectId);
      setSelectedNoteId(aiFlashcardPresetNote.id);
      setCustomTopic(aiFlashcardPresetNote.title);
    }
  }, [aiFlashcardPresetNote]);

  if (!isAiFlashcardModalOpen) return null;

  const handleClose = () => {
    setIsAiFlashcardModalOpen(false);
    setAiFlashcardPresetNote(null);
    setErrorMessage(null);
  };

  const handleGenerateDeck = async () => {
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const activeSubjectObj = subjects.find((s) => s.id === selectedSubject);
      const chosenNote = notes.find((n) => n.id === selectedNoteId);

      const res = await requestAiFlashcards({
        subject: activeSubjectObj?.name || 'General Academic',
        topic: customTopic || chosenNote?.title || 'General Review',
        noteContent: chosenNote?.content,
        count: cardCount,
      });

      const newDeck = addDeck({
        title: res.deckTitle || `${customTopic || 'Study'} Deck`,
        subjectId: selectedSubject,
        noteIdRef: chosenNote?.id,
        cards: res.cards.map((c, i) => ({
          id: 'card-' + Date.now() + '-' + i,
          front: c.front,
          back: c.back,
          category: c.category || 'Core Concept',
          state: 'learning',
        })),
      });

      handleClose();
      setSelectedDeckId(newDeck.id);
      setActiveTab('flashcards');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to generate flashcards.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-slate-100 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Generate Flashcard Deck</h3>
              <p className="text-xs text-slate-400">Creates active recall question/answer pairs with AI</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Configuration Form */}
        <div className="space-y-4 text-xs">
          
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Subject Category</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-violet-500 font-medium"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code}: {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Source Note (Optional)</label>
            <select
              value={selectedNoteId}
              onChange={(e) => {
                setSelectedNoteId(e.target.value);
                const n = notes.find((item) => item.id === e.target.value);
                if (n) {
                  setCustomTopic(n.title);
                  setSelectedSubject(n.subjectId);
                }
              }}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-violet-500 font-medium"
            >
              <option value="none">None (Generate from Topic Prompt)</option>
              {notes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Deck Focus / Topic</label>
            <input
              type="text"
              placeholder="e.g. SN1/SN2 Reagents, Time Complexities, Organic Reaction Mechanisms..."
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Number of Flashcards</label>
            <select
              value={cardCount}
              onChange={(e) => setCardCount(parseInt(e.target.value, 10))}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-violet-500 font-medium"
            >
              <option value={4}>4 Flashcards (Quick Concept)</option>
              <option value={6}>6 Flashcards (Standard Deck)</option>
              <option value={10}>10 Flashcards (Comprehensive Review)</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleGenerateDeck}
            disabled={isGenerating || (!customTopic.trim() && selectedNoteId === 'none')}
            className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-40 text-white rounded-xl shadow-lg shadow-blue-600/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating Deck...' : 'Generate Deck'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
