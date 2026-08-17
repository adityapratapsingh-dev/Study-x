import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { requestAiQuiz } from '../../lib/geminiApi';
import { DifficultyLevel } from '../../types';
import {
  Sparkles,
  X,
  BookOpen,
  FileCheck,
  Zap,
  Sliders,
  Check,
} from 'lucide-react';

export const AiQuizGeneratorModal: React.FC = () => {
  const {
    isAiQuizModalOpen,
    setIsAiQuizModalOpen,
    aiQuizPresetNote,
    setAiQuizPresetNote,
    notes,
    subjects,
    selectedSubjectId,
    addTest,
    startTest,
  } = useWorkspace();

  const [selectedSubject, setSelectedSubject] = useState<string>(
    aiQuizPresetNote?.subjectId || selectedSubjectId || subjects[0]?.id || 'cs-algo'
  );
  const [selectedNoteId, setSelectedNoteId] = useState<string>(
    aiQuizPresetNote?.id || 'none'
  );
  const [customTopic, setCustomTopic] = useState<string>(
    aiQuizPresetNote ? aiQuizPresetNote.title : ''
  );
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');
  const [includeTypes, setIncludeTypes] = useState<('mcq' | 'tf' | 'short')[]>([
    'mcq',
    'tf',
    'short',
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (aiQuizPresetNote) {
      setSelectedSubject(aiQuizPresetNote.subjectId);
      setSelectedNoteId(aiQuizPresetNote.id);
      setCustomTopic(aiQuizPresetNote.title);
    }
  }, [aiQuizPresetNote]);

  if (!isAiQuizModalOpen) return null;

  const handleClose = () => {
    setIsAiQuizModalOpen(false);
    setAiQuizPresetNote(null);
    setErrorMessage(null);
  };

  const toggleType = (type: 'mcq' | 'tf' | 'short') => {
    if (includeTypes.includes(type)) {
      if (includeTypes.length > 1) {
        setIncludeTypes(includeTypes.filter((t) => t !== type));
      }
    } else {
      setIncludeTypes([...includeTypes, type]);
    }
  };

  const handleGenerateQuiz = async () => {
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const activeSubjectObj = subjects.find((s) => s.id === selectedSubject);
      const chosenNote = notes.find((n) => n.id === selectedNoteId);

      const res = await requestAiQuiz({
        subject: activeSubjectObj?.name || 'General Academic',
        topic: customTopic || chosenNote?.title || 'General Review',
        noteContent: chosenNote?.content,
        count: questionCount,
        difficulty,
        questionTypes: includeTypes,
      });

      const newTest = addTest({
        title: res.title,
        description: res.description,
        subjectId: selectedSubject,
        examType: 'CHAPTER_WISE',
        targetExam: 'JEE',
        estimatedMinutes: res.estimatedMinutes,
        totalMarks: res.questions.length * 4,
        positiveMarks: 4,
        negativeMarks: 1,
        difficulty,
        questions: res.questions,
        noteIdRef: chosenNote?.id,
        tags: [difficulty, 'AI-Generated', 'Practice'],
      });

      handleClose();
      startTest(newTest.id);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to generate quiz.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-slate-100 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Generate AI Practice Test</h3>
              <p className="text-xs text-slate-400">Creates diagnostic questions with instant explanations</p>
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
          
          {/* Subject selector */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Subject Category</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code}: {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Source Note selector */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Source Material / Note (Optional)</label>
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
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="none">None (Generate from Topic Prompt)</option>
              {notes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.title}
                </option>
              ))}
            </select>
          </div>

          {/* Topic prompt input */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Test Topic or Focus Area</label>
            <input
              type="text"
              placeholder="e.g. Graph Traversal, Stereochemistry, Multivariable Chain Rule..."
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Difficulty & Count */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="Easy">Easy (Foundations)</option>
                <option value="Medium">Medium (Standard Exam)</option>
                <option value="Hard">Hard (Advanced / Trap)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Question Count</label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value={3}>3 Questions (Quick Drill)</option>
                <option value={5}>5 Questions (Standard Quiz)</option>
                <option value={8}>8 Questions (Deep Review)</option>
                <option value={10}>10 Questions (Mastery Exam)</option>
              </select>
            </div>
          </div>

          {/* Question Types Toggle */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Included Question Formats</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => toggleType('mcq')}
                className={`p-2 rounded-xl border text-center font-semibold transition cursor-pointer ${
                  includeTypes.includes('mcq')
                    ? 'bg-indigo-600/30 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Multiple Choice
              </button>
              <button
                type="button"
                onClick={() => toggleType('tf')}
                className={`p-2 rounded-xl border text-center font-semibold transition cursor-pointer ${
                  includeTypes.includes('tf')
                    ? 'bg-indigo-600/30 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                True / False
              </button>
              <button
                type="button"
                onClick={() => toggleType('short')}
                className={`p-2 rounded-xl border text-center font-semibold transition cursor-pointer ${
                  includeTypes.includes('short')
                    ? 'bg-indigo-600/30 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Short Answer
              </button>
            </div>
          </div>
        </div>

        {/* Footer actions */}
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
            onClick={handleGenerateQuiz}
            disabled={isGenerating || (!customTopic.trim() && selectedNoteId === 'none')}
            className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 text-white rounded-xl shadow-lg shadow-indigo-600/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating Exam...' : 'Generate & Begin Exam'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
