import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { FlashcardDeck, Flashcard } from '../../types';
import {
  Layers,
  Plus,
  Sparkles,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Trash2,
  Check,
  Flame,
  Award,
} from 'lucide-react';

export const FlashcardHub: React.FC = () => {
  const {
    decks,
    selectedDeckId,
    setSelectedDeckId,
    selectedSubjectId,
    subjects,
    updateCardState,
    deleteDeck,
    setIsAiFlashcardModalOpen,
    searchQuery,
  } = useWorkspace();

  const [activeDeck, setActiveDeck] = useState<FlashcardDeck | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [sessionRatings, setSessionRatings] = useState<Record<string, 'learning' | 'review' | 'mastered'>>({});

  // Filter decks
  const filteredDecks = decks.filter((d) => {
    if (selectedSubjectId && d.subjectId !== selectedSubjectId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = d.title.toLowerCase().includes(q);
      const matchCard = d.cards.some((c) => c.front.toLowerCase().includes(q) || c.back.toLowerCase().includes(q));
      if (!matchTitle && !matchCard) return false;
    }
    return true;
  });

  const handleStartStudy = (deck: FlashcardDeck) => {
    setActiveDeck(deck);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setSessionCompleted(false);
    setSessionRatings({});
  };

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRateCard = (rating: 'learning' | 'review' | 'mastered') => {
    if (!activeDeck) return;
    const currentCard = activeDeck.cards[currentCardIndex];
    if (!currentCard) return;

    updateCardState(activeDeck.id, currentCard.id, rating);
    setSessionRatings((prev) => ({ ...prev, [currentCard.id]: rating }));

    if (currentCardIndex < activeDeck.cards.length - 1) {
      setIsFlipped(false);
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      setSessionCompleted(true);
    }
  };

  // Keyboard navigation for flashcards
  React.useEffect(() => {
    if (!activeDeck || sessionCompleted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((f) => !f);
      } else if (e.key === '1') {
        handleRateCard('learning');
      } else if (e.key === '2') {
        handleRateCard('review');
      } else if (e.key === '3') {
        handleRateCard('mastered');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDeck, sessionCompleted, currentCardIndex, isFlipped]);

  // If in active flashcard study mode
  if (activeDeck) {
    const totalCards = activeDeck.cards.length;
    const currentCard = activeDeck.cards[currentCardIndex];
    const sub = subjects.find((s) => s.id === activeDeck.subjectId);

    if (sessionCompleted) {
      const masteredCount = Object.values(sessionRatings).filter((r) => r === 'mastered').length;
      const reviewCount = Object.values(sessionRatings).filter((r) => r === 'review').length;
      const learningCount = Object.values(sessionRatings).filter((r) => r === 'learning').length;

      return (
        <div className="flex-1 p-6 md:p-8 bg-slate-950 text-slate-100 flex items-center justify-center min-h-[calc(100vh-112px)]">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-white">Deck Session Complete!</h2>
              <p className="text-sm text-slate-400 mt-1">
                You reviewed <span className="font-bold text-white">{totalCards} cards</span> in {activeDeck.title}.
              </p>
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl">
                <span className="font-bold text-lg text-emerald-400 block">{masteredCount}</span>
                <span className="text-slate-400">Mastered</span>
              </div>
              <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-xl">
                <span className="font-bold text-lg text-blue-400 block">{reviewCount}</span>
                <span className="text-slate-400">Review</span>
              </div>
              <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl">
                <span className="font-bold text-lg text-amber-400 block">{learningCount}</span>
                <span className="text-slate-400">Learning</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => handleStartStudy(activeDeck)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
              >
                Study Again
              </button>
              <button
                onClick={() => setActiveDeck(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                Exit to Decks
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 p-6 md:p-8 bg-slate-950 text-slate-100 flex flex-col justify-between max-w-3xl mx-auto w-full min-h-[calc(100vh-112px)]">
        
        {/* Top Study Bar */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-lg"
              style={{
                backgroundColor: `${sub?.color || '#3B82F6'}20`,
                color: sub?.color || '#3B82F6',
              }}
            >
              {sub?.code || 'Deck'}
            </span>
            <span className="text-sm font-bold text-white line-clamp-1">{activeDeck.title}</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>
              Card <span className="text-white font-bold">{currentCardIndex + 1}</span> of {totalCards}
            </span>
            <button
              onClick={() => setActiveDeck(null)}
              className="hover:text-slate-200 transition"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Progress Line */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden my-4">
          <div
            className="bg-indigo-500 h-full transition-all duration-300"
            style={{ width: `${((currentCardIndex + 1) / totalCards) * 100}%` }}
          />
        </div>

        {/* Interactive 3D Flip Flashcard */}
        <div className="flex-1 flex items-center justify-center my-6">
          <div
            onClick={handleFlipCard}
            className={`w-full max-w-xl min-h-[320px] sm:min-h-[360px] p-8 rounded-3xl border transition-all duration-300 transform flex flex-col justify-between cursor-pointer shadow-2xl relative select-none ${
              isFlipped
                ? 'bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border-indigo-500/50 shadow-indigo-500/10'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Top Card Tag */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="px-2.5 py-0.5 bg-slate-800 rounded-full font-medium">
                {currentCard.category || 'Concept'}
              </span>
              <span className="text-indigo-400 font-semibold flex items-center gap-1 text-[11px]">
                <RotateCw className="w-3 h-3" /> Click or Space to Flip
              </span>
            </div>

            {/* Card Content Prompt */}
            <div className="my-auto py-6 text-center space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                {isFlipped ? 'Answer / Explanation' : 'Question / Concept'}
              </span>
              <p
                className={`text-lg sm:text-2xl font-bold leading-relaxed whitespace-pre-line ${
                  isFlipped ? 'text-indigo-200' : 'text-white'
                }`}
              >
                {isFlipped ? currentCard.back : currentCard.front}
              </p>
            </div>

            {/* Bottom State Pill */}
            <div className="flex items-center justify-center text-xs text-slate-500">
              <span>Status: {currentCard.state || 'new'}</span>
            </div>
          </div>
        </div>

        {/* Active Recall Rating Buttons (Shown when flipped) */}
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleRateCard('learning')}
              className="py-3 px-4 bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/40 text-slate-200 hover:text-rose-300 rounded-2xl text-xs sm:text-sm font-bold transition flex flex-col items-center gap-1 cursor-pointer"
            >
              <span>❌ Hard / Again</span>
              <span className="text-[10px] text-slate-500 font-normal">Press 1</span>
            </button>

            <button
              onClick={() => handleRateCard('review')}
              className="py-3 px-4 bg-slate-900 hover:bg-blue-950/40 border border-slate-800 hover:border-blue-500/40 text-slate-200 hover:text-blue-300 rounded-2xl text-xs sm:text-sm font-bold transition flex flex-col items-center gap-1 cursor-pointer"
            >
              <span>⚠️ Good</span>
              <span className="text-[10px] text-slate-500 font-normal">Press 2</span>
            </button>

            <button
              onClick={() => handleRateCard('mastered')}
              className="py-3 px-4 bg-slate-900 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/40 text-slate-200 hover:text-emerald-300 rounded-2xl text-xs sm:text-sm font-bold transition flex flex-col items-center gap-1 cursor-pointer"
            >
              <span>✅ Easy / Mastered</span>
              <span className="text-[10px] text-slate-500 font-normal">Press 3</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Flashcards Catalog Grid
  return (
    <div className="flex-1 p-6 md:p-8 bg-slate-950 text-slate-100 overflow-y-auto max-w-7xl mx-auto w-full space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-violet-950/60 via-slate-900 to-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-violet-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Active Recall Flashcards
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Retain formulas, terms, and core concepts using spaced repetition and 3D active recall decks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-generate-flashcards"
            onClick={() => setIsAiFlashcardModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-violet-600/30 transition transform active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Flashcards with AI</span>
          </button>
        </div>
      </div>

      {/* Decks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDecks.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
            <Layers className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-base font-semibold text-slate-300">No flashcard decks found.</p>
            <button
              onClick={() => setIsAiFlashcardModalOpen(true)}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow transition"
            >
              Create Deck with AI
            </button>
          </div>
        ) : (
          filteredDecks.map((deck) => {
            const sub = subjects.find((s) => s.id === deck.subjectId);
            const masteredCount = deck.cards.filter((c) => c.state === 'mastered').length;
            const masteryPct = Math.round((masteredCount / (deck.cards.length || 1)) * 100);

            return (
              <div
                key={deck.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between group shadow-sm hover:shadow-violet-500/5"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="px-2.5 py-0.5 rounded text-[11px] font-bold"
                      style={{
                        backgroundColor: `${sub?.color || '#3B82F6'}20`,
                        color: sub?.color || '#3B82F6',
                      }}
                    >
                      {sub?.code || 'General'}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {deck.cards.length} Cards
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition line-clamp-1">
                    {deck.title}
                  </h3>

                  {/* Progress mastery */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Mastery Progress</span>
                      <span className="font-semibold text-emerald-400">{masteryPct}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${masteryPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-slate-800">
                  <button
                    onClick={() => handleStartStudy(deck)}
                    className="flex-1 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-600/20 transition cursor-pointer"
                  >
                    Study Deck
                  </button>
                  <button
                    onClick={() => deleteDeck(deck.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition"
                    title="Delete Deck"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
